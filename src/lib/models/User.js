import mongoose from 'mongoose';

const discountSchema = new mongoose.Schema({
  serviceId: {
    type: mongoose.Schema.Types.Mixed, // or String or Number, depending on your service ID type
    required: true,
  },
  discount: {
    type: Number,
    min: 1,
    max: 100,
    required: true,
  }
}, { _id: false }); // no separate _id for each subdocument (optional)

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user"
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  discount: {
    type: [discountSchema],  // Array of discount objects
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent model overwrite in Next.js
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
