import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
  service: {
    type: String,
    required: true
  },
  rate: {
    type: Number,
    required: true
  },
  min: {
    type: Number,
    required: true
  },
  max: {
    type: Number,
    required: true
  },
  desc: {
    type: String,
    required: true
  }
}, { _id: false });

const PlatformSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  categories: {
    type: Map,
    of: [ServiceSchema],
    default: new Map(),   // ✅ optional, defaults to empty
  }
});

// ✅ Prevent model overwrite in Next.js
const PlatformService =
  mongoose.models.PlatformService || mongoose.model('PlatformService', PlatformSchema);

export default PlatformService;
