import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import cors from 'cors';
import crypto from 'node:crypto';

const app = express();
const PORT = process.env.PORT || 5000;
const TOKEN_SECRET = process.env.SWIFTRIDE_TOKEN_SECRET || crypto.randomBytes(32).toString('hex');
const MOBILE_CLIENT_KEY = process.env.SWIFTRIDE_MOBILE_KEY || '';
const ADMIN_USERNAME = process.env.SWIFTRIDE_ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD_HASH = process.env.SWIFTRIDE_ADMIN_PASSWORD_HASH || '';

app.use(cors({ origin: process.env.SWIFTRIDE_WEB_ORIGIN ? process.env.SWIFTRIDE_WEB_ORIGIN.split(',') : true }));
app.use(express.json());

function verifyPassword(password, encodedHash) {
  const [salt, expected] = encodedHash.split(':');
  if (!salt || !expected) return false;
  const actual = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(actual, 'hex'), Buffer.from(expected, 'hex'));
}

function createToken(payload) {
  const body = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + 8 * 60 * 60 * 1000 })).toString('base64url');
  const signature = crypto.createHmac('sha256', TOKEN_SECRET).update(body).digest('base64url');
  return `${body}.${signature}`;
}

function readToken(token) {
  const [body, signature] = String(token || '').split('.');
  if (!body || !signature) return null;
  const expected = crypto.createHmac('sha256', TOKEN_SECRET).update(body).digest('base64url');
  if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    return payload.exp > Date.now() ? payload : null;
  } catch {
    return null;
  }
}

function requireAuth(req, res, next) {
  const bearer = req.get('authorization')?.replace(/^Bearer\s+/i, '');
  const tokenPayload = readToken(bearer);
  if (tokenPayload) {
    req.user = tokenPayload;
    return next();
  }
  if (MOBILE_CLIENT_KEY && req.get('x-swiftride-client-key') === MOBILE_CLIENT_KEY) {
    req.user = { role: 'mobile' };
    return next();
  }
  return res.status(401).json({ error: 'Authentication required' });
}

function requireRole(...roles) {
  return (req, res, next) => roles.includes(req.user?.role) ? next() : res.status(403).json({ error: 'Insufficient permissions' });
}

