import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiX } from 'react-icons/fi';
import axiosInstance from '../utils/axiosConfig';
import ProductCard from '../components/ProductCard';

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const initialSearchParam = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [sortOrder, setSortOrder] = useState('Featured');
  const [liveSearch, setLiveSearch] = useState(initialSearchParam);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (categoryParam) {
      setSelectedCategories([categoryParam.toLowerCase()]);
    }
    
    axiosInstance.get('/products')
      .then(res => {
        const fetchedData = res.data.data || res.data.products || res.data;
        setProducts(Array.isArray(fetchedData) ? fetchedData : []);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
      });
  }, [categoryParam]);

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setMaxPrice(5000);
    setSortOrder('Featured');
    setLiveSearch('');
    setSearchParams({});
  };

  const filteredProducts = products.filter(product => {
    const matchCategory = selectedCategories.length === 0 || selectedCategories.some(cat => {
      if (!product.category) return false;
      const prodCat = product.category.toLowerCase();
      
      if (cat === 'casual') {
        return prodCat.includes('casual');
      }
      if (cat === 'casual men') {
        return prodCat.includes('casual men') || (prodCat.includes('casual') && prodCat.includes('men'));
      }
      if (cat === 'casual woman') {
        return prodCat.includes('casual woman') || prodCat.includes('casual women') || (prodCat.includes('casual') && (prodCat.includes('woman') || prodCat.includes('women')));
      }
      if (cat === 'woman' || cat === 'women') {
        return (prodCat.includes('woman') || prodCat.includes('women')) && !prodCat.includes('casual');
      }
      if (cat === 'men') {
        return prodCat.includes('men') && !prodCat.includes('casual');
      }
      return prodCat.includes(cat);
    });

    const price = product.discountPrice ? Number(product.discountPrice) : Number(product.price);
    const matchPrice = price <= maxPrice;

    const matchSearch = product.name.toLowerCase().includes(liveSearch.toLowerCase()) || 
                        (product.category && product.category.toLowerCase().includes(liveSearch.toLowerCase()));

    return matchCategory && matchPrice && matchSearch;
  }).sort((a, b) => {
    const priceA = a.discountPrice ? Number(a.discountPrice) : Number(a.price);
    const priceB = b.discountPrice ? Number(b.discountPrice) : Number(b.price);

    if (sortOrder === 'Price: Low to High') return priceA - priceB;
    if (sortOrder === 'Price: High to Low') return priceB - priceA;
    if (sortOrder === 'Highest Rated') return Number(b.rating) - Number(a.rating);
    return 0;
  });

  return (
    <Container className="my-4 my-md-5 py-4 py-md-5">
      <Row className="mb-4 mb-md-5">
        <Col>
          <h1 className="display-5 display-md-4 text-uppercase mb-3" style={{ fontFamily: 'Playfair Display', color: '#1A1A1A' }}>
            The Catalog
          </h1>
          <div style={{ backgroundColor: '#008B8B', width: '60px', height: '3px' }}></div>
        </Col>
      </Row>
      
      <Row className="g-4 g-lg-5">
        <Col lg={3}>
          <div className="p-3 p-md-4 sticky-lg-top" style={{ border: '16px solid #F2F2F2', top: '20px', zIndex: 1 }}>
            <h4 className="mb-4" style={{ fontFamily: 'Playfair Display', color: '#1A1A1A' }}>Refine By</h4>
            
            <Row className="g-4">
              <Col xs={12}>
                <h6 className="text-uppercase text-muted mb-3" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Search Collection</h6>
                <InputGroup>
                  <InputGroup.Text className="bg-white border-end-0 rounded-0 text-muted">
                    <FiSearch size={16} />
                  </InputGroup.Text>
                  <Form.Control 
                    type="text" 
                    placeholder="Find a silhouette..." 
                    className="border-start-0 rounded-0 shadow-none px-0"
                    value={liveSearch}
                    onChange={(e) => setLiveSearch(e.target.value)}
                    style={{ fontSize: '0.85rem' }}
                  />
                  {liveSearch && (
                    <InputGroup.Text className="bg-white border-start-0 rounded-0 text-muted" style={{ cursor: 'pointer' }} onClick={() => setLiveSearch('')}>
                      <FiX size={16} />
                    </InputGroup.Text>
                  )}
                </InputGroup>
              </Col>

              <Col xs={12}>
                <h6 className="text-uppercase text-muted mb-3" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Category</h6>
                <Form.Check type="checkbox" label="Woman" className="mb-2 rounded-0 small" checked={selectedCategories.includes('woman')} onChange={() => handleCategoryChange('woman')} />
                <Form.Check type="checkbox" label="Men" className="mb-2 rounded-0 small" checked={selectedCategories.includes('men')} onChange={() => handleCategoryChange('men')} />
                <Form.Check type="checkbox" label="Casual" className="mb-2 rounded-0 small" checked={selectedCategories.includes('casual')} onChange={() => handleCategoryChange('casual')} />
                <Form.Check type="checkbox" label="Casual Men" className="mb-2 rounded-0 small" checked={selectedCategories.includes('casual men')} onChange={() => handleCategoryChange('casual men')} />
                <Form.Check type="checkbox" label="Casual Woman" className="mb-2 rounded-0 small" checked={selectedCategories.includes('casual woman')} onChange={() => handleCategoryChange('casual woman')} />
              </Col>
              
              <Col xs={12} className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="text-uppercase text-muted m-0" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Max Price</h6>
                  <span className="fw-bold text-teal" style={{ fontSize: '0.85rem' }}>${maxPrice}</span>
                </div>
                <Form.Range 
                  min={50} 
                  max={5000} 
                  step={50} 
                  value={maxPrice} 
                  onChange={(e) => setMaxPrice(Number(e.target.value))} 
                />
              </Col>
            </Row>

            <Button variant="dark" className="w-100 rounded-0 text-uppercase fw-bold mt-4" style={{ fontSize: '0.75rem', letterSpacing: '1px', padding: '12px' }} onClick={clearFilters}>
              Reset Filters
            </Button>
          </div>
        </Col>

        <Col lg={9}>
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4 pb-3 border-bottom gap-3">
            <span className="text-muted small text-uppercase fw-bold" style={{ letterSpacing: '1px', fontSize: '0.70rem' }}>
              Displaying {filteredProducts.length} Silhouettes
            </span>
            <Form.Select className="w-100 w-sm-auto rounded-0 shadow-none border-1" style={{ fontSize: '0.80rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }} value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="Featured">Sort by: Featured</option>
              <option value="Price: Low to High">Price: Low to High</option>
              <option value="Price: High to Low">Price: High to Low</option>
              <option value="Highest Rated">Highest Rated</option>
            </Form.Select>
          </div>

          {loading ? (
            <div className="text-center py-5 my-5 text-muted" style={{ fontFamily: 'Playfair Display', fontSize: '1.2rem' }}>Curating pieces...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-5 my-5 text-muted" style={{ fontFamily: 'Playfair Display', fontSize: '1.2rem' }}>No pieces found matching your criteria.</div>
          ) : (
            <Row className="g-4">
              {filteredProducts.map(product => {
                const displayProduct = {
                  ...product,
                  price: product.discountPrice ? product.discountPrice : product.price,
                  originalPrice: product.discountPrice ? product.price : null
                };
                return (
                  <Col xs={12} sm={6} lg={4} key={product._id}>
                    <ProductCard product={displayProduct} />
                  </Col>
                );
              })}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Catalog;