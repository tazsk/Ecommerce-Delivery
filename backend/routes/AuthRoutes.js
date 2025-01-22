import express from 'express';
import AuthController from '../controllers/AuthController.js';
import protect from '../middleware/AuthMiddleware.js';

const { signup, login, getUser, updateCart, placeOrder } = AuthController;

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/user', protect, getUser);
router.put('/cart', protect, updateCart);
router.post('/placeOrder', protect, placeOrder);

export default router;