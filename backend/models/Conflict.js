import mongoose from 'mongoose';

const ConflictSchema = new mongoose.Schema({
  request: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Request',
    required: true,
  },
  type: {
    type: String,
    enum: ['DoubleBooking', 'EquipmentShortage', 'StaffUnavailable', 'CapacityExceeded'],
    required: true,
  },
  severity: {
    type: String,
    enum: ['minor', 'normal', 'major'],
    default: 'normal',
  },
  description: {
    type: String,
    required: true,
  },
  conflictingIds: [{
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'conflictingModel',
  }],
  conflictingModel: {
    type: String,
    enum: ['Request', 'Resource'],
  },
  status: {
    type: String,
    enum: ['active', 'resolved'],
    default: 'active',
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  resolutionNotes: String,
}, { timestamps: true });

export default mongoose.model('Conflict', ConflictSchema);
