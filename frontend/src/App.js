import { BrowserRouter, Routes, Route } from "react-router-dom";

import Main from './Main/Main.jsx';

import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Main />} />
      </Routes>
      {/* <Main></Main> */}
    </BrowserRouter>

  );
}

export default App;
