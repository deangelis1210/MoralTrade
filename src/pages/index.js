import React, { useEffect, useState } from 'react';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { Navbar, Container, Nav, Card, Alert } from 'react-bootstrap';

function IndexPage() {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      fetch('/allCompanies')
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch data');
          }
          return response.json();
        })
        .then(data => {
          setCompanies(data.companies.map(company => ({ ...company, expanded: false })));
          setLoading(false);
        })
        .catch(error => {
          setError(error.message);
          setLoading(false);
        });
    }, []);
  
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
  
    const toggleExpand = (index) => {
      setCompanies(prevCompanies =>
        prevCompanies.map((company, i) =>
          i === index ? { ...company, expanded: !company.expanded } : company
        )
      );
    };
  
    return (
      <>
        <Navbar bg="light" expand="lg">
          <Container>
            <Navbar.Brand href="#home">MVP Stock Trading</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="#all-companies">All Companies</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Container className="py-4">
          <main>
            <section id="all-companies" className="mb-4">
              <h2 className="section-title">All Companies</h2>
              <div className="row row-cols-1 row-cols-md-3 g-4">
                {companies.map((company, index) => (
                  <div key={index} className="col">
                    <Card className={`company-card ${company.expanded ? 'expanded' : ''}`} onClick={() => toggleExpand(index)}>
                      <Card.Body>
                        <div className="left-side">
                          <Card.Title className="company-name">{company.name}</Card.Title>
                          <Card.Text className="ticker">{company.ticker}</Card.Text>
                        </div>
                        <div className="additional-info">
                          {company.expanded && (
                            <div>
                              {/* Additional content to display when expanded */}
                              <p>Environment: {company.environment}</p>
                              <p>Social: {company.social}</p>
                              <p>Governance: {company.governance}</p>
                            </div>
                          )}
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

export default IndexPage