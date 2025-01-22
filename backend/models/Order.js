import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      title: { type: String, required: true },
      image: { type: String, required: true },
      quantity: Number,
      total: Number,
    },
  ],
  total: Number,
  date: { type: Date, default: Date.now },
});

export default mongoose.model('Order', OrderSchema);
