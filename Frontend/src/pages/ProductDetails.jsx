import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Modal, Table, Form } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { toast, ToastContainer } from 'react-toastify';
import { FiHeart, FiStar } from 'react-icons/fi';
import axiosInstance from '../utils/axiosConfig';
import ProductCard from '../components/ProductCard';

const FALLBACK_IMAGE = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22500%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23f2f2f2%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20font-family%3D%22sans-serif%22%20font-size%3D%2216%22%20fill%3D%22%23aaaaaa%22%3ENo%20Image%20Available%3C%2Ftext%3E%3C%2Fsvg%3E';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedSize, setSelectedSize] = useState('M');
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const prodRes = await axiosInstance.get(`/products/${id}`);
        setProduct(prodRes.data.data);
        
        const allRes = await axiosInstance.get('/products');
        const allProducts = allRes.data.data || [];
        setRelatedProducts(allProducts.filter(p => p._id !== id).slice(0, 6));
        
        const token = localStorage.getItem('token');
        if (token) {
          const wishRes = await axiosInstance.get('/wishlist');
          const wishlistItems = wishRes.data.data?.wishlistItems || [];
          const exists = wishlistItems.some(item => (item.product?._id || item.product || item._id) === id);
          setIsFavorite(exists);
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please sign in first to add items to your bag.');
      navigate('/auth');
      return;
    }
    setAddingToCart(true);
    try {
      await axiosInstance.post('/cart', {
        productId: product._id,
        quantity: 1,
        size: selectedSize
      });
      toast.success('Piece added to your shopping bag successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add item to bag.');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleToggleFavorite = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please sign in first to manage your vault.');
      navigate('/auth');
      return;
    }
    try {
      if (isFavorite) {
        await axiosInstance.delete(`/wishlist/${product._id}`);
        setIsFavorite(false);
        toast.success('Removed from your private vault.');
      } else {
        await axiosInstance.post('/wishlist', { productId: product._id });
        setIsFavorite(true);
        toast.success('Piece saved to your private vault!');
      }
      window.dispatchEvent(new Event('wishlistUpdated'));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update wishlist.');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please sign in to submit a review.');
      navigate('/auth');
      return;
    }
    if (!reviewText.trim()) {
      toast.error('Please write a review comment.');
      return;
    }
    setSubmittingReview(true);
    try {
      await axiosInstance.post(`/products/${id}/reviews`, {
        rating: reviewRating,
        comment: reviewText
      });
      toast.success('Review submitted successfully!');
      setReviewText('');
      setReviewRating(5);
      
      const prodRes = await axiosInstance.get(`/products/${id}`);
      setProduct(prodRes.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <div className="text-center py-5 my-5">Loading product details...</div>;
  if (!product) return <div className="text-center py-5 my-5">Product not found.</div>;

  return (
    <Container className="my-4 my-md-5 py-4 py-md-5">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <Modal show={showSizeGuide} onHide={() => setShowSizeGuide(false)} centered size="lg">
        <Modal.Header closeButton className="rounded-0 border-0 bg-light">
          <Modal.Title style={{ fontFamily: 'Playfair Display' }}>Atelier Size & Biometric Guide</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <p className="text-muted small mb-4">All measurements are provided in centimeters (cm) and tailored to fit standard international haute couture specifications.</p>
          <Table bordered hover className="align-middle text-center small">
            <thead className="bg-dark text-white">
              <tr>
                <th>Size</th>
                <th>Bust</th>
                <th>Waist</th>
                <th>High Hip</th>
                <th>Stature</th>
              </tr>
            </thead>
            <tbody>
              <tr><td><strong>XS</strong></td><td>80 - 82</td><td>60 - 62</td><td>88 - 90</td><td>170</td></tr>
              <tr><td><strong>S</strong></td><td>84 - 86</td><td>64 - 66</td><td>92 - 94</td><td>172</td></tr>
              <tr><td><strong>M</strong></td><td>88 - 90</td><td>68 - 70</td><td>96 - 98</td><td>175</td></tr>
              <tr><td><strong>L</strong></td><td>92 - 94</td><td>72 - 76</td><td>100 - 102</td><td>178</td></tr>
              <tr><td><strong>XL</strong></td><td>96 - 100</td><td>80 - 84</td><td>106 - 110</td><td>180</td></tr>
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="dark" className="rounded-0 text-uppercase px-4" style={{ fontSize: '0.75rem' }} onClick={() => setShowSizeGuide(false)}>
            Close Guide
          </Button>
        </Modal.Footer>
      </Modal>

      <Row className="g-4 g-lg-5 mb-5 pb-4 pb-md-5 border-bottom">
        <Col md={6} lg={5}>
          <div className="bg-light p-2 p-md-4" style={{ border: '16px solid #F2F2F2' }}>
            <img
              src={product.image || FALLBACK_IMAGE}
              alt={product.name}
              className="w-100 rounded-0 shadow-sm"
              style={{ objectFit: 'cover', maxHeight: '600px' }}
              onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE; }}
            />
          </div>
        </Col>
        
        <Col md={6} lg={7} className="d-flex flex-column justify-content-center pt-3 pt-md-0">
          <p className="text-muted small mb-2 text-uppercase fw-bold" style={{ letterSpacing: '2px', fontSize: '0.75rem' }}>
            {product.category || 'CATEGORY'}
          </p>
          <h1 className="display-6 display-md-5 fw-bold mb-3" style={{ fontFamily: 'Playfair Display', color: '#1A1A1A' }}>
            {product.name}
          </h1>
          <div className="d-flex align-items-center gap-2 mb-4">
            <div className="bg-teal text-white fw-bold d-flex align-items-center justify-content-center rounded-0" style={{ padding: '4px 10px', fontSize: '0.85rem' }}>
              {product.rating || '4.95'}
            </div>
            <span className="text-muted small">
              {product.reviews?.length || 0} Patron Reviews
            </span>
          </div>
          
          <h3 className="fw-bold mb-4 fs-4 fs-md-3" style={{ color: '#1A1A1A' }}>${product.price}</h3>
          <p className="text-muted mb-4 mb-md-5" style={{ lineHeight: '1.8', fontSize: '0.95rem' }}>
            {product.description || "Haute couture bespoke garment crafted at Senopati Atelier. Designed with premium fabrics to ensure absolute elegance and durability."}
          </p>
          
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="text-uppercase mb-0 fw-bold" style={{ fontSize: '0.80rem', letterSpacing: '1px' }}>Select Size:</h6>
              <span 
                className="text-teal small text-uppercase text-decoration-underline" 
                style={{ cursor: 'pointer', fontSize: '0.75rem' }}
                onClick={() => setShowSizeGuide(true)}
              >
                Size Guide
              </span>
            </div>
            <div className="d-flex flex-wrap gap-2">
              {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                <Button
                  key={size}
                  variant={selectedSize === size ? "dark" : "outline-dark"}
                  className="rounded-0 flex-grow-1 flex-sm-grow-0 fw-bold"
                  style={{ minWidth: '60px', height: '50px', fontSize: '0.9rem' }}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          <div className="d-flex gap-3 mt-3">
            <Button 
              className="btn-teal rounded-0 py-3 flex-grow-1 text-uppercase fw-bold shadow-sm" 
              style={{ letterSpacing: '2px', fontSize: '0.9rem' }}
              onClick={handleAddToCart}
              disabled={addingToCart}
            >
              {addingToCart ? 'Adding to Bag...' : `Add to Cart   $${product.price}`}
            </Button>
            <Button 
              variant="outline-dark" 
              className="rounded-0 px-4 d-flex align-items-center justify-content-center"
              title={isFavorite ? "Remove from Favorite" : "Add to Favorite"}
              onClick={handleToggleFavorite}
            >
              <FiHeart size={22} className="text-teal" fill={isFavorite ? "#008B8B" : "none"} />
            </Button>
          </div>

          <div className="mt-4 pt-3 border-top d-flex flex-column gap-2 text-muted small">
            <span className="d-flex align-items-center gap-2"><strong className="text-dark">Availability:</strong> In Stock & Ready to Ship</span>
            <span className="d-flex align-items-center gap-2"><strong className="text-dark">Delivery:</strong> Complimentary White-Glove Courier</span>
          </div>
        </Col>
      </Row>

      <Row className="mb-5 border-bottom pb-5">
        <Col lg={12}>
          <h3 className="mb-4 text-uppercase fs-4" style={{ fontFamily: 'Playfair Display', letterSpacing: '1px' }}>
            Patron Reviews
          </h3>
        </Col>
        
        <Col lg={7} className="mb-5 mb-lg-0">
          {product.reviews && product.reviews.length > 0 ? (
            <div className="d-flex flex-column gap-4">
              {product.reviews.map((review, index) => (
                <div key={index} className="border p-4 bg-light">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="mb-0 fw-bold text-uppercase" style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>
                      {review.name || review.user?.name || 'Valued Patron'}
                    </h6>
                    <div className="text-warning">
                      {[...Array(5)].map((_, i) => (
                        <FiStar key={i} fill={i < review.rating ? "#ffc107" : "none"} />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted mb-0 small" style={{ lineHeight: '1.8' }}>{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-5 bg-light border text-center text-muted">
              <p className="mb-0" style={{ fontFamily: 'Playfair Display', fontSize: '1.1rem' }}>No reviews yet for this silhouette. Be the first to share your thoughts.</p>
            </div>
          )}
        </Col>

        <Col lg={5}>
          <div className="p-4 border" style={{ backgroundColor: '#F8F9FA' }}>
            <h5 className="mb-4" style={{ fontFamily: 'Playfair Display' }}>Submit Your Review</h5>
            <Form onSubmit={handleSubmitReview}>
              <Form.Group className="mb-3">
                <Form.Label className="small text-uppercase fw-bold text-muted" style={{ letterSpacing: '1px', fontSize: '0.75rem' }}>Rating</Form.Label>
                <Form.Select 
                  value={reviewRating} 
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="rounded-0 shadow-none border-1"
                >
                  <option value={5}>5 Stars - Absolute Perfection</option>
                  <option value={4}>4 Stars - Excellent Craftsmanship</option>
                  <option value={3}>3 Stars - Good Fit</option>
                  <option value={2}>2 Stars - Fair</option>
                  <option value={1}>1 Star - Needs Improvement</option>
                </Form.Select>
              </Form.Group>
              
              <Form.Group className="mb-4">
                <Form.Label className="small text-uppercase fw-bold text-muted" style={{ letterSpacing: '1px', fontSize: '0.75rem' }}>Your Review</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={4} 
                  value={reviewText} 
                  onChange={(e) => setReviewText(e.target.value)} 
                  required 
                  className="rounded-0 shadow-none border-1" 
                  placeholder="Share your thoughts on the fit, fabric, and feel..." 
                />
              </Form.Group>
              
              <Button 
                type="submit" 
                disabled={submittingReview} 
                className="btn-dark w-100 rounded-0 py-3 text-uppercase fw-bold" 
                style={{ letterSpacing: '1px', fontSize: '0.85rem' }}
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </Button>
            </Form>
          </div>
        </Col>
      </Row>

      <div className="mt-5 pt-4">
        <h3 className="mb-4 mb-md-5 text-center text-uppercase fs-4 fs-md-3" style={{ fontFamily: 'Playfair Display', letterSpacing: '1px' }}>
          You May Also Like
        </h3>
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={16}
          slidesPerView={1.2}
          breakpoints={{
            576: { slidesPerView: 2, spaceBetween: 20 },
            768: { slidesPerView: 3, spaceBetween: 24 },
            992: { slidesPerView: 4, spaceBetween: 24 }
          }}
          autoplay={{ delay: 3500 }}
          pagination={{ clickable: true, dynamicBullets: true }}
          className="pb-5"
        >
          {relatedProducts.map(relProduct => (
            <SwiperSlide key={relProduct._id}>
              <ProductCard product={relProduct} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </Container>
  );
};

export default ProductDetails;