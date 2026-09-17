import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import axiosInstance from '../utils/axiosConfig';
import ProductCard from '../components/ProductCard';

const NewArrival = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    axiosInstance.get('/products')
      .then(res => {
        const allProducts = res.data.data || [];
        const featuredNewArrivals = allProducts.filter(p => p.isNewArrival === true);
        setProducts(featuredNewArrivals);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching new arrivals:", err);
        setLoading(false);
      });
  }, []);

  return (
    <Container className="my-4 my-md-5 py-4 py-md-5">
      <Row className="mb-4 mb-md-5 text-center text-md-start">
        <Col>
          <p className="text-teal small text-uppercase fw-bold mb-2" style={{ letterSpacing: '2px' }}>Curated Selections</p>
          <h1 className="display-5 display-md-4 text-uppercase mb-3" style={{ fontFamily: 'Playfair Display', color: '#1A1A1A' }}>
            New Arrivals
          </h1>
          <div className="mx-auto mx-md-0" style={{ backgroundColor: '#008B8B', width: '60px', height: '3px' }}></div>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-5">Loading latest pieces...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-5 text-muted">No new arrivals featured by admin yet.</div>
      ) : (
        <Row className="g-4">
          {products.map(product => (
            <Col xs={12} sm={6} md={4} lg={3} key={product._id}>
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default NewArrival;