import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    cart: { type: Map, of: Number, default: {} },
  });

  userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    console.log('Password before hashing:', this.password);
    this.password = await bcrypt.hash(this.password, 10);
    console.log('Password after hashing:', this.password);
    next();
  })

  export default mongoose.model('User', userSchema);