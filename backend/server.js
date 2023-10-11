const express = require("express");
const app = express();

const fetch = require("node-fetch-commonjs");
const cors = require("cors");

app.use(cors());

var buliteams = undefined;
var bulitable = undefined;
var buligames = undefined;

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

function buliTeam(teamName, shortName, teamIconUrl, points, opponentGoals, goals, matches, won, lost, draw, goalDiff) {
    this.teamName = teamName;
    this.shortName = shortName;
    this.teamIconUrl = teamIconUrl;
    this.points = points;
    this.opponentGoals = opponentGoals;
    this.goals = goals;
    this.matches = matches;
    this.won = won;
    this.lost = lost;
    this.draw = draw;
    this.goalDiff = goalDiff;
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
    var tables = [...Array(finishedMatches.slice(-1).pop().group.groupOrderID)].map(e => []);

    // calculate points for each team per matchday
    finishedMatches.forEach(match => {
        // extract points
        const pointsTeam1 = match.matchResults[1].pointsTeam1;
        const pointsTeam2 = match.matchResults[1].pointsTeam2;



        var goals = match.goals.slice(-1).pop();
        // if no goals, add 0:0
        if (goals === undefined) {
            goals = {
                "scoreTeam1": 0,
                "scoreTeam2": 0
            }
        }


        // construct teams
        var newTeam1 = new buliTeam(match.team1.teamName, match.team1.shortName, match.team1.teamIconUrl, 0, goals.scoreTeam2, goals.scoreTeam1, match.group.groupOrderID, 0, 0, 0, 0);
        var newTeam2 = new buliTeam(match.team2.teamName, match.team2.shortName, match.team2.teamIconUrl, 0, goals.scoreTeam1, goals.scoreTeam2, match.group.groupOrderID, 0, 0, 0, 0);

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

        
        // if(match.team1.teamName === 'Werder Bremen') {
        //     console.log(match.matchID, goals, newTeam1.points);
        // } else if ( match.team2.teamName === 'Werder Bremen') {
        //     console.log(match.matchID, goals, newTeam2.points);
        // }

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
                }
            });
        });
    }
    // console.log(tables.slice(-1));

    return tables;
}



// fetchung buli teams data from openliga db
const url_buliteams = "https://api.openligadb.de/getavailableteams/bl1/2023";
(async () => {
    buliteams = await fetchAsync(url_buliteams);
})()

// fetching buli data from openligadb
const url_bulitable = "https://api.openligadb.de/getbltable/bl1/2023";
(async () => {
    bulitable = await fetchAsync(url_bulitable);
})()

// fetchung buli games data from openligadb
const url_buligames = "https://api.openligadb.de/getmatchdata/bl1/2023";
(async () => {
    buligames = await fetchAsync(url_buligames);
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
    // calculate league position each matchday
    // console.log(buligames);
    res.send(calcLeague(buligames));
})

app.use((req, res) => {
    res.status(404).json({ message: "Not found" });
})

app.listen(3000, () => console.log("Server started on port 3000"));