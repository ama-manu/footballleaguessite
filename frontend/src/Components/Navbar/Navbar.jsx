import React, { useState } from 'react'
import { Link, NavLink } from "react-router-dom"

import menuData from '../../Data/Leagues.jsx'
import styles from './Navbar.module.scss'

const Dropdown = ({ items, dropdown }) => {
  return (
    <ul className={dropdown ? (styles.dropdownshow) : styles.dropdown}>
      {items.submenu.map((submenu, index) => (
        <li key={index} className={styles.menuitems}>
          <Link to={`/${items.internalURL}/${submenu.internalURL}`}>{submenu.league}</Link>
        </li>
      ))}
    </ul>
  );
};

const MenuItems = ({ items }) => {
  const [dropdown, setDropdown] = useState(false);
  return (
    <li
      className={styles.menuitems}
      onMouseEnter={() => setDropdown(true)}
      onMouseLeave={() => setDropdown(false)}>
      {items.submenu ? (
        <>
          <button
            type="button"
          // aria-haspopup={dropdown ? "true" : "false"}
          // onClick={() => setDropdown((prev) => !prev)}
          >
            {items.country}{' '}
          </button>
          <Dropdown
            items={items}
            dropdown={dropdown}
          />
        </>
      ) : (
        <a href={items.internalURL}>{items.league}</a>
      )}
    </li>
  );
};


function Navbar() {
  return (
    <nav className={styles.navbar}>
      <Link to='/' className={styles.logo}>FLS</Link>
      <ul className={styles.menu}>
        {menuData.map((menuD) => {
          return <MenuItems items={menuD}/>;
        })}
      </ul>
    </nav>
  )
}

export default Navbar