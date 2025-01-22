import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    title: { type: String, required: true},
    description: { type: String},
    price: { type: Number, required: true},
    category: { type: String},
    imageUrl: { type: String},
});

export default mongoose.model('Product', ProductSchema);