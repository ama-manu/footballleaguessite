import React, { useEffect, useState } from 'react'

import Base from '../Base/Base.jsx'
import Chart from '../Chart/Chart.jsx'
import SelectMatchday from '../SelectMatchday/SelectMatchday.jsx'
import Key from '../Key/Key.jsx'

import styles from './League.module.scss'

// team object constructor funciton
function buliTeam(teamName, shortName, teamIconUrl, points, position, posChange, opponentGoals, goals, matches, won, lost, draw, goalDiff) {
    this.teamName = teamName;
    this.shortName = shortName;
    this.teamIconUrl = teamIconUrl;
    this.points = points;
    this.position = position;
    this.posChange = posChange;                   // team moved up or down a position
    this.opponentGoals = opponentGoals;
    this.goals = goals;
    this.matches = matches;
    this.won = won;
    this.lost = lost;
    this.draw = draw;
    this.goalDiff = goalDiff;
}

// sort league table by points and goalDiff and goals
function sortLeagueTable(table) {
    var sortedTable = table.sort((a, b) => {
        return b.points - a.points || b.goalDiff - a.goalDiff || b.goals - a.goals;
    });

    // calculate position
    var i = 1;
    sortedTable.forEach(team => {
        team.position = i;
        i++;
    });

    return sortedTable;
}

// determine league position changes
function calcPosChange(tables) {
    // go through tables
    // start with 2nd day, always look back 1 day
    for (var i = 1; i < tables.length; i++) {
        // go through teams
        tables[i].forEach(team => {
            const teamPreviousDay = tables[i - 1].find(x => x.teamName === team.teamName);
            if (team.position > teamPreviousDay.position) {
                team.posChange = "down";
            } else if (team.position < teamPreviousDay.position) {
                team.posChange = "up";
            }
            // if (i === 9) {
            //     console.log(teamPreviousDay.teamName, teamPreviousDay.position, " -> ", team.position);
            // }
        });
    }
    return tables;
}

// fill teams with previous info if they haven't played yet
function fillNotYetPlayedMatches(tables) {
    for (var i = 0; i < tables.length - 1; i++) {
        tables[i].forEach(team => {
            if (tables[i + 1].find(x => x.teamName === team.teamName) === undefined) {
                tables[i + 1].push(team);
            };
        });
    }
}

// league matchday calculations
async function calcLeague(matches) {
    // filter only finished matches
    var finishedMatches = [];
    // console.log(matches);
    matches.forEach(match => {
        if (match.matchIsFinished === true) {
            finishedMatches.push(match);
        }
    });

    // set up empty tables for all matchdays
    var tables = [...Array(finishedMatches.at(-1).group.groupOrderID)].map(e => []);

    // calculate points for each team per matchday
    finishedMatches.forEach(match => {
        // extract points
        const pointsTeam1 = match.matchResults[1].pointsTeam1;
        const pointsTeam2 = match.matchResults[1].pointsTeam2;


        // sort goals by time
        var sortedGoals = match.goals.sort((a, b) => {
            return a.matchMinute - b.matchMinute;
        });
        var goals = sortedGoals.at(-1); // match.goals
        // if no goals, add 0:0
        if (goals === undefined) {
            goals = {
                "scoreTeam1": 0,
                "scoreTeam2": 0
            }
        }

        // construct teams
        var newTeam1 = new buliTeam(match.team1.teamName, match.team1.shortName, match.team1.teamIconUrl, 0, 0, "", goals.scoreTeam2, goals.scoreTeam1, match.group.groupOrderID, 0, 0, 0, 0);
        var newTeam2 = new buliTeam(match.team2.teamName, match.team2.shortName, match.team2.teamIconUrl, 0, 0, "", goals.scoreTeam1, goals.scoreTeam2, match.group.groupOrderID, 0, 0, 0, 0);

        // calculate points
        if (pointsTeam1 > pointsTeam2) {
            newTeam1.points = 3;
            newTeam1.won = 1;
            newTeam2.lost = 1;
        } else if (pointsTeam1 < pointsTeam2) {
            newTeam1.lost = 1;
            newTeam2.points = 3;
            newTeam2.won = 1;
        } else {
            newTeam1.points = 1;
            newTeam2.points = 1;
            newTeam1.draw = 1;
            newTeam2.draw = 1;
        }


        // add teams to matchday tables
        tables[match.group.groupOrderID - 1].push(newTeam1);
        tables[match.group.groupOrderID - 1].push(newTeam2);

    });

    // add up stats
    // select table, first matchday doesnt need adding up
    for (var i = 1; i < tables.length; i++) {
        // select team
        tables[i].forEach(team => {
            // add up stats from previous matchday
            const teamPre = tables[i - 1].find(x => (x.teamName === team.teamName) && (team.matches === (x.matches + 1)));
            if ((team.teamName === teamPre.teamName) && (team.matches === (teamPre.matches + 1))) {
                team.points += teamPre.points;
                team.opponentGoals += teamPre.opponentGoals;
                team.goals += teamPre.goals;
                team.won += teamPre.won;
                team.lost += teamPre.lost;
                team.draw += teamPre.draw;
                team.goalDiff = team.goals - team.opponentGoals;
            }
        });
    }

    fillNotYetPlayedMatches(tables);

    // sort tables
    tables.forEach(table => {
        sortLeagueTable(table);
    });

    // replace union logo
    tables.forEach(table => {
        table.forEach(team => {
            if (team.shortName === "Union Berlin") {
                team.teamIconUrl = 'https://upload.wikimedia.org/wikipedia/commons/4/44/1._FC_Union_Berlin_Logo.svg';
            }
        });
    });

    // calculate position movements
    return calcPosChange(tables);
}

function League() {

    var url_bulimatches = "https://api.openligadb.de/getmatchdata/bl1/2023";
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(url_bulimatches);
                const result = await response.json();
                const fresult = await calcLeague(result);
                setData(fresult);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        fetchData();
    }, [url_bulimatches]);

    return (
        <Base>
            {/* <h1 className={styles.league}>Bundesliga</h1> */}
            <div className={styles.league}>
                <img className={styles.leagueImg} src='https://www.bundesliga.com/assets/logo/bundesliga_pos.svg'></img>
                <SelectMatchday data={data} />
                <Key></Key>
            </div>
        </Base>
    )
}

export default League