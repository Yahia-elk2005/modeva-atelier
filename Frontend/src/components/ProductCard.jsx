import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const FALLBACK_IMAGE = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22380%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23f2f2f2%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20font-family%3D%22sans-serif%22%20font-size%3D%2214%22%20fill%3D%22%23aaaaaa%22%3ENo%20Image%20Available%3C%2Ftext%3E%3C%2Fsvg%3E';

const ProductCard = ({ product }) => {
  const productId = product?._id || product?.id;

  return (
    <Card className="border-0 h-100 bg-transparent rounded-0 d-flex flex-column">
      <Link to={`/product/${productId}`} className="text-decoration-none">
        <div className="position-relative overflow-hidden" style={{ height: '360px' }}>
          <Card.Img
            variant="top"
            src={product?.image || FALLBACK_IMAGE}
            onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE; }}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            className="rounded-0"
          />
          {product?.onSale && (
            <span className="position-absolute bg-danger text-white px-2 py-1 small fw-bold" style={{ top: '10px', left: '10px', fontSize: '0.7rem' }}>
              SALE
            </span>
          )}
          <div className="rating-badge d-flex align-items-center gap-1">
            <span>★</span> {product?.rating || '4.95'}
          </div>
        </div>
      </Link>

      <Card.Body className="p-0 pt-3 d-flex flex-column flex-grow-1">
        <p className="text-muted small mb-1 text-uppercase" style={{ letterSpacing: '1px', fontSize: '0.65rem' }}>
          {product?.category || 'PRODUCT CATEGORY'}
        </p>

        <Link to={`/product/${productId}`} className="text-decoration-none">
          <h5 
            className="mb-2 text-dark" 
            style={{ 
              fontFamily: 'Playfair Display', 
              fontSize: '1.2rem', 
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '2.8em',
              lineHeight: '1.4'
            }}
          >
            {product?.name || 'Product Name'}
          </h5>
        </Link>

        <div className="mb-3">
          {product?.originalPrice ? (
            <div>
              <span className="text-decoration-line-through text-muted me-2 small">${product.originalPrice}</span>
              <span className="text-danger fw-bold">${product.price}</span>
            </div>
          ) : (
            <span className="text-secondary small fw-bold">${product?.price || '300'}</span>
          )}
        </div>

        <div className="mt-auto">
          <Link
            to={`/product/${productId}`}
            className="btn btn-teal rounded-0 text-white text-decoration-none text-center d-inline-block"
            style={{ fontSize: '0.75rem', letterSpacing: '1px', textTransform: 'uppercase', padding: '8px 20px', width: 'auto' }}
          >
            SHOP NOW
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;