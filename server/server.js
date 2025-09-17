const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config(); // Add this at the top after your requires

const app = express();
const PORT = process.env.PORT || 5002; // Use environment variable or fallback

// Enhanced Logging Configuration
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
const DATABASE_TYPE = process.env.DATABASE_TYPE || 'atlas';


// Comprehensive Logger
const logger = {
  info: (...args) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [INFO]`, ...args);
  },
  warn: (...args) => {
    const timestamp = new Date().toISOString();
    console.warn(`[${timestamp}] [WARN]`, ...args);
  },
  error: (...args) => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] [ERROR]`, ...args);
  },
  debug: (...args) => {
    if (LOG_LEVEL === 'debug') {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] [DEBUG]`, ...args);
    }
  }
};

logger.info('🚀 Starting Healthcare Backend Server...');
logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
logger.info(`🗃️ Database Type: ${DATABASE_TYPE}`);
logger.info(`📝 Log Level: ${LOG_LEVEL}`);

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

// MongoDB Atlas connection - Use Atlas exclusively for 3-tier architecture
const MONGODB_URI = process.env.MONGODB_ATLAS_URI || 'mongodb+srv://devops:devops@devops.o4ykiod.mongodb.net/?retryWrites=true&w=majority&appName=devops';

logger.info('🔗 Attempting database connection...');
logger.info(`🌐 Connection String: ${MONGODB_URI.substring(0, 30)}...`);
logger.debug(`🔍 Full URI: ${MONGODB_URI}`);

// Enhanced MongoDB connection with detailed logging
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,
  heartbeatFrequencyMS: 10000,
  maxPoolSize: 10,
  minPoolSize: 2,
  retryWrites: true,
  w: 'majority'
})
  .then(() => {
    const dbType = MONGODB_URI.includes('mongodb+srv') ? 'MongoDB Atlas Cloud' : 'Local MongoDB Instance';
    logger.info(`✅ Database connected successfully to: ${dbType}`);
    logger.info(`🔢 Connection readyState: ${mongoose.connection.readyState}`);
    logger.info(`🗄️ Database Name: ${mongoose.connection.db?.databaseName || 'Not available'}`);
  })
  .catch(err => {
    logger.error('❌ MongoDB connection error:', err.message);
    logger.error('🔧 Connection details:', {
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      port: mongoose.connection.port
    });
  });

// MongoDB connection event listeners
mongoose.connection.on('connected', () => {
  logger.info('🟢 MongoDB connected event triggered');
});

mongoose.connection.on('error', (err) => {
  logger.error('🔴 MongoDB connection error event:', err.message);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('🟡 MongoDB disconnected event triggered');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('🛑 Received SIGINT, closing MongoDB connection...');
  await mongoose.connection.close();
  logger.info('✅ MongoDB connection closed');
  process.exit(0);
});

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

  logger.info('📝 Incoming signup request:', { username, email, passwordLength: password?.length });
  logger.debug('🔍 Request body details:', req.body);

  if (!username || !email || !password) {
    logger.warn('❌ Signup validation failed: Missing required fields');
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    logger.debug('🔍 Checking for existing email:', email);
    // Check for existing email
    const existingEmailUser = await User.findOne({ email });
    if (existingEmailUser) {
      logger.warn('❌ Signup failed: Email already exists', email);
      return res.status(400).json({ message: 'Email already in use' });
    }

    logger.debug('🔍 Checking for existing username:', username);
    // Check for existing username
    const existingUsernameUser = await User.findOne({ username });
    if (existingUsernameUser) {
      logger.warn('❌ Signup failed: Username already taken', username);
      return res.status(400).json({ message: 'Username already taken' });
    }

    logger.debug('🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });

    logger.debug('💾 Saving user to database...');
    await user.save();
    logger.info('✅ User registered successfully:', { username, email });
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    logger.error('❌ Error during signup:', error.message);
    logger.debug('🔧 Full error details:', error);
    
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

  logger.info('🔐 Incoming login request:', { email, passwordLength: password?.length });
  logger.debug('🔍 Login attempt details:', { email, hasPassword: !!password });

  try {
    // Check for admin login
    if (email === 'admin' && password === 'admin123') {
      logger.info('👑 Admin login successful');
      return res.status(200).json({ message: 'Admin login successful', redirectTo: '/admin' });
    }

    logger.debug('🔍 Searching for user in database:', email);
    const user = await User.findOne({ email });

    if (!user) {
      logger.warn('❌ Login failed: User not found', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    logger.debug('🔐 Validating password for user:', email);
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      logger.info('✅ Login successful for user:', email);
      res.status(200).json({ message: 'Login successful' });
    } else {
      logger.warn('❌ Login failed: Invalid password for user:', email);
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    logger.error('❌ Error during login:', error.message);
    logger.debug('🔧 Full login error details:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
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
