import React from 'react'
import Card from '../Components/Card/Card.jsx'
import LeagueTable from '../Components/LeagueTable/LeagueTable.jsx'
import Chart from '../Components/Chart/Chart.jsx'

import styles from './Main.module.scss'



function Main() {

    return (
        <div className={styles.base}>
            {/* <Card> */}
            <LeagueTable/>
            {/* <Chart /> */}
            {/* </Card> */}
        </div>
    )
}

export default Main