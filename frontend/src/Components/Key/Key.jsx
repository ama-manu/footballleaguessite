import React from 'react'

import styles from './Key.module.scss'

function Key() {
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
                    <li>S Siege</li>
                    <li>U Unentschieden</li>
                    <li>N Niederlagen</li>
                    <li>D Tordifferenz</li>
                </ul>
            </div>
        </div>
    )
}

export default Key