import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Welcome from './components/Welcome';
import Home from './components/Home';
import About from './components/About';
import Login from './components/Login';
import Signup from './components/Signup';
import AppointmentScheduling from './components/AppointmentScheduling';
import MedicalRecord from './components/MedicalRecord';
import Billing from './components/Billing';
import AdminPage from './components/AdminPage';
import Footer from './components/Footer'; 
import ProtectedRoute from './components/ProtectedRoute';




function App() {
  return (
    <Router>
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/appointment-scheduling" element={<ProtectedRoute><AppointmentScheduling /></ProtectedRoute>} />
        <Route path="/medical-record" element={<ProtectedRoute><MedicalRecord /></ProtectedRoute>} />
        <Route path="/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
        <Route path="/about" element={<About />} />
      </Routes>
      <Footer />
    </div>
  </Router>
  );
}

export default App;