import React, { useEffect } from 'react';
import { Container, Row, Col, Accordion } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const SupportPage = () => {
  const { type } = useParams();
  useEffect(() => { window.scrollTo(0, 0); }, [type]);

  const contentMap = {
    faq: {
      title: 'Frequently Asked Questions',
      subtitle: 'Everything you need to know about our atelier, bespoke orders, and private services.',
      body: (
        <Accordion defaultActiveKey="0" className="rounded-0">
          <Accordion.Item eventKey="0" className="rounded-0 mb-3 border">
            <Accordion.Header>How do I commission a bespoke garment?</Accordion.Header>
            <Accordion.Body className="text-muted small">
              You can initiate a commission by visiting our catalog, selecting your silhouette, and scheduling an in-person or virtual consultation with our master tailors at the Senopati Atelier.
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1" className="rounded-0 mb-3 border">
            <Accordion.Header>What is the standard crafting timeline?</Accordion.Header>
            <Accordion.Body className="text-muted small">
              Standard artisanal crafting takes between 10 to 14 business days, depending on fabric intricacy and hand-weaving requirements (such as Batik Tulis).
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2" className="rounded-0 mb-3 border">
            <Accordion.Header>Can I request micro-alterations?</Accordion.Header>
            <Accordion.Body className="text-muted small">
              Yes, all garments include complimentary waist and hem micro-alterations within 30 days of delivery.
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      )
    },
    service: {
      title: 'Customer Service & Patron Support',
      subtitle: 'We are here to provide white-glove assistance around the clock.',
      body: (
        <div>
          <p className="text-muted mb-4" style={{ lineHeight: '1.8' }}>
            Our dedicated patron liaisons are available 24/7 to assist you with sizing, tracking active atelier commissions, or arranging private salon viewings.
          </p>
          <div className="bg-light p-4 border mb-4">
            <h6 className="fw-bold text-uppercase mb-2" style={{ fontSize: '0.85rem' }}>Direct Concierge Channels</h6>
            <p className="text-muted small mb-1"><strong>WhatsApp:</strong> +62 859 9999 999</p>
            <p className="text-muted small mb-0"><strong>Email:</strong> hello@modeva.com</p>
          </div>
        </div>
      )
    },
    refund: {
      title: 'Refund and Return Policy',
      subtitle: 'Strictly curated policies to ensure absolute artisanal satisfaction.',
      body: (
        <div>
          <p className="text-muted mb-4" style={{ lineHeight: '1.8' }}>
            Because our pieces involve custom hand-finishing and limited-run looms, returns are accepted within 30 days of delivery exclusively for unworn items in their original packaging with wax seals intact.
          </p>
          <p className="text-muted mb-0" style={{ lineHeight: '1.8' }}>
            Bespoke, made-to-measure garments tailored precisely to your biometric profile are final sale, but are fully eligible for our complimentary micro-alteration program.
          </p>
        </div>
      )
    },
    terms: {
      title: 'Terms and Conditions',
      subtitle: 'Legal framework governing MODEVA Haute Couture digital and salon transactions.',
      body: (
        <div>
          <p className="text-muted mb-4" style={{ lineHeight: '1.8' }}>
            By accessing our digital salon or purchasing from MODEVA, you agree to respect our intellectual property, digital provenance certificates, and exclusive design copyrights.
          </p>
          <p className="text-muted mb-0" style={{ lineHeight: '1.8' }}>
            All transactions processed through our tokenized gateways are bound by Indonesian luxury commerce laws and protected via 256-bit encryption.
          </p>
        </div>
      )
    },
    shipping: {
      title: 'Shipping & White-Glove Delivery',
      subtitle: 'Secure, insured, and tracked transport straight to your sanctuary.',
      body: (
        <div>
          <p className="text-muted mb-4" style={{ lineHeight: '1.8' }}>
            We provide insured white-glove courier services globally and nationwide across Indonesia. Each garment is packed in a wax-sealed cedar box accompanied by its physical embossed certificate of provenance.
          </p>
          <div className="bg-light p-4 border">
            <h6 className="fw-bold text-uppercase mb-2" style={{ fontSize: '0.85rem' }}>Delivery Estimates</h6>
            <p className="text-muted small mb-1"><strong>Jakarta Region:</strong> 1-2 business days (Complimentary)</p>
            <p className="text-muted small mb-0"><strong>International Express:</strong> 3-5 business days (Calculated at checkout)</p>
          </div>
        </div>
      )
    }
  };

  const currentContent = contentMap[type] || contentMap['faq'];

  return (
    <Container className="my-5 py-5">
      <Row className="mb-4 text-center">
        <Col>
          <h1 className="display-5 text-uppercase mb-2" style={{ fontFamily: 'Playfair Display', color: '#1A1A1A' }}>
            {currentContent.title}
          </h1>
          <p className="text-muted small mb-4">{currentContent.subtitle}</p>
          <div className="mx-auto" style={{ backgroundColor: '#008B8B', width: '80px', height: '3px' }}></div>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={9} className="bg-white p-4 p-md-5 border">
          {currentContent.body}
        </Col>
      </Row>
    </Container>
  );
};

export default SupportPage;