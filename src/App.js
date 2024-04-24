import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IndexPage from './pages/index'; // Import the Index Page component
import LoginPage from './pages/login'; // Import the Index Page component
import SignupPage from './pages/signup'; // Import the Index Page component

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<IndexPage />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/signup" element={<SignupPage />}></Route>
        </Routes>
    </Router>
  );
}

export default App;