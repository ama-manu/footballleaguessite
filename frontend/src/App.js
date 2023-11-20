import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from './Components/Header/Header.jsx'
import League from './Components/League/League.jsx';

import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Header></Header>
      <Routes>
        <Route path='/' element={<League />} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;
