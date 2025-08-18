import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  platform: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  quantity: {
    type: String,
    required: true,
  },
  platformService: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  startCount: {
    type: String,
  },
  status: {
    type: String,
  },
  remains: {
    type: String,
  },
  service: {
    type: String,
    required: true,
  },
  actualOrderIdFromApi: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { timestamps: true });

// ✅ Prevent model overwrite in Next.js
const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
