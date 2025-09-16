const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config(); // Add this at the top after your requires

const app = express();
const PORT = process.env.PORT || 5002; // Use environment variable or fallback

// Middleware
// Configure CORS to allow requests from frontend services
const corsOptions = {
  origin: process.env.CORS_ORIGIN === '*' ? true : [
    'http://localhost:3000',  // Local development
    'http://frontend:3000',   // Docker compose
    'http://healthcare-frontend-service:3000',  // Kubernetes service
    'http://healthcare-frontend-service.healthcare-app.svc.cluster.local:3000',  // Full Kubernetes DNS
    'http://34.180.18.177:30080',  // External NodePort access
    process.env.CORS_ORIGIN   // Environment override
  ].filter(Boolean), // Remove undefined values
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json()); // Parse JSON requests

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Healthcare Backend Server is running!',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: PORT
  });
});

// Health check endpoint for Kubernetes probes
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Metrics endpoint for Prometheus
app.get('/metrics', (req, res) => {
  const metrics = {
    uptime_seconds: process.uptime(),
    memory_usage: process.memoryUsage(),
    database_status: mongoose.connection.readyState,
    requests_total: global.requestCount || 0,
    timestamp: Date.now()
  };
  res.status(200).json(metrics);
});

// Request counter middleware
app.use((req, res, next) => {
  global.requestCount = (global.requestCount || 0) + 1;
  next();
});

// MongoDB connection - Use environment variable with fallback
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGODB_ATLAS_URI || 'mongodb+srv://devops:devops@devops.o4ykiod.mongodb.net/?retryWrites=true&w=majority&appName=devops';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log(`MongoDB connected to: ${MONGODB_URI.includes('mongodb+srv') ? 'Atlas Cloud' : 'Local Instance'}`))
  .catch(err => console.error('MongoDB connection error:', err));

// Define schemas
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});



// Appointment schema updated for frontend fields
const appointmentSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  patientId: { type: String },
  date: { type: Date, required: true },
  time: { type: String },
  doctor: { type: String },
  reason: { type: String },
  status: { type: String, default: 'Scheduled' },
  notes: { type: String },
});

// Medical record schema updated for frontend fields
const medicalRecordSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  patientId: { type: String },
  dateOfBirth: { type: String },
  condition: { type: String, required: true },
  treatment: { type: String },
  medications: { type: String },
  notes: { type: String },
});

// Billing schema updated for frontend fields
const billingSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  patientId: { type: String },
  serviceType: { type: String },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  insuranceProvider: { type: String },
  insurancePolicyNumber: { type: String },
  billingAddress: { type: String },
});

// Define models
const User = mongoose.model('User', userSchema);

const Appointment = mongoose.model('Appointment', appointmentSchema);
const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);
const Billing = mongoose.model('Billing', billingSchema);

// User registration route
app.post('/api/signup', async (req, res) => {
  const { username, email, password } = req.body;

  console.log('Incoming signup request:', req.body);

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check for existing email
    const existingEmailUser = await User.findOne({ email });
    if (existingEmailUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Check for existing username
    const existingUsernameUser = await User.findOne({ username });
    if (existingUsernameUser) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });

    await user.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Error during signup:', error);
    
    // Handle MongoDB duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const value = error.keyValue[field];
      
      if (field === 'username') {
        return res.status(400).json({ message: 'Username already taken' });
      } else if (field === 'email') {
        return res.status(400).json({ message: 'Email already in use' });
      } else {
        return res.status(400).json({ message: `${field} already exists` });
      }
    }
    
    res.status(500).json({ message: 'Error registering user. Please try again.' });
  }
});

// User login route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (email === 'admin' && password === 'admin123') {
      return res.status(200).json({ message: 'Admin login successful', redirectTo: '/admin' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});



// Get all appointments route
app.get('/api/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments', error });
  }
});


// Create new appointment route (with all fields)
app.post('/api/appointments', async (req, res) => {
  const {
    patientName,
    patientId,
    date,
    time,
    doctor,
    reason,
    status,
    notes
  } = req.body;
  try {
    const appointment = new Appointment({
      patientName,
      patientId,
      date,
      time,
      doctor,
      reason,
      status,
      notes
    });
    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({ message: 'Error creating appointment', error });
  }
});

// Create new medical record route (with all fields)
app.post('/api/records', async (req, res) => {
  const {
    patientName,
    patientId,
    dateOfBirth,
    condition,
    treatment,
    medications,
    notes
  } = req.body;
  try {
    const record = new MedicalRecord({
      patientName,
      patientId,
      dateOfBirth,
      condition,
      treatment,
      medications,
      notes
    });
    await record.save();
    res.status(201).json(record);
  } catch (error) {
    res.status(400).json({ message: 'Error creating medical record', error });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}, 'username email'); // Select only relevant fields
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
});

// Create new billing record route (with all fields)
app.post('/api/billings', async (req, res) => {
  const {
    patientName,
    patientId,
    serviceType,
    amount,
    paymentMethod,
    insuranceProvider,
    insurancePolicyNumber,
    billingAddress
  } = req.body;
  try {
    const billing = new Billing({
      patientName,
      patientId,
      serviceType,
      amount,
      paymentMethod,
      insuranceProvider,
      insurancePolicyNumber,
      billingAddress
    });
    await billing.save();
    res.status(201).json(billing);
  } catch (error) {
    res.status(400).json({ message: 'Error creating billing record', error });
  }
});


// Enhanced logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const ip = req.ip || req.connection.remoteAddress;

  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);

  // Log response time
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    console.log(`[${timestamp}] ${method} ${url} - ${status} - ${duration}ms`);
  });

  next();
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  const env = process.env.NODE_ENV || 'development';
  const dbType = MONGODB_URI.includes('mongodb+srv') ? 'Atlas Cloud' : 'Local MongoDB';

  console.log('====================================');
  console.log('🏥 Healthcare Backend Server Started');
  console.log('====================================');
  console.log(`📡 Server: http://0.0.0.0:${PORT}`);
  console.log(`🌍 Environment: ${env}`);
  console.log(`🗄️ Database: ${dbType}`);
  console.log(`⏰ Started: ${new Date().toISOString()}`);
  console.log(`🔧 Process ID: ${process.pid}`);
  console.log(`💾 Memory Usage: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`);
  console.log('====================================');
  console.log('📊 Health Check: /health');
  console.log('📈 Metrics: /metrics');
  console.log('🔗 API Base: /api');
  console.log('====================================');
});
