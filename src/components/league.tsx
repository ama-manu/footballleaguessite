"use client";
import Table from "@/src/components/table";
import { LeagueTable, SeasonData } from "@/src/types/types";
import { useState } from "react";

function LeagueComponent({ data }: { data: SeasonData[] }) {
	const [season, setSeason] = useState(new Date().getFullYear() - 1);
	const [matchday, setMatchday] = useState(0);

	const currentSeasonData = data.find(d => d.season === season);
	const maxMatchday = currentSeasonData?.matchdays.length ? currentSeasonData.matchdays.length - 1 : 0;
	return (
		<>
			<button onClick={() => setSeason(season - 1)} disabled={!data.find(d => d.season === season - 1)}>
				Previous Season
			</button>
			<button onClick={() => setSeason(season + 1)} disabled={!data.find(d => d.season === season + 1)}>Next Season</button>
			<div>{season}</div>
			<button onClick={() => setMatchday(prev => prev - 1)} disabled={matchday === 0}>
				Previous Matchday
			</button>
			<button onClick={() => setMatchday(prev => prev + 1)} disabled={matchday === maxMatchday}>
				Next Matchday
			</button>
			<div>Matchday: {matchday + 1}</div>
			<Table 
				key={`${season}-${matchday}`} 
				processedData={currentSeasonData?.matchdays[matchday]?.table || []} 
			/>
		</>
	);
}

export default LeagueComponent;
