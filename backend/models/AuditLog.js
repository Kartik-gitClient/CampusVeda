import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema({
  actor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  entity: {
    type: String,
    required: true,
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  beforeState: {
    type: mongoose.Schema.Types.Mixed,
  },
  afterState: {
    type: mongoose.Schema.Types.Mixed,
  },
  ipAddress: String,
}, { timestamps: true });

export default mongoose.model('AuditLog', AuditLogSchema);
