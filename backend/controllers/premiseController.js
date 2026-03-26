import Premise from '../models/Premise.js';
import Resource from '../models/Resource.js';
import ErrorResponse from '../utils/errorResponse.js';

export const getPremise = async (req, res, next) => {
  try {
    let premise = await Premise.findOne().sort({ createdAt: -1 });
    if (!premise) {
      // Create a default one if none exists
      premise = await Premise.create({
        totalRooms: 0,
        seminarHalls: 0,
        staffRooms: 0,
        miscRooms: 0,
        classRooms: 0
      });
    }
    res.status(200).json({ success: true, data: premise });
  } catch (error) {
    next(error);
  }
};

export const updatePremise = async (req, res, next) => {
  try {
    const { totalRooms, seminarHalls, staffRooms, miscRooms, classRooms } = req.body;

    if (totalRooms < (Number(seminarHalls || 0) + Number(staffRooms || 0) + Number(miscRooms || 0) + Number(classRooms || 0))) {
      throw new ErrorResponse('Total rooms cannot be less than the sum of specialized spaces.', 400);
    }
    
    let premise = await Premise.findOne().sort({ createdAt: -1 });
    if (!premise) {
      premise = new Premise({ updatedBy: req.user.id });
    } else {
      premise.updatedBy = req.user.id;
    }

    premise.totalRooms = totalRooms || 0;
    premise.seminarHalls = seminarHalls || 0;
    premise.staffRooms = staffRooms || 0;
    premise.miscRooms = miscRooms || 0;
    premise.classRooms = classRooms || 0;

    await premise.save();

    // Logic to sync/generate rooms in Resource collection
    const syncRooms = async (count, subType, prefix) => {
      const existingRooms = await Resource.find({ subType, type: 'Room' });
      const currentCount = existingRooms.length;

      if (count > currentCount) {
        // Create new rooms
        const newRooms = [];
        for (let i = currentCount + 1; i <= count; i++) {
          newRooms.push({
            name: `${prefix} ${i}`,
            type: 'Room',
            subType,
            department: req.user?.department || 'General Services',
            status: 'Available',
            capacity: subType === 'Seminar Hall' ? 100 : 40,
            isActive: true
          });
        }
        if (newRooms.length > 0) {
          await Resource.insertMany(newRooms);
        }
      } else if (count < currentCount) {
        // Deactivate excess rooms (optional, but let's keep it simple for now and just set isActive to false for those beyond count)
        // Only if they are currently Available
        const excessRooms = await Resource.find({ subType, type: 'Room' }).skip(count);
        for (const room of excessRooms) {
          room.isActive = false;
          await room.save();
        }
      } else {
        // Ensure they are active if they fall within the count
        await Resource.updateMany(
            { subType, type: 'Room', _id: { $in: existingRooms.slice(0, count).map(r => r._id) } },
            { isActive: true }
        );
      }
    };

    await syncRooms(classRooms, 'Classroom', 'Classroom');
    await syncRooms(seminarHalls, 'Seminar Hall', 'Seminar Hall');
    await syncRooms(staffRooms, 'Staff Room', 'Staff Room');
    await syncRooms(miscRooms, 'Misc', 'Misc Room');

    res.status(200).json({ success: true, data: premise, message: 'Premise updated and rooms synchronized.' });
  } catch (error) {
    next(error);
  }
};
