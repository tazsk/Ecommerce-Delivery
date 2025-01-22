import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const roundToTwoDecimals = (value) => Math.round(value * 100) / 100;

export const ShopContext = createContext();

const ShopProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cart, setCart] = useState({});
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [totalCartValue, setTotalCartValue] = useState(0);
  const [orders, setOrders] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [tab, setTab] = useState(() => {
    // Retrieve the tab from session storage, or default to "grocery"
    return sessionStorage.getItem('tab') || 'grocery';
  });

  useEffect(() => {
    // Update session storage whenever the tab changes
    sessionStorage.setItem('tab', tab);
  }, [tab]);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
    fetchProducts();
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getTotalCartValue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart, products])

  useEffect(() => {
    console.log('Updated search results:', searchResults);
  }, [searchResults]);

  const getTotalCartValue = () => {
    if (cart && products.length > 0) {
        const totalValue = Object.entries(cart).reduce((acc, [productId, quantity]) => {
          const product = products.find(p => p._id === productId);
          if (product) {
            return acc + product.price * quantity;
          }
          return acc;
        }, 0);
        setTotalCartValue(totalValue);
      }
  }

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:4000/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error.response?.data?.error || error.message);
    }
  };

  // Save cart to backend
  const saveCartToBackend = async (updatedCart) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await axios.put(
        'http://localhost:4000/auth/cart',
        { cart: updatedCart },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.error('Failed to save cart to backend:', error.response?.data?.error || error.message);
    }
  };

  const fetchMatchedProducts = async (query) => {
    try {
        const response = await axios.post('http://localhost:4000/products/search', { query });
        setSearchResults(response.data.matchedProducts);
        
    } catch (error) {
        console.error('Error fetching matched products:', error.message);
    }
  };

  // Add product to cart
  const addToCart = (productId) => {
    if (!isLoggedIn) {
      alert('Please login to add products to the cart');
      return;
    }
    const updatedCart = { ...cart, [productId]: (cart[productId] || 0) + 1 };
    const product = products.find((item) => item._id === productId);
    setTotalCartValue((prev) => roundToTwoDecimals(prev + product.price))
    setCart(updatedCart);
    saveCartToBackend(updatedCart);
  };

  // Decrease product quantity by 1
  const removeFromCart = (productId) => {
    if (!isLoggedIn) {
      alert('Please login to update the cart');
      return;
    }
    if (cart[productId] > 1) {
      const updatedCart = { ...cart, [productId]: cart[productId] - 1 };
      const product = products.find((item) => item._id === productId);
      setTotalCartValue((prev) => roundToTwoDecimals(prev - product.price))
      setCart(updatedCart);
      saveCartToBackend(updatedCart);
    } else {
      removeFromCartList(productId);
    }
  };

  // Remove product from cart completely
  const removeFromCartList = (productId) => {
    if (!isLoggedIn) {
      alert('Please login to update the cart');
      return;
    }
    const updatedCart = { ...cart };
    const product = products.find((item) => item._id === productId);
    setTotalCartValue((prev) => roundToTwoDecimals(prev - (product.price * cart[productId])));
    delete updatedCart[productId];
    setCart(updatedCart);
    saveCartToBackend(updatedCart);
  };

  // Get total number of items in the cart
  const getTotalCartItems = () => {
    return Object.values(cart).reduce((total, quantity) => total + quantity, 0);
  };

  const signup = async (username, email, password) => {
    try {
      const response = await axios.post('http://localhost:4000/auth/signup', {
        username,
        email,
        password,
      });
      const { token, cart } = response.data;
  
      localStorage.setItem('token', token);
      setUser({ username, email });
      setCart(cart);
      alert('Signup successful!')
      setIsLoggedIn(true);
      setError('');
    } catch (err) {
      console.error('Signup failed:', err.response?.data?.error || err.message);
      setError(err.response?.data?.error || 'An error occurred');
      setIsLoggedIn(false);
    }
  };  

  // Login user
  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:4000/auth/login', { email, password });

      const { token, username, cart, orders } = response.data;
      console.log('Orders frontend', orders);
      localStorage.setItem('token', token);
      alert('Login successful!')
      setUser({ username, email });
      setCart(cart);
      setOrders(orders || []);
      setIsLoggedIn(true);
      setTab("grocery");
      window.location.href = 'grocery';
    } catch (error) {
      console.error('Login failed:', error.response?.data?.error || error.message);
      setIsLoggedIn(false);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setCart({});
    setOrders([]);
    setIsLoggedIn(false);
    setTab("login");
    window.location.href = 'login';
  };

  // Fetch user data using token
  const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await axios.get('http://localhost:4000/auth/user', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { username, email, cart, orders } = response.data;
      setUser({ username, email });
      setCart(cart);
      setOrders(orders || []);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Failed to fetch user data:', error.response?.data?.error || error.message);
    }
  };

  const placeOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      const deliveryFee = Object.values(cart).some((count) => count > 0) ? 4 : 0;
      const total = roundToTwoDecimals(totalCartValue + deliveryFee);

      const response = await axios.post('http://localhost:4000/auth/placeOrder', { cart, total }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('Order response', response.data.order);
      
      setCart({});
      setOrders((prevOrders) => [...prevOrders, response.data.order]);
      setTotalCartValue(0);
      window.location.href = '/orders';
    } catch (error) {
      console.error('Failed to place order:', error);
    }
  };

  return (
    <ShopContext.Provider
      value={{
        user,
        isLoggedIn,
        signup,
        login,
        logout,
        cart,
        addToCart,
        removeFromCart,
        removeFromCartList,
        getTotalCartItems,
        saveCartToBackend,
        placeOrder,
        orders,
        products,
        error,
        totalCartValue,
        fetchProducts,
        fetchMatchedProducts,
        searchResults,
        tab,
        setTab,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export default ShopProvider;
