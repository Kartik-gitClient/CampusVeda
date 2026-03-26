import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

// Inline models (avoid import chain issues in standalone script)
import User from '../models/User.js';
import Request from '../models/Request.js';
import Resource from '../models/Resource.js';
import Conflict from '../models/Conflict.js';
import Notification from '../models/Notification.js';
import Settings from '../models/Settings.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/prithveda';

const seed = async () => {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB');

  // Clear all collections
  await User.deleteMany({});
  await Request.deleteMany({});
  await Resource.deleteMany({});
  await Conflict.deleteMany({});
  await Notification.deleteMany({});
  console.log('🗑  Cleared existing data');

  // ── 1. SEED USERS ────────────────────────────────────────────────
  // Plain text password — the User model's pre('save') hook handles bcrypt hashing
  const password = 'password123';

  const usersData = [
    { name: 'Arjun Sharma', email: 'junior@test.com', password, role: 'junior', department: 'Computer Science', designation: 'Assistant Professor', isActive: true },
    { name: 'Dr. Ramesh Gupta', email: 'senior@test.com', password, role: 'senior', department: 'Computer Science', designation: 'Associate Professor', isActive: true },
    { name: 'Prof. N. K. Sinha', email: 'hod@test.com', password, role: 'hod', department: 'Computer Science', designation: 'Head of Department', isActive: true },
    { name: 'Priya Mehta', email: 'priya@test.com', password, role: 'junior', department: 'Electronics', designation: 'Assistant Professor', isActive: true },
    { name: 'Vikram Singh', email: 'vikram@test.com', password, role: 'junior', department: 'Mechanical', designation: 'Assistant Professor', isActive: true },
  ];

  const seededUsers = [];
  for (const ud of usersData) {
    const u = new User(ud);
    await u.save();
    seededUsers.push(u);
  }

  const [junior, senior, hod, junior2, junior3] = seededUsers;

  console.log('👤 Users seeded');

  // ── 2. SEED RESOURCES ─────────────────────────────────────────────
  const resources = await Resource.insertMany([
    { name: 'Lab 101', type: 'Room', department: 'Computer Science', capacity: 40, status: 'Available' },
    { name: 'Seminar Hall A', type: 'Room', department: 'Computer Science', capacity: 120, status: 'Available' },
    { name: 'Projector Set (x3)', type: 'Equipment', department: 'Computer Science', status: 'Available' },
    { name: 'Server Room B', type: 'Room', department: 'Computer Science', capacity: 10, status: 'Maintenance' },
    { name: 'Lab Assistant – Ravi', type: 'Staff', department: 'Computer Science', status: 'Available' },
    { name: 'Electronics Lab 201', type: 'Room', department: 'Electronics', capacity: 35, status: 'Available' },
    { name: 'Workshop Hall', type: 'Room', department: 'Mechanical', capacity: 60, status: 'Available' },
  ]);
  console.log('🏢 Resources seeded');

  // ── 3. SEED REQUESTS (past 7 days for good analytics) ──────────
  const daysAgo = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return d; };
  const hoursLater = (d, h) => new Date(d.getTime() + h * 60 * 60 * 1000);

  const requestData = [
    // Today
    { requester: junior._id, type: 'Room', resourceName: 'Lab 101', purpose: 'Machine Learning Lab Session for 3rd Year students', startDate: daysAgo(0), endDate: hoursLater(daysAgo(0), 2), priority: 'Normal', status: 'submitted' },
    { requester: junior2._id, type: 'Equipment', resourceName: 'Projector Set (x3)', purpose: 'Guest lecture on IoT by industry expert', startDate: daysAgo(0), endDate: hoursLater(daysAgo(0), 3), priority: 'High', status: 'submitted' },
    // 1 day ago
    { requester: junior._id, type: 'Room', resourceName: 'Seminar Hall A', purpose: 'Technical symposium annual event', startDate: daysAgo(1), endDate: hoursLater(daysAgo(1), 5), priority: 'High', status: 'approved' },
    { requester: junior3._id, type: 'Room', resourceName: 'Workshop Hall', purpose: 'CNC Machine workshop for final year', startDate: daysAgo(1), endDate: hoursLater(daysAgo(1), 4), priority: 'Normal', status: 'approved' },
    // 2 days ago
    { requester: junior2._id, type: 'Room', resourceName: 'Electronics Lab 201', purpose: 'VLSI Design practical examination', startDate: daysAgo(2), endDate: hoursLater(daysAgo(2), 3), priority: 'Emergency', status: 'approved' },
    { requester: junior._id, type: 'Staff', resourceName: 'Lab Assistant – Ravi', purpose: 'Assist with network configuration lab', startDate: daysAgo(2), endDate: hoursLater(daysAgo(2), 2), priority: 'Normal', status: 'rejected' },
    // 3 days ago
    { requester: junior3._id, type: 'Equipment', resourceName: 'Projector Set (x3)', purpose: 'Department meeting and review presentation', startDate: daysAgo(3), endDate: hoursLater(daysAgo(3), 2), priority: 'Normal', status: 'approved' },
    { requester: junior._id, type: 'Room', resourceName: 'Lab 101', purpose: 'Data Structures remedial class', startDate: daysAgo(3), endDate: hoursLater(daysAgo(3), 2), priority: 'Normal', status: 'escalated' },
    // 4 days ago
    { requester: junior2._id, type: 'Room', resourceName: 'Seminar Hall A', purpose: 'Coding competition hackathon event', startDate: daysAgo(4), endDate: hoursLater(daysAgo(4), 8), priority: 'High', status: 'approved' },
    { requester: junior._id, type: 'Room', resourceName: 'Lab 101', purpose: 'Operating Systems lab extra session', startDate: daysAgo(4), endDate: hoursLater(daysAgo(4), 2), priority: 'Normal', status: 'approved' },
    // 5 days ago
    { requester: junior3._id, type: 'Room', resourceName: 'Workshop Hall', purpose: '3D printing demonstration for freshers', startDate: daysAgo(5), endDate: hoursLater(daysAgo(5), 3), priority: 'Normal', status: 'rejected' },
    { requester: junior._id, type: 'Equipment', resourceName: 'Projector Set (x3)', purpose: 'Paper presentation dry run session', startDate: daysAgo(5), endDate: hoursLater(daysAgo(5), 2), priority: 'Normal', status: 'approved' },
    // 6 days ago
    { requester: junior2._id, type: 'Room', resourceName: 'Electronics Lab 201', purpose: 'Embedded systems workshop', startDate: daysAgo(6), endDate: hoursLater(daysAgo(6), 4), priority: 'High', status: 'approved' },
    { requester: junior3._id, type: 'Staff', resourceName: 'Lab Assistant – Ravi', purpose: 'Assist with hardware troubleshooting', startDate: daysAgo(6), endDate: hoursLater(daysAgo(6), 2), priority: 'Normal', status: 'approved' },
  ];

  const requests = [];
  for (const rd of requestData) {
    const r = await Request.create({
      ...rd,
      history: [{ status: rd.status, actor: rd.requester, reason: rd.status === 'submitted' ? 'Created request' : `Request ${rd.status}` }],
      createdAt: rd.startDate,
    });
    requests.push(r);
  }
  console.log(`📋 ${requests.length} Requests seeded`);

  // ── 4. SEED CONFLICTS ──────────────────────────────────────────────
  await Conflict.insertMany([
    {
      type: 'DoubleBooking',
      severity: 'major',
      status: 'active',
      request: requests[0]._id,
      conflictingIds: [requests[7]._id],
      conflictingModel: 'Request',
      description: 'Lab 101 has overlapping booking on the same time slot',
    },
    {
      type: 'CapacityExceeded',
      severity: 'normal',
      status: 'active',
      request: requests[2]._id,
      description: 'Seminar Hall A booking exceeds expected capacity with additional attendees',
    },
    {
      type: 'DoubleBooking',
      severity: 'minor',
      status: 'resolved',
      request: requests[4]._id,
      conflictingIds: [requests[12]._id],
      conflictingModel: 'Request',
      description: 'Electronics Lab 201 had a minor scheduling overlap – resolved by shifting time',
    },
  ]);
  console.log('⚡ Conflicts seeded');

  // ── 5. SEED SETTINGS ─────────────────────────────────────────────
  await Settings.findOneAndUpdate(
    { department: 'global' },
    { whatsappAlerts: false, autoDocumentGen: false, autoApproveMinor: false },
    { upsert: true }
  );
  console.log('⚙️  Settings seeded');

  console.log('\n🎉 Database seeded successfully!\n');
  console.log('Test Credentials:');
  console.log('  junior@test.com  / password123  →  /junior');
  console.log('  senior@test.com  / password123  →  /senior');
  console.log('  hod@test.com     / password123  →  /hod\n');

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});

