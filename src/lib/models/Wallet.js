import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true,
    required: true
  },
  balance: {
    type: Number,
    default: 0,
    set: (v) => Math.round(v * 100) / 100 // round to 2 decimal places
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Prevent model overwrite in Next.js
const Wallet = mongoose.models.Wallet || mongoose.model('Wallet', walletSchema);

export default Wallet;
