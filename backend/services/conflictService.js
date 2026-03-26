import Conflict from '../models/Conflict.js';
import Request from '../models/Request.js';
import ErrorResponse from '../utils/errorResponse.js';
import { suggestConflictResolution } from './aiService.js';

export const detectConflicts = async (requestId) => {
  const request = await Request.findById(requestId);
  if (!request) return;

  const conflicts = [];
  
  // 1. Double Booking Check (Same resource, overlapping dates)
  const overlaps = await Request.find({
    _id: { $ne: requestId },
    resourceName: request.resourceName,
    startDate: { $lt: request.endDate },
    endDate: { $gt: request.startDate },
    status: { $in: ['approved', 'submitted', 'checking'] }
  });

  if (overlaps.length > 0) {
    const conflictDetails = {
      type: 'DoubleBooking',
      resource: request.resourceName,
      dates: `${request.startDate} to ${request.endDate}`
    };
    
    const suggestion = await suggestConflictResolution(conflictDetails);

    const conflict = await Conflict.create({
      request: requestId,
      type: 'DoubleBooking',
      severity: 'major',
      description: `Resource ${request.resourceName} is already booked during this time period.`,
      conflictingIds: overlaps.map(o => o._id),
      conflictingModel: 'Request',
      suggestions: suggestion ? [suggestion] : [],
    });
    conflicts.push(conflict);
  }

  // Future logic: Capacity checks, Equipment shortages, etc. depending on Resource model bindings.

  return conflicts;
};

export const getConflicts = async () => {
  return await Conflict.find({ status: 'active' })
    .populate('request')
    .populate('conflictingIds');
};

export const resolveConflict = async (id, resolveData, user) => {
  const conflict = await Conflict.findById(id);
  
  if (!conflict) throw new ErrorResponse(`Conflict not found`, 404);

  conflict.status = 'resolved';
  conflict.resolvedBy = user._id;
  conflict.resolutionNotes = resolveData.notes || 'Resolved administratively';

  await conflict.save();
  return conflict;
};
