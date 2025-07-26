import { processData } from "../lib/processData";
import countries from "../lib/leagues";
import LeagueTableComponent from "../components/table";

export default async function Home() {
  const data = await processData(countries[0].leagues[0]);

  // console.log(data.matchdays.length);

  return (
    <div>
      <LeagueTableComponent processedData={data.matchdays[2].table} />
    </div>
  );
}
