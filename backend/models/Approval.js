import mongoose from 'mongoose';

const ApprovalSchema = new mongoose.Schema({
  request: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Request',
    required: true,
  },
  approver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  action: {
    type: String,
    enum: ['approved', 'rejected', 'conditional'],
    required: true,
  },
  reason: {
    type: String,
    required: function() { return this.action === 'rejected'; }
  },
  conditions: {
    type: String,
  }
}, { timestamps: true });

export default mongoose.model('Approval', ApprovalSchema);
