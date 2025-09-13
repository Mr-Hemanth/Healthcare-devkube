// AppointmentScheduling.js
import React, { useState } from 'react';
import axios from 'axios';

const AppointmentScheduling = () => {
  const [patientName, setPatientName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [doctor, setDoctor] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [reason, setReason] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAppointmentScheduling = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post('http://localhost:5002/api/appointments', {
        patientName,
        date,
        time,
        doctor,
        phoneNumber,
        reason,
      });
      setSuccessMessage('Appointment scheduled successfully! You will receive a confirmation shortly.');
      // Clear form fields
      setPatientName('');
      setDate('');
      setTime('');
      setDoctor('');
      setPhoneNumber('');
      setReason('');
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      setSuccessMessage('Error scheduling appointment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const doctorOptions = [
    'Dr. Sarah Johnson - Cardiologist',
    'Dr. Michael Chen - Neurologist', 
    'Dr. Emily Rodriguez - Pediatrician',
    'Dr. David Thompson - Orthopedist',
    'Dr. Lisa Kumar - Dermatologist',
    'Dr. James Wilson - General Medicine'
  ];

  return (
    <div style={pageContainerStyle}>
      {/* Header Section */}
      <div style={headerSectionStyle}>
        <div style={headerContentStyle}>
          <div style={iconContainerStyle}>
            📅
          </div>
          <h1 style={mainTitleStyle}>Appointment Scheduling</h1>
          <p style={subtitleStyle}>
            Book your appointment with our experienced healthcare professionals. 
            Choose your preferred time and doctor for personalized care.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={contentSectionStyle}>
        <div style={formContainerStyle}>
          <div style={formHeaderStyle}>
            <h2 style={formTitleStyle}>Schedule New Appointment</h2>
            <p style={formDescriptionStyle}>
              Fill in the details below to book your appointment
            </p>
          </div>

          <form onSubmit={handleAppointmentScheduling} style={formStyle}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Patient Full Name *</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                required
                style={inputStyle}
              />
            </div>

            <div style={inputRowStyle}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Preferred Date *</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  style={inputStyle}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Preferred Time *</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Select Doctor *</label>
              <select
                value={doctor}
                onChange={(e) => setDoctor(e.target.value)}
                required
                style={selectStyle}
              >
                <option value="">Choose a doctor...</option>
                {doctorOptions.map((doc, index) => (
                  <option key={index} value={doc}>{doc}</option>
                ))}
              </select>
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Phone Number *</label>
              <input
                type="tel"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                style={inputStyle}
              />
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Reason for Visit</label>
              <textarea
                placeholder="Brief description of your concern (optional)"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                style={textareaStyle}
                rows="4"
              />
            </div>

            <button 
              type="submit" 
              style={isLoading ? {...buttonStyle, ...buttonDisabledStyle} : buttonStyle}
              disabled={isLoading}
            >
              {isLoading ? 'Scheduling...' : 'Schedule Appointment'}
            </button>

            {successMessage && (
              <div style={successMessage.includes('Error') ? errorMessageStyle : successMessageStyle}>
                <div style={messageIconStyle}>
                  {successMessage.includes('Error') ? '❌' : '✅'}
                </div>
                <p style={messageTextStyle}>{successMessage}</p>
              </div>
            )}
          </form>
        </div>

        {/* Info Card */}
        <div style={infoCardStyle}>
          <h3 style={infoTitleStyle}>📋 Appointment Guidelines</h3>
          <ul style={infoListStyle}>
            <li style={infoItemStyle}>
              <strong>Advance Booking:</strong> Schedule at least 24 hours in advance
            </li>
            <li style={infoItemStyle}>
              <strong>Cancellation:</strong> Cancel or reschedule 4 hours before appointment
            </li>
            <li style={infoItemStyle}>
              <strong>Preparation:</strong> Bring your ID and insurance card
            </li>
            <li style={infoItemStyle}>
              <strong>Early Arrival:</strong> Please arrive 15 minutes early
            </li>
          </ul>
          
          <div style={contactInfoStyle}>
            <h4 style={contactTitleStyle}>Need Help?</h4>
            <p style={contactTextStyle}>
              📞 Call us: (555) 123-4567<br/>
              📧 Email: appointments@healthcare.com<br/>
              🕒 Hours: Mon-Fri 8AM-6PM
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Styles
const pageContainerStyle = {
  minHeight: '100vh',
  backgroundColor: '#f8fafc',
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
};

const headerSectionStyle = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  padding: '80px 24px 60px',
  color: 'white',
  textAlign: 'center',
};

const headerContentStyle = {
  maxWidth: '800px',
  margin: '0 auto',
};

const iconContainerStyle = {
  fontSize: '64px',
  marginBottom: '24px',
  display: 'inline-block',
  padding: '20px',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  borderRadius: '50%',
  backdropFilter: 'blur(10px)',
};

const mainTitleStyle = {
  fontSize: '3.5rem',
  fontWeight: '700',
  marginBottom: '16px',
  lineHeight: '1.1',
};

const subtitleStyle = {
  fontSize: '1.25rem',
  opacity: '0.9',
  lineHeight: '1.6',
  maxWidth: '600px',
  margin: '0 auto',
};

const contentSectionStyle = {
  padding: '80px 24px',
  maxWidth: '1200px',
  margin: '0 auto',
  display: 'grid',
  gridTemplateColumns: '2fr 1fr',
  gap: '64px',
  alignItems: 'start',
};

const formContainerStyle = {
  backgroundColor: 'white',
  borderRadius: '16px',
  padding: '48px',
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  border: '1px solid #e5e7eb',
};

const formHeaderStyle = {
  marginBottom: '40px',
  textAlign: 'center',
};

const formTitleStyle = {
  fontSize: '2rem',
  fontWeight: '700',
  color: '#1f2937',
  marginBottom: '12px',
};

const formDescriptionStyle = {
  color: '#6b7280',
  fontSize: '1.1rem',
  lineHeight: '1.6',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
};

const inputGroupStyle = {
  marginBottom: '24px',
};

const inputRowStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '20px',
  marginBottom: '24px',
};

const labelStyle = {
  display: 'block',
  fontSize: '0.875rem',
  fontWeight: '600',
  color: '#374151',
  marginBottom: '8px',
};

const inputStyle = {
  width: '100%',
  padding: '16px',
  borderRadius: '8px',
  border: '2px solid #e5e7eb',
  fontSize: '16px',
  transition: 'all 0.2s ease',
  backgroundColor: '#ffffff',
  outline: 'none',
  fontFamily: 'inherit',
  ':focus': {
    borderColor: '#667eea',
    boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
  },
};

const selectStyle = {
  ...inputStyle,
  appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
  backgroundPosition: 'right 12px center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: '16px',
  paddingRight: '48px',
};

const textareaStyle = {
  ...inputStyle,
  minHeight: '120px',
  resize: 'vertical',
  fontFamily: 'inherit',
};

const buttonStyle = {
  backgroundColor: '#667eea',
  color: 'white',
  padding: '18px 32px',
  borderRadius: '12px',
  border: 'none',
  fontSize: '1.1rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  textTransform: 'none',
  fontFamily: 'inherit',
  marginTop: '16px',
  ':hover': {
    backgroundColor: '#5a67d8',
    transform: 'translateY(-1px)',
    boxShadow: '0 10px 25px rgba(102, 126, 234, 0.3)',
  },
};

const buttonDisabledStyle = {
  backgroundColor: '#9ca3af',
  cursor: 'not-allowed',
  transform: 'none',
};

const successMessageStyle = {
  backgroundColor: '#ecfdf5',
  border: '1px solid #10b981',
  borderRadius: '12px',
  padding: '20px',
  marginTop: '24px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
};

const errorMessageStyle = {
  backgroundColor: '#fef2f2',
  border: '1px solid #ef4444',
  borderRadius: '12px',
  padding: '20px',
  marginTop: '24px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
};

const messageIconStyle = {
  fontSize: '24px',
  flexShrink: 0,
};

const messageTextStyle = {
  color: '#374151',
  margin: '0',
  fontWeight: '500',
};

const infoCardStyle = {
  backgroundColor: 'white',
  borderRadius: '16px',
  padding: '32px',
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  border: '1px solid #e5e7eb',
  height: 'fit-content',
};

const infoTitleStyle = {
  fontSize: '1.5rem',
  fontWeight: '700',
  color: '#1f2937',
  marginBottom: '24px',
};

const infoListStyle = {
  listStyle: 'none',
  padding: '0',
  margin: '0 0 32px 0',
};

const infoItemStyle = {
  padding: '12px 0',
  borderBottom: '1px solid #f3f4f6',
  color: '#4b5563',
  lineHeight: '1.6',
};

const contactInfoStyle = {
  backgroundColor: '#f9fafb',
  borderRadius: '12px',
  padding: '24px',
  border: '1px solid #e5e7eb',
};

const contactTitleStyle = {
  fontSize: '1.125rem',
  fontWeight: '600',
  color: '#1f2937',
  marginBottom: '12px',
};

const contactTextStyle = {
  color: '#6b7280',
  lineHeight: '1.8',
  margin: '0',
};

export default AppointmentScheduling;
