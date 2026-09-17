import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { FiChevronDown, FiThumbsUp, FiPhoneCall, FiSend, FiCreditCard } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import ProductCard from '../components/ProductCard';
import Testimonials from '../components/Testimonials';
import heroBg from '../assets/f43a681d7b8898aabfd20ba4cce7738f6423baa8.jpg';
import formalWomanImg from '../assets/41e09ff70dac848d36b787163f2d6fc87b806080.jpg';
import formalMenImg from '../assets/c821e3b385057f30e8a04b4124732d426c8d0332.jpg';
import casualStyleImg from '../assets/e38106164a677189095f3e59f420ccfd8728c180.jpg';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axiosInstance.get('/products')
      .then(res => setProducts(res.data.data || []))
      .catch(console.error);
  }, []);

  const womanProducts = products.filter(product => product.category === 'Woman');
  const menProducts = products.filter(product => product.category === 'Men');
  const featuredProduct1 = products[0];
  const featuredProduct2 = products[1] || products[0];

  return (
    <div className="page-wrapper">
      <div className="hero-wrapper" style={{ backgroundImage: `url(${heroBg})` }}>
        <div className="hero-content-wrapper d-flex">
          <Container className="position-relative d-flex align-items-end pb-5 w-100">
            <div className="hero-text-block text-white w-100 pb-3">
              <p className="subtitle mb-3">MADE IN INDONESIA, DEDICATED TO INDONESIA</p>
              <h1 className="hero-title fw-normal mb-0">DISCOVER THE ART OF</h1>
              <h1 className="hero-title fw-normal mb-0">DRESSING UP</h1>
            </div>
            
            <div className="floating-cards-block position-absolute end-0 bottom-0 mb-5 me-lg-5 pe-lg-3 d-none d-lg-flex">
              {featuredProduct1 && (
                <div className="floating-card card-top d-flex align-items-center">
                  <img src={featuredProduct1.image} alt="Product" className="card-thumb" />
                  <div className="card-info ps-3">
                    <h6 className="card-product-title mb-1">{featuredProduct1.name}</h6>
                    <p className="card-product-price mb-2">${featuredProduct1.price}</p>
                    <Link to={`/product/${featuredProduct1._id}`} className="shop-link">SHOP NOW</Link>
                  </div>
                </div>
              )}
              {featuredProduct2 && (
                <div className="floating-card card-bottom d-flex align-items-center">
                  <div className="card-info pe-3">
                    <h6 className="card-product-title mb-1">{featuredProduct2.name}</h6>
                    <p className="card-product-price mb-2">${featuredProduct2.price}</p>
                    <Link to={`/product/${featuredProduct2._id}`} className="shop-link">SHOP NOW</Link>
                  </div>
                  <img src={featuredProduct2.image} alt="Product" className="card-thumb" />
                </div>
              )}
            </div>

            <div className="scroll-down text-white position-absolute start-50 translate-middle-x bottom-0 mb-4">
              SCROLL DOWN <FiChevronDown size={16} />
            </div>
          </Container>
        </div>
      </div>

      <Container className="my-5 py-5">
        <Row className="g-4">
          <Col md={6}>
            <div className="category-card mb-4" style={{ backgroundImage: `url(${formalWomanImg})` }}>
              <div className="overlay d-flex align-items-center px-5">
                <Link to="/catalog?category=Woman" className="text-decoration-none">
                  <h3 className="category-title text-white mb-0">FORMAL WOMAN</h3>
                </Link>
              </div>
            </div>
            <div className="category-card" style={{ backgroundImage: `url(${formalMenImg})` }}>
              <div className="overlay d-flex align-items-center px-5">
                <Link to="/catalog?category=Men" className="text-decoration-none">
                  <h3 className="category-title text-white mb-0">FORMAL MEN</h3>
                </Link>
              </div>
            </div>
          </Col>
          <Col md={6}>
            <div className="category-card tall" style={{ backgroundImage: `url(${casualStyleImg})` }}>
              <div className="overlay d-flex align-items-center px-5">
                <Link to="/catalog?category=Casual" className="text-decoration-none">
                  <h3 className="category-title text-white mb-0">CASUAL STYLE</h3>
                </Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      <Container className="my-5 py-4">
        <h2 className="section-heading text-center display-6 mb-5">THE BEST DRESS FOR THE BEST WOMAN</h2>
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            576: { slidesPerView: 2 },
            992: { slidesPerView: 4 }
          }}
          autoplay={{ delay: 3500 }}
          pagination={{ clickable: true }}
          className="pb-5"
        >
          {womanProducts.map(product => (
            <SwiperSlide key={product._id}>
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="mt-4 text-center">
          <Link to="/catalog?category=Woman">
            <Button className="btn-teal rounded-0 px-4 py-2">SEE MORE &rarr;</Button>
          </Link>
        </div>
      </Container>

      <Container className="my-5 py-4">
        <h2 className="section-heading text-center display-6 mb-5">BEST OUTFIT FOR YOUR HAPPINESS</h2>
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            576: { slidesPerView: 2 },
            992: { slidesPerView: 4 }
          }}
          autoplay={{ delay: 4000 }}
          pagination={{ clickable: true }}
          className="pb-5"
        >
          {menProducts.map(product => (
            <SwiperSlide key={product._id}>
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="mt-4 text-center">
          <Link to="/catalog?category=Men">
            <Button className="btn-teal rounded-0 px-4 py-2">SEE MORE &rarr;</Button>
          </Link>
        </div>
      </Container>

      <Container className="my-5 py-5 px-lg-5">
        <Row className="g-4 align-items-stretch">
          <Col md={4}>
            <div className="feature-card w-100 h-100 bg-white p-5 text-center d-flex flex-column justify-content-center align-items-center" style={{ border: '26px solid #F2F2F2' }}>
              <div className="icon-circle mb-4"><FiThumbsUp /></div>
              <h4 className="mb-3" style={{ fontFamily: 'Playfair Display' }}>100% Satisfaction Guaranteed</h4>
              <p className="text-muted small mb-0">Committed to delivering immaculate bespoke tailoring and high-end atelier standards.</p>
            </div>
          </Col>
          <Col md={4} className="d-flex flex-column gap-4">
            <div className="feature-card w-100 bg-white p-4 d-flex align-items-center gap-4 flex-grow-1" style={{ border: '26px solid #F2F2F2' }}>
              <div className="icon-circle flex-shrink-0"><FiPhoneCall /></div>
              <div>
                <h5 className="mb-2" style={{ fontFamily: 'Playfair Display' }}>24/7 Online Service</h5>
                <p className="text-muted small mb-0">Our concierge liaisons are always available to assist your couture selections.</p>
              </div>
            </div>
            <div className="feature-card w-100 bg-white p-4 d-flex align-items-center gap-4 flex-grow-1" style={{ border: '26px solid #F2F2F2' }}>
              <div className="icon-circle flex-shrink-0"><FiSend /></div>
              <div>
                <h5 className="mb-2" style={{ fontFamily: 'Playfair Display' }}>Fast Delivery</h5>
                <p className="text-muted small mb-0">Insured white-glove transport straight to your private sanctuary.</p>
              </div>
            </div>
          </Col>
          <Col md={4}>
            <div className="feature-card w-100 h-100 bg-white p-5 text-center d-flex flex-column justify-content-center align-items-center" style={{ border: '26px solid #F2F2F2' }}>
              <div className="icon-circle mb-4"><FiCreditCard /></div>
              <h4 className="mb-3" style={{ fontFamily: 'Playfair Display' }}>Payment With Secure System</h4>
              <p className="text-muted small mb-0">End-to-end tokenized encryption protecting every patron investment.</p>
            </div>
          </Col>
        </Row>
      </Container>
      <Testimonials products={products} />
    </div>
  );
};

export default Home;