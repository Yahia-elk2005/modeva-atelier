import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import axiosInstance from '../utils/axiosConfig';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosInstance.post(`/auth/reset-password/${token}`, { password });
      toast.success(res.data.message || 'Password reset successfully!');
      setTimeout(() => {
        navigate('/auth');
      }, 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired token.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-5 py-5">
      <ToastContainer position="top-right" autoClose={3000} />
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="border-0 shadow-sm p-4 rounded-0">
            <h2 className="mb-3 fs-3 fw-normal text-center" style={{ fontFamily: 'Playfair Display' }}>Reset Password</h2>
            <p className="text-muted small text-center mb-4">Please enter your new secure password below.</p>
            
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="small text-uppercase text-muted fw-bold" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>New Password</Form.Label>
                <Form.Control 
                  type="password" 
                  className="rounded-0 p-3 shadow-none" 
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </Form.Group>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-100 rounded-0 text-uppercase fw-bold py-3 mt-2"
                style={{ backgroundColor: '#007373', border: 'none', fontSize: '0.75rem', letterSpacing: '1px' }}
              >
                {loading ? 'Updating...' : 'Update Password'}
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ResetPassword;