import { check } from 'express-validator';

export const createRequestValidation = [
  check('type', 'Request type is required').isIn(['Room', 'Equipment', 'Staff']),
  check('resourceName', 'Resource name is required').not().isEmpty(),
  check('startDate', 'Start date is required').isISO8601().toDate(),
  check('endDate', 'End date is required').isISO8601().toDate()
    .custom((endDate, { req }) => {
      if (new Date(endDate) <= new Date(req.body.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  check('purpose', 'Purpose is required').not().isEmpty(),
  check('priority', 'Invalid priority').optional().isIn(['Normal', 'High', 'Emergency']),
];