// In-Memory Database (Synced across Mobile Apps and Web Admin)
const db = {
  auditLogs: [],
  platformStats: {
    totalPassengers: 12542,
    activeDrivers: 1650,
    totalBookings: 45890,
    dailyRevenue: 485200,
    openTickets: 14,
    pendingApplications: 3
  },
  
  passengers: [
    {
      id: 'p1',
      name: 'Maria Santos',
      phone: '0917 123 4567',
      email: 'maria.santos@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      totalTrips: 48,
      rating: 4.9,
      status: 'Verified',
      joinedDate: 'Jan 12, 2025'
    },
    {
      id: 'p2',
      name: 'John Michael Doe',
      phone: '0918 555 7890',
      email: 'john.doe@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      totalTrips: 12,
      rating: 4.2,
      status: 'Flagged',
      joinedDate: 'Feb 04, 2025'
    },
    {
      id: 'p3',
      name: 'Clarissa Reyes',
      phone: '0922 333 4455',
      email: 'clarissa.reyes@yahoo.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      totalTrips: 94,
      rating: 5.0,
      status: 'Verified',
      joinedDate: 'Nov 18, 2024'
    }
  ],

  drivers: [
    {
      id: 'd1',
      name: 'Juan Dela Cruz',
      phone: '0917 888 1234',
      email: 'juan.delacruz@swiftride.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      vehicle: 'Toyota Vios (Sedan)',
      plateNumber: 'NDA 1234',
      rating: 4.9,
      totalTrips: 542,
      acceptanceRate: 98,
      status: 'Online',
      city: 'Caloocan City'
    },
    {
      id: 'd2',
      name: 'Mark Reyes',
      phone: '0918 222 3344',
      email: 'mark.reyes@swiftride.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      vehicle: 'Honda Click 125 (Motorcycle)',
      plateNumber: 'DEF 5678',
      rating: 4.8,
      totalTrips: 312,
      acceptanceRate: 95,
      status: 'On Trip',
      city: 'Quezon City'
    }
  ],

  pendingApplications: [
    {
      id: 'app-101',
      driverName: 'Ricardo Dalisay',
      phone: '0917 999 8877',
      email: 'ricardo.dalisay@gmail.com',
      vehicleType: 'Car',
      vehicleModel: 'Toyota Vios 2023',
      plateNumber: 'NBB 8899',
      licenseNumber: 'N01-18-999888',
      city: 'Quezon City',
      status: 'pending',
      appliedDate: '2025-05-18 09:30 AM',
      documents: {
        driverLicense: true,
        orCr: true,
        nbiClearance: true,
        vehiclePhotos: true
      }
    },
    {
      id: 'app-102',
      driverName: 'Fernando Poe Jr.',
      phone: '0918 777 6655',
      email: 'fpj.driver@gmail.com',
      vehicleType: 'Motorcycle',
      vehicleModel: 'Yamaha NMAX 155',
      plateNumber: 'MC 55443',
      licenseNumber: 'N02-19-445566',
      city: 'Manila',
      status: 'pending',
      appliedDate: '2025-05-18 10:15 AM',
      documents: {
        driverLicense: true,
        orCr: true,
        nbiClearance: true,
        vehiclePhotos: true
      }
    }
  ],

  rides: [
    {
      id: 'SR-8849',
      passengerName: 'Maria Santos',
      passengerPhone: '0917 123 4567',
      driverName: 'Juan Dela Cruz',
      driverPhone: '0917 888 1234',
      driverPlate: 'NDA 1234',
      vehicleType: 'Sedan',
      pickup: { name: 'SM North EDSA, Quezon City', lat: 14.656, lng: 121.031 },
      dropoff: { name: 'BGC High Street, Taguig', lat: 14.552, lng: 121.051 },
      fare: 285.00,
      paymentMethod: 'GCash',
      status: 'completed',
      date: 'May 18, 2025 • 10:24 AM'
    },
    {
      id: 'SR-8850',
      passengerName: 'John Michael Doe',
      passengerPhone: '0918 555 7890',
      driverName: 'Mark Reyes',
      driverPhone: '0918 222 3344',
      driverPlate: 'DEF 5678',
      vehicleType: 'Motorcycle',
      pickup: { name: 'Ayala Malls Cloverleaf, Balintawak', lat: 14.659, lng: 121.002 },
      dropoff: { name: 'Trinoma Mall, Quezon City', lat: 14.654, lng: 121.033 },
      fare: 110.00,
      paymentMethod: 'Cash',
      status: 'in_progress',
      date: 'May 18, 2025 • 11:10 AM'
    }
  ],

  tickets: [
    {
      id: 'TICK-401',
      userId: 'p2',
      userName: 'John Michael Doe',
      userType: 'Passenger',
      category: 'Fare Dispute',
      subject: 'Incorrect surge fare charged during non-peak hour',
      description: 'I was charged ₱350 for a 4km trip at 2 PM when surge multiplier was supposed to be 1.0x.',
      status: 'open',
      priority: 'high',
      createdDate: 'May 18, 2025 09:12 AM'
    },
    {
      id: 'TICK-402',
      userId: 'd1',
      userName: 'Juan Dela Cruz',
      userType: 'Driver',
      category: 'Payout Issue',
      subject: 'Weekly GCash cashout delay',
      description: 'My withdrawal of ₱4,500 on Friday afternoon has not reflected in my GCash wallet.',
      status: 'open',
      priority: 'medium',
      createdDate: 'May 18, 2025 10:45 AM'
    }
  ],

  notifications: [
    {
      id: 'n1',
      title: 'LTFRB Fare Schedule Compliance Update',
      message: 'New base fare adjustments approved for Metro Manila TNVS units effective June 1.',
      timestamp: '2 hours ago',
      type: 'warning',
      category: 'Regulatory'
    },
    {
      id: 'n2',
      title: 'Weekly Driver Payout Run Completed',
      message: 'Successfully disbursed ₱1,842,500 across 1,650 verified driver accounts.',
      timestamp: 'Yesterday',
      type: 'success',
      category: 'Finance'
    }
  ],

  emergencies: [
    {
      id: 'SOS-9021',
      userId: 'pass_001',
      userName: 'John Michael Nabung',
      userRole: 'passenger',
      userPhone: '0912 345 6789',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      rideId: 'TRIP-8850',
      location: {
        name: 'SM North EDSA, Quezon City',
        address: 'EDSA cor. North Ave, Quezon City, Metro Manila',
        lat: 14.6565,
        lng: 121.0289
      },
      emergencyType: 'Safety SOS',
      status: 'active',
      createdAt: '5 mins ago',
      notes: 'Passenger triggered Safety SOS button during trip. Vehicle route slowed down near North Ave flyover.',
      driverName: 'Juan Dela Cruz',
      driverPhone: '0917 888 1234',
      vehicleInfo: 'Toyota Vios (Sedan) • NDA 1234'
    }
  ],

  settings: {
    baseFareSedan: 50.0,
    perKmRateSedan: 15.0,
    baseFareMotorcycle: 30.0,
    perKmRateMotorcycle: 9.0,
    surgeMultiplier: 1.2,
    platformCommissionPercent: 15.0,
    ltfrbFeePerTrip: 2.0
  }
};

