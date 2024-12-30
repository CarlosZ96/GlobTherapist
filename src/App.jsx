/* eslint-disable react/react-in-jsx-scope */
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Mainpage from './Components/Homepage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Mainpage />} />
      </Routes>
    </div>
  );
}

export default App;
