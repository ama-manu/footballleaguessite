import fetchData from "./fetchData";
import {
	LeagueConfig,
	LeagueTable,
	Match,
	Matchday,
	SeasonData,
	TableEntry,
} from "../types/types";

function checkAllPlayed(matches: Match[], seasonStartYear: number): boolean {
	if (seasonStartYear < new Date().getFullYear()) {
		return true; // If the season is in the past, we assume all matches are played
	}
	return matches.every((match) => match.matchIsFinished);
}

function transformMatches(matches: any[]): Match[] {
	let newMatches: Match[] = [];

	matches.forEach((match) => {
		const newMatch: Match = {
			matchId: match.matchID,
			matchDateTime: match.matchDateTime,
			timeZoneId: match.timeZoneID,
			matchday: {
				number: match.group.groupOrderID,
				matchdayId: match.group.groupID,
			},
			team1: {
				teamId: match.team1.teamId,
				teamName: match.team1.teamName,
				shortName: match.team1.shortName,
				teamIconUrl: match.team1.teamIconUrl,
			},
			team2: {
				teamId: match.team2.teamId,
				teamName: match.team2.teamName,
				shortName: match.team2.shortName,
				teamIconUrl: match.team2.teamIconUrl,
			},
			lastUpdateDateTime: match.lastUpdateDateTime,
			matchIsFinished: match.matchIsFinished,
			matchResults: match.matchResults?.map((result: any) => ({
				resultId: result.resultID,
				resultName: result.resultName,
				pointsTeam1: result.pointsTeam1,
				pointsTeam2: result.pointsTeam2,
				resultOrderId: result.resultOrderID,
				resultTypeId: result.resultTypeID,
				resultDescription: result.resultDescription,
			})) ?? [],
			winner: calculateResult(match.matchResults),
			goals: match.goals?.map((goal: any) => ({
				goalId: goal.goalID,
				scoreTeam1: goal.scoreTeam1,
				scoreTeam2: goal.scoreTeam2,
				matchMinute: goal.matchMinute,
				goalGetterId: goal.goalGetterID,
				goalGetterName: goal.goalGetterName,
				isPenalty: goal.isPenalty,
				isOwnGoal: goal.isOwnGoal,
				isOvertime: goal.isOvertime,
				comment: goal.comment,
			})) ?? [],
			location: match.location,
			numberOfViewers: match.numberOfViewers,
		};
		// console.log(newMatch);
		newMatches.push(newMatch);
	});
	return newMatches;
}

function excludeRelegationMatches(
	matches: any[],
	config: LeagueConfig,
): any[] {
	// return matches.filter((match) => {
	// 	const groupName = match.group.groupName;
	// 	for (let i = 1; i <= (config.size - 1) * 2; i++) {
	// 		if (groupName === `${i}. Spieltag`) {
	// 			return false;
	// 		}
	// 	}
	// 	return true;
	// });
	const tempMatches: any[] = [];
	matches.forEach((match) => {
		if (!match.group.groupName.includes("Spieltag")) {
			// console.log(`Excluding match: ${match.matchID} - ${match.group.groupName}`);
		} else {
			tempMatches.push(match);
		}
	});
	return tempMatches;
}

function calculateResult(
	matchResults: any[],
): "team1" | "team2" | "draw" | null {
	if (matchResults.length === 0) return null;

	const result = matchResults.find((r) => r.resultName === "Endergebnis");
	if (!result) return null;
	if (result.pointsTeam1 > result.pointsTeam2) {
		return "team1";
	} else if (result.pointsTeam1 < result.pointsTeam2) {
		return "team2";
	} else {
		return "draw";
	}
}

