import React, { useMemo } from 'react';
import { Container, Card } from 'react-bootstrap';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { FiStar } from 'react-icons/fi';

const fallbackReviews = [
  {
    _id: 'f1',
    name: 'AMINA RASHED',
    date: '12 Oct 2026',
    rating: 5,
    comment: 'The craftsmanship is absolutely exquisite. The bespoke fitting experience was flawless, and the silhouette falls perfectly. Highly recommended for elite evening wear.',
    productName: 'Signature Evening Gown'
  },
  {
    _id: 'f2',
    name: 'SARAH CONNOR',
    date: '05 Nov 2026',
    rating: 5,
    comment: 'Modeva Atelier exceeded all my expectations. The fabric quality is unparalleled, and the white-glove delivery service made the entire experience feel incredibly luxurious.',
    productName: 'Classic Tweed Jacket'
  },
  {
    _id: 'f3',
    name: 'YASMINE TAREK',
    date: '20 Nov 2026',
    rating: 4,
    comment: 'Beautiful structural tailoring. The micro-alteration service was prompt and professional. I will definitely be commissioning another piece for the upcoming gala.',
    productName: 'Pleated Midi Skirt'
  }
];

const Testimonials = ({ products = [] }) => {
  const dynamicReviews = useMemo(() => {
    let allReviews = [];
    products.forEach(product => {
      if (product.reviews && product.reviews.length > 0) {
        const topReviews = product.reviews
          .filter(r => r.rating >= 4)
          .map(r => ({
            ...r,
            productName: product.name,
            date: new Date(r.createdAt || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
          }));
        allReviews = [...allReviews, ...topReviews];
      }
    });
    
    return allReviews.length > 0 ? allReviews.slice(0, 8) : fallbackReviews;
  }, [products]);

  const getAvatarColor = (name) => {
    const colors = ['#008B8B', '#1A1A1A', '#4A1C1C', '#2C3E50', '#8E44AD'];
    const charCode = name.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };

  return (
    <Container 
      className="py-5 px-4 px-lg-5 position-relative" 
      style={{ backgroundColor: '#F2F2F2', marginBottom: '-100px', zIndex: 10 }}
    >
      <div className="text-center mb-5">
        <h2 className="display-6" style={{ fontFamily: 'Playfair Display', color: '#1A1A1A' }}>
          PATRON EXPERIENCES
        </h2>
        <div className="mx-auto mt-2" style={{ backgroundColor: '#008B8B', width: '60px', height: '2px' }}></div>
      </div>

      <Swiper
        modules={[Autoplay]}
        spaceBetween={24}
        slidesPerView={1}
        breakpoints={{
          768: { slidesPerView: 2 },
          1200: { slidesPerView: 3 }
        }}
        autoplay={{ delay: 4500 }}
        className="pb-4"
      >
        {dynamicReviews.map((review, idx) => (
          <SwiperSlide key={review._id || idx}>
            <Card className="border-0 shadow-sm h-100 rounded-0">
              <Card.Body className="p-4 d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <div className="d-flex align-items-center gap-3">
                    <div 
                      className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold" 
                      style={{ width: '45px', height: '45px', backgroundColor: getAvatarColor(review.name || review.user?.name || 'V') }}
                    >
                      {(review.name || review.user?.name || 'V').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h6 className="mb-0 text-dark text-uppercase" style={{ fontSize: '0.80rem', letterSpacing: '0.5px', fontWeight: 'bold' }}>
                        {review.name || review.user?.name || 'Valued Patron'}
                      </h6>
                      <small className="text-muted" style={{ fontSize: '0.70rem' }}>
                        {review.date}
                      </small>
                    </div>
                  </div>
                  <div className="text-warning d-flex" style={{ fontSize: '1rem' }}>
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} fill={i < review.rating ? "#ffc107" : "none"} />
                    ))}
                  </div>
                </div>
                <Card.Text className="text-muted flex-grow-1 mb-3" style={{ fontSize: '0.85rem', lineHeight: '1.6', fontStyle: 'italic' }}>
                  "{review.comment}"
                </Card.Text>
                <div className="mt-auto pt-3 border-top">
                  <small className="text-uppercase fw-bold" style={{ fontSize: '0.65rem', color: '#008B8B', letterSpacing: '1px' }}>
                    Purchased: {review.productName}
                  </small>
                </div>
              </Card.Body>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </Container>
  );
};

export default Testimonials;