const abuseBuckets = new Map();
function requestKey(req, action) { return `${action}:${req.ip || req.socket.remoteAddress || 'unknown'}`; }
function enforceLimit(req, res, action, limit, windowMs) {
  const key = requestKey(req, action);
  const now = Date.now();
  const recent = (abuseBuckets.get(key) || []).filter(timestamp => now - timestamp < windowMs);
  if (recent.length >= limit) {
    res.set('Retry-After', String(Math.ceil(windowMs / 1000)));
    return false;
  }
  recent.push(now);
  abuseBuckets.set(key, recent);
  return true;
}
function appendAudit(req, action, target, details = {}) {
  db.auditLogs.unshift({ id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, action, target, actor: req.user?.sub || req.user?.role || 'unknown', ip: req.ip, createdAt: new Date().toISOString(), details });
  db.auditLogs.splice(500);
}

// HTTP Server & WebSocket Server
const server = createServer(app);
const wss = new WebSocketServer({ server });

function broadcast(type, payload) {
  const messageStr = JSON.stringify({ type, payload });
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(messageStr);
    }
  });
}

wss.on('connection', (ws, req) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const tokenPayload = readToken(url.searchParams.get('token'));
  const mobileClient = MOBILE_CLIENT_KEY && url.searchParams.get('clientKey') === MOBILE_CLIENT_KEY;
  if (!tokenPayload && !mobileClient) {
    ws.close(1008, 'Authentication required');
    return;
  }
  console.log('⚡ New Client Connected (Web Admin / Mobile App)');
  ws.send(JSON.stringify({ type: 'CONNECTED', payload: { message: 'SwiftRide Central Gateway Connected' } }));
});

// --- REST API ENDPOINTS ---

app.post('/api/auth/login', (req, res) => {
  if (!enforceLimit(req, res, 'admin-login', 5, 15 * 60_000)) return res.status(429).json({ error: 'Too many login attempts. Please try again later.' });
  const { username, password } = req.body || {};
  if (!ADMIN_PASSWORD_HASH) return res.status(503).json({ error: 'Admin authentication is not configured on the server' });
  if (username !== ADMIN_USERNAME || typeof password !== 'string' || !verifyPassword(password, ADMIN_PASSWORD_HASH)) {
    return res.status(401).json({ error: 'Invalid administrative credentials' });
  }
  res.json({ token: createToken({ sub: username, role: 'admin' }), role: 'admin' });
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'online', service: 'SwiftRide Central Backend API', timestamp: new Date().toISOString() });
});

app.use('/api', requireAuth);

app.get('/api/audit-logs', requireRole('admin'), (req, res) => {
  res.json(db.auditLogs);
});

// System Stats
app.get('/api/stats', (req, res) => {
  res.json(db.platformStats);
});

// Passengers
app.get('/api/passengers', (req, res) => {
  res.json(db.passengers);
});

app.patch('/api/passengers/:id/status', requireRole('admin'), (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const passenger = db.passengers.find(p => p.id === id);
  if (passenger) {
    passenger.status = status;
    broadcast('passenger_status_updated', passenger);
    return res.json({ success: true, passenger });
  }
  res.status(404).json({ error: 'Passenger not found' });
});

// Drivers & Onboarding Applications
app.get('/api/drivers', (req, res) => {
  res.json(db.drivers);
});

app.get('/api/drivers/pending', (req, res) => {
  res.json(db.pendingApplications);
});

// Mobile App: Driver Application Submission
app.post('/api/drivers/apply', (req, res) => {
  if (!enforceLimit(req, res, 'driver-application', 3, 60 * 60_000)) return res.status(429).json({ error: 'Too many driver applications from this address' });
  if (!req.body?.driverName || !req.body?.phone || !req.body?.vehicleModel) return res.status(400).json({ error: 'Driver name, phone, and vehicle details are required' });
  const application = {
    id: `app-${Date.now()}`,
    status: 'pending',
    appliedDate: new Date().toLocaleString(),
    documents: {
      driverLicense: true,
      orCr: true,
      nbiClearance: true,
      vehiclePhotos: true
    },
    ...req.body
  };
  db.pendingApplications.unshift(application);
  db.platformStats.pendingApplications += 1;
  broadcast('driver_application_submitted', application);
  res.json({ success: true, application });
});

