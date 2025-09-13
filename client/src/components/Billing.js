import React, { useState } from 'react';
import axios from 'axios';

const Billing = () => {
  // --- State Management ---
  const [patientName, setPatientName] = useState('');
  const [patientId, setPatientId] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [insuranceProvider, setInsuranceProvider] = useState('');
  const [insurancePolicyNumber, setInsurancePolicyNumber] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // --- Data for Select Dropdowns ---
  const serviceTypes = [
    'General Consultation',
    'Specialist Visit',
    'Diagnostic Tests',
    'Emergency Care',
    'Surgery',
    'Physical Therapy',
    'In-patient Care'
  ];

  const paymentMethods = [
    'Insurance',
    'Credit Card',
    'Bank Transfer',
    'Cash',
    'Online Payment Gateway'
  ];

  // --- Form Submission Handler ---
  const handleBilling = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // API call to the backend to process billing
      const response = await axios.post('http://localhost:5002/api/billings', {
        patientName,
        patientId,
        serviceType,
        amount: parseFloat(amount),
        paymentMethod,
        insuranceProvider,
        insurancePolicyNumber,
        billingAddress,
      });

      // Handle success
      setSuccessMessage(`Billing processed successfully! Transaction ID: ${response.data.transactionId || 'N/A'}`);
      
      // Reset form fields
      setPatientName('');
      setPatientId('');
      setServiceType('');
      setAmount('');
      setPaymentMethod('');
      setInsuranceProvider('');
      setInsurancePolicyNumber('');
      setBillingAddress('');

    } catch (error) {
      // Handle error
      setErrorMessage(error.response?.data?.message || 'An unexpected error occurred. Please try again.');
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
            💳
          </div>
          <h1 style={mainTitleStyle}>Revenue Cycle Management</h1>
          <p style={subtitleStyle}>
            Comprehensive billing and payment processing system with insurance verification,
            automated workflows, and detailed financial reporting for healthcare providers.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={contentSectionStyle}>
        {/* Form Container */}
        <div style={formContainerStyle}>
          <div style={formHeaderStyle}>
            <h2 style={formTitleStyle}>Process Patient Billing</h2>
            <p style={formDescriptionStyle}>
              Generate invoices, process payments, and manage insurance claims efficiently.
            </p>
          </div>

          <form onSubmit={handleBilling} style={formStyle}>
            {/* Patient Information Section */}
            <div style={sectionStyle}>
              <h3 style={sectionTitleStyle}>👤 Patient Information</h3>
              
              <div style={inputRowStyle}>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Patient Full Name *</label>
                  <input
                    type="text"
                    placeholder="Enter patient's full name"
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
                    placeholder="Enter patient ID"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    required
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>Billing Address</label>
                <textarea
                  placeholder="Enter complete billing address"
                  value={billingAddress}
                  onChange={(e) => setBillingAddress(e.target.value)}
                  style={textareaStyle}
                  rows="3"
                />
              </div>
            </div>

            {/* Service Information Section */}
            <div style={sectionStyle}>
              <h3 style={sectionTitleStyle}>🏥 Service Details</h3>
              
              <div style={inputRowStyle}>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Service Type *</label>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    required
                    style={selectStyle}
                  >
                    <option value="">Select service type...</option>
                    {serviceTypes.map((service, index) => (
                      <option key={index} value={service}>{service}</option>
                    ))}
                  </select>
                </div>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Amount (USD) *</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    style={inputStyle}
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Payment Information Section */}
            <div style={sectionStyle}>
              <h3 style={sectionTitleStyle}>💰 Payment Information</h3>
              
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Payment Method *</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  required
                  style={selectStyle}
                >
                  <option value="">Select payment method...</option>
                  {paymentMethods.map((method, index) => (
                    <option key={index} value={method}>{method}</option>
                  ))}
                </select>
              </div>

              <div style={inputRowStyle}>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Insurance Provider</label>
                  <input
                    type="text"
                    placeholder="Enter insurance company name"
                    value={insuranceProvider}
                    onChange={(e) => setInsuranceProvider(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Policy Number</label>
                  <input
                    type="text"
                    placeholder="Enter policy number"
                    value={insurancePolicyNumber}
                    onChange={(e) => setInsurancePolicyNumber(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              style={isLoading ? {...buttonStyle, ...buttonDisabledStyle} : buttonStyle}
              disabled={isLoading}
            >
              {isLoading ? 'Processing Payment...' : 'Process Billing'}
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

        {/* Features Card */}
        <div style={infoCardStyle}>
          <h3 style={infoTitleStyle}>💼 Billing Features</h3>
          
          <div style={featureStyle}>
            <div style={featureIconStyle}>⚡</div>
            <div>
              <h4 style={featureTitleStyle}>Automated Processing</h4>
              <p style={featureTextStyle}>Real-time insurance verification and claims processing</p>
            </div>
          </div>
          
          <div style={featureStyle}>
            <div style={featureIconStyle}>📊</div>
            <div>
              <h4 style={featureTitleStyle}>Financial Reporting</h4>
              <p style={featureTextStyle}>Comprehensive revenue analytics and reporting tools</p>
            </div>
          </div>
          
          <div style={featureStyle}>
            <div style={featureIconStyle}>🔄</div>
            <div>
              <h4 style={featureTitleStyle}>Claims Management</h4>
              <p style={featureTextStyle}>Track and manage insurance claims end-to-end</p>
            </div>
          </div>
          
          <div style={featureStyle}>
            <div style={featureIconStyle}>💻</div>
            <div>
              <h4 style={featureTitleStyle}>Online Payments</h4>
              <p style={featureTextStyle}>Secure patient portal for online payment processing</p>
            </div>
          </div>

          <div style={pricingCardStyle}>
            <h4 style={pricingTitleStyle}>💡 Quick Pricing Guide</h4>
            <div style={pricingItemStyle}>
              <span>General Consultation</span>
              <span style={priceStyle}>$150-200</span>
            </div>
            <div style={pricingItemStyle}>
              <span>Specialist Visit</span>
              <span style={priceStyle}>$250-400</span>
            </div>
            <div style={pricingItemStyle}>
              <span>Diagnostic Tests</span>
              <span style={priceStyle}>$100-500</span>
            </div>
            <div style={pricingItemStyle}>
              <span>Emergency Care</span>
              <span style={priceStyle}>$500-2000</span>
            </div>
          </div>

          <div style={contactInfoStyle}>
            <h4 style={contactTitleStyle}>Billing Support</h4>
            <p style={contactTextStyle}>
              📞 Call: (555) 123-4567 ext. 3<br/>
              📧 Email: billing@healthcare.com<br/>
              🕒 Hours: Mon-Fri 8AM-6PM
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
  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
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
  marginBottom: '40px',
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
  marginBottom: '24px',
};

const inputRowStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '20px',
  marginBottom: '0', // Adjusted to avoid double margin with parent
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
  boxSizing: 'border-box', // Added for consistent sizing
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
  backgroundColor: '#4facfe',
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

const featureStyle = {
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

const pricingCardStyle = {
  backgroundColor: '#f0f9ff',
  borderRadius: '12px',
  padding: '20px',
  border: '1px solid #0ea5e9',
  marginBottom: '24px',
};

const pricingTitleStyle = {
  fontSize: '1.125rem',
  fontWeight: '600',
  color: '#0369a1',
  marginBottom: '16px',
};

const pricingItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '8px 0',
  borderBottom: '1px solid #e0f2fe',
  fontSize: '0.875rem',
  color: '#374151',
};

const priceStyle = {
  fontWeight: '600',
  color: '#0369a1',
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

export default Billing;