function groupMatchesByMatchday(
	matches: Match[],
	seasonStartYear: number,
): Matchday[] {
	const maxMatchdayNumber = Math.max(
		...matches.map((match) => match.matchday.number),
	);

	let matchDays: Matchday[] = [];
	let previousTable: LeagueTable | null = null;

	for (let index = 1; index <= maxMatchdayNumber; index++) {
		const indexMatches = matches.filter((match) =>
			match.matchday.number === index
		);
		if (previousTable === null) {
			previousTable = calculateTable(indexMatches, null);
		} else {
			previousTable = calculateTable(indexMatches, previousTable);
		}

		matchDays.push({
			matchdayNumber: index,
			matches: indexMatches,
			isFinished: checkAllPlayed(indexMatches, seasonStartYear),
			table: previousTable,
		});
	}

	if (seasonStartYear < 2003) {
		console.log(matchDays);
	}

	return matchDays;
}

function calculateTable(
	matches: Match[],
	previousTable: LeagueTable | null,
): LeagueTable {
	let tempTable: LeagueTable = [];

	// Create a temporary table to hold the current matchday's results
	// This will be used to calculate the new table based on the previous table
	matches.forEach((match) => {
		// Create temporary entries for both teams
		// Initialize with default values
		let tempTeam1Entry: TableEntry = {
			position: 0,
			positionChange: null,
			team: {
				teamId: match.team1.teamId,
				teamName: match.team1.teamName,
				teamIconUrl: match.team1.teamIconUrl,
				matchesPlayed: 0,
				wins: 0,
				draws: 0,
				losses: 0,
				goalsFor: 0,
				goalsAgainst: 0,
				goalDifference: 0,
				points: 0,
				form: [],
			},
		};
		let tempTeam2Entry: TableEntry = {
			position: 0,
			positionChange: null,
			team: {
				teamId: match.team2.teamId,
				teamName: match.team2.teamName,
				teamIconUrl: match.team2.teamIconUrl,
				matchesPlayed: 0,
				wins: 0,
				draws: 0,
				losses: 0,
				goalsFor: 0,
				goalsAgainst: 0,
				goalDifference: 0,
				points: 0,
				form: [],
			},
		};

		// only add game results if the match is finished
		if (match.matchIsFinished) {
			// Find the result with the highest order ID
			// This is the final result of the match
			const highestOrderId = Math.max(
				...match.matchResults.map((r) => r.resultOrderId),
			);
			const result: any = match.matchResults.find((r) =>
				r.resultOrderId === highestOrderId
			);

			// both teams have played one match
			tempTeam1Entry.team.matchesPlayed++;
			tempTeam2Entry.team.matchesPlayed++;

			if (result) {
			tempTeam1Entry.team.goalsFor += result.pointsTeam1;
			tempTeam1Entry.team.goalsAgainst += result.pointsTeam2;
			tempTeam1Entry.team.goalDifference += result.pointsTeam1 -
				result.pointsTeam2;

			tempTeam2Entry.team.goalsFor += result.pointsTeam2;
			tempTeam2Entry.team.goalsAgainst += result.pointsTeam1;
			tempTeam2Entry.team.goalDifference += result.pointsTeam2 -
				result.pointsTeam1;
			}

			switch (match.winner) {
				case "team1":
					tempTeam1Entry.team.wins++;
					tempTeam1Entry.team.points += 3;
					tempTeam1Entry.team.form.push("W");

					tempTeam2Entry.team.losses++;
					tempTeam2Entry.team.form.push("L");
					break;
				case "team2":
					tempTeam2Entry.team.wins++;
					tempTeam2Entry.team.points += 3;
					tempTeam2Entry.team.form.push("W");

					tempTeam1Entry.team.losses++;
					tempTeam1Entry.team.form.push("L");
					break;
				case "draw":
					tempTeam1Entry.team.draws++;
					tempTeam1Entry.team.points++;
					tempTeam1Entry.team.form.push("D");

					tempTeam2Entry.team.draws++;
					tempTeam2Entry.team.points++;
					tempTeam2Entry.team.form.push("D");
					break;
			}
		}

		tempTable.push(tempTeam1Entry);
		tempTable.push(tempTeam2Entry);
	});

	let newTable: LeagueTable = [];

	// if there is a previous table, we need to update the new table based on the previous table
	// if there is no previous table, we just use the tempTable
	// This is the case for the first matchday of the season
	if (previousTable !== null) {
		previousTable.forEach((prevTeam) => {
			const currentTeam = tempTable.find((t) =>
				t.team.teamId === prevTeam.team.teamId
			);
			if (currentTeam) {
				currentTeam.team.matchesPlayed += prevTeam.team.matchesPlayed;
				currentTeam.team.wins += prevTeam.team.wins;
				currentTeam.team.draws += prevTeam.team.draws;
				currentTeam.team.losses += prevTeam.team.losses;
				currentTeam.team.goalsFor += prevTeam.team.goalsFor;
				currentTeam.team.goalsAgainst += prevTeam.team.goalsAgainst;
				currentTeam.team.goalDifference += prevTeam.team.goalDifference;
				currentTeam.team.points += prevTeam.team.points;

				// Update form
				currentTeam.team.form = [
					...prevTeam.team.form,
					...currentTeam.team.form,
				];

				newTable.push(currentTeam);
			} else {
				newTable.push(prevTeam);
			}
		});
	} else if (previousTable === null && tempTable.length > 0) {
		tempTable.forEach((team) => {
			newTable.push(team);
		});
	}

	// if there is a previous table, we need to add teams that are not in the new table
	// This is the case when a team has not played the matchdays match yet
	if (previousTable !== null && newTable.length < previousTable.length) {
		previousTable.forEach((team) => {
			if (!newTable.some((t) => t.team.teamId === team.team.teamId)) {
				newTable.push(team);
			}
		});
	}

	sortTable(newTable);
	calculatePositionChange(newTable, previousTable);

	return newTable;
}

