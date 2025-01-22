import Product from '../models/Product.js'
import s3 from '../config/s3.js';
import User from '../models/User.js';
import openai from '../config/openai.js';
import queryLlamaIndex from './queryLlamaIndex.js';

const addProduct = async (req, res) => {
    try {
        console.log("Request Body:", req.body);
        console.log("Request File:", req.file);
        const {title, description, price, category} = req.body;
        if (!req.file) {
            return res.status(400).json({ error: "Image upload failed" });
        }
        const imageUrl = req.file.location;
        const product = new Product({title, description, price, category, imageUrl});
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const getAllProducts = async (req, res) => {
    try {
      const products = await Product.find();
  
      const updatedProducts = products.map((product) => {
        const imageKey = product.imageUrl.split('/').pop();
        const cloudFrontUrl = `${process.env.AWS_CLOUDFRONT_URL}${imageKey}`;
        return { ...product.toObject(), imageUrl: cloudFrontUrl };
      });
  
      res.status(200).json(updatedProducts);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

const editProduct = async (req, res) => {
    try {
      const { title, description, price, category } = req.body;
      const updateFields = { title, description, price, category };
  
      if (req.file) {
        const product = await Product.findById(req.params.id);
        if (product) {
          const oldImageKey = product.imageUrl.split('/').pop();
          await s3.deleteObject({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: oldImageKey,
          }).promise();
        }
        updateFields.imageUrl = req.file.location;
      }
  
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        updateFields,
        { new: true }
      );
      res.status(200).json(updatedProduct);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
}
  

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const imageKey = product.imageUrl.split('/').pop();

    await Product.findByIdAndDelete(req.params.id);

    await s3.deleteObject({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: imageKey,
    }).promise();

    await User.updateMany({}, { $unset: { [`cart.${req.params.id}`]: "" } });

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

const searchProducts = async (req, res) => {
  const { query } = req.body;

  try {
    const messages = [
      {
        role: 'system',
        content: 'You are a helpful assistant that provides a list of ingredients for a given food/dish.',
      },
      {
        role: 'user',
        content: `List the ingredients for food/dish "${query}". If you don't understand the food/dish, assume the closest possible food/dish. Consider only one food/dish and return nothing else but a single array such that the first item in the array is the food/dish name and the rest ingredients required to prepare that food/dish. The strings should be words with brackets.`,
      },
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages,
      max_tokens: 300,
    });

    console.log('OpenAI Response:', response.choices[0].message.content);

    const resultArray = JSON.parse(response.choices[0].message.content.trim());
    const [foodName, ...ingredients] = resultArray;
    
    const matchedProducts = await queryLlamaIndex(ingredients);

    res.status(200).json({ matchedProducts: matchedProducts });
  } catch (error) {
    console.error('Error querying LlamaIndex:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch search results' });
  }
};

export default { addProduct, getAllProducts, editProduct, deleteProduct, searchProducts };