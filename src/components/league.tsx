"use client";
import Table from "@/src/components/table";
import { SeasonData } from "@/src/types/types";
import { useState } from "react";
import DropdownMenu from "./dropdownmenu";

function LeagueComponent(
	{ data, currentMatchday }: { data: SeasonData[]; currentMatchday: any },
) {
	// const [season, setSeason] = useState(
	// 	data.findLast((d) => d.matchdays.find((m) => m.isFinished))?.season ||
	// 		new Date().getFullYear() - 1,
	// );

	const [season, setSeason] = useState(() => {
		if (currentMatchday.groupName === "1. Spieltag") {
			return data[data.length - 1].season;
		} else {
			return data[data.length - 2].season;
		}
	});

	const currentSeasonData = data.find((d) => d.season === season);
	const [matchday, setMatchday] = useState(
		(currentSeasonData?.matchdays
			.findLast((d) => d.isFinished)?.matchdayNumber || 1) - 1,
	);

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
				data={Array.from({
					length: currentSeasonData?.matchdays.length || 0,
				}, (_, i) => i + 1)}
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
