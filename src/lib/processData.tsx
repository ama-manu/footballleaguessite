import fetchData from "./fetchData";
import { LeagueConfig, LeagueData, Match, Matchday } from "../types/types";

function checkAllPlayed(matches: Match[]): boolean {
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
			matchResults: match.matchResults.map((result: any) => ({
				resultId: result.resultID,
				resultName: result.resultName,
				pointsTeam1: result.pointsTeam1,
				pointsTeam2: result.pointsTeam2,
				resultOrderId: result.resultOrderID,
				resultTypeId: result.resultTypeID,
				resultDescription: result.resultDescription,
			})),
			goals: match.goals.map((goal: any) => ({
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
			})),
			location: match.location,
			numberOfViewers: match.numberOfViewers,
		};

		newMatches.push(newMatch);
	});
	return newMatches;
}

function groupMatchesByMatchday(matches: Match[]): Matchday[] {
	const maxMatchdayNumber = Math.max(
		...matches.map((match) => match.matchday.number),
	);

	let matchDays: Matchday[] = [];
	for (let index = 0; index < maxMatchdayNumber; index++) {
		matchDays.push({
			matchdayNumber: index + 1,
			matches: matches.filter((match) =>
				match.matchday.number === index + 1
			),
			isFinished: checkAllPlayed(
				matches.filter((match) => match.matchday.number === index + 1),
			),
		});
	}

	return matchDays;
}

async function processData(config: LeagueConfig) {
	const data = await fetchData(config.externalURL);

	// if (isLoading) return { newData: null, error: true, isLoading: true };
	// if (error) return { newData: null, error: true, isLoading: false };

	// let newData = data;

	const matches = transformMatches(data);

	let newData: LeagueData = {
		config: config,
		season: data[0].leagueSeason,
		matchdays: groupMatchesByMatchday(matches),
		allMatches: matches,
		isComplete: checkAllPlayed(matches),
	};

	return newData;
}

export { processData };
