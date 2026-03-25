import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
  department: {
    type: String,
    default: 'global',
    unique: true,
  },
  whatsappAlerts: {
    type: Boolean,
    default: false,
  },
  autoDocumentGen: {
    type: Boolean,
    default: false,
  },
  autoApproveMinor: {
    type: Boolean,
    default: false,
  },
  emergencyCriteria: {
    type: String,
    default: "IF type == 'Room' AND requester == 'Senior Faculty' THEN flag = 'Emergency'",
  },
  notificationRules: {
    type: [String],
    default: ['request_approved', 'request_rejected', 'conflict_detected'],
  },
}, { timestamps: true });

export default mongoose.model('Settings', SettingsSchema);
