import React, { useState, useEffect, useRef } from 'react'
import { Link, NavLink } from "react-router-dom"

import menuData from '../../Data/Leagues.jsx'
import styles from './Navbar.module.scss'

import { useMediaQuery } from 'react-responsive';

const Dropdown = ({ items, dropdown, setDropdown }) => {
  return (
    <div className={dropdown ? (styles.dropdownshow) : styles.dropdown}>
      <div className={styles.smallLine}></div>
      <ul>
        {items.submenu.map((submenu, index) => (
          <li key={index} className={styles.menuitems} tabIndex={-1} onMouseDown={(e) => e.preventDefault()}>
            {/* <Link onClick={() => dropdown && setDropdown(false)} to={`/${items.internalURL}/${submenu.internalURL}`}>{submenu.league}</Link> */}
            <Link onClick={() => dropdown && setDropdown(false)} to={`/${items.internalURL}/${submenu.internalURL}`}>
              <img className={styles.imageDropdown} src={submenu.wordmarkURL}></img>
            </Link>
          </li>
        ))}
      </ul>
    </div>

  );
};

// const MenuItems = ({ items }) => {
//   const [dropdown, setDropdown] = useState(false);
//   return (
//     <li
//       className={styles.menuitems}
//     onMouseEnter={() => setDropdown(true)}
//     onMouseLeave={() => setDropdown(false)}
//     >
//       {items.submenu ? (
//         <>
//           <button
//             type="button"
//             // aria-haspopup={dropdown ? "true" : "false"}
//             onClick={() => setDropdown((prev) => !prev)}
//           >
//             {items.country}
//             {/* <div className={styles.menubars}>
//               <div></div>
//               <div></div>
//               <div></div>
//             </div> */}

//           </button>
//           <Dropdown
//             items={items}
//             dropdown={dropdown}
//           />
//         </>
//       ) : (
//         <a href={items.internalURL}>{items.league}</a>
//       )}
//     </li>
//   );
// };

const MenuItems = ({ items }) => {
  const [dropdown, setDropdown] = useState(false);

  // let ref = useRef();

  // useEffect(() => {
  //   const handler = (event) => {
  //     if (dropdown && ref.current && !ref.current.contains(event.target)) {
  //       setDropdown(false);
  //     }
  //   };
  //   document.addEventListener("mousedown", handler);
  //   document.addEventListener("touchstart", handler);
  //   return () => {
  //     // Cleanup the event listener
  //     document.removeEventListener("mousedown", handler);
  //     document.removeEventListener("touchstart", handler);
  //   };
  // }, [dropdown]);

  return (
    <div
      className={styles.menuitems}
    // onMouseEnter={() => setDropdown(true)}
    // onMouseLeave={() => setDropdown(false)}
    >
      <button
        type="button"
        // aria-haspopup={dropdown ? "true" : "false"}
        // onMouseDown={() => event.preventDefault()}
        onClick={() => setDropdown((prev) => !prev)}


        // onFocus={() => dropdown && setDropdown(false)}
        onBlur={() => dropdown && setDropdown(false)}
      >
        <div className={styles.menubars}>
          <div></div>
          <div></div>
          <div></div>
        </div>

      </button>
      <Dropdown
        items={items}
        dropdown={dropdown}
        setDropdown={setDropdown}
      />
    </div>
  );
};


function LeagueList({ items }) {
  items.forEach((country) => country.submenu.forEach((league) => console.log(league.league)));
  return (
    <ul className={styles.leaguelist}>
      {items.map(country =>
        country.submenu.map((league, index) => (
          <Link to={`/${country.internalURL}/${league.internalURL}`}>
            <img className={styles.image} src={league.wordmarkURL}></img>
          </Link>
        ))
      )}
    </ul>
  );
}


function Navbar() {
  var isMobile = useMediaQuery({ query: `(max-width: 630px)` });

  return (
    <nav className={styles.navbar}>
      <Link to='/' className={styles.logo}>FLS</Link>
      {isMobile ? (
        <ul className={styles.menu}>
          {menuData.map((menuD) => {
            return <MenuItems items={menuD} />;
          })}
        </ul>
      ) : (
        <LeagueList items={menuData} />
      )}

    </nav>
  )
}

export default Navbar