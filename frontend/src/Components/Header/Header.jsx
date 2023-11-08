import React from 'react'
import { Link, NavLink } from "react-router-dom"

import styles from './Header.modules.scss'

function Header() {
  return (
    // <div className={styles.header}></div>
    <nav>
        <Link to='/' className={styles.title}>Football Leagues Site</Link>
    </nav>
  )
}

export default Header