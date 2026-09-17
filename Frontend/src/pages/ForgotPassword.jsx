import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axiosInstance from "../utils/axiosConfig";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosInstance.post("/auth/forget-password", { email });
      toast.success(
        res.data.message || "Password reset link sent to your email.",
      );
      setTimeout(() => {
        navigate("/auth");
      }, 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send reset link.");
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
            <h2
              className="mb-3 fs-3 fw-normal text-center"
              style={{ fontFamily: "Playfair Display" }}
            >
              Forgot Password
            </h2>
            <p className="text-muted small text-center mb-4">
              Enter your registered email address and we will send you a secure
              link to reset your password.
            </p>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label
                  className="small text-uppercase text-muted fw-bold"
                  style={{ fontSize: "0.7rem", letterSpacing: "1px" }}
                >
                  Email Address
                </Form.Label>
                <Form.Control
                  type="email"
                  className="rounded-0 p-3 shadow-none"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Button
                type="submit"
                disabled={loading}
                className="w-100 rounded-0 text-uppercase fw-bold py-3 mt-2"
                style={{
                  backgroundColor: "#007373",
                  border: "none",
                  fontSize: "0.75rem",
                  letterSpacing: "1px",
                }}
              >
                {loading ? "Sending Link..." : "Send Reset Link"}
              </Button>
            </Form>

            <div className="text-center mt-3">
              <Button
                variant="link"
                className="text-dark text-decoration-none small p-0"
                onClick={() => navigate("/auth")}
              >
                &larr; Back to Sign In
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPassword;
