import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import axiosInstance from '../utils/axiosConfig';

const Vouchers = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      const res = await axiosInstance.get('/api/vouchers');
      setVouchers(res.data.data || []);
    } catch (err) {
      console.error("Error fetching vouchers:", err);
      toast.error("Failed to load salon vouchers.");
    } finally {
      setLoading(false);
    }
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success(`Pass code "${code}" copied to clipboard!`);
  };

  const handleApplyPromo = async (e) => {
    e.preventDefault();
    if (!promoCode.trim()) return;

    try {
      const res = await axiosInstance.post('/api/vouchers/apply', {
        code: promoCode.trim(),
        cartTotal: 500
      });

      const { message, discountAmount, voucher } = res.data;
      toast.success(`${message} You saved $${discountAmount} using pass "${voucher.title}"!`);
      setPromoCode('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired privilege pass.');
    }
  };

  return (
    <Container className="my-5 py-4">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="border-bottom pb-4 mb-5">
        <p className="text-teal small text-uppercase fw-bold mb-1" style={{ letterSpacing: '2px', color: '#007373' }}>Bespoke Patronage Portfolio</p>
        <h1 className="display-5 fw-normal text-uppercase" style={{ fontFamily: 'Playfair Display', color: '#1A1A1A' }}>
          Patron Privileges & Archival Vouchers
        </h1>
        <p className="text-muted small">
          Exclusive digital vouchers, tier passes, and seasonal courtesies reserved for registered Modeva patrons.
        </p>
      </div>

      <div className="bg-light p-4 mb-5 border">
        <Form onSubmit={handleApplyPromo} className="d-flex gap-2">
          <Form.Control 
            type="text" 
            placeholder="ENTER PROMO OR PRIVILEGE CODE" 
            className="rounded-0 shadow-none uppercase"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
          />
          <Button type="submit" className="rounded-0 text-uppercase fw-bold px-4 text-nowrap" style={{ backgroundColor: '#007373', border: 'none' }}>
            Apply Pass
          </Button>
        </Form>
      </div>

      {loading ? (
        <div className="text-center py-5">Loading salon privileges...</div>
      ) : vouchers.length === 0 ? (
        <div className="text-center py-5 text-muted">No active vouchers available at the moment. Check back soon.</div>
      ) : (
        <Row className="g-4">
          {vouchers.map((voucher) => (
            <Col lg={6} key={voucher._id}>
              <div className="border p-4 bg-white position-relative shadow-sm h-100 d-flex flex-column justify-content-between" style={{ borderLeft: '5px solid #007373' }}>
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="badge bg-light text-dark rounded-0 border text-uppercase" style={{ fontSize: '0.65rem', letterSpacing: '1px' }}>
                      {voucher.category}
                    </span>
                    <span className="text-muted small" style={{ fontSize: '0.75rem' }}>Expires: {voucher.expiryDate}</span>
                  </div>
                  
                  <div className="d-flex align-items-baseline gap-3 mb-2">
                    <h2 className="fw-bold mb-0" style={{ color: '#007373', fontSize: '2rem' }}>{voucher.discountValue}</h2>
                    <h5 className="text-uppercase mb-0" style={{ fontFamily: 'Playfair Display' }}>{voucher.title}</h5>
                  </div>
                  <p className="text-muted small mb-4">{voucher.description}</p>
                </div>
                
                <div className="pt-3 border-top d-flex justify-content-between align-items-center flex-wrap gap-2">
                  <div className="d-flex align-items-center gap-2">
                    <span className="small text-muted fw-bold" style={{ fontSize: '0.70rem' }}>CODE:</span>
                    <span className="fw-bold font-monospace bg-light px-2 py-1 border">{voucher.code}</span>
                    <Button variant="outline-dark" size="sm" className="rounded-0" onClick={() => copyCode(voucher.code)}>
                      Copy
                    </Button>
                  </div>
                  <span className="small fw-bold text-teal" style={{ color: '#007373' }}>Min Order: ${voucher.minOrder}</span>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Vouchers;