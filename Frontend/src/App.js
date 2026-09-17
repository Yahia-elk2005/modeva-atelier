import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import Admin from './pages/Admin';
import ProductDetails from './pages/ProductDetails';
import Catalog from './pages/Catalog'; 
import Cart from './pages/Cart';
import About from './pages/About';
import Auth from './pages/Auth';
import ClientDashboard from './pages/ClientDashboard';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import Sale from './pages/Sale';
import NewArrival from './pages/NewArrival';
import SupportPage from './pages/SupportPage';
import Vouchers from './pages/Vouchers'; 
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import NotFound from './pages/NotFound';

function App() {
  return (
    <div className="container-fluid p-0 d-flex flex-column min-vh-100">
      <Router>
        <Navigation /> 

        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/catalog" element={<Catalog />} /> 
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/about" element={<About />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/dashboard" element={<ClientDashboard />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/sale" element={<Sale />} />
            <Route path="/new" element={<NewArrival />} />
            <Route path="/support/:type" element={<SupportPage />} />
            <Route path="/vouchers" element={<Vouchers />} /> 
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </Router>
    </div>
  );
}

export default App;