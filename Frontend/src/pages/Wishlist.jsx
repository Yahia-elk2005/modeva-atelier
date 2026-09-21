import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form, Modal } from "react-bootstrap";
import { FiHeart, FiShoppingBag, FiShare2, FiSliders } from "react-icons/fi";
import { Link } from "react-router-dom";
import axiosInstance from '../utils/axiosConfig';
import { toast, ToastContainer } from 'react-toastify';

const FALLBACK_IMAGE = "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22500%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23f2f2f2%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20font-family%3D%22sans-serif%22%20font-size%3D%2216%22%20fill%3D%22%23aaaaaa%22%3EProduct%20Image%3C%2Ftext%3E%3C%2Fsvg%3E";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("default");
  const [showFilterModal, setShowFilterModal] = useState(false);

  const fetchWishlist = () => {
    axiosInstance.get('/wishlist')
      .then(res => {
        setWishlistItems(res.data.data?.wishlistItems || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching wishlist", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchWishlist();
  }, []);

  const removeWishlistItem = async (productId) => {
    try {
      await axiosInstance.delete(`/wishlist/${productId}`);
      toast.success("Item removed from wishlist");
      fetchWishlist();
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const moveToCart = async (productId) => {
    try {
      await axiosInstance.post('/cart', { productId, quantity: 1, size: 'M' });
      await axiosInstance.delete(`/wishlist/${productId}`);
      toast.success("Item moved to your cart");
      fetchWishlist();
    } catch (error) {
      toast.error("Failed to move item to cart");
    }
  };

  const handleShareVault = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Private vault link copied to clipboard!");
  };

  const categories = ["all", ...new Set(wishlistItems.map(item => {
    const prod = item.product || item;
    return (prod.category || "Couture").toLowerCase();
  }))];

  const filteredItems = wishlistItems.filter(item => {
    const prod = item.product || item;
    const cat = (prod.category || "Couture").toLowerCase();
    if (selectedCategory === "all") return true;
    return cat === selectedCategory;
  }).sort((a, b) => {
    const pA = Number((a.product || a).price || 0);
    const pB = Number((b.product || b).price || 0);
    if (sortOrder === "lowToHigh") return pA - pB;
    if (sortOrder === "highToLow") return pB - pA;
    return 0;
  });

  if (loading) return <div className="text-center py-5 my-5">Loading your vault...</div>;

  return (
    <Container className="my-4 my-md-5 py-4 py-md-5">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <Modal show={showFilterModal} onHide={() => setShowFilterModal(false)} centered>
        <Modal.Header closeButton className="rounded-0 border-0 bg-light">
          <Modal.Title style={{ fontFamily: "Playfair Display" }}>Sort Vault Collection</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form.Group className="mb-3">
            <Form.Label className="small text-uppercase fw-bold text-muted" style={{ letterSpacing: '1px' }}>Sort By Price</Form.Label>
            <Form.Select 
              className="rounded-0 shadow-none"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="default">Default Order</option>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="dark" className="rounded-0 text-uppercase px-4" style={{ fontSize: '0.75rem' }} onClick={() => setShowFilterModal(false)}>
            Apply Filters
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-end mb-4">
        <div>
          <span className="text-teal small text-uppercase fw-bold" style={{ letterSpacing: "2px", fontSize: "0.75rem" }}>
            Private Vault Collection
          </span>
          <h1 className="display-6 display-md-5 fw-bold mb-1" style={{ fontFamily: "Playfair Display", color: "#1A1A1A" }}>
            Liked Pieces
          </h1>
          <p className="text-muted small mb-0">
            Hand-curated silhouettes reserved under your patron privilege.
          </p>
        </div>
        <div className="mt-3 mt-md-0 text-muted small fw-bold text-uppercase">
          ID: PTRN-8921 | {filteredItems.length} PIECES SHOWN
        </div>
      </div>

      <div className="bg-light p-2 p-md-3 mb-4 mb-md-5 d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 border shadow-sm" style={{ position: "sticky", top: "70px", zIndex: 10 }}>
        <div className="d-flex gap-2 flex-nowrap overflow-auto w-100 pb-1 pb-lg-0">
          {categories.map(cat => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "dark" : "outline-dark"}
              className="rounded-0 text-uppercase fw-bold px-3 px-md-4 py-2 text-nowrap flex-shrink-0"
              style={{ fontSize: "0.75rem", letterSpacing: "1px" }}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === "all" ? `All (${wishlistItems.length})` : cat}
            </Button>
          ))}
        </div>
        <div className="d-flex gap-2 w-100 w-lg-auto">
          <Button 
            variant="outline-dark" 
            className="rounded-0 bg-white px-3 flex-shrink-0" 
            title="Share Vault"
            onClick={handleShareVault}
          >
            <FiShare2 />
          </Button>
          <Button 
            variant="outline-dark" 
            className="rounded-0 bg-white px-3 flex-shrink-0" 
            title="Sort Options"
            onClick={() => setShowFilterModal(true)}
          >
            <FiSliders />
          </Button>
        </div>
      </div>

      <Row className="g-4">
        {filteredItems.length === 0 ? (
          <Col className="text-center py-5">
            <h4 style={{ fontFamily: "Playfair Display" }} className="mb-3">
              {wishlistItems.length === 0 ? "Your private vault is currently empty." : "No items match your filter."}
            </h4>
            <p className="text-muted small mb-4">
              Explore our catalog and add your favorite couture silhouettes to your wishlist.
            </p>
            <Link to="/catalog">
              <Button className="btn-teal rounded-0 px-4 py-3 text-uppercase fw-bold" style={{ letterSpacing: '1px', fontSize: '0.8rem' }}>
                Browse Catalog & Add Items
              </Button>
            </Link>
          </Col>
        ) : (
          filteredItems.map((item) => {
            const prod = item.product || item;
            const prodId = prod._id || item._id;
            const prodName = prod.name || item.name || "Couture Piece";
            const prodPrice = prod.price || item.price || 0;
            const prodCategory = prod.category || item.category || "Couture";
            const prodImage = prod.image || item.image || FALLBACK_IMAGE;

            return (
              <Col xs={12} sm={6} lg={4} key={prodId}>
                <div className="bg-white p-3 h-100 d-flex flex-column border" style={{ borderColor: "#E0E0E0" }}>
                  <div className="position-relative mb-3 bg-light">
                    <Link to={`/product/${prodId}`}>
                      <img src={prodImage} alt={prodName} className="w-100 rounded-0" style={{ height: "380px", objectFit: "cover" }} />
                    </Link>
                    <Button
                      variant="light"
                      className="position-absolute top-0 end-0 m-3 rounded-0 border-0 p-2 shadow-sm d-flex align-items-center justify-content-center"
                      onClick={() => removeWishlistItem(prodId)}
                    >
                      <FiHeart fill="#008B8B" className="text-teal" size={20} />
                    </Button>
                  </div>
                  
                  <span className="text-muted text-uppercase fw-bold mb-2" style={{ fontSize: "0.65rem", letterSpacing: "1px" }}>
                    {prodCategory}
                  </span>
                  
                  <Link to={`/product/${prodId}`} className="text-decoration-none">
                    <h4 className="mb-2 text-dark" style={{ fontFamily: "Playfair Display", fontSize: "1.25rem" }}>
                      {prodName}
                    </h4>
                  </Link>
                  <p className="fw-bold mb-3">${prodPrice}</p>
                  <div className="mt-auto pt-3 border-top">
                    <Button
                      onClick={() => moveToCart(prodId)}
                      className="btn-teal w-100 rounded-0 py-3 text-uppercase fw-bold d-flex align-items-center justify-content-center gap-2"
                      style={{ letterSpacing: "1px", fontSize: "0.8rem" }}
                    >
                      <FiShoppingBag /> Move To Bag
                    </Button>
                  </div>
                </div>
              </Col>
            );
          })
        )}
      </Row>
    </Container>
  );
};

export default Wishlist;