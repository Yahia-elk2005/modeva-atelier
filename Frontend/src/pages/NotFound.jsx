import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NotFound = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Container className="my-5 py-5">
      <Row className="align-items-center mb-5">
        <Col lg={7} className="mb-4 mb-lg-0">
          <div className="d-flex align-items-center gap-2 mb-2">
            <span className="text-white px-2 py-1 small text-uppercase fw-bold" style={{ fontSize: '0.7rem', letterSpacing: '1px', backgroundColor: '#007373' }}>
              ARCHIVE ARCHITECTURE
            </span>
            <span className="text-muted small uppercase" style={{ letterSpacing: '1px' }}>
              REF: 404-NOT-LOCATED
            </span>
          </div>

          <div className="position-relative select-none my-3">
            <span className="display-1 text-muted opacity-25 fw-light d-block" style={{ fontSize: '6rem', lineHeight: '1' }}>
              404
            </span>
            <div className="position-absolute top-50 start-0 translate-middle-y">
              <h1 className="display-6 text-uppercase fw-normal" style={{ fontFamily: 'Playfair Display', color: '#1A1A1A' }}>
                The Silhouette <br/><span className="fst-italic" style={{ color: '#007373' }}>Is Relocated</span>
              </h1>
            </div>
          </div>

          <p className="text-muted fw-light mb-4" style={{ maxWidth: '500px' }}>
            The curated couture piece or salon portfolio you requested may have migrated to our private Senopati vault, concluded in patronage commission, or no longer rests at this coordinate. Let our house guide you back to active runways.
          </p>

          <div className="d-flex flex-column flex-sm-row gap-2">
            <Link to="/" className="btn rounded-0 text-uppercase fw-bold px-4 py-3 text-decoration-none text-white text-center" style={{ backgroundColor: '#007373', fontSize: '0.75rem', letterSpacing: '1px' }}>
              Return to Home Runway
            </Link>
            <Link to="/catalog" className="btn btn-outline-dark rounded-0 text-uppercase fw-bold px-4 py-3 text-decoration-none text-center" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>
              Explore Catalog
            </Link>
          </div>
        </Col>

        <Col lg={5}>
          <div className="p-3 bg-light border">
            <div className="position-relative overflow-hidden bg-white" style={{ height: '400px' }}>
              <img 
                src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop" 
                alt="Archive Model" 
                className="w-100 h-100 object-fit-cover"
                style={{ filter: 'grayscale(100%) contrast(1.2)' }}
              />
              <div className="position-absolute bottom-0 start-0 end-0 p-3 bg-dark text-white d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-uppercase tracking-wider" style={{ fontSize: '0.65rem' }}>ARCHIVAL ENTRY</small>
                  <p className="mb-0 fw-bold" style={{ fontFamily: 'Playfair Display' }}>Vault Piece No. 0404</p>
                </div>
                <span className="badge bg-white text-dark rounded-0 fw-bold" style={{ fontSize: '0.65rem' }}>DE-LISTED</span>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      <div className="p-4 bg-light my-5 border">
        <div className="bg-white p-4 p-md-5 d-flex flex-column flex-md-row justify-content-between align-items-center gap-4">
          <div>
            <h5 className="mb-2" style={{ fontFamily: 'Playfair Display' }}>Need Private Commission or Salon Inquiries?</h5>
            <p className="text-muted small mb-0">
              Our Senopati Atelier stylists are on call 24/7 via WhatsApp Concierge (+62 859 9999 999) or via email at <span className="text-dark fw-bold">concierge@modeva.id</span>.
            </p>
          </div>
          <a 
            href="https://wa.me/628599999999" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-dark rounded-0 text-uppercase fw-bold px-4 py-3 text-nowrap text-decoration-none"
            style={{ fontSize: '0.75rem', letterSpacing: '1px' }}
          >
            Dispatch WhatsApp
          </a>
        </div>
      </div>
    </Container>
  );
};

export default NotFound;