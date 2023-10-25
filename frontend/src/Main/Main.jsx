import React from 'react'
import Card from '../Components/Card/Card.jsx'
import LeagueTable from '../Components/LeagueTable/LeagueTable.jsx'
import Chart from '../Components/Chart/Chart.jsx'
import CalculateLeague from '../Components/CalculateLeague/CalculateLeague.jsx'

import styles from './Main.module.scss'



function Main() {

    return (
        <div className={styles.base}>
            {/* <Card> */}
            {/* <LeagueTable/> */}
            {/* <Chart /> */}
            {/* </Card> */}
            <CalculateLeague></CalculateLeague>
        </div>
    )
}

export default Main