function sortTable(table: LeagueTable): LeagueTable {
	const sortedTable = table.sort((a: TableEntry, b: TableEntry) => {
		// First sort by points (descending)
		if (b.team.points !== a.team.points) {
			return b.team.points - a.team.points;
		}

		// If points are equal, sort by goal difference (descending)
		if (b.team.goalDifference !== a.team.goalDifference) {
			return b.team.goalDifference - a.team.goalDifference;
		}

		// If goal difference is equal, sort by goals for (descending)
		if (b.team.goalsFor !== a.team.goalsFor) {
			return b.team.goalsFor - a.team.goalsFor;
		}

		// If all above are equal, sort by team name (ascending)
		const nameA = a.team.teamName.replace(/^\d+\.\s*/, "");
		const nameB = b.team.teamName.replace(/^\d+\.\s*/, "");
		return nameA.localeCompare(nameB);
	});

	// Assign positions after sorting
	sortedTable.forEach((team, index) => {
		team.position = index + 1;
	});
	return sortedTable;
}

function calculatePositionChange(
	table: LeagueTable,
	previousTable: LeagueTable | null,
): void {
	// assume that all teams are in the table
	if (!previousTable) return;

	table.forEach((newTeam) => {
		const previousTeam = previousTable.find((prevTeam) =>
			prevTeam.team.teamId === newTeam.team.teamId
		);
		if (previousTeam && previousTeam.position < newTeam.position) {
			newTeam.positionChange = "up";
		} else if (previousTeam && previousTeam.position > newTeam.position) {
			newTeam.positionChange = "down";
		}
	});
}

async function processData(config: LeagueConfig, seasonStartYear: number) {
	// const data = await fetchData(config.externalURL + "2024");
	const data = await fetchData(
		config.externalURL + seasonStartYear.toString(),
	);

	const tempMatches = excludeRelegationMatches(data, config);

	const matches = transformMatches(tempMatches);

	// if (seasonStartYear === 2024) {
	// 	console.log(tempMatches[tempMatches.length - 1].group.groupName);
	// }
	
	let newData: SeasonData = {
		config: config,
		season: seasonStartYear,
		matchdays: groupMatchesByMatchday(matches, seasonStartYear),
		allMatches: matches,
		isComplete: checkAllPlayed(matches, seasonStartYear),
	};

	return newData;
}

export { processData };
