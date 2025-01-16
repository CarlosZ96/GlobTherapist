import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Month from './Components/Month';
import './App.css';
import Mainpage from './Components/Homepage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Mainpage />} />
        <Route path="/ca" element={<Month />} />
      </Routes>
    </div>
  );
}

export default App;
