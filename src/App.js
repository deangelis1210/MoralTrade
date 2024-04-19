import React, { useEffect, useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { Navbar, Container, Nav, Card, Alert } from 'react-bootstrap';

function App() {
  const [topPerformers, setTopPerformers] = useState([]);
  const [additionalCompanies, setAdditionalCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/aboveAverageESGcompanies')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json();
      })
      .then(data => {
        setTopPerformers(data.message.slice(0, 12).map(company => ({ ...company, expanded: false })));
        setAdditionalCompanies(data.message.slice(12).map(company => ({ ...company, expanded: false })));
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

  const toggleExpand = (index, isTopPerformers) => {
    if (isTopPerformers) {
      setTopPerformers(prevTopPerformers =>
        prevTopPerformers.map((company, i) =>
          i === index ? { ...company, expanded: !company.expanded } : company
        )
      );
    } else {
      setAdditionalCompanies(prevAdditionalCompanies =>
        prevAdditionalCompanies.map((company, i) =>
          i === index ? { ...company, expanded: !company.expanded } : company
        )
      );
    }
  };

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="#home">MVP Stock Trading</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#top-performers">Top Performers</Nav.Link>
              <Nav.Link href="#additional-companies">Additional Companies</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="py-4">
        <main>
          <section id="top-performers" className="mb-4">
            <h2 className="section-title">Top Performers</h2>
            <div className="row row-cols-1 row-cols-md-3 g-4">
              {topPerformers.map((company, index) => (
                <div key={company.id} className="col">
                  <Card className={`company-card ${company.expanded ? 'expanded' : ''}`} onClick={() => toggleExpand(index, true)}>
                    <Card.Body>
                      <div className="left-side">
                        <Card.Title className="company-name">{company.name}</Card.Title>
                      </div>
                      <div className="esg-score-section">
                        <span className="esg-score">{company.esg_score}</span>
                      </div>
                      <div className="additional-info">
                        {company.expanded && (
                          <div>
                            {/* Additional content to display when expanded */}
                            <p>Additional information about {company.name} can go here...</p>
                          </div>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </div>
          </section>
          <section id="additional-companies">
            <h2 className="section-title">Additional Companies</h2>
            <div className="row row-cols-1 row-cols-md-3 g-4">
              {additionalCompanies.map((company, index) => (
                <div key={company.id} className="col">
                  <Card className={`company-card ${company.expanded ? 'expanded' : ''}`} onClick={() => toggleExpand(index, false)}>
                    <Card.Body>
                      <div className="left-side">
                        <Card.Title className="company-name">{company.name}</Card.Title>
                      </div>
                      <div className="esg-score-section">
                        <span className="esg-score">{company.esg_score}</span>
                      </div>
                      <div className="additional-info">
                        {company.expanded && (
                          <div>
                            {/* Additional content to display when expanded */}
                            <p>Additional information about {company.name} can go here...</p>
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

export default App;
