import React from 'react'
import { useMediaQuery } from 'react-responsive';

import styles from './Key.module.scss'

function TableKey(tableKey) {
    // tableKeyHTML
    return (
        <div></div>
    )
}

function Key() {
    var isMobile = useMediaQuery({ query: `(max-width: 630px)` });

    var tableKey = isMobile ? [
        'Sp Spiele',
        'S Siege',
        'U Unentschieden',
        'N Niederlagen',
        'Pkt Punkte'
    ] : [
        'S Siege',
        'U Unentschieden',
        'N Niederlagen',
        'D Tordifferenz'
    ]

    return (
        <div className={styles.key}>
            <div className={styles.box}>
                <h1>Qualifikation/Relegation</h1>
                <ul>
                    <li>
                        <div className={`${styles.colourbox} ${styles.ucl}`}></div>
                        <div>UEFA Champions League</div>
                    </li>
                    <li>
                        <div className={`${styles.colourbox} ${styles.uel}`}></div>
                        <div>UEFA Europa League
                        </div>
                    </li>
                    <li>
                        <div className={`${styles.colourbox} ${styles.uecl}`}></div>
                        <div>UEFA Europa Conference League</div>
                    </li>
                    <li>
                        <div className={`${styles.colourbox} ${styles.relpo}`}></div>
                        <div>Relegation</div>
                    </li>
                    <li>
                        <div className={`${styles.colourbox} ${styles.rel}`}></div>
                        <div>Abstieg</div>
                    </li>
                </ul>
            </div>
            <div className={styles.box}>
                <h1>Legende</h1>
                <ul>
                    {/* <li>Sp Spiele</li>
                    <li>S Siege</li>
                    <li>U Unentschieden</li>
                    <li>N Niederlagen</li>
                    <li>D Tordifferenz</li>
                    <li>Pkt Punkte</li> */}
                    {tableKey.map(keyElement =>
                        <li>{keyElement}</li>
                    )}
                </ul>
            </div>
        </div>
    )
}

export default Key