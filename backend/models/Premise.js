import mongoose from 'mongoose';

const PremiseSchema = new mongoose.Schema({
  totalRooms: {
    type: Number,
    default: 0
  },
  seminarHalls: {
    type: Number,
    default: 0
  },
  staffRooms: {
    type: Number,
    default: 0
  },
  miscRooms: {
    type: Number,
    default: 0
  },
  classRooms: {
    type: Number,
    default: 0
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

export default mongoose.model('Premise', PremiseSchema);
