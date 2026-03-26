import mongoose from 'mongoose';

const RequestSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['Room', 'Equipment', 'Staff'],
    required: true,
  },
  resourceName: {
    type: String,
    required: true,
  },
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource',
  },
  department: {
    type: String,
  },
  capacity: {
    type: Number,
  },
  equipmentNeeded: {
    type: String,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  purpose: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    enum: ['Normal', 'High', 'Emergency'],
    default: 'Normal',
  },
  notes: {
    type: String,
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'checking', 'approved', 'rejected', 'escalated', 'resolved'],
    default: 'submitted',
  },
  history: [{
    status: String,
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reason: String,
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }]
}, { timestamps: true });

export default mongoose.model('Request', RequestSchema);