// Admin: Approve Driver Application
app.post('/api/drivers/applications/:id/approve', requireRole('admin'), (req, res) => {
  const { id } = req.params;
  const appIndex = db.pendingApplications.findIndex(a => a.id === id);
  if (appIndex !== -1) {
    const application = db.pendingApplications[appIndex];
    application.status = 'approved';
    db.pendingApplications.splice(appIndex, 1);
    
    // Add to verified fleet
    const newDriver = {
      id: `d-${Date.now()}`,
      name: application.driverName,
      phone: application.phone,
      email: application.email,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      vehicle: `${application.vehicleModel} (${application.vehicleType})`,
      plateNumber: application.plateNumber,
      rating: 5.0,
      totalTrips: 0,
      acceptanceRate: 100,
      status: 'Online',
      city: application.city
    };
    db.drivers.unshift(newDriver);
    db.platformStats.activeDrivers += 1;
    if (db.platformStats.pendingApplications > 0) db.platformStats.pendingApplications -= 1;

    appendAudit(req, 'driver_application_approved', id, { driverId: newDriver.id });
    broadcast('driver_application_updated', { id, status: 'approved', driver: newDriver });
    return res.json({ success: true, driver: newDriver });
  }
  res.status(404).json({ error: 'Application not found' });
});

// Admin: Reject Driver Application
app.post('/api/drivers/applications/:id/reject', requireRole('admin'), (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;
  const appIndex = db.pendingApplications.findIndex(a => a.id === id);
  if (appIndex !== -1) {
    const application = db.pendingApplications[appIndex];
    application.status = 'rejected';
    application.rejectionReason = reason;
    db.pendingApplications.splice(appIndex, 1);
    if (db.platformStats.pendingApplications > 0) db.platformStats.pendingApplications -= 1;

    appendAudit(req, 'driver_application_rejected', id, { reason });
    broadcast('driver_application_updated', { id, status: 'rejected', reason });
    return res.json({ success: true });
  }
  res.status(404).json({ error: 'Application not found' });
});

// Rides & Dispatch
app.get('/api/rides', (req, res) => {
  res.json(db.rides);
});

// Mobile App: Passenger Requests Ride
app.post('/api/rides/request', (req, res) => {
  if (!enforceLimit(req, res, 'ride-request', 10, 60_000)) return res.status(429).json({ error: 'Too many ride requests. Please try again later.' });
  const { passengerName, pickup, dropoff, estimatedFare, fare } = req.body || {};
  if (!passengerName || !pickup?.name || !dropoff?.name) return res.status(400).json({ error: 'Passenger, pickup, and dropoff are required' });
  const requestedFare = Number(estimatedFare ?? fare ?? 0);
  if (!Number.isFinite(requestedFare) || requestedFare < 0 || requestedFare > 100000) return res.status(400).json({ error: 'Invalid fare amount' });
  const ride = {
    ...req.body,
    id: `SR-${Math.floor(1000 + Math.random() * 9000)}`,
    status: 'requested',
    date: new Date().toISOString()
  };
  db.rides.unshift(ride);
  db.platformStats.totalBookings += 1;
  appendAudit(req, 'ride_requested', ride.id, { pickup: pickup.name, dropoff: dropoff.name });
  broadcast('ride_requested', ride);
  res.json({ success: true, ride });
});

// Mobile App / Driver: Update Ride Status
app.patch('/api/rides/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, driverName, driverPhone, driverPlate } = req.body;
  const normalizedStatus = { ACTIVE: 'accepted', ACCEPTED: 'accepted', DRIVER_ARRIVED: 'driver_arriving', IN_PROGRESS: 'in_progress', COMPLETED: 'completed', CANCELLED: 'cancelled' }[String(status || '').toUpperCase()] || String(status || '').toLowerCase();
  const ride = db.rides.find(r => r.id === id);
  if (ride) {
    const transitions = { requested: ['accepted', 'cancelled'], accepted: ['driver_arriving', 'cancelled'], driver_arriving: ['in_progress', 'cancelled'], in_progress: ['completed', 'cancelled'], completed: [], cancelled: [] };
    if (!transitions[ride.status]?.includes(normalizedStatus)) return res.status(409).json({ error: `Invalid ride transition from ${ride.status} to ${normalizedStatus}` });
    ride.status = normalizedStatus;
    if (driverName) ride.driverName = driverName;
    if (driverPhone) ride.driverPhone = driverPhone;
    if (driverPlate) ride.driverPlate = driverPlate;
    
    if (normalizedStatus === 'completed') {
      db.platformStats.dailyRevenue += ride.fare || 0;
    }
    appendAudit(req, 'ride_status_updated', id, { status: normalizedStatus });
    
    broadcast('ride_status_updated', ride);
    return res.json({ success: true, ride });
  }
  res.status(404).json({ error: 'Ride not found' });
});

