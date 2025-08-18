  import mongoose from 'mongoose';

  const paymentSchema = new mongoose.Schema({
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      required: true 
    },
    type: {
      type: String,
      enum: ['online', 'manual'],
      default: 'online',
      required: true
    },
    orderId: {
      type: String,
      required: function () {
        return this.type === 'online';
      }
    },
    paymentId: {
      type: String,
      required: function () {
        return this.type === 'online';
      }
    },
    signature: {
      type: String,
      required: function () {
        return this.type === 'online';
      }
    },
    amount: { 
      type: Number, 
      required: true 
    },
    status: { 
      type: String, 
      enum: ['pending', 'paid', 'failed'], 
      default: 'pending',
      required: true 
    },
    createdAt: { 
      type: Date, 
      default: Date.now,
      required: true
    }
  });

  // ✅ Prevent model overwrite in Next.js
  const Payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);

  export default Payment;
