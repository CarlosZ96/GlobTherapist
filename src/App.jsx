import React from 'react';
import { Route, Routes } from 'react-router-dom';
import CreatePro from './Components/CreatePro';
import './App.css';
import Mainpage from './Components/Homepage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Mainpage />} />
        <Route path="/ca" element={<CreatePro />} />
      </Routes>
    </div>
  );
}

export default App;
