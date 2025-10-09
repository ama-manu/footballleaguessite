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

	// if current season is incomplete but matchday is still at 34 then show last season
	// else show current season
	// matchday should advance halfway between matchdays 

	const [season, setSeason] = useState(() => {
		if (data.length < 2) return data[0].season;
		if (!(data[data.length - 1].isComplete) && data[data.length - 2].isComplete) {
			if (currentMatchday.groupOrderID === 34) {
				return data[data.length - 2].season;
			} else {
				return data[data.length - 1].season;
			}
		} else {
			return data[data.length - 1].season;
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
