import React from 'react'

import styles from './Landing.module.scss'

import Card from '../Card/Card.jsx'

function Landing({ leagues }) {
  return (
    // <Card countryURL={leagues[0].internalURL} league={leagues[0].submenu[0]}></Card>
    <div className={styles.country}>
      {leagues.map((league, index) => (
        <div key={index}>
          <h1>{league.country}</h1>
          <ul className={styles.cardList}>
            {league.submenu.map((item, subIndex) => (
              <li key={subIndex}>
                <Card countryURL={league.internalURL} league={item}></Card>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>

  )
}

export default Landing