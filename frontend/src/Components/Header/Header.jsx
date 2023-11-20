import React from 'react'
import { Link, NavLink } from "react-router-dom"

import styles from './Header.module.scss'

function DropDown(params) {

}

function Header() {
  return (
    <nav className={styles.title}>
      <Link to='/'>FLS</Link>
    </nav>
    // <div className={styles.header}></div>
    // <>
    //   <nav className={styles.title}>
    //     <Link to='/'>FLS</Link>
    //   </nav>
    //   <nav className={styles.leagues}>
    //     <ul>
    //       <li>
    //         <div>
    //           {/* <img src='https://flagicons.lipis.dev/flags/4x3/de.svg'></img> */}
    //           <div>Deutschland</div>
    //         </div>

    //       </li>
    //       <li>
    //         <div>
    //           {/* <img src='https://flagicons.lipis.dev/flags/4x3/gb-eng.svg'></img> */}
    //           <div>England</div>
    //         </div>
    //       </li>
    //     </ul>

    //   </nav>
    // </>
  )
}

export default Header