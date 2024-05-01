import React, { useEffect, useState } from 'react';
import './index.css';
import { NavLink, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Container, Nav, Card, Alert, Form, Button, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSignOutAlt, faPlus } from '@fortawesome/free-solid-svg-icons';

function IndexPage() {
  const navigate = useNavigate();
  const [allCompanies, setAllCompanies] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [sectionTitle, setSectionTitle] = useState('All Companies');

  useEffect(() => {
    fetch('/allCompanies')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json();
      })
      .then(data => {
        setAllCompanies(data.companies);
        setCompanies(data.companies);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSignOut = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  const loadAboveAverageESGCompanies = () => {
    fetch('/aboveAverageESGcompanies')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json();
      })
      .then(data => {
        setCompanies(data.message);
        setSectionTitle('Top Performing ESG');
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  };

  const loadHealthAndOilCompanies = () => {
    fetch('/healthAndOilCompanies')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json();
      })
      .then(data => {
        setCompanies(data.message);
        setSectionTitle('Health and Oil Companies');
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  };

  const loadTopSectorCompanies = () => {
    fetch('/topSectorPerformers')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json();
      })
      .then(data => {
        setCompanies(data.message);
        setSectionTitle('Top Sector Performers');
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  };

  const loadSectorMarketCaps = () => {
    fetch('/sectorMarketCaps')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json();
      })
      .then(data => {
        setCompanies(data.message);
        setSectionTitle('Top Market Caps in Sectors');
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  };

  const loadAllCompanies = (event) => {
    event.preventDefault();
    setCompanies(allCompanies);
    setSectionTitle('All Companies');
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    if (event.target.value === '') {
      switch (sectionTitle) {
        case 'Top Performing ESG':
          loadAboveAverageESGCompanies();
          break;
        case 'Health and Oil Companies':
          loadHealthAndOilCompanies();
          break;
        case 'Top Sector Performers':
          loadTopSectorCompanies();
          break;
        default:
          loadAllCompanies(event);
      }
    } else {
      const filteredCompanies = companies.filter(company =>
        company.ticker.toLowerCase().includes(event.target.value.toLowerCase()) ||
        company.name.toLowerCase().includes(event.target.value.toLowerCase())
      );
      setCompanies(filteredCompanies);
    }
  };

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

  const addCompanyToPortfolio = (company) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    console.log('Current User:', currentUser);
  
    if (!currentUser || !currentUser.username) {
      console.error('Current user is invalid');
      return;
    }
  
    const { ticker } = company;
  
    const payload = {
      ticker: ticker,
      username: currentUser.username,
      first_name: currentUser.first_name,
      date: new Date().toLocaleDateString(),
    };
  
    console.log('Payload:', payload);
  
    fetch('/addToPortfolio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to add company to portfolio');
        }
        return response.json();
      })
      .then((data) => {
        alert('Added to portfolio');
      })
      .then((data) => {
        console.log('Company added to portfolio successfully:', data);
      })
      .catch((error) => {
        console.error('Error adding company to portfolio:', error);
      });
  };    

  if (loading) {
    return (
      <Container className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="error-container">
        <Alert variant="danger">Error: {error}</Alert>
      </Container>
    );
  }

  return (
    <>
      <Navbar bg="light" variant="light" expand="lg">
        <Container>
          <Navbar.Brand href="#home">MVP Stock Trading</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#all-companies" onClick={(event) => loadAllCompanies(event)}>All Companies</Nav.Link>
              <Nav.Link as={NavLink} to="/portfolio">Portfolio</Nav.Link>
              <Dropdown>
                <Dropdown.Toggle variant="light" id="dropdown-basic">
                  Sections
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={loadAboveAverageESGCompanies}>Top Performing ESG</Dropdown.Item>
                  <Dropdown.Item onClick={loadHealthAndOilCompanies}>Health and Oil Companies</Dropdown.Item>
                  <Dropdown.Item onClick={loadTopSectorCompanies}>Top Sector Performers</Dropdown.Item>
                  <Dropdown.Item onClick={loadSectorMarketCaps}>Top Market Caps in Sectors</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          
            <div className="user-actions d-flex align-items-center">
              {currentUser && (
                <div className="user-info">
                  <span className="user-name">Hello, {currentUser.first_name}</span>
                </div>
              )}
              <Form className="d-flex search-container">
                <Form.Control
                  type="search"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={handleSearch}
                  className="search-bar"
                />
                <span className="search-icon">
                  <FontAwesomeIcon icon={faSearch} />
                </span>
              </Form>
              
              <Button className="sign-out-button" variant="outline-primary" onClick={handleSignOut}>
                <FontAwesomeIcon icon={faSignOutAlt} />
              </Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="py-4">
        <main>
          <section id="all-companies" className="mb-4">
            <h2 className="section-title">{sectionTitle}</h2>
            <div className="row row-cols-1 g-4">
              {companies.map((company, index) => (
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
                        <Card.Text className="esg-score">{company.esg}</Card.Text>
                      </div>
                        <div className="col company-actions">
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          onClick={() => addCompanyToPortfolio(company)} 
                          className="plus-button"
                          >
                          <FontAwesomeIcon icon={faPlus} />
                        </Button>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </div>
          </section>
        </main>
        <footer className="py-3 text-muted text-center bg-light">
          <p>&copy; 2024 MVP Stock Trading. All rights reserved.</p>
        </footer>
      </Container>
    </>
  );  
}

export default IndexPage;
