import React, { useRef, useState, useEffect } from "react";
import * as d3 from 'd3';

import styles from './Chart.module.scss'

const url = "http://localhost:3000/api/buligames";

function FetchData(dataUrl) {
    const [dbdata, setdbData] = useState([]);

    useEffect(() => {
        fetch(dataUrl)
            .then(response => response.json())
            .then(data => setdbData(data))
            .catch(err => console.log(err))
    }, [])

    return dbdata;
}

function TeamGames() {
    const tempData = FetchData(url);
    // console.log(tempData);

    useEffect(() => {
        // dimensions
        const margin = { top: 70, right: 30, bottom: 40, left: 80 };
        const width = 500 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;


        // x & y scales
        const x = d3.scaleLinear()
            .range([0, width]);

        const y = d3.scaleLinear()
            .range([height, 0]);

        // create svg
        const svg = d3.select("#chart-container")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // console.log(tempData);
        // process data for only one team (test)
        var team0 = [];
        tempData.forEach(element => {
            element.forEach(e => {

                if (e.teamName === 'Werder Bremen') {
                    team0.push(e);
                }
            });

        });

        // team0 = team0.slice(0, 4);
        // console.log(team0);

        // x & y domains (what data goes which axis)
        x.domain([1, d3.max(team0, d => d.matches)]);
        y.domain([0, d3.max(team0, d => d.points)]);

        // add x axis
        const xAxisTicks = x.ticks().filter(Number.isInteger);
        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x)
                .tickValues(xAxisTicks)
                .tickFormat(d3.format("d")));

        // add y axis
        const yAxisTicks = y.ticks().filter(Number.isInteger);
        svg.append("g")
            .call(d3.axisLeft(y)
                .tickValues(yAxisTicks)
                .tickFormat(d3.format("d"))
                );

        // create line generator
        const line = d3.line()
            .x(d => x(d.matches))
            .y(d => y(d.points));

        // add line path
        svg.append("path")
            .datum(team0)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("strokewidth", 1)
            .attr("d", line);
    });

    return (
        <React.Fragment>
            <svg
                id="chart-container"
                width="100%"
                height="100%"
                viewBox="0 0 1500 1500"
            ></svg>
        </React.Fragment>
        // <div></div>
    );
}

export default TeamGames