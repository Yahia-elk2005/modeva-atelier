import React, { useState, useEffect } from 'react';
import { Container, Table, Form, Button, Row, Col, Badge, Tabs, Tab } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import axiosInstance from '../utils/axiosConfig';

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    category: '', 
    price: '', 
    rating: '', 
    image: '', 
    quantity: 10, 
    description: '',
    onSale: false,
    discountPrice: '',
    isNewArrival: false
  });

  const [voucherForm, setVoucherForm] = useState({
    code: '',
    title: '',
    discountValue: '',
    description: '',
    minOrder: '',
    expiryDate: '',
    category: 'Active Privileges'
  });

  const fetchData = async () => {
    try {
      const prodRes = await axiosInstance.get('/products');
      setProducts(prodRes.data.data || []);
             
      const ordRes = await axiosInstance.get('/orders');
      setOrders(ordRes.data.data || []);

      const voucherRes = await axiosInstance.get('/api/vouchers');
      setVouchers(voucherRes.data.data || []);
    } catch (err) {
      toast.error('Failed to fetch data. Ensure you have admin privileges.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const maxWidth = 300;
      const scaleFactor = maxWidth / img.width;
      canvas.width = maxWidth;
      canvas.height = img.height * scaleFactor;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const compressedBase64 = canvas.toDataURL('image/jpeg', 0.5);
      setFormData(prev => ({ ...prev, image: compressedBase64 }));
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        discountPrice: formData.onSale && formData.discountPrice ? Number(formData.discountPrice) : undefined
      };

      if (editId) {
        await axiosInstance.put(`/products/${editId}`, payload);
        toast.success('Product updated successfully!');
      } else {
        await axiosInstance.post('/products', payload);
        toast.success('Product added successfully!');
      }
      resetForm();
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleCreateVoucher = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/api/vouchers', {
        ...voucherForm,
        minOrder: Number(voucherForm.minOrder) || 0
      });
      toast.success('Voucher created successfully!');
      setVoucherForm({
        code: '',
        title: '',
        discountValue: '',
        description: '',
        minOrder: '',
        expiryDate: '',
        category: 'Active Privileges'
      });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create voucher.');
    }
  };

  const handleDeleteVoucher = async (id) => {
    if (window.confirm('Are you sure you want to delete this voucher?')) {
      try {
        await axiosInstance.delete(`/api/vouchers/${id}`);
        toast.success('Voucher deleted successfully!');
        fetchData();
      } catch (err) {
        toast.error('Failed to delete voucher.');
      }
    }
  };

  const handleEdit = (product) => {
    setEditId(product._id);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      rating: product.rating,
      image: product.image,
      quantity: product.quantity || 10,
      description: product.description || '',
      onSale: product.onSale || false,
      discountPrice: product.discountPrice || '',
      isNewArrival: product.isNewArrival || false
    });
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axiosInstance.delete(`/products/${id}`);
        toast.success('Product deleted!');
        fetchData();
      } catch (err) {
        toast.error('Failed to delete product');
      }
    }
  };

  const resetForm = () => {
    setEditId(null);
    setFormData({ 
      name: '', 
      category: '', 
      price: '', 
      rating: '', 
      image: '', 
      quantity: 10, 
      description: '',
      onSale: false,
      discountPrice: '',
      isNewArrival: false
    });
  };

  const handleDeleteOrder = async (id) => {
    if (window.confirm('Are you sure you want to delete/cancel this order?')) {
      try {
        await axiosInstance.delete(`/orders/${id}`);
        toast.success('Order removed successfully!');
        fetchData();
      } catch (err) {
        toast.error('Failed to delete order');
      }
    }
  };

  const handleUpdateOrderStatus = async (id, newStatus) => {
    try {
      if(newStatus === 'Dispatched') {
         await axiosInstance.patch(`/orders/${id}`);
      }
      toast.success(`Order status updated to ${newStatus}!`);
      fetchData();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <Container className="my-5">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Admin Dashboard</h2>
        <a href="/" className="btn btn-outline-secondary">Go to Website</a>
      </div>
      <Tabs defaultActiveKey="products" className="mb-4">
        <Tab eventKey="products" title="Manage Products">
          <Form onSubmit={handleSubmit} className="mb-5 bg-light p-4 rounded shadow-sm">
            <h5 className="mb-3">{editId ? 'Edit Product' : 'Add New Product'}</h5>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Control type="text" placeholder="Product Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              </Col>
              
              <Col md={6} className="mb-3">
                <Form.Select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required>
                  <option value="">Select Category</option>
                  <option value="Woman">Woman</option>
                  <option value="Men">Men</option>
                  <option value="Casual">Casual</option>
                  <option value="Casual Men">Casual Men</option>
                  <option value="Casual Woman">Casual Woman</option>
                </Form.Select>
              </Col>

              <Col md={3} className="mb-3">
                <Form.Control type="number" placeholder="Original Price" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
              </Col>
              <Col md={3} className="mb-3">
                <Form.Control type="number" placeholder="Quantity" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} required />
              </Col>
              <Col md={3} className="mb-3">
                <Form.Control type="number" step="0.01" placeholder="Rating (e.g. 4.95)" value={formData.rating} onChange={(e) => setFormData({...formData, rating: e.target.value})} required />
              </Col>
              <Col md={3} className="mb-3">
                <Form.Control type="file" accept="image/*" onChange={handleImageUpload} required={!editId} />
              </Col>

              <Col md={6} className="mb-3">
                <Form.Check 
                  type="checkbox" 
                  label="Display in Archival Sale" 
                  checked={formData.onSale}
                  onChange={(e) => setFormData({...formData, onSale: e.target.checked})}
                  className="fw-bold text-teal"
                />
              </Col>

              <Col md={6} className="mb-3">
                <Form.Check 
                  type="checkbox" 
                  label="Feature in New Arrivals" 
                  checked={formData.isNewArrival}
                  onChange={(e) => setFormData({...formData, isNewArrival: e.target.checked})}
                  className="fw-bold text-teal"
                />
              </Col>

              {formData.onSale && (
                <Col md={6} className="mb-3">
                  <Form.Control 
                    type="number" 
                    placeholder="Sale / Discount Price" 
                    value={formData.discountPrice} 
                    onChange={(e) => setFormData({...formData, discountPrice: e.target.value})} 
                    required={formData.onSale} 
                  />
                </Col>
              )}
            </Row>

            <div className="d-flex gap-2">
              <Button className="btn-teal" type="submit">{editId ? 'Update Product' : 'Add Product'}</Button>
              {editId && <Button variant="secondary" onClick={resetForm}>Cancel Edit</Button>}
            </div>
          </Form>

          <Table responsive striped bordered hover align="middle">
            <thead>
              <tr>
                <th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Badges</th><th>Stock</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id}>
                  <td><img src={product.image} alt={product.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} /></td>
                  <td>{product.name}</td>
                  <td><Badge bg="secondary">{product.category}</Badge></td>
                  <td>
                    {product.onSale ? (
                      <div>
                        <span className="text-decoration-line-through text-muted me-2">${product.price}</span>
                        <span className="text-danger fw-bold">${product.discountPrice}</span>
                      </div>
                    ) : (
                      `$${product.price}`
                    )}
                  </td>
                  <td>
                    {product.onSale && <Badge bg="danger" className="me-1">Sale</Badge>}
                    {product.isNewArrival && <Badge bg="success">New Arrival</Badge>}
                    {!product.onSale && !product.isNewArrival && <span className="text-muted small">Normal</span>}
                  </td>
                  <td>{product.quantity}</td>
                  <td className="text-nowrap">
                    <Button variant="warning" size="sm" className="me-2 text-white" onClick={() => handleEdit(product)}>Edit</Button>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteProduct(product._id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>

        <Tab eventKey="orders" title={`Manage Orders (${orders.length})`}>
          <Table responsive striped bordered hover align="middle" className="bg-white">
            <thead>
              <tr>
                <th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-4">No orders found.</td></tr>
              ) : (
                orders.map(order => (
                  <tr key={order._id}>
                    <td>#{order._id.substring(18).toUpperCase()}</td>
                    <td>{order.user?.name || 'Guest'} <br/><small className="text-muted">{order.user?.email}</small></td>
                    <td>
                      {order.items && order.items.map((it, idx) => (
                        <div key={idx} className="small"> {it.product?.name || it.name} (Qty: {it.quantity})</div>
                      ))}
                    </td>
                    <td className="fw-bold text-teal">{order.total}</td>
                    <td>
                      <Badge bg={order.status === 'Cancelled' ? 'secondary' : order.status === 'Dispatched' ? 'success' : 'info'}>
                        {order.status || 'In Progress'}
                      </Badge>
                      {order.alterationRequested && <Badge bg="warning" className="ms-1 text-dark">Alteration</Badge>}
                    </td>
                    <td className="text-nowrap">
                      <Button variant="success" size="sm" className="me-2" disabled={order.status === 'Dispatched'} onClick={() => handleUpdateOrderStatus(order._id, 'Dispatched')}>Dispatch</Button>
                      <Button variant="danger" size="sm" onClick={() => handleDeleteOrder(order._id)}>Cancel/Delete</Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Tab>

        <Tab eventKey="vouchers" title={`Manage Vouchers (${vouchers.length})`}>
          <Form onSubmit={handleCreateVoucher} className="mb-5 bg-light p-4 rounded shadow-sm">
            <h5 className="mb-3">Create New Voucher / Pass</h5>
            <Row>
              <Col md={4} className="mb-3">
                <Form.Control type="text" placeholder="Pass Code (e.g. ATELIER25)" value={voucherForm.code} onChange={(e) => setVoucherForm({...voucherForm, code: e.target.value.toUpperCase()})} required />
              </Col>
              <Col md={4} className="mb-3">
                <Form.Control type="text" placeholder="Title (e.g. Senopati Courtesy)" value={voucherForm.title} onChange={(e) => setVoucherForm({...voucherForm, title: e.target.value})} required />
              </Col>
              <Col md={4} className="mb-3">
                <Form.Control type="text" placeholder="Discount Value (e.g. 25% OFF)" value={voucherForm.discountValue} onChange={(e) => setVoucherForm({...voucherForm, discountValue: e.target.value})} required />
              </Col>
              <Col md={12} className="mb-3">
                <Form.Control as="textarea" rows={2} placeholder="Description details..." value={voucherForm.description} onChange={(e) => setVoucherForm({...voucherForm, description: e.target.value})} required />
              </Col>
              <Col md={4} className="mb-3">
                <Form.Control type="number" placeholder="Min Order ($)" value={voucherForm.minOrder} onChange={(e) => setVoucherForm({...voucherForm, minOrder: e.target.value})} />
              </Col>
              <Col md={4} className="mb-3">
                <Form.Control type="text" placeholder="Expiry Date (e.g. May 15, 2026)" value={voucherForm.expiryDate} onChange={(e) => setVoucherForm({...voucherForm, expiryDate: e.target.value})} required />
              </Col>
              <Col md={4} className="mb-3">
                <Form.Select value={voucherForm.category} onChange={(e) => setVoucherForm({...voucherForm, category: e.target.value})}>
                  <option value="Active Privileges">Active Privileges</option>
                  <option value="Salon Master Pass">Salon Master Pass</option>
                  <option value="Concierge Fitting">Concierge Fitting</option>
                </Form.Select>
              </Col>
            </Row>
            <Button className="btn-teal" type="submit">Create Voucher Pass</Button>
          </Form>

          <Table responsive striped bordered hover align="middle" className="bg-white">
            <thead>
              <tr>
                <th>Code</th><th>Title</th><th>Value</th><th>Min Order</th><th>Expiry</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vouchers.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-4">No vouchers found.</td></tr>
              ) : (
                vouchers.map(v => (
                  <tr key={v._id}>
                    <td><Badge bg="dark" className="font-monospace">{v.code}</Badge></td>
                    <td>{v.title}</td>
                    <td className="fw-bold text-teal">{v.discountValue}</td>
                    <td>${v.minOrder}</td>
                    <td>{v.expiryDate}</td>
                    <td>
                      <Button variant="danger" size="sm" onClick={() => handleDeleteVoucher(v._id)}>Delete</Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default Admin;