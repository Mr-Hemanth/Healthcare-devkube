// ...existing code...

// Alias route for /api/records to support frontend compatibility
// (Place this after app and models are defined)

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 5001; // Port specified directly

// Middleware
app.use(cors()); // Allow requests from your frontend's IP
app.use(express.json()); // Parse JSON requests

// Root route
app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/health', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http:localhost:${PORT}`); // Use public IP address
});
