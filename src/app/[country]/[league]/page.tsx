import { processData } from "@/src/lib/processData";
import countries from "@/src/lib/leagues";
import LeagueComponent from "@/src/components/league";
import { SeasonData } from "@/src/types/types";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const currentYear = new Date().getFullYear();
  const allParams: any[] = [];

  for (const country of countries) {
    for (const league of country.leagues) {
      for (let season = league.startYear; season < currentYear; season++) {
        allParams.push({
          country: country.internalURL,
          league: league.shortcut,
          season: season,
        });
      }
    }
  }
  return allParams;
}

async function getLeagueData(params: { country: string; league: string }) {
  const data: SeasonData[] = [];
  
  for (const tempCountry of countries) {
    if (tempCountry.internalURL === params.country) {
      for (const tempLeague of tempCountry.leagues) {
        if (tempLeague.shortcut === params.league) {
          for (
            let season = tempLeague.startYear;
            season <= new Date().getFullYear();
            season++
          ) {
            const tempData = await fetch(
              tempLeague.dbUrl + 'getmatchdata/' + tempLeague.shortcut + '/' + season.toString(),
            );
            // console.log(`Fetching data for ${tempLeague.name} - Season ${season}`);
            
            const jsonData = await tempData.json();
            const leagueData = processData(jsonData, tempLeague, season);
            data.push(leagueData);
          }
        }
      }
    }
  }
  return data;
}

async function getCurrentMatchday(params: { country: string; league: string }) {
    let currentMatchday = await fetch(countries.find((country) => country.internalURL === params.country)?.leagues.find(
    (league) => league.shortcut === params.league
  )?.dbUrl + 'getcurrentgroup/' + params.league);

  currentMatchday = await currentMatchday.json();
  return currentMatchday;
}

async function League(
  props: { params: Promise<{ country: string; league: string }> },
) {
  const params = await props.params;

  const data: SeasonData[] = await getLeagueData(params);

  const currentMatchday = await getCurrentMatchday(params);

  return (
    <>
      <LeagueComponent data={data} currentMatchday={currentMatchday} />
    </>
  );
}

export default League;
