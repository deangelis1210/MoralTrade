import React, { useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom'; 
import './index.css';

function PortfolioPage() {
  const [portfolioCompanies, setPortfolioCompanies] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      if (!currentUser) return;

      try {
        const response = await fetch(`/getPortfolio?username=${currentUser.username}`);
        if (!response.ok) {
          throw new Error('Failed to fetch portfolio data');
        }
        const data = await response.json();
        setPortfolioCompanies(data.portfolio);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, [currentUser]);

  const formatMarketCap = (value) => {
    if (!value) return '';

    if (value >= 1e12) {
      return "$" + (value / 1e12).toFixed(3) + " T";
    } else if (value >= 1e9) {
      return "$" + (value / 1e9).toFixed(3) + " B";
    } else if (value >= 1e6) {
      return "$" + (value / 1e6).toFixed(3) + " M";
    } else if (value >= 1e3) {
      return "$" + (value / 1e3).toFixed(3) + " K";
    } else {
      return "$" + value.toFixed(3);
    }
  };

  const deleteFromPortfolio = async (ticker) => {
    try {
      const response = await fetch(`/deleteFromPortfolio?username=${currentUser.username}&ticker=${ticker}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to delete company from portfolio');
      }
      setPortfolioCompanies(portfolioCompanies.filter(company => company.ticker !== ticker));
      alert('Removed from portfolio');
    } catch (error) {
      console.error('Error deleting company from portfolio:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="title">{currentUser.first_name}'s Portfolio</h2>
        <Link to="/home" className="btn btn-primary"><FontAwesomeIcon icon={faHome} /></Link>
      </div>
      <div className="row row-cols-1 g-4">
        {portfolioCompanies.map((company, index) => (
          <div key={index} className="col">
            <Card className="company-card">
              <Card.Body>
                <div className="row">
                  <div className="col">
                    <Card.Text className="ticker">{company.ticker}</Card.Text>
                  </div>
                  <div className="col">
                    <Card.Text className="company-name">{company.name}</Card.Text>
                  </div>
                  <div className="col">
                    <Card.Text className="sector">{company.sector}</Card.Text>
                  </div>
                  <div className="col">
                    <Card.Text className="market-cap">{formatMarketCap(company.market_cap)}</Card.Text>
                  </div>
                  <div className="col">
                    <Card.Text className="esg-subscore">E: {company.environment}</Card.Text>
                  </div>
                  <div className="col">
                    <Card.Text className="esg-subscore">S: {company.social}</Card.Text>
                  </div>
                  <div className="col">
                    <Card.Text className="esg-subscore">G: {company.governance}</Card.Text>
                  </div>
                  <div className="col">
                    <Card.Text className="esg-score">{company.total_esg}</Card.Text>
                  </div>
                  <div className="col company-actions">
                    <Button variant="danger" size="sm" onClick={() => deleteFromPortfolio(company.ticker)} className="trash-button">
                        <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PortfolioPage;
