import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPanel.css'

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    price: '',
    category: '',
  });
  const [image, setImage] = useState(null);

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:4000/products');
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  // Handle input change for the form
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle image file change
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Add or Edit Product
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('category', formData.category);
  
    // Only append image if a new one is selected
    if (image) data.append('image', image);
  
    try {
      if (isEditing) {
        await axios.put(`http://localhost:4000/products/edit/${formData.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('Product updated successfully!');
      } else {
        await axios.post('http://localhost:4000/products/add', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('Product added successfully!');
      }
  
      // Clear form and refresh products
      setFormData({ id: '', title: '', description: '', price: '', category: '' });
      setImage(null);
      setIsEditing(false);
  
      const res = await axios.get('http://localhost:4000/products');
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to save product.');
    }
  };  

  // Handle edit button click
  const handleEditClick = (product) => {
    setIsEditing(true);
    setFormData({
      id: product._id,
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.category,
    });
  };

  // Handle delete product
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/products/delete/${id}`);
      setProducts(products.filter((product) => product._id !== id));
      alert('Product deleted successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to delete product.');
    }
  };

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>

      {/* Add/Edit Product Form */}
      <form className="product-form" onSubmit={handleSubmit}>
        <h3>{isEditing ? 'Edit Product' : 'Add Product'}</h3>
        <input
          type="text"
          name="title"
          placeholder="Product Title"
          value={formData.title}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="description"
          placeholder="Product Description"
          value={formData.description}
          onChange={handleInputChange}
          required
        ></textarea>
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleInputChange}
          required
        />
        <input type="file" onChange={handleImageChange} />
        <button type="submit">{isEditing ? 'Update Product' : 'Add Product'}</button>
      </form>

      {/* Display Products */}
      <div className="product-list">
        {products.map((product) => (
          <div className="product-item" key={product._id}>
            <img src={product.imageUrl} alt={product.title} style={{ height: '100px', width: '70px' }} />
            <h3>{product.title}</h3>
            <p>{product.description}</p>
            <p>${product.price}</p>
            <p>{product.category}</p>
            <button onClick={() => handleEditClick(product)}>Edit</button>
            <button onClick={() => handleDelete(product._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
