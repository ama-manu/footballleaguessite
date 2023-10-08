const express = require("express");
const app = express();

const fetch = require("node-fetch-commonjs");
const cors = require("cors");

app.use(cors());

var buli = undefined;
var union = undefined;

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

// fetching buli data from openligadb
const url = "https://api.openligadb.de/getbltable/bl1/2023";
(async () => {
    buli = await fetchAsync(url);
})()

// fetchung union Berlin data from openligadb
const urlu = "https://api.openligadb.de/getmatchdata/bl1/2023/Union%20Berlin";
(async () => {
    union = await fetchAsync(urlu);
})()

app.get("/", (req, res) => {
    res.send("<h1>test</h1>");
})

// send data on /api/buli endpoint
app.get("/api/buli", (req, res) => {
    // console.log(buli);
    res.send(buli);
})

// send data on /api/union endpoint
app.get("/api/union", (req, res) => {
    // console.log(buli);
    res.send(union);
})

app.use((req, res) => {
    res.status(404).json({ message: "Not found" });
})

app.listen(3000, () => console.log("Server started on port 3000"));