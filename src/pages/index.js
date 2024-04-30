import React, { useEffect, useState } from 'react';
import './index.css';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { Navbar, Container, Nav, Card, Alert, Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

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
    // Fetch all companies
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
    // Retrieve current user from local storage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSignOut = () => {
    // Clear current user data from state and local storage
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  const loadAboveAverageESGCompanies = () => {
    // Fetch above-average ESG companies
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
    // Fetch above-average ESG companies
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
    // Fetch above-average ESG companies
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

  const loadAllCompanies = (event) => {
    event.preventDefault(); // Prevent default behavior of link
    setCompanies(allCompanies);
    setSectionTitle('All Companies');
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    if (event.target.value === '') {
      // If the search term is empty, display all companies based on the current section
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
      // Filter the currently displayed companies based on the search term
      const filteredCompanies = companies.filter(company =>
        company.ticker.toLowerCase().includes(event.target.value.toLowerCase()) ||
        company.name.toLowerCase().includes(event.target.value.toLowerCase())
      );
      setCompanies(filteredCompanies);
    }
  };
  

  const calculateESGColor = (score) => {
    // Assuming score ranges from 0 to 100
    
    // Calculate the red, green, and blue components
    const red = Math.floor((100 - score) * 255 / 100);
    const green = Math.floor(score * 255 / 100);
    const blue = 0;

    // Convert the RGB values to HEX format
    const rgbHex = "#" + ((1 << 24) + (red << 16) + (green << 8) + blue).toString(16).slice(1);
    
    return rgbHex;
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
              <Nav.Link onClick={loadAboveAverageESGCompanies}>Top Performing ESG</Nav.Link>
              <Nav.Link onClick={loadHealthAndOilCompanies}>Health and Oil Companies</Nav.Link>
              <Nav.Link onClick={loadTopSectorCompanies}>Top Sector Performers</Nav.Link>
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
              
              <Button className = "sign-out-button" variant="outline-primary" onClick={handleSignOut}>
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
            {/* Data Rows */}
            <div className="row row-cols-1 g-4">
              {companies.map((company, index) => (
                <div key={index} className="col">
                  <Card className="company-card">
                    <Card.Body>
                      <div className="row">
                        <div className="col-2">
                          <Card.Text className="ticker">{company.ticker}</Card.Text>
                        </div>
                        <div className="col-4">
                          <Card.Text className="company-name">{company.name}</Card.Text>
                        </div>
                        {/* Empty space */}
                        <div className="col-6">
                          <Card.Text className="ticker">{company.sector}</Card.Text>
                        </div>
                        {/* Subscores */}
                        <div className="esg-subscore">
                          <Card.Text style={{ color: calculateESGColor(company.environment) }}>E: {company.environment}</Card.Text>
                        </div>
                        <div className="esg-subscore">
                          <Card.Text style={{ color: calculateESGColor(company.social) }}>S: {company.social}</Card.Text>
                        </div>
                        <div className="esg-subscore">
                          <Card.Text style={{ color: calculateESGColor(company.governance) }}>G: {company.governance}</Card.Text>
                        </div>
                        <div className="esg-score">
                          <Card.Text style={{ color: calculateESGColor(company.esg) }}>{company.esg}</Card.Text>
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
