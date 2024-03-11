import { BrowserRouter, Routes, Route } from "react-router-dom";

import Leagues from "./Data/Leagues.jsx";

import Navbar from './Components/Navbar/Navbar.jsx'
import Base from './Components/Base/Base.jsx';
import League from './Components/League/League.jsx';
import Landing from './Components/Landing/Landing.jsx';

import logo from './logo.svg';
import './App.css';

function App() {
  return (
    // <BrowserRouter>
    //   <Navbar />
    //   <Routes>
    //     <Route path='/' element={<Base> <Landing /> </Base>}>
    //       {Leagues.map((countries) => {
    //         <Route path={countries.internalURL} element={<Base> <Landing /> </Base>}>
    //           {countries.submenu.map((curLeague) => {
    //             <Route path={curLeague.internalURL} element={<Base> <Landing /> </Base>}>

    //             </Route>
    //           })}
    //         </Route>
    //       })}
    //     </Route>
    //   </Routes>
    // </BrowserRouter>

    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route exact path='/' element={<Base> </Base>}>
        </Route>

        <Route exact path='/de/bl1' element={<Base> <League league={Leagues[0].submenu[0]}></League> </Base>} />
        <Route exact path='/de/bl2' element={<Base> <League league={Leagues[0].submenu[1]}></League> </Base>} />
        <Route exact path='/de/bl3' element={<Base> <League league={Leagues[0].submenu[2]}></League> </Base>} />

        {/* <Route exact path='/at/bl1' element={<Base> <League league={Leagues[1].submenu[0]}></League> </Base>} /> */}

        {/* {console.log("/" + Leagues[0].internalURL + "/" + Leagues[0].submenu[0].internalURL)} */}
        {/* {Leagues.map((curCountry) => {
          // console.log(curCountry);
          curCountry.submenu.map((curLeague) => {
            // console.log("/" + curCountry.internalURL + "/" + curLeague.internalURL);
            let thePath = ("/" + curCountry.internalURL + "/" + curLeague.internalURL);
            console.log(thePath);
            <Route exact path={thePath} element={<Base><League league={curLeague}></League></Base>}></Route>
          })
        })} */}


        {/* {Leagues.map((curCountry) => {
          let countryURL = curCountry.internalURL;
          console.log(curCountry + curCountry.submenu);
          <Route exact path={countryURL} element={<Base> <League league={curCountry.submenu[0]}></League> </Base>}>

          </Route>
        })} */}


      </Routes>
    </BrowserRouter>

  );
}

export default App;
