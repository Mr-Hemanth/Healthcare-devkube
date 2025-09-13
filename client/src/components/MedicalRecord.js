import React, { useState } from 'react';
import axios from 'axios';

const MedicalRecordManagement = () => {
  // --- State Management ---
  const [patientName, setPatientName] = useState('');
  const [patientId, setPatientId] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [condition, setCondition] = useState('');
  const [treatment, setTreatment] = useState('');
  const [medications, setMedications] = useState('');
  const [notes, setNotes] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // --- Form Submission Handler ---
  const handleMedicalRecordManagement = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // API call to the backend to save the medical record
      const response = await axios.post('http://localhost:5002/api/records', {
        patientName,
        patientId,
        dateOfBirth,
        condition,
        treatment,
        medications,
        notes,
      });

      // Handle success
      setSuccessMessage(`Medical record saved successfully! Record ID: ${response.data.recordId || 'N/A'}`);
      
      // Reset form fields
      setPatientName('');
      setPatientId('');
      setDateOfBirth('');
      setCondition('');
      setTreatment('');
      setMedications('');
      setNotes('');

    } catch (error) {
      // Handle error
      setErrorMessage(error.response?.data?.message || 'Failed to save record. Please try again.');
    } finally {
      // Stop loading
      setIsLoading(false);
    }
  };

  return (
    <div style={pageContainerStyle}>
      {/* Header Section */}
      <div style={headerSectionStyle}>
        <div style={headerContentStyle}>
          <div style={iconContainerStyle}>
            📄
          </div>
          <h1 style={mainTitleStyle}>Medical Record Management</h1>
          <p style={subtitleStyle}>
            Securely create, update, and manage patient electronic health records (EHR) with
            utmost confidentiality and integrity.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={contentSectionStyle}>
        {/* Form Container */}
        <div style={formContainerStyle}>
          <div style={formHeaderStyle}>
            <h2 style={formTitleStyle}>Add New Medical Record</h2>
            <p style={formDescriptionStyle}>
              Fill in the patient's details to create a new secure health record.
            </p>
          </div>

          <form onSubmit={handleMedicalRecordManagement} style={formStyle}>
            {/* Patient Demographics Section */}
            <div style={sectionStyle}>
              <h3 style={sectionTitleStyle}>👤 Patient Demographics</h3>
              <div style={inputRowStyle}>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Patient Full Name *</label>
                  <input
                    type="text"
                    placeholder="e.g., John Doe"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    required
                    style={inputStyle}
                  />
                </div>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Patient ID *</label>
                  <input
                    type="text"
                    placeholder="e.g., P-12345"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    required
                    style={inputStyle}
                  />
                </div>
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Date of Birth *</label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  required
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Clinical Information Section */}
            <div style={sectionStyle}>
              <h3 style={sectionTitleStyle}>🩺 Clinical Information</h3>
              <div style={inputRowStyle}>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Condition / Diagnosis *</label>
                  <input
                    type="text"
                    placeholder="e.g., Hypertension"
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    required
                    style={inputStyle}
                  />
                </div>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Prescribed Treatment *</label>
                  <input
                    type="text"
                    placeholder="e.g., Lifestyle changes"
                    value={treatment}
                    onChange={(e) => setTreatment(e.target.value)}
                    required
                    style={inputStyle}
                  />
                </div>
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Medications</label>
                <input
                  type="text"
                  placeholder="e.g., Lisinopril 10mg"
                  value={medications}
                  onChange={(e) => setMedications(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Additional Notes</label>
                <textarea
                  placeholder="Enter any additional notes or observations..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={textareaStyle}
                  rows="4"
                />
              </div>
            </div>

            <button
              type="submit"
              style={isLoading ? { ...buttonStyle, ...buttonDisabledStyle } : buttonStyle}
              disabled={isLoading}
            >
              {isLoading ? 'Saving Record...' : 'Submit Medical Record'}
            </button>

            {successMessage && (
              <div style={successMessageStyle}>
                <div style={messageIconStyle}>✅</div>
                <p style={messageTextStyle}>{successMessage}</p>
              </div>
            )}

            {errorMessage && (
              <div style={errorMessageStyle}>
                <div style={messageIconStyle}>❌</div>
                <p style={messageTextStyle}>{errorMessage}</p>
              </div>
            )}
          </form>
        </div>

        {/* Info Card */}
        <div style={infoCardStyle}>
          <h3 style={infoTitleStyle}>🔒 Data Security & Compliance</h3>
          
          <div style={securityFeatureStyle}>
            <div style={featureIconStyle}>🛡️</div>
            <div>
              <h4 style={featureTitleStyle}>End-to-End Encryption</h4>
              <p style={featureTextStyle}>All data is encrypted in transit and at rest using AES-256.</p>
            </div>
          </div>
          
          <div style={securityFeatureStyle}>
            <div style={featureIconStyle}>🔑</div>
            <div>
              <h4 style={featureTitleStyle}>Access Control</h4>
              <p style={featureTextStyle}>Role-based access ensures only authorized personnel can view records.</p>
            </div>
          </div>
          
          <div style={securityFeatureStyle}>
            <div style={featureIconStyle}>📋</div>
            <div>
              <h4 style={featureTitleStyle}>Audit Trails</h4>
              <p style={featureTextStyle}>Comprehensive logs track every access and modification to records.</p>
            </div>
          </div>
          
          <div style={contactInfoStyle}>
            <h4 style={contactTitleStyle}>Need Help?</h4>
            <p style={contactTextStyle}>
              📞 Call: (555) 123-4567 ext. 2<br/>
              📧 Email: records@healthcare.com<br/>
              🕒 Hours: Mon-Fri 8AM-5PM
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Styles ---
const pageContainerStyle = {
  minHeight: '100vh',
  backgroundColor: '#f8fafc',
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
};

const headerSectionStyle = {
  background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
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

const sectionStyle = {
  marginBottom: '32px',
  padding: '24px',
  backgroundColor: '#f9fafb',
  borderRadius: '12px',
  border: '1px solid #e5e7eb',
};

const sectionTitleStyle = {
  fontSize: '1.25rem',
  fontWeight: '600',
  color: '#1f2937',
  marginBottom: '20px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

const inputGroupStyle = {
  marginBottom: '20px',
};

const inputRowStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '20px',
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
  boxSizing: 'border-box',
};

const textareaStyle = {
  ...inputStyle,
  minHeight: '120px',
  resize: 'vertical',
  fontFamily: 'inherit',
};

const buttonStyle = {
  backgroundColor: '#ec4899',
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
};

const buttonDisabledStyle = {
  backgroundColor: '#9ca3af',
  cursor: 'not-allowed',
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

const securityFeatureStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '16px',
  marginBottom: '24px',
  padding: '16px',
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
};

const featureIconStyle = {
  fontSize: '24px',
  flexShrink: 0,
};

const featureTitleStyle = {
  fontSize: '1rem',
  fontWeight: '600',
  color: '#1f2937',
  margin: '0 0 4px 0',
};

const featureTextStyle = {
  fontSize: '0.875rem',
  color: '#6b7280',
  lineHeight: '1.5',
  margin: '0',
};

const contactInfoStyle = {
  backgroundColor: '#f9fafb',
  borderRadius: '12px',
  padding: '24px',
  border: '1px solid #e5e7eb',
  marginTop: '24px',
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

export default MedicalRecordManagement;