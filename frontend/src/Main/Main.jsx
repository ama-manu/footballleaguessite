import React from 'react'
import LeagueTable from '../Components/LeagueTable/LeagueTable.jsx'

import styles from './Main.modules.scss'



function Main() {

    return (
        <div className={styles.base}>
            <LeagueTable></LeagueTable>
        </div>
    )
}

export default Main