import React, { useState, useEffect } from 'react';
import { Container, Navbar, Nav, Form, InputGroup } from 'react-bootstrap';
import { FiSearch, FiUser, FiShoppingBag, FiHeart, FiX } from 'react-icons/fi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import logo from '../assets/Modeva.png';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const [showBanner, setShowBanner] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [wishlistCount, setWishlistCount] = useState(0);
  const [userRole, setUserRole] = useState(localStorage.getItem('role') || '');
  const token = localStorage.getItem('token');

  const fetchUserDataAndWishlist = () => {
    const currentToken = localStorage.getItem('token');
    const currentRole = localStorage.getItem('role');
    setUserRole(currentRole || '');
    if (currentToken) {
      axiosInstance.get('/wishlist')
        .then(res => {
          const items = res.data.data?.wishlistItems || [];
          setWishlistCount(items.length);
        })
        .catch(err => console.error("Error fetching wishlist count:", err));

      axiosInstance.get('/users/me')
        .then(res => {
          const uData = res.data.data || res.data;
          if (uData?.role) {
            setUserRole(uData.role);
            localStorage.setItem('role', uData.role);
          }
        })
        .catch(err => console.error("Error fetching profile role:", err));
    } else {
      setWishlistCount(0);
      setUserRole('');
    }
  };

  useEffect(() => {
    fetchUserDataAndWishlist();
    window.addEventListener('wishlistUpdated', fetchUserDataAndWishlist);
    window.addEventListener('authUpdated', fetchUserDataAndWishlist);
    return () => {
      window.removeEventListener('wishlistUpdated', fetchUserDataAndWishlist);
      window.removeEventListener('authUpdated', fetchUserDataAndWishlist);
    };
  }, []); // تم ترك مصفوفة الاعتبارات فارغة لضمان عدم تكرار الطلبات بلا حدود

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchKeyword.trim())}`);
    }
  };

  return (
    <header className={isHome ? "position-absolute w-100 top-0" : "w-100"} style={{ zIndex: 1000 }}>
      {showBanner && (
        <div className="top-banner d-flex justify-content-center align-items-center position-relative py-2 px-3" style={{ backgroundColor: '#009999' }}>
          <span className="small text-center pe-4 text-white">
            Discount 20% For New Member, <strong className="fw-bold text-nowrap">ONLY FOR TODAY!!</strong>
          </span>
          <FiX 
            className="position-absolute cursor-pointer text-white" 
            style={{ right: '15px', top: '50%', transform: 'translateY(-50%)', fontSize: '1.2rem' }} 
            onClick={() => setShowBanner(false)} 
          />
        </div>
      )}
      <Navbar expand="lg" className="py-3" style={{ backgroundColor: isHome ? 'transparent' : '#3fafaf' }}>
        <Container className="px-lg-5">
          <Link to="/" className="navbar-brand me-4">
            <img 
              src={logo} 
              alt="MODEVA" 
              className="brand-logo"
              style={{ 
                height: '28px', 
                objectFit: 'contain', 
                filter: isHome ? 'none' : 'brightness(0) invert(1)' 
              }} 
            />
          </Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-white text-white" />
          
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto align-items-center gap-4 w-100">
              <Link to="/catalog" className="nav-link text-white d-flex align-items-center gap-1" style={{ fontSize: '0.9rem' }}>Catalog</Link>
              <Link to="/sale" className="nav-link text-white" style={{ fontSize: '0.9rem' }}>Sale</Link>
              <Link to="/new" className="nav-link text-white" style={{ fontSize: '0.9rem' }}>New Arrival</Link>
              <Link to="/about" className="nav-link text-white" style={{ fontSize: '0.9rem' }}>About</Link>
              
              {token && userRole === 'admin' && (
                <Link to="/admin" className="nav-link text-white fw-bold" style={{ fontSize: '0.9rem' }}>Admin</Link>
              )}
              
              {token && (
                <Link to="/dashboard" className="nav-link text-white fw-bold" style={{ fontSize: '0.9rem' }}>User</Link>
              )}
              <div className="d-flex align-items-center gap-3 ms-lg-auto mt-3 mt-lg-0">
                <Form onSubmit={handleSearchSubmit}>
                  <InputGroup style={{ width: '170px', height: '32px' }}>
                    <InputGroup.Text className="bg-white border-0 rounded-0 px-2 text-muted" style={{ cursor: 'pointer' }} onClick={handleSearchSubmit}>
                      <FiSearch size={15} />
                    </InputGroup.Text>
                    <Form.Control 
                      placeholder="Search" 
                      className="border-0 shadow-none rounded-0"
                      style={{ fontSize: '0.85rem' }}
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                    />
                  </InputGroup>
                </Form>
                
                {!token && (
                  <Link to="/auth" className="text-white text-decoration-none">
                    <FiUser size={20} className="cursor-pointer ms-2" />
                  </Link>
                )}
                <Link to="/wishlist" className="text-white text-decoration-none position-relative me-2">
                  <FiHeart size={20} className="cursor-pointer" />
                  {wishlistCount > 0 && (
                    <span className="position-absolute bg-white text-teal rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '15px', height: '15px', fontSize: '9px', top: '-5px', right: '-8px' }}>
                      {wishlistCount}
                    </span>
                  )}
                </Link>
                <Link to="/cart" className="text-white text-decoration-none">
                  <FiShoppingBag size={20} className="cursor-pointer" />
                </Link>
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Navigation;