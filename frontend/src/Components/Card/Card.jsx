import React from 'react'
import { Link } from "react-router-dom"

import styles from './Card.module.scss'

function Card({ countryURL, league }) {
  return (
    // <div className={styles.card}>
      <Link className={styles.title} to={`/${countryURL}/${league.internalURL}`}>
        <img className={styles.img} src={league.logoURL}></img>
        {/* {league.name} */}
      </Link>
    // </div>
  )
}

export default Card