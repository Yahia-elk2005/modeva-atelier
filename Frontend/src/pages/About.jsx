import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const aboutImg1 = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop';
const aboutImg2 = 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=800&auto=format&fit=crop'; // صورة ثانية جديدة بجودة عالية وتعبر عن الخياطة الراقية

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Container className="my-5 py-5">
      <Row className="mb-5 text-center">
        <Col>
          <h1 className="display-3 text-uppercase mb-3" style={{ fontFamily: 'Playfair Display', color: '#1A1A1A' }}>
            Our Story
          </h1>
          <div className="mx-auto" style={{ backgroundColor: '#008B8B', width: '80px', height: '3px' }}></div>
        </Col>
      </Row>

      <Row className="align-items-center mb-5 pb-5 g-5">
        <Col md={6}>
          <div className="bg-light p-3" style={{ border: '16px solid #F2F2F2' }}>
            <img 
              src={aboutImg1} 
              alt="Modeva Atelier" 
              className="w-100 rounded-0" 
              style={{ height: '500px', objectFit: 'cover' }} 
              onError={(e) => { e.target.src = 'https://placehold.co/800x500?text=Modeva+Atelier'; }}
            />
          </div>
        </Col>
        <Col md={6} className="px-lg-5">
          <p className="text-muted small mb-2 text-uppercase fw-bold" style={{ letterSpacing: '2px', fontSize: '0.75rem' }}>
            The Beginning
          </p>
          <h2 className="display-6 mb-4" style={{ fontFamily: 'Playfair Display', color: '#1A1A1A' }}>
            Made in Indonesia, Dedicated to Indonesia
          </h2>
          <p className="text-muted mb-4" style={{ lineHeight: '1.8' }}>
            MODEVA was born out of a profound appreciation for timeless elegance and structural tailoring. Our journey started in the heart of Jakarta, merging traditional craftsmanship with modern, sharp silhouettes. Every garment is a testament to our dedication to quality and luxury.
          </p>
          <p className="text-muted" style={{ lineHeight: '1.8' }}>
            We believe that dressing up is an art form. It is not just about fabric; it is about architecture, emotion, and the confidence that comes from wearing something perfectly constructed for you.
          </p>
        </Col>
      </Row>

      <Row className="align-items-center mb-5 g-5 flex-column-reverse flex-md-row">
        <Col md={6} className="px-lg-5">
          <p className="text-muted small mb-2 text-uppercase fw-bold" style={{ letterSpacing: '2px', fontSize: '0.75rem' }}>
            Our Philosophy
          </p>
          <h2 className="display-6 mb-4" style={{ fontFamily: 'Playfair Display', color: '#1A1A1A' }}>
            The Art of Dressing Up
          </h2>
          <p className="text-muted mb-4" style={{ lineHeight: '1.8' }}>
            At MODEVA, we reject the fleeting nature of fast fashion. Instead, we embrace the permanence of style. Our collections are strictly curated, featuring uncompromising lines, premium textures, and a pure constructivism that speaks volumes through its minimalism.
          </p>
          <p className="text-muted" style={{ lineHeight: '1.8' }}>
            From the sharp lapels of our formal men's wear to the flowing yet structured lines of our evening gowns, every detail is engineered to perfection. Welcome to the sanctuary of high-end couture.
          </p>
        </Col>
        <Col md={6}>
          <div className="bg-light p-3" style={{ border: '16px solid #F2F2F2' }}>
            <img 
              src={aboutImg2} 
              alt="Modeva Craftsmanship" 
              className="w-100 rounded-0" 
              style={{ height: '500px', objectFit: 'cover' }} 
              onError={(e) => { e.target.src = 'https://placehold.co/800x500?text=Modeva+Craftsmanship'; }}
            />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default About;