// Support Tickets
app.get('/api/tickets', (req, res) => {
  res.json(db.tickets);
});

// Mobile App: Create Ticket
app.post('/api/tickets', (req, res) => {
  const ticket = {
    id: `TICK-${Math.floor(100 + Math.random() * 900)}`,
    status: 'open',
    createdDate: new Date().toLocaleString(),
    ...req.body
  };
  db.tickets.unshift(ticket);
  db.platformStats.openTickets += 1;
  broadcast('support_ticket_created', ticket);
  res.json({ success: true, ticket });
});

// Admin: Resolve Ticket
app.patch('/api/tickets/:id', requireRole('admin'), (req, res) => {
  const { id } = req.params;
  const { status, resolutionNote } = req.body;
  const ticket = db.tickets.find(t => t.id === id);
  if (ticket) {
    ticket.status = status;
    if (resolutionNote) ticket.resolutionNote = resolutionNote;
    if (status === 'resolved' && db.platformStats.openTickets > 0) {
      db.platformStats.openTickets -= 1;
    }
    appendAudit(req, 'ticket_updated', id, { status });
    broadcast('support_ticket_updated', ticket);
    return res.json({ success: true, ticket });
  }
  res.status(404).json({ error: 'Ticket not found' });
});

// System Notifications
app.get('/api/notifications', (req, res) => {
  res.json(db.notifications);
});

app.post('/api/notifications/broadcast', requireRole('admin'), (req, res) => {
  const { title, message, category, type } = req.body;
  const notification = {
    id: `n-${Date.now()}`,
    title,
    message,
    category: category || 'System',
    type: type || 'info',
    timestamp: 'Just now'
  };
  db.notifications.unshift(notification);
  broadcast('notification_broadcasted', notification);
  res.json({ success: true, notification });
});

// System Settings
app.get('/api/settings', (req, res) => {
  res.json(db.settings);
});

app.put('/api/settings', requireRole('admin'), (req, res) => {
  db.settings = { ...db.settings, ...req.body };
  appendAudit(req, 'settings_updated', 'platform', { fields: Object.keys(req.body || {}) });
  broadcast('settings_updated', db.settings);
  res.json({ success: true, settings: db.settings });
});

// Emergency Requests
app.get('/api/emergencies', (req, res) => {
  res.json(db.emergencies);
});

app.post('/api/emergencies', (req, res) => {
  if (!enforceLimit(req, res, 'sos', 3, 300_000)) return res.status(429).json({ error: 'Too many SOS requests. Please contact emergency services directly if this is urgent.' });
  if (!req.body?.userName && !req.body?.passengerName && !req.body?.driverName) return res.status(400).json({ error: 'Emergency identity is required' });
  const emergency = {
    ...req.body,
    id: `SOS-${Math.floor(1000 + Math.random() * 9000)}`,
    status: 'active',
    createdAt: new Date().toISOString()
  };
  db.emergencies.unshift(emergency);
  appendAudit(req, 'emergency_created', emergency.id, { emergencyType: emergency.emergencyType || 'unknown' });
  broadcast('emergency_triggered', emergency);
  res.json({ success: true, emergency });
});

app.patch('/api/emergencies/:id', requireRole('admin'), (req, res) => {
  const { id } = req.params;
  const emergency = db.emergencies.find(e => e.id === id);
  if (emergency) {
    Object.assign(emergency, req.body);
    appendAudit(req, 'emergency_updated', id, { status: emergency.status });
    broadcast('emergency_updated', emergency);
    return res.json({ success: true, emergency });
  }
  res.status(404).json({ error: 'Emergency request not found' });
});

server.listen(PORT, () => {
  console.log(`🚀 SwiftRide Central Gateway running on http://localhost:${PORT}`);
  console.log(`⚡ WebSocket Server running on ws://localhost:${PORT}`);
});
