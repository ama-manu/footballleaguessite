const express = require("express");
const app = express();

const fetch = require("node-fetch-commonjs");
const cors = require("cors");

app.use(cors());

var buliteams = undefined;
var bulitable = undefined;
var buligames = undefined;
var btables = undefined;

// function to fetch data from api
async function fetchAsync(url) {
    try {
        let response = await fetch(url);
        let data = await response.json();
        return data;
    } catch (error) {
        console.log(error.message);
    }
}

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
                team.posChange = "up";
            } else if (team.position < teamPreviousDay.position) {
                team.posChange = "down";
            }
        });
    }
    return tables;
}

// league matchday calculations
function calcLeague(matches) {
    // filter only finished matches
    var finishedMatches = [];
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

        var goals = match.goals.at(-1);
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
        } else if (pointsTeam1 < pointsTeam2) {
            newTeam2.points = 3;
            newTeam2.won = 1;
        } else {
            newTeam1.points, newTeam2.points = 1;
            newTeam1.draw, newTeam2.draw = 1;
        }


        // add teams to matchday tables
        tables[match.group.groupOrderID - 1].push(newTeam1);
        tables[match.group.groupOrderID - 1].push(newTeam2);

    });

    // add up points
    // select table, first matchday doesnt need adding up
    for (i = 1; i < tables.length; i++) {
        // select team
        tables[i].forEach(team => {
            // add points from previous matchday
            tables[i - 1].forEach(teamPre => {
                if ((team.teamName === teamPre.teamName) && (team.matches == (teamPre.matches + 1))) {
                    team.points += teamPre.points;
                    team.opponentGoals += teamPre.opponentGoals;
                    team.goals += teamPre.goals;
                    team.won += teamPre.won;
                    team.lost += teamPre.lost;
                    team.draw += teamPre.draw;
                    team.goalDiff = team.goals - team.opponentGoals;
                }
            });
        });
    }

    // sort tables
    tables.forEach(table => {
        sortLeagueTable(table);
    });

    // calculate position movements
    return calcPosChange(tables);
}


// fetchung buli teams data from openliga db
const url_buliteams = "https://api.openligadb.de/getavailableteams/bl1/2023";
(async () => {
    buliteams = await fetchAsync(url_buliteams);
})()

// fetching buli data from openligadb
// const url_bulitable = "https://api.openligadb.de/getbltable/bl1/2023";
const url_bulitable = "https://api.openligadb.de/getmatchdata/bl1/2023";
(async () => {
    buligames = await fetchAsync(url_bulitable);
    btables = calcLeague(buligames);
    bulitable = btables.at(-1);
})()

// fetchung buli games data from openligadb
const url_buligames = "https://api.openligadb.de/getmatchdata/bl1/2023";
(async () => {
    buligames = await fetchAsync(url_buligames);
    btables = calcLeague(buligames);
})()



app.get("/", (req, res) => {
    res.send("<h1>test</h1>");
})

// send data on /api/bulitable endpoint
app.get("/api/bulitable", (req, res) => {
    // console.log(bulitable);
    res.send(bulitable);
})

// send data on /api/buligames endpoint
app.get("/api/buligames", (req, res) => {
    res.send(btables);
})

app.use((req, res) => {
    res.status(404).json({ message: "Not found" });
})

app.listen(3000, () => console.log("Server started on port 3000"));