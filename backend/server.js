const express = require("express");
const app = express();

const fetch = require("node-fetch-commonjs");

var buli = undefined;

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

app.get("/", (req, res) => {
})

// send data on /api endpoint
app.get("/api", (req, res) => {
    res.send(buli);
})

app.use((req, res) => {
    res.status(404).json({ message: "Not found" });
})

app.listen(3000, () => console.log("Server started on port 3000"));