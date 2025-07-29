"use client";
import Table from "@/src/components/table";
import { SeasonData } from "@/src/types/types";
import { useState } from "react";
import DropdownMenu from "./dropdownmenu";

function LeagueComponent({ data }: { data: SeasonData[] }) {
	const [season, setSeason] = useState(new Date().getFullYear() - 1);
	const [matchday, setMatchday] = useState(
		data.find((d) => d.season === new Date().getFullYear() - 1)?.matchdays
			.findLast((d) => d.isFinished)?.matchdayNumber || 0,
	);

	const currentSeasonData = data.find((d) => d.season === season);
	return (
		<>
			<DropdownMenu
				type="season"
				defaultVal={season}
				data={data.map((d) => d.season)}
				setfunction={setSeason}
			/>
			<DropdownMenu
				type="matchday"
				defaultVal={matchday}
				data={Array.from({ length: currentSeasonData?.matchdays.length || 0 }, (_, i) => i + 1)}
				setfunction={setMatchday}
			/>
			<Table
				key={`${season}-${matchday}`}
				processedData={currentSeasonData?.matchdays[matchday]?.table ||
					[]}
			/>
		</>
	);
}

export default LeagueComponent;
