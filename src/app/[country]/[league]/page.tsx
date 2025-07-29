import { processData } from "@/src/lib/processData";
import countries from "@/src/lib/leagues";
import Table from "@/src/components/table";

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

async function League(props: { params: Promise<{ country: string; league: string }> }) {
  const params = await props.params;

  const countryIndex = countries.findIndex((c) =>
    c.internalURL === params.country
  );
  const leagueIndex = countries[countryIndex]?.leagues.findIndex((l) =>
    l.internalURL === params.league
  );


  const data = [];

  for (const tempCountry of countries) {
    if (tempCountry.internalURL === params.country) {
      for (const tempLeague of tempCountry.leagues) {
        if (tempLeague.internalURL === params.league) {
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

  // console.log(data[0].matchdays[0].table);

  return (
    <>
      <Table processedData={data[0].matchdays[0].table} />
    </>
  );
}

export default League;
