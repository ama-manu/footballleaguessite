import { processData } from "@/src/lib/processData";
import countries from "@/src/lib/leagues";
import LeagueComponent from "@/src/components/league";
import { SeasonData } from "@/src/types/types";
import { log } from "node:console";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-12
  
  // Only include current year if we're in August or later
  const maxYear = currentMonth >= 8 ? currentYear : currentYear - 1;
  const allParams: any[] = [];

  for (const country of countries) {
    for (const league of country.leagues) {
      for (let season = league.startYear; season <= maxYear; season++) {
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
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-12
  const maxYear = currentMonth >= 8 ? currentYear : currentYear - 1;

  for (const tempCountry of countries) {
    if (tempCountry.internalURL === params.country) {
      for (const tempLeague of tempCountry.leagues) {
        if (tempLeague.shortcut === params.league) {
          for (
            let season = tempLeague.startYear;
            season <= maxYear;
            season++
          ) {
            try {
              const tempData = await fetch(
                tempLeague.dbUrl +
                  "getmatchdata/" +
                  tempLeague.shortcut +
                  "/" +
                  season.toString(),
              );

              if (!tempData.ok) {
                continue;
              }

              const jsonData = await tempData.json();
              
              // Skip if no data is available for this season
              if (!jsonData || jsonData.length === 0) {
                continue;
              }

              const leagueData = processData(jsonData, tempLeague, season);
              data.push(leagueData);
            } catch (error) {
              continue;
            }
          }
        }
      }
    }
  }
  return data;
}

async function getCurrentMatchday(params: { country: string; league: string }) {
  const country = countries.find((c) => c.internalURL === params.country);
  const league = country?.leagues.find((l) => l.shortcut === params.league);

  if (!league) {
    return null;
  }

  const response = await fetch(
    league.dbUrl + "getcurrentgroup/" + params.league,
  );
  const currentMatchday = await response.json();
  return currentMatchday;
}

async function League(props: {
  params: Promise<{ country: string; league: string }>;
}) {
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
