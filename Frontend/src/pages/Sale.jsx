import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import axiosInstance from '../utils/axiosConfig';
import ProductCard from '../components/ProductCard';

const Sale = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    axiosInstance.get('/products')
      .then(res => {
        const allProducts = res.data.data || [];
        // تصفية المنتجات بحيث لا يظهر في السيل إلا ما فعله الأدمن (onSale === true)
        const saleProducts = allProducts.filter(p => p.onSale === true);
        setProducts(saleProducts);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching sale products:", err);
        setLoading(false);
      });
  }, []);

  return (
    <Container className="my-4 my-md-5 py-4 py-md-5">
      <Row className="mb-4 mb-md-5 text-center text-md-start">
        <Col>
          <span className="bg-danger text-white px-2 py-1 small text-uppercase fw-bold mb-3 d-inline-block" style={{ letterSpacing: '1px' }}>
            Special Atelier Discount
          </span>
          <h1 className="display-5 display-md-4 text-uppercase mb-3 mt-2" style={{ fontFamily: 'Playfair Display', color: '#1A1A1A' }}>
            Archival Sale
          </h1>
          <div className="mx-auto mx-md-0" style={{ backgroundColor: '#008B8B', width: '60px', height: '3px' }}></div>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-5">Loading sale pieces...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-5 text-muted">No items currently on sale.</div>
      ) : (
        <Row className="g-4">
          {products.map(product => {
            // تمرير السعر المخفض للبطاقة إذا كان موجوداً
            const displayProduct = {
              ...product,
              price: product.discountPrice ? product.discountPrice : product.price,
              originalPrice: product.discountPrice ? product.price : null
            };

            return (
              <Col xs={12} sm={6} md={4} lg={3} key={product._id}>
                <ProductCard product={displayProduct} />
              </Col>
            );
          })}
        </Row>
      )}
    </Container>
  );
};

export default Sale;