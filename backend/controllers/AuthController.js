import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

const JWT_SECRET = process.env.JWT_SECRET;

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const orders = await Order.find({ userId: user._id });

    const token = jwt.sign({ id: user._id, email: user.email, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token, username: user.username, cart: user.cart, orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const signup = async (req, res) => {

  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered.' });
    }
    
    const user = new User({ username, email, password });
    await user.save().catch((error) => {
      console.error('Error during user save:', error.message);
    });

    const token = jwt.sign({ id: user._id, email: user.email, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: 'Signup successful', token, username: user.username, cart: user.cart });
  } catch (error) {
    console.error('Error during signup', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getUser = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    const orders = await Order.find({ userId: user._id });
    res.status(200).json({ username: user.username, email: user.email, cart: user.cart, orders });
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Unauthorized' });
  }
};

export const updateCart = async (req, res) => {
  try {
    const { cart } = req.body;
    const userId = req.user._id; // Extracted from JWT

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.cart = cart;
    await user.save();

    res.status(200).json({ message: 'Cart updated successfully', cart: user.cart });
  } catch (err) {
    console.error('Error updating cart:', err);
    res.status(500).json({ error: 'Failed to update cart' });
  }
};

export const placeOrder = async (req, res) => {
  try {
    const { cart, total } = req.body;
    const userId = req.user._id;

    const orderItems = await Promise.all(
      Object.entries(cart).map(async ([productId, quantity]) => {
        const product = await Product.findById(productId);
        console.log(product.title, product.ima);
        
        if (!product) {
          throw new Error(`Product with ID ${productId} not found`);
        }
        return {
          productId,
          title: product.title,
          image: product.imageUrl.split('/').pop(),
          quantity,
          total: quantity * product.price,
        };
      })
    );

    const order = new Order({ userId, items: orderItems, total });
    console.log('Order backend', order);
    
    await order.save();

    // Clear user's cart after placing order
    const user = await User.findById(userId);
    user.cart = {};
    await user.save();

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (err) {
    console.error('Error placing order:', err);
    res.status(500).json({ error: 'Failed to place order' });
  }
};



export default { signup, login, getUser, updateCart, placeOrder };
