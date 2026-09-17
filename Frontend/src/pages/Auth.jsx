import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import axiosInstance from '../utils/axiosConfig';

const Auth = () => {
  const [activeTab, setActiveTab] = useState('signin');
  const [step, setStep] = useState('auth');
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [otpData, setOtpData] = useState({ email: '', confirmOTP: '' });
  const [loading, setLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showOtpCode, setShowOtpCode] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosInstance.post('/auth/login', loginData);
      localStorage.setItem('token', res.data.token);
      
      const userRole = res.data.data?.user?.role || res.data.user?.role || 'user';
      localStorage.setItem('role', userRole);

      window.dispatchEvent(new Event('authUpdated'));

      toast.success('Welcome back to the Atelier!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fullName = `${signupData.firstName} ${signupData.lastName}`.trim();
      const res = await axiosInstance.post('/auth/signup', {
        name: fullName,
        email: signupData.email,
        password: signupData.password
      });
      toast.success(res.data.message || 'Account created! Check your email for OTP.');
      setOtpData(prev => ({ ...prev, email: signupData.email }));
      setStep('otp');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otpData.confirmOTP.length !== 6) {
      toast.error('Verification code must be 6 digits.');
      return;
    }
    setLoading(true);
    try {
      const res = await axiosInstance.post('/auth/confirm-email', otpData);
      localStorage.setItem('token', res.data.token);
      
      const userRole = res.data.data?.user?.role || res.data.user?.role || 'user';
      localStorage.setItem('role', userRole);

      window.dispatchEvent(new Event('authUpdated'));

      toast.success('Email verified successfully! Welcome to the Atelier.');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-5 py-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <Row className="g-0 bg-white shadow-sm" style={{ border: '1px solid #E0E0E0' }}>
        <Col lg={6} className="d-none d-lg-block position-relative" style={{ minHeight: '600px' }}>
          <div
            className="position-absolute w-100 h-100"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop')",
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="position-absolute w-100 h-100" style={{ backgroundColor: 'rgba(26, 26, 26, 0.4)' }}></div>
            <div className="position-absolute w-100 h-100 d-flex flex-column justify-content-center align-items-center text-white p-5 text-center">
              <h1 className="display-4 fw-bold mb-4" style={{ fontFamily: 'Playfair Display' }}>MODEVA</h1>
              <div style={{ width: '50px', height: '2px', backgroundColor: '#008B8B', margin: '0 auto 20px' }}></div>
              <p className="lead" style={{ fontFamily: 'Playfair Display' }}>The Art of Dressing Up</p>
            </div>
          </div>
        </Col>
        <Col lg={6} className="d-flex flex-column">
          {step === 'otp' ? (
            <div className="p-4 p-md-5 bg-white flex-grow-1 d-flex flex-column justify-content-center">
              <h3 className="mb-2" style={{ fontFamily: 'Playfair Display', color: '#1A1A1A' }}>Security Verification</h3>
              <p className="text-muted small mb-4">Please enter the confirmation code sent to <span className="fw-bold text-dark">{otpData.email}</span>.</p>
              
              <Form onSubmit={handleVerifyOTP}>
                <Form.Group className="mb-4">
                  <Form.Label className="small text-uppercase fw-bold text-muted" style={{ letterSpacing: '1px', fontSize: '0.75rem' }}>Verification Code (OTP)</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showOtpCode ? "text" : "password"}
                      className="rounded-0 p-3 shadow-none border-1 text-center fw-bold fs-4"
                      placeholder="000000"
                      maxLength="6"
                      value={otpData.confirmOTP}
                      onChange={(e) => setOtpData({...otpData, confirmOTP: e.target.value})}
                      required
                    />
                    <Button
                      variant="outline-secondary"
                      className="rounded-0 border"
                      onClick={() => setShowOtpCode(!showOtpCode)}
                    >
                      {showOtpCode ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </Button>
                  </InputGroup>
                </Form.Group>
                <Button type="submit" disabled={loading} className="btn-teal w-100 rounded-0 py-3 text-uppercase fw-bold" style={{ letterSpacing: '2px' }}>
                  {loading ? 'Verifying...' : 'Authorize & Sign In'}
                </Button>
              </Form>
            </div>
          ) : (
            <>
              <div className="d-flex border-bottom bg-light">
                <Button
                  variant="link"
                  className={`w-50 rounded-0 text-decoration-none py-3 text-uppercase fw-bold ${activeTab === 'signin' ? 'bg-white text-dark border-bottom border-dark border-2' : 'text-muted'}`}
                  style={{ fontSize: '0.85rem', letterSpacing: '1px' }}
                  onClick={() => setActiveTab('signin')}
                >
                  Sign In
                </Button>
                <Button
                  variant="link"
                  className={`w-50 rounded-0 text-decoration-none py-3 text-uppercase fw-bold ${activeTab === 'signup' ? 'bg-white text-dark border-bottom border-dark border-2' : 'text-muted'}`}
                  style={{ fontSize: '0.85rem', letterSpacing: '1px' }}
                  onClick={() => setActiveTab('signup')}
                >
                  Create Account
                </Button>
              </div>
              <div className="p-4 p-md-5 flex-grow-1 bg-white">
                {activeTab === 'signin' ? (
                  <div>
                    <h3 className="mb-2" style={{ fontFamily: 'Playfair Display', color: '#1A1A1A' }}>Welcome Patron</h3>
                    <p className="text-muted small mb-4">Authenticate to view custom orders and profile settings.</p>
                    
                    <Form onSubmit={handleLogin}>
                      <Form.Group className="mb-4">
                        <Form.Label className="small text-uppercase fw-bold text-muted" style={{ letterSpacing: '1px', fontSize: '0.75rem' }}>Email</Form.Label>
                        <Form.Control
                          type="email"
                          className="rounded-0 p-3 shadow-none border-1"
                          placeholder="patron@modeva.com"
                          value={loginData.email}
                          onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                          required
                        />
                      </Form.Group>
                      <Form.Group className="mb-4">
                        <Form.Label className="small text-uppercase fw-bold text-muted" style={{ letterSpacing: '1px', fontSize: '0.75rem' }}>Passphrase</Form.Label>
                        <InputGroup>
                          <Form.Control
                            type={showLoginPassword ? "text" : "password"}
                            className="rounded-0 p-3 shadow-none border-1"
                            placeholder="Enter your password"
                            value={loginData.password}
                            onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                            required
                          />
                          <Button
                            variant="outline-secondary"
                            className="rounded-0 border"
                            onClick={() => setShowLoginPassword(!showLoginPassword)}
                          >
                            {showLoginPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                          </Button>
                        </InputGroup>
                      </Form.Group>
                      <Button type="submit" disabled={loading} className="btn-teal w-100 rounded-0 py-3 text-uppercase fw-bold mb-4" style={{ letterSpacing: '2px' }}>
                        {loading ? 'Authenticating...' : 'Sign In To Atelier'}
                      </Button>
                    </Form>
                  </div>
                ) : (
                  <div>
                    <h3 className="mb-2" style={{ fontFamily: 'Playfair Display', color: '#1A1A1A' }}>Atelier Membership</h3>
                    <p className="text-muted small mb-4">Join our private registry of couture connoisseurs.</p>
                    
                    <Form onSubmit={handleSignup}>
                      <Row className="mb-3">
                        <Col>
                          <Form.Group>
                            <Form.Label className="small text-uppercase fw-bold text-muted" style={{ letterSpacing: '1px', fontSize: '0.75rem' }}>First Name</Form.Label>
                            <Form.Control
                              type="text"
                              className="rounded-0 p-3 shadow-none border-1"
                              placeholder="Raden"
                              value={signupData.firstName}
                              onChange={(e) => setSignupData({...signupData, firstName: e.target.value})}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group>
                            <Form.Label className="small text-uppercase fw-bold text-muted" style={{ letterSpacing: '1px', fontSize: '0.75rem' }}>Last Name</Form.Label>
                            <Form.Control
                              type="text"
                              className="rounded-0 p-3 shadow-none border-1"
                              placeholder="Kartini"
                              value={signupData.lastName}
                              onChange={(e) => setSignupData({...signupData, lastName: e.target.value})}
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Form.Group className="mb-3">
                        <Form.Label className="small text-uppercase fw-bold text-muted" style={{ letterSpacing: '1px', fontSize: '0.75rem' }}>Email Address</Form.Label>
                        <Form.Control
                          type="email"
                          className="rounded-0 p-3 shadow-none border-1"
                          placeholder="patron@domain.com"
                          value={signupData.email}
                          onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                          required
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label className="small text-uppercase fw-bold text-muted" style={{ letterSpacing: '1px', fontSize: '0.75rem' }}>Create Passphrase</Form.Label>
                        <InputGroup>
                          <Form.Control
                            type={showSignupPassword ? "text" : "password"}
                            className="rounded-0 p-3 shadow-none border-1"
                            placeholder="At least 6 characters"
                            value={signupData.password}
                            onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                            required
                          />
                          <Button
                            variant="outline-secondary"
                            className="rounded-0 border"
                            onClick={() => setShowSignupPassword(!showSignupPassword)}
                          >
                            {showSignupPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                          </Button>
                        </InputGroup>
                      </Form.Group>
                      <Button type="submit" disabled={loading} className="btn-teal w-100 rounded-0 py-3 text-uppercase fw-bold" style={{ letterSpacing: '2px' }}>
                        {loading ? 'Processing...' : 'Register As Patron'}
                      </Button>
                    </Form>
                  </div>
                )}
              </div>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Auth;