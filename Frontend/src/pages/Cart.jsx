import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FiX, FiMinus, FiPlus } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import { toast } from 'react-toastify';

const FALLBACK_IMAGE = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22400%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23f2f2f2%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20font-family%3D%22sans-serif%22%20font-size%3D%2214%22%20fill%3D%22%23aaaaaa%22%3EProduct%20Image%3C%2Ftext%3E%3C%2Fsvg%3E';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userMembership, setUserMembership] = useState('Standard');

  const fetchCartAndUser = async () => {
    try {
      const [cartRes, userRes] = await Promise.all([
        axiosInstance.get('/cart'),
        axiosInstance.get('/users/me')
      ]);
      setCartItems(cartRes.data.data?.cartItems || []);
      const userData = userRes.data.data;
      if (userData?.membership) {
        setUserMembership(userData.membership);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCartAndUser();
  }, []);

  const updateQuantity = async (productId, currentQuantity, change, size) => {
    if (currentQuantity === 1 && change === -1) {
      return removeItem(productId);
    }
    try {
      await axiosInstance.post('/cart', { productId, quantity: change, size: size || 'M' });
      fetchCartAndUser();
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const removeItem = async (productId) => {
    try {
      await axiosInstance.delete(`/cart/${productId}`);
      toast.success('Item removed from cart');
      fetchCartAndUser();
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const calculatedSubtotal = cartItems.reduce((acc, item) => {
    const itemPrice = Number(item.price || item.product?.price || 0);
    const itemQty = Number(item.quantity || 1);
    return acc + (itemPrice * itemQty);
  }, 0);

  let membershipDiscount = 0;
  if (userMembership === 'Salon Prime') {
    membershipDiscount = calculatedSubtotal * 0.15;
  } else if (userMembership === 'VIP Gold') {
    membershipDiscount = calculatedSubtotal * 0.25;
  }

  const shipping = (cartItems.length > 0 && userMembership === 'Standard') ? 25 : 0;
  const total = Math.max(0, (calculatedSubtotal - membershipDiscount) + shipping);

  if (loading) return <div className="text-center py-5 my-5">Loading cart...</div>;

  return (
    <Container className="my-5 py-4 py-md-5">
      <Row className="mb-4 mb-md-5">
        <Col>
          <h1 className="display-5 display-md-4 text-uppercase mb-3" style={{ fontFamily: 'Playfair Display', color: '#1A1A1A' }}>
            Shopping Cart
          </h1>
          <div style={{ backgroundColor: '#008B8B', width: '60px', height: '3px' }}></div>
        </Col>
      </Row>

      <Row className="g-4 g-lg-5">
        <Col lg={8}>
          {cartItems.length === 0 ? (
            <div className="text-center py-5">
              <h4 style={{ fontFamily: 'Playfair Display' }}>Your cart is currently empty.</h4>
              <Link to="/catalog">
                <Button className="btn-teal rounded-0 mt-4 px-4 px-md-5 py-3 text-uppercase fw-bold w-100 w-md-auto" style={{ letterSpacing: '1px' }}>
                  Return to Shop
                </Button>
              </Link>
            </div>
          ) : (
            cartItems.map((item, index) => {
              const prodId = item.product?._id || item.product;
              const itemPrice = Number(item.price || item.product?.price || 0);
              const itemTotal = itemPrice * item.quantity;
              const itemSize = item.size || 'M';
              return (
                <div key={item._id || prodId + itemSize + index} className="d-flex flex-column flex-md-row align-items-start align-items-md-center py-4 border-bottom position-relative gap-3">
                  <div className="d-flex gap-3 flex-grow-1 w-100">
                    <img
                      src={item.product?.image || FALLBACK_IMAGE}
                      alt={item.product?.name}
                      style={{ width: '90px', height: '110px', objectFit: 'cover' }}
                      className="rounded-0 flex-shrink-0 bg-light"
                    />
                    <div className="flex-grow-1">
                      <p className="text-muted small mb-1 text-uppercase" style={{ letterSpacing: '1px', fontSize: '0.65rem' }}>
                        {item.product?.category || 'Couture'}
                      </p>
                      <h5 className="mb-2" style={{ fontFamily: 'Playfair Display', color: '#1A1A1A', fontSize: '1.1rem' }}>
                        {item.product?.name || item.name}
                      </h5>
                      <p className="text-muted small mb-1">
                        Size: <strong className="text-dark text-uppercase">{itemSize}</strong>
                      </p>
                      <p className="mb-0 fw-bold">${itemPrice} <span className="text-muted small fw-normal">(Item Total: ${itemTotal})</span></p>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center w-100 w-md-auto mt-2 mt-md-0">
                    <div className="d-flex align-items-center border flex-shrink-0">
                      <Button variant="light" className="rounded-0 border-0 bg-transparent px-3 py-2" onClick={() => updateQuantity(prodId, item.quantity, -1, itemSize)}>
                        <FiMinus />
                      </Button>
                      <span className="px-3 fw-bold" style={{ minWidth: '40px', textAlign: 'center' }}>{item.quantity}</span>
                      <Button variant="light" className="rounded-0 border-0 bg-transparent px-3 py-2" onClick={() => updateQuantity(prodId, item.quantity, 1, itemSize)}>
                        <FiPlus />
                      </Button>
                    </div>
                    <button
                      className="btn text-muted border-0 bg-transparent p-2 ms-md-4 flex-shrink-0"
                      onClick={() => removeItem(prodId)}
                      title="Remove Item"
                    >
                      <FiX size={24} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </Col>

        <Col lg={4}>
          <div className="bg-white p-3 p-md-4" style={{ border: '16px solid #F2F2F2' }}>
            <h4 className="mb-4 text-uppercase fw-bold" style={{ fontFamily: 'Playfair Display', color: '#1A1A1A', fontSize: '1.2rem' }}>
              Order Summary
            </h4>
            <div className="d-flex justify-content-between mb-3 text-muted">
              <span>Subtotal</span>
              <span>${calculatedSubtotal}</span>
            </div>

            {membershipDiscount > 0 && (
              <div className="d-flex justify-content-between mb-3 text-success">
                <span>{userMembership} Discount</span>
                <span>-${membershipDiscount.toFixed(2)}</span>
              </div>
            )}

            <div className="d-flex justify-content-between mb-4 pb-4 border-bottom text-muted">
              <span>Estimated Shipping</span>
              <span>{shipping === 0 ? <strong className="text-success">FREE</strong> : `$${shipping}`}</span>
            </div>
            
            <div className="d-flex justify-content-between mb-4">
              <span className="text-uppercase fw-bold" style={{ letterSpacing: '1px' }}>Total</span>
              <span className="fw-bold fs-5" style={{ color: '#008B8B' }}>${total.toFixed(2)}</span>
            </div>

            <Link to="/checkout" className="text-decoration-none w-100 d-block">
              <Button
                className="btn-teal rounded-0 w-100 py-3 text-uppercase fw-bold"
                style={{ letterSpacing: '1px' }}
                disabled={cartItems.length === 0}
              >
                Proceed to Checkout
              </Button>
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;