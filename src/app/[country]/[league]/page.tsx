import { processData } from "../../../lib/processData";
import countries from "../../../lib/leagues";

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

async function League(
  { params }: { params: { country: string; league: string } },
) {

  const country = await params.country;
  const league = await params.league;
  const countryIndex = countries.findIndex((c) =>
    c.internalURL === country
  );
  const leagueIndex = countries[countryIndex]?.leagues.findIndex((l) =>
    l.internalURL === league
  );
 

  const data = [];

  for (const tempCountry of countries) {
    if (tempCountry.internalURL === country) {
      for (const tempLeague of tempCountry.leagues) {
        if (tempLeague.internalURL === league) {
          for (
            let season = tempLeague.startYear;
            season < new Date().getFullYear();
            season++
          ) {
            const leagueData = await processData(tempLeague, season);
            data.push(leagueData);
          }
        }
      }
    }
  }

  console.log(data.findIndex((s) => s.season ));
  

  // const data = await processData(
  //   countries[countryIndex]?.leagues[leagueIndex],
  //   params.season,
  // );
  return (
    <>
      <p>{params.country}</p>
      <p>{params.league}</p>
    </>
  );
}

export default League;
