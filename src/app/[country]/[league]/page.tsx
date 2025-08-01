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
          league: league.internalURL,
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
        if (tempLeague.internalURL === params.league) {
          for (
            let season = tempLeague.startYear;
            season < new Date().getFullYear();
            season++
          ) {
            const tempData = await fetch(
              tempLeague.externalURL + season.toString(),
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

async function League(
  props: { params: Promise<{ country: string; league: string }> },
) {
  const params = await props.params;

  const data: SeasonData[] = await getLeagueData(params);

  return (
    <>
      <LeagueComponent data={data} />
    </>
  );
}

export default League;
