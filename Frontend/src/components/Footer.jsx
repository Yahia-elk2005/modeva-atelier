import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-teal text-white pb-4 mt-0" style={{ paddingTop: '100px', backgroundColor: '#008B8B' }}>
      <Container>
        <Row className="gy-4 mb-5">
          {/* Brand & Info */}
          <Col lg={4} md={12}>
            <h2 className="fw-bold mb-4" style={{ fontFamily: 'Playfair Display', fontSize: '2.5rem', letterSpacing: '1px' }}>MODEVA</h2>
            <table className="text-white small" style={{ borderCollapse: 'separate', borderSpacing: '0 8px' }}>
              <tbody>
                <tr>
                  <td style={{ width: '80px', verticalAlign: 'top' }}>WhatsApp</td>
                  <td style={{ verticalAlign: 'top' }}>: +62 859 9999 999</td>
                </tr>
                <tr>
                  <td style={{ verticalAlign: 'top' }}>Email</td>
                  <td style={{ verticalAlign: 'top' }}>: hello@modeva.com</td>
                </tr>
                <tr>
                  <td style={{ verticalAlign: 'top' }}>Address</td>
                  <td style={{ verticalAlign: 'top' }}>: Senopati Suite 18, Jakarta, Indonesia</td>
                </tr>
              </tbody>
            </table>
          </Col>

          {/* Menu */}
          <Col lg={2} md={4} className="mt-lg-5">
            <h6 className="fw-bold mb-4 small">Menu</h6>
            <ul className="list-unstyled small d-grid gap-3 opacity-100">
              <li><Link to="/sale" className="text-white text-decoration-none">Sale</Link></li>
              <li><Link to="/new" className="text-white text-decoration-none">New Arrivals</Link></li>
              <li><Link to="/catalog?category=men" className="text-white text-decoration-none">Formal Men</Link></li>
              <li><Link to="/catalog?category=woman" className="text-white text-decoration-none">Formal Woman</Link></li>
              {/* تفعيل وتوجيه Casual Men و Casual Woman للكاتيجوري الصحيح */}
              <li><Link to="/catalog?category=casual men" className="text-white text-decoration-none">Casual Men</Link></li>
              <li><Link to="/catalog?category=casual woman" className="text-white text-decoration-none">Casual Woman</Link></li>
            </ul>
          </Col>

          {/* Get Help */}
          <Col lg={2} md={4} className="mt-lg-5">
            <h6 className="fw-bold mb-4 small">Get Help</h6>
            <ul className="list-unstyled small d-grid gap-3 opacity-100">
              <li><Link to="/support/faq" className="text-white text-decoration-none">FAQ</Link></li>
              <li><Link to="/support/service" className="text-white text-decoration-none">Customer Service</Link></li>
              <li><Link to="/support/refund" className="text-white text-decoration-none">Refund and Return</Link></li>
              <li><Link to="/support/terms" className="text-white text-decoration-none">Terms and Conditions</Link></li>
              <li><Link to="/support/shipping" className="text-white text-decoration-none">Shipping</Link></li>
            </ul>
          </Col>

          {/* Account */}
          <Col lg={2} md={4} className="mt-lg-5">
            <h6 className="fw-bold mb-4 small">Account</h6>
            <ul className="list-unstyled small d-grid gap-3 opacity-100">
              <li><Link to="/dashboard" className="text-white text-decoration-none">My Account</Link></li>
              <li><Link to="/dashboard" className="text-white text-decoration-none">My Orders</Link></li>
              <li><Link to="/vouchers" className="text-white text-decoration-none">Vouchers and Discounts</Link></li>
            </ul>
          </Col>
        </Row>
        
        <div className="text-center small opacity-75 pt-2" style={{ fontSize: '0.75rem' }}>
          <p className="mb-1">All rights reserved</p>
          <p className="mb-0">Copyright 2026 By Modeva Fashion</p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;