import React, { useState, useEffect } from "react";

import styles from './TeamGames.module.scss'

const url = "http://localhost:3000/api/union";

function FetchData() {
    const [dbdata, setdbData] = useState([]);

    useEffect(() => {
        fetch(url)
            .then(response => response.json())
            .then(data => setdbData(data))
            .catch(err => console.log(err))
    }, [])

    return dbdata;
}

function TeamGames() {

    const tempData = FetchData();
    const data = tempData;
    return (
        <div>TeamGames</div>
    )
}

export default TeamGames