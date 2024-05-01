import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IndexPage from './pages/index';
import LoginPage from './pages/login';
import SignupPage from './pages/signup';
import PortfolioPage from './pages/portfolio'; // Import the PortfolioPage component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<IndexPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
      </Routes>
    </Router>
  );
}

export default App;
