import express from 'express';
import multer from 'multer';
import multerS3 from 'multer-s3';
import s3 from '../config/s3.js';
import dotenv from 'dotenv';
import ProductController from '../controllers/ProductController.js'

const { addProduct, getAllProducts, editProduct, deleteProduct, searchProducts } = ProductController

const router = express.Router();

dotenv.config();

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.S3_BUCKET_NAME,
    key: (req, file, cb) => {
      cb(null, Date.now().toString() + '-' + file.originalname);
    },
  }),
});

router.post('/add', upload.single('image'), addProduct);
router.get('/', getAllProducts);
router.put('/edit/:id', upload.single('image'), editProduct);
router.delete('/delete/:id', deleteProduct);
router.post('/search', searchProducts);

export default router;

