import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['request_approved', 'request_rejected', 'conflict_detected', 'escalation_needed', 'action_required', 'system'],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  relatedModel: {
    type: String,
    enum: ['Request', 'Conflict', 'Approval'],
  },
  isRead: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

export default mongoose.model('Notification', NotificationSchema);
