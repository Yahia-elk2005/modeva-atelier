import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FiLock, FiShield } from 'react-icons/fi';
import axiosInstance from '../utils/axiosConfig';
import { toast, ToastContainer } from 'react-toastify';

const FALLBACK_IMAGE = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22500%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23f2f2f2%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20font-family%3D%22sans-serif%22%20font-size%3D%2216%22%20fill%3D%22%23aaaaaa%22%3EProduct%3C%2Ftext%3E%3C%2Fsvg%3E';

const shippingRates = {
  "Jakarta": 15,
  "Giza Governorate": 25,
  "Cairo": 20,
  "Alexandria": 30,
  "Other Governorates": 40
};

const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedGovernorate, setSelectedGovernorate] = useState('Giza Governorate');
  const [userMembership, setUserMembership] = useState('Standard');
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [appliedVoucherCode, setAppliedVoucherCode] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchCheckoutData = async () => {
      try {
        const [cartRes, userRes] = await Promise.all([
          axiosInstance.get('/cart'),
          axiosInstance.get('/users/me')
        ]);
        
        setCartItems(cartRes.data.data?.cartItems || []);
        setTotalPrice(cartRes.data.data?.totalCartPrice || 0);
        
        const userData = userRes.data.data;
        if (userData?.membership) {
          setUserMembership(userData.membership);
        }
      } catch (err) {
        console.error("Error fetching checkout data:", err);
      }
    };
    fetchCheckoutData();
  }, []);

  const baseShippingCost = shippingRates[selectedGovernorate] || 25;
  const currentShippingCost = (userMembership === 'Salon Prime' || userMembership === 'VIP Gold') ? 0 : baseShippingCost;

  let membershipDiscountAmount = 0;
  if (userMembership === 'Salon Prime') {
    membershipDiscountAmount = totalPrice * 0.15;
  } else if (userMembership === 'VIP Gold') {
    membershipDiscountAmount = totalPrice * 0.25;
  }

  const totalDiscount = appliedDiscount + membershipDiscountAmount;
  const finalTotal = Math.max(0, (totalPrice - totalDiscount) + currentShippingCost);

  const handleApplyPromoCode = async () => {
    if (!promoCodeInput.trim()) return;
    try {
      const res = await axiosInstance.post('/api/vouchers/apply', {
        code: promoCodeInput.trim(),
        cartTotal: totalPrice
      });
      const { discountAmount, voucher } = res.data;
      setAppliedDiscount(discountAmount);
      setAppliedVoucherCode(voucher.code);
      toast.success(`Pass "${voucher.code}" applied! You saved $${discountAmount}`);
      setPromoCodeInput('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired privilege pass.');
    }
  };

  const handleAuthorizePayment = async () => {
    setLoading(true);
    try {
      const orderItems = cartItems.map(item => ({
        product: item.product._id,
        name: (item.product.name || item.name).substring(0, 45),
        price: item.price,
        quantity: item.quantity,
        size: item.size || "M"
      }));

      const res = await axiosInstance.post('/orders', { 
        items: orderItems,
        shippingAddress: selectedGovernorate,
        shippingCost: currentShippingCost,
        total: `$${finalTotal.toFixed(2)}`
      });

      if (res.data && res.data.url) {
        toast.success('Redirecting to secure payment gateway...');
        window.location.href = res.data.url;
      } else {
        toast.success('Order placed successfully!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (err) {
      console.error("Failed to place order", err);
      toast.error(err.response?.data?.message || 'Failed to process payment. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-light pb-5">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="bg-dark text-white py-3 px-3 px-lg-5 d-flex justify-content-between align-items-center mt-5 pt-4">
        <div className="d-flex align-items-center gap-2 gap-md-3">
          <span className="bg-teal text-white px-2 py-1 fw-bold text-uppercase" style={{ fontSize: '0.65rem', letterSpacing: '1px' }}>
            Encrypted
          </span>
          <span className="fw-bold fs-6 fs-md-5" style={{ fontFamily: 'Playfair Display', letterSpacing: '2px' }}>MODEVA</span>
          <span className="text-muted small d-none d-md-inline">| Secure Atelier Checkout</span>
        </div>
        <div className="d-flex align-items-center gap-1 gap-md-2 text-success small fw-bold">
          <FiLock /> <span className="d-none d-sm-inline" style={{ fontSize: '0.75rem' }}>256-Bit SSL Protected</span>
        </div>
      </div>

      <Container className="mt-4">
        <Row className="g-4 g-lg-5">
          <Col lg={7}>
            <div className="bg-white p-3 p-md-5 border mb-4">
              <h2 className="mb-3 fs-3 fs-md-2" style={{ fontFamily: 'Playfair Display', color: '#1A1A1A' }}>Shipping Destination</h2>
              
              <Form.Group className="mb-4">
                <Form.Label className="small text-uppercase text-muted fw-bold" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>Select Governorate / Region</Form.Label>
                <Form.Select 
                  className="rounded-0 p-3 shadow-none bg-white"
                  value={selectedGovernorate}
                  onChange={(e) => setSelectedGovernorate(e.target.value)}
                >
                  <option value="Giza Governorate">Giza Governorate ($25)</option>
                  <option value="Cairo">Cairo ($20)</option>
                  <option value="Alexandria">Alexandria ($30)</option>
                  <option value="Jakarta">Jakarta ($15)</option>
                  <option value="Other Governorates">Other Governorates ($40)</option>
                </Form.Select>
              </Form.Group>

              {userMembership !== 'Standard' && (
                <div className="alert alert-success rounded-0 small mb-4">
                  <strong>{userMembership} Benefit Active:</strong> Enjoying free white-glove shipping & automatic tier privileges!
                </div>
              )}

              <span className="text-teal fw-bold text-uppercase tracking-widest d-block mb-2 mt-4" style={{ fontSize: '0.7rem', letterSpacing: '2px' }}>Step 3 of 4</span>
              <h2 className="mb-2 fs-3 fs-md-2" style={{ fontFamily: 'Playfair Display', color: '#1A1A1A' }}>Select Payment Method</h2>
              <p className="text-muted small mb-4">Transactions are protected with tokenized atelier encryption.</p>
              
              <div className="p-3 p-md-4 mb-3 border border-2" style={{ borderColor: '#008B8B', backgroundColor: '#F8F9FA' }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <Form.Check 
                    type="radio"
                    label={<span className="fw-bold text-uppercase small ms-2" style={{ letterSpacing: '1px' }}>Credit / Debit Card</span>}
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="rounded-0"
                  />
                  <div className="d-flex gap-1 gap-md-2">
                    <span className="bg-dark text-white px-2 py-1 fw-bold text-uppercase" style={{ fontSize: '0.6rem' }}>VISA</span>
                    <span className="bg-secondary text-white px-2 py-1 fw-bold text-uppercase" style={{ fontSize: '0.6rem' }}>MC</span>
                  </div>
                </div>

                <Form className="mt-3" onSubmit={(e) => e.preventDefault()}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small text-uppercase text-muted fw-bold" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>Name on Card</Form.Label>
                    <Form.Control type="text" className="rounded-0 p-3 shadow-none bg-white" placeholder="HOSNA SALEH" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="small text-uppercase text-muted fw-bold" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>Card Number</Form.Label>
                    <Form.Control type="text" className="rounded-0 p-3 shadow-none bg-white" placeholder="0000 0000 0000 0000" />
                  </Form.Group>
                  <Row className="g-2 g-md-3">
                    <Col xs={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="small text-uppercase text-muted fw-bold" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>Expiry Date</Form.Label>
                        <Form.Control type="text" className="rounded-0 p-3 shadow-none bg-white" placeholder="MM / YY" />
                      </Form.Group>
                    </Col>
                    <Col xs={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="small text-uppercase text-muted fw-bold" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>Security CVV</Form.Label>
                        <Form.Control type="password" className="rounded-0 p-3 shadow-none bg-white" placeholder="***" />
                      </Form.Group>
                    </Col>
                  </Row>
                </Form>
              </div>

            </div>

            <div className="d-flex justify-content-between align-items-center mt-4 gap-3">
              <Button variant="link" className="text-muted text-uppercase text-decoration-none fw-bold small" onClick={() => navigate('/cart')}>
                &larr; Back to Cart
              </Button>
              <Button 
                className="btn-teal px-5 py-3 rounded-0 text-uppercase fw-bold" 
                style={{ letterSpacing: '1px' }}
                onClick={handleAuthorizePayment}
                disabled={loading || cartItems.length === 0}
              >
                {loading ? 'Processing...' : 'Authorize Payment'}
              </Button>
            </div>
          </Col>

          <Col lg={5}>
            <div className="bg-white p-3 p-md-5 border h-100 d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                <h3 className="mb-0 fs-4 fs-md-3" style={{ fontFamily: 'Playfair Display', color: '#1A1A1A' }}>Order Summary</h3>
                <span className="text-teal text-uppercase fw-bold small" style={{ fontSize: '0.65rem', letterSpacing: '1px' }}>
                  {cartItems.length} Piece{cartItems.length !== 1 && 's'}
                </span>
              </div>

              <div className="mb-4">
                <Form.Label className="small text-uppercase text-muted fw-bold" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>Privilege Pass / Promo Code</Form.Label>
                <InputGroup>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter code..." 
                    className="rounded-0 shadow-none text-uppercase"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value)}
                  />
                  <Button variant="dark" className="rounded-0 text-uppercase fw-bold px-3" onClick={handleApplyPromoCode} style={{ fontSize: '0.75rem' }}>
                    Apply
                  </Button>
                </InputGroup>
                {appliedVoucherCode && (
                  <small className="text-success mt-1 d-block">Pass "{appliedVoucherCode}" applied successfully!</small>
                )}
              </div>

              <div className="mb-4 overflow-auto" style={{ maxHeight: '200px' }}>
                {cartItems.map((item, idx) => (
                  <div key={idx} className="d-flex gap-3 mb-3 p-2 border">
                    <img src={item.product?.image || FALLBACK_IMAGE} alt="Product" style={{ width: '50px', height: '70px', objectFit: 'cover' }} className="bg-light rounded-0 flex-shrink-0" />
                    <div className="flex-grow-1">
                      <span className="text-muted text-uppercase fw-bold" style={{ fontSize: '0.65rem', letterSpacing: '1px' }}>{item.product?.category}</span>
                      <h6 className="mb-1 fw-bold" style={{ fontFamily: 'Playfair Display', fontSize: '0.9rem' }}>{item.product?.name}</h6>
                      <div className="d-flex justify-content-between mt-1">
                        <span className="text-muted small">Qty: {item.quantity} | Size: {item.size || 'M'}</span>
                        <span className="fw-bold">${item.price * item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="d-flex justify-content-between mb-2 text-muted small">
                <span>Subtotal</span>
                <span>${totalPrice}</span>
              </div>
              
              {totalDiscount > 0 && (
                <div className="d-flex justify-content-between mb-2 text-success small">
                  <span>Total Discount & Privileges</span>
                  <span>-${totalDiscount.toFixed(2)}</span>
                </div>
              )}

              <div className="d-flex justify-content-between mb-4 pb-4 border-bottom text-muted small">
                <span>Shipping ({selectedGovernorate})</span>
                <span>{currentShippingCost === 0 ? <strong className="text-success">FREE (Prime)</strong> : `$${currentShippingCost}`}</span>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <span className="text-uppercase fw-bold text-muted d-block" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Total Investment</span>
                  <span className="small text-muted" style={{ fontSize: '0.70rem' }}>Taxes & Shipping included</span>
                </div>
                <span className="fs-4 fs-md-3 fw-bold text-teal" style={{ fontFamily: 'Playfair Display' }}>${finalTotal.toFixed(2)}</span>
              </div>

              <div className="bg-light p-3 border-start border-4 border-teal mt-auto">
                <div className="d-flex gap-2 gap-md-3">
                  <FiShield className="text-teal flex-shrink-0 mt-1" size={20} />
                  <div>
                    <h6 className="text-uppercase fw-bold text-dark mb-1" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>The Senopati Atelier Warranty</h6>
                    <p className="text-muted mb-0" style={{ fontSize: '0.7rem', lineHeight: '1.6' }}>Includes complimentary micro-alteration within 30 days.</p>
                  </div>
                </div>
              </div>

            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Checkout;