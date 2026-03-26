import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

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
  const password = await bcrypt.hash('password123', 10);

  // ── 1. SEED USERS ────────────────────────────────────────────────
  // Note: Temporary faculty data (junior, senior, hod) removed as per requirement.
  // Users should be registered via the API or another seeding mechanism.
  console.log('👤 User seeding skipped (temporary faculty data removed)');

  // ── 2. SEED RESOURCES ─────────────────────────────────────────────
  const resources = await Resource.insertMany([
    { name: 'Lab 101', type: 'Room', department: 'Computer Science', capacity: 40, status: 'Available' },
    { name: 'Seminar Hall A', type: 'Room', department: 'Computer Science', capacity: 120, status: 'Available' },
    { name: 'Projector Set (x3)', type: 'Equipment', department: 'Computer Science', status: 'Available' },
    { name: 'Server Room B', type: 'Room', department: 'Computer Science', capacity: 10, status: 'Maintenance' },
    { name: 'Lab Assistant – Ravi', type: 'Staff', department: 'Computer Science', status: 'Available' },
  ]);
  console.log('🏢 Resources seeded');

  // ── 3. SEED SETTINGS ─────────────────────────────────────────────
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
