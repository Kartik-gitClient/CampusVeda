import mongoose from 'mongoose';

const ResourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Room', 'Equipment', 'Staff'],
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
  },
  status: {
    type: String,
    enum: ['Available', 'In Use', 'Maintenance', 'Unavailable'],
    default: 'Available',
  },
  isActive: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

export default mongoose.model('Resource', ResourceSchema);
