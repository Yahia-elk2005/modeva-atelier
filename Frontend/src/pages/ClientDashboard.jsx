import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import axiosInstance from '../utils/axiosConfig';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [updatingMeasurements, setUpdatingMeasurements] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
    address: ''
  });
  
  const [measurements, setMeasurements] = useState({
    bust: '84 cm',
    waist: '66 cm',
    highHip: '92 cm',
    stature: '175 cm'
  });

  const fetchData = async () => {
    try {
      const [ordersRes, userMeRes] = await Promise.all([
        axiosInstance.get('/orders/my-orders'),
        axiosInstance.get('/users/me')
      ]);
      
      const userData = userMeRes.data.data || userMeRes.data.user || userMeRes.data;
      setUser(userData);
      
      if (userData) {
        setProfileData({
          name: userData.name || '',
          phone: userData.phone || userData.phoneNumber || '',
          address: userData.address || ''
        });
      }
      
      if (userData?.measurements) {
        setMeasurements(userData.measurements);
      }
      
      setOrders(ordersRes.data.data || ordersRes.data.orders || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please sign in to access your dashboard.');
      navigate('/auth');
      return;
    }
    window.scrollTo(0, 0);
    fetchData();
  }, [navigate]);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const sessionId = queryParams.get('session_id');
    const success = queryParams.get('success');
    
    if (success === 'true' && sessionId) {
      axiosInstance.get(`/subscriptions/verify-session?session_id=${sessionId}`)
        .then(res => {
          if (res.data.success) {
            toast.success('Membership upgraded successfully!');
            fetchData();
          }
        })
        .catch(err => console.error(err));
        
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleUpgradeMembership = async (plan) => {
    try {
      const res = await axiosInstance.post('/subscriptions/create-checkout', { plan });
      if (res.data.success && res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to initiate membership checkout.');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    try {
      await axiosInstance.patch('/auth/update-profile', profileData);
      toast.success('Contact info & shipping address updated successfully!');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile details.');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleUpdateMeasurements = async (e) => {
    e.preventDefault();
    setUpdatingMeasurements(true);
    try {
      await axiosInstance.patch('/auth/update-measurements', { measurements });
      toast.success('Fitting profile measurements updated successfully!');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update measurements.');
    } finally {
      setUpdatingMeasurements(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await axiosInstance.delete(`/orders/${orderId}`);
        toast.success('Order cancelled successfully.');
        fetchData();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to cancel order.');
      }
    }
  };

  const handleRequestAlteration = async (orderId) => {
    try {
      await axiosInstance.patch(`/orders/alteration/${orderId}`);
      toast.success('Micro-alteration request submitted successfully!');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit alteration request.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    toast.success('Logged out successfully.');
    navigate('/auth');
  };

  const getOrderStatusValue = (status) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('deliver')) return 100;
    if (s.includes('dispatch') || s.includes('ship')) return 75;
    if (s.includes('process') || s.includes('atelier')) return 50;
    if (s.includes('cancel')) return 0;
    return 25; 
  };

  const getOrderStatusColor = (status) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('cancel')) return 'danger';
    if (s.includes('deliver')) return 'success';
    return 'info';
  };

  if (loading) return <div className="text-center py-5 my-5">Loading your dashboard sanctuary...</div>;

  return (
    <Container className="my-4 my-md-5 py-4">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <Row className="mb-4 mb-md-5 align-items-md-center border-bottom pb-4">
        <Col md={8} className="text-center text-md-start">
          <p className="text-muted small text-uppercase mb-1" style={{ letterSpacing: '2px' }}>Patron Sanctuary</p>
          <h1 className="display-6 display-md-5 fw-normal mb-2" style={{ fontFamily: 'Playfair Display', color: '#1A1A1A' }}>
            Welcome, {user?.name || 'Valued Patron'}
          </h1>
          <p className="text-muted small mb-0">{user?.email}</p>
        </Col>
        <Col md={4} className="mt-3 mt-md-0 d-flex justify-content-center justify-content-md-end">
          <Button 
            variant="outline-dark" 
            className="rounded-0 text-uppercase fw-bold px-4 w-100 w-md-auto" 
            style={{ fontSize: '0.75rem', letterSpacing: '1px' }}
            onClick={handleLogout}
          >
            Sign Out
          </Button>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg={12}>
          <Card className="border-0 shadow-sm p-3 p-md-4 rounded-0" style={{ borderLeft: '5px solid #007373' }}>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 gap-3">
              <div>
                <Badge bg="dark" className="rounded-0 text-uppercase mb-2" style={{ backgroundColor: '#007373' }}>Modeva Membership</Badge>
                <h3 className="fw-bold text-uppercase m-0 fs-4 fs-md-3" style={{ fontFamily: 'Playfair Display' }}>Salon Prime Tier</h3>
              </div>
              <div className="text-start text-md-end">
                <span className="text-muted small d-block">Current Plan</span>
                <span className="fw-bold fs-5 text-uppercase" style={{ color: '#007373' }}>{user?.membership || 'Standard'}</span>
              </div>
            </div>
            
            <p className="text-muted small mb-3">
              Unlock free white-glove express courier, permanent 15% off on all archival collections, and priority private salon booking.
            </p>

            {user?.membershipExpiresAt && (
              <p className="text-muted small mb-3">
                <strong>Subscription Expires:</strong> {new Date(user.membershipExpiresAt).toLocaleDateString()}
              </p>
            )}

            <div className="d-flex flex-column flex-md-row gap-2 gap-md-3 mt-2">
              <Button 
                className="rounded-0 text-uppercase fw-bold px-4 py-2 w-100 w-md-auto" 
                style={{ backgroundColor: '#007373', border: 'none', fontSize: '0.8rem' }}
                onClick={() => handleUpgradeMembership('Salon Prime')}
              >
                Subscribe to Prime
              </Button>
              <Button 
                variant="outline-dark" 
                className="rounded-0 text-uppercase fw-bold px-4 py-2 w-100 w-md-auto"
                style={{ fontSize: '0.8rem' }}
                onClick={() => handleUpgradeMembership('VIP Gold')}
              >
                Upgrade to VIP
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col lg={4} className="d-flex flex-column gap-4">
          <Card className="border-0 rounded-0 shadow-sm p-3 p-md-4" style={{ borderTop: '4px solid #008B8B' }}>
            <h4 className="mb-3 fs-5 fs-md-4" style={{ fontFamily: 'Playfair Display' }}>Shipping & Contact Info</h4>
            <Form onSubmit={handleUpdateProfile}>
              <Form.Group className="mb-3">
                <Form.Label className="small text-muted fw-bold" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>FULL NAME</Form.Label>
                <Form.Control 
                  type="text" 
                  className="rounded-0 shadow-none" 
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="small text-muted fw-bold" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>PHONE NUMBER</Form.Label>
                <Form.Control 
                  type="text" 
                  className="rounded-0 shadow-none" 
                  placeholder="+20 100 000 0000"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="small text-muted fw-bold" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>SHIPPING ADDRESS</Form.Label>
                <Form.Control 
                  as="textarea"
                  rows={3}
                  className="rounded-0 shadow-none" 
                  placeholder="Street, Building, Apartment, City, Governorate"
                  value={profileData.address}
                  onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                  required
                />
              </Form.Group>
              <Button 
                type="submit" 
                disabled={updatingProfile}
                className="btn btn-dark w-100 rounded-0 mt-2 text-uppercase fw-bold" 
                style={{ fontSize: '0.75rem', letterSpacing: '1px', padding: '10px' }}
              >
                {updatingProfile ? 'Saving Info...' : 'Save Address'}
              </Button>
            </Form>
          </Card>

          <Card className="border-0 rounded-0 shadow-sm p-3 p-md-4" style={{ borderTop: '4px solid #008B8B' }}>
            <h4 className="mb-3 fs-5 fs-md-4" style={{ fontFamily: 'Playfair Display' }}>Fitting Profile</h4>
            <Form onSubmit={handleUpdateMeasurements}>
              <Row className="g-3">
                <Col xs={6}>
                  <Form.Group>
                    <Form.Label className="small text-muted fw-bold" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>BUST</Form.Label>
                    <Form.Control 
                      type="text" 
                      className="rounded-0 shadow-none" 
                      value={measurements.bust}
                      onChange={(e) => setMeasurements({...measurements, bust: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group>
                    <Form.Label className="small text-muted fw-bold" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>WAIST</Form.Label>
                    <Form.Control 
                      type="text" 
                      className="rounded-0 shadow-none" 
                      value={measurements.waist}
                      onChange={(e) => setMeasurements({...measurements, waist: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group>
                    <Form.Label className="small text-muted fw-bold" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>HIGH HIP</Form.Label>
                    <Form.Control 
                      type="text" 
                      className="rounded-0 shadow-none" 
                      value={measurements.highHip}
                      onChange={(e) => setMeasurements({...measurements, highHip: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group>
                    <Form.Label className="small text-muted fw-bold" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>STATURE</Form.Label>
                    <Form.Control 
                      type="text" 
                      className="rounded-0 shadow-none" 
                      value={measurements.stature}
                      onChange={(e) => setMeasurements({...measurements, stature: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Button 
                type="submit" 
                disabled={updatingMeasurements}
                className="btn btn-dark w-100 rounded-0 mt-4 text-uppercase fw-bold" 
                style={{ fontSize: '0.75rem', letterSpacing: '1px', padding: '10px' }}
              >
                {updatingMeasurements ? 'Saving...' : 'Save Measurements'}
              </Button>
            </Form>
          </Card>
        </Col>

        <Col lg={8}>
          <Card className="border-0 rounded-0 shadow-sm p-3 p-md-4 h-100">
            <h4 className="mb-4 fs-5 fs-md-4" style={{ fontFamily: 'Playfair Display' }}>Active Atelier Orders</h4>
            {orders.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <p>No active custom orders found in your registry.</p>
                <Button 
                  variant="dark" 
                  className="rounded-0 text-uppercase fw-bold px-4 py-2 mt-2"
                  style={{ fontSize: '0.75rem', letterSpacing: '1px' }}
                  onClick={() => navigate('/catalog')}
                >
                  Explore Catalog
                </Button>
              </div>
            ) : (
              <div className="d-flex flex-column gap-4">
                {orders.map((order) => (
                  <Card key={order._id} className="border p-3 rounded-0 shadow-none">
                    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-3 pb-3 border-bottom gap-2">
                      <div>
                        <span className="text-muted small text-uppercase fw-bold" style={{ letterSpacing: '1px', fontSize: '0.7rem' }}>Order ID:</span>
                        <span className="fw-bold ms-2 text-dark">#{order._id.substring(order._id.length - 6).toUpperCase()}</span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <Badge bg={order.paymentMethod === 'COD' ? 'warning' : 'dark'} className="text-uppercase rounded-0 px-2 py-1" style={{ fontSize: '0.65rem' }}>
                          {order.paymentMethod || 'CARD'}
                        </Badge>
                        <span className="fw-bold text-teal fs-5">{order.total}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="small fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>Status Tracker</span>
                        <Badge bg={getOrderStatusColor(order.status || 'Confirmed')} className="rounded-0 text-uppercase px-3 py-1 text-wrap text-center" style={{ maxWidth: '120px' }}>
                          {order.status || 'Confirmed'}
                        </Badge>
                      </div>
                      
                      {order.status !== 'Cancelled' && (
                        <div className="position-relative mt-3 mb-2">
                          <ProgressBar 
                            now={getOrderStatusValue(order.status || 'Confirmed')} 
                            variant="info" 
                            style={{ height: '4px' }} 
                            className="rounded-0"
                          />
                          <div className="d-flex justify-content-between mt-2 text-muted text-uppercase" style={{ fontSize: '0.55rem', letterSpacing: '0px' }}>
                            <span className={getOrderStatusValue(order.status) >= 25 ? 'text-dark fw-bold' : ''}>Confirmed</span>
                            <span className={getOrderStatusValue(order.status) >= 50 ? 'text-dark fw-bold' : ''}>Processing</span>
                            <span className={getOrderStatusValue(order.status) >= 75 ? 'text-dark fw-bold' : ''}>Dispatched</span>
                            <span className={getOrderStatusValue(order.status) === 100 ? 'text-dark fw-bold' : ''}>Delivered</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="bg-light p-3 mb-3 border">
                      <p className="mb-2 small text-uppercase fw-bold text-muted" style={{ letterSpacing: '1px', fontSize: '0.7rem' }}>Items in Order:</p>
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="small text-dark mb-2 pb-2 border-bottom d-flex flex-column flex-sm-row justify-content-between gap-1 last-child-no-border">
                          <span className="fw-bold text-truncate" style={{ maxWidth: '100%' }}>{item.name}</span>
                          <span className="text-muted text-nowrap">Size: {item.size} | Qty: {item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="d-flex flex-column flex-sm-row justify-content-end gap-2 pt-2 mt-2">
                      <Button 
                        variant="outline-dark" 
                        size="sm" 
                        className="rounded-0 text-uppercase fw-bold px-3 py-2 w-100 w-sm-auto"
                        style={{ fontSize: '0.7rem', letterSpacing: '1px' }}
                        onClick={() => handleRequestAlteration(order._id)}
                        disabled={order.alterationRequested || order.status === 'Cancelled'}
                      >
                        {order.alterationRequested ? 'Alteration Requested' : 'Request Alteration'}
                      </Button>
                      <Button 
                        variant="danger" 
                        size="sm" 
                        className="rounded-0 text-uppercase fw-bold px-3 py-2 w-100 w-sm-auto"
                        style={{ fontSize: '0.7rem', letterSpacing: '1px' }}
                        onClick={() => handleCancelOrder(order._id)}
                        disabled={order.status === 'Dispatched' || order.status === 'Delivered' || order.status === 'Cancelled'}
                      >
                        Cancel Order
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ClientDashboard;