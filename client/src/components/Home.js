import React from 'react';
import { Link } from 'react-router-dom';
import { useProtectedNavigation } from '../hooks/useProtectedNavigation';

const Home = () => {
  const { navigateToProtectedRoute } = useProtectedNavigation();

  const cardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '24px',
    margin: '12px',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    color: 'inherit',
    display: 'block',
    border: '1px solid #e8ecef',
  };

  const sectionStyle = {
    padding: '64px 24px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const containerStyle = {
    maxWidth: '1140px',
    margin: '0 auto',
    width: '100%',
  };

  const featureCardStyle = {
    ...cardStyle,
    textAlign: 'center',
    cursor: 'pointer',
    ':hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)',
    }
  };

  return (
    <div style={{ backgroundColor: '#fafbfc' }}>
      {/* Hero Section */}
      <section style={{ 
        ...sectionStyle, 
        background: 'linear-gradient(135deg, #2c5aa0 0%, #1e3a8a 100%)', 
        color: '#ffffff',
        textAlign: 'center',
        paddingTop: '96px',
        paddingBottom: '96px'
      }}>
        <div style={containerStyle}>
          <h1 style={{ 
            fontSize: '3.2rem', 
            marginBottom: '24px', 
            fontWeight: '700',
            letterSpacing: '-0.02em',
            lineHeight: '1.1'
          }}>
            Advanced Healthcare Management Platform
          </h1>
          <p style={{ 
            fontSize: '1.25rem', 
            marginBottom: '48px', 
            maxWidth: '640px', 
            margin: '0 auto 48px auto',
            opacity: '0.95',
            lineHeight: '1.6'
          }}>
            Streamline operations, enhance patient care, and optimize healthcare delivery with our comprehensive digital solution
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link 
              to="/login" 
              style={{
                padding: '14px 32px',
                backgroundColor: '#ffffff',
                color: '#1e3a8a',
                textDecoration: 'none',
                borderRadius: '6px',
                fontWeight: '600',
                fontSize: '1rem',
                transition: 'all 0.2s ease',
                border: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              Get Started
            </Link>
            <Link 
              to="/about" 
              style={{
                padding: '14px 32px',
                backgroundColor: 'transparent',
                color: '#ffffff',
                textDecoration: 'none',
                borderRadius: '6px',
                fontWeight: '600',
                fontSize: '1rem',
                transition: 'all 0.2s ease',
                border: '2px solid rgba(255,255,255,0.3)'
              }}
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section style={{ ...sectionStyle, backgroundColor: '#ffffff' }}>
        <div style={containerStyle}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ 
              fontSize: '2.5rem', 
              color: '#1f2937', 
              marginBottom: '16px',
              fontWeight: '700',
              lineHeight: '1.2'
            }}>
              Core Healthcare Solutions
            </h2>
            <p style={{ 
              fontSize: '1.125rem', 
              color: '#6b7280', 
              maxWidth: '560px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Comprehensive digital tools designed to modernize healthcare operations and improve patient outcomes
            </p>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
            gap: '24px' 
          }}>
            <div 
              style={{...featureCardStyle, cursor: 'pointer'}} 
              onClick={() => navigateToProtectedRoute('/appointment-scheduling')}
            >
              <div style={{ 
                width: '64px',
                height: '64px',
                backgroundColor: '#dbeafe',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '24px',
                color: '#2563eb'
              }}>
                📅
              </div>
              <h3 style={{ 
                color: '#1f2937', 
                marginBottom: '12px', 
                fontSize: '1.25rem',
                fontWeight: '600'
              }}>
                Appointment Management
              </h3>
              <p style={{ 
                color: '#6b7280', 
                lineHeight: '1.6',
                fontSize: '0.95rem',
                margin: '0'
              }}>
                Intelligent scheduling system with automated reminders, calendar integration, and real-time availability tracking for optimal resource allocation.
              </p>
            </div>

            <div 
              style={{...featureCardStyle, cursor: 'pointer'}} 
              onClick={() => navigateToProtectedRoute('/medical-record')}
            >
              <div style={{ 
                width: '64px',
                height: '64px',
                backgroundColor: '#fef3c7',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '24px',
                color: '#d97706'
              }}>
                📋
              </div>
              <h3 style={{ 
                color: '#1f2937', 
                marginBottom: '12px', 
                fontSize: '1.25rem',
                fontWeight: '600'
              }}>
                Electronic Health Records
              </h3>
              <p style={{ 
                color: '#6b7280', 
                lineHeight: '1.6',
                fontSize: '0.95rem',
                margin: '0'
              }}>
                HIPAA-compliant digital records management with advanced search, version control, and seamless provider collaboration capabilities.
              </p>
            </div>

            <div 
              style={{...featureCardStyle, cursor: 'pointer'}} 
              onClick={() => navigateToProtectedRoute('/billing')}
            >
              <div style={{ 
                width: '64px',
                height: '64px',
                backgroundColor: '#d1fae5',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '24px',
                color: '#059669'
              }}>
                💳
              </div>
              <h3 style={{ 
                color: '#1f2937', 
                marginBottom: '12px', 
                fontSize: '1.25rem',
                fontWeight: '600'
              }}>
                Revenue Cycle Management
              </h3>
              <p style={{ 
                color: '#6b7280', 
                lineHeight: '1.6',
                fontSize: '0.95rem',
                margin: '0'
              }}>
                Automated billing workflows, insurance verification, claims processing, and comprehensive financial reporting for optimized revenue streams.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ ...sectionStyle, backgroundColor: '#f9fafb' }}>
        <div style={containerStyle}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ 
              fontSize: '2.5rem', 
              color: '#1f2937', 
              marginBottom: '16px',
              fontWeight: '700',
              lineHeight: '1.2'
            }}>
              Why Healthcare Professionals Choose Us
            </h2>
            <p style={{ 
              fontSize: '1.125rem', 
              color: '#6b7280', 
              maxWidth: '560px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Enterprise-grade features built specifically for modern healthcare environments
            </p>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '24px' 
          }}>
            <div style={cardStyle}>
              <div style={{ 
                width: '56px', 
                height: '56px', 
                borderRadius: '8px', 
                backgroundColor: '#dbeafe', 
                margin: '0 0 16px 0', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '20px', 
                color: '#2563eb' 
              }}>
                🔒
              </div>
              <h4 style={{ color: '#1f2937', marginBottom: '8px', fontSize: '1.125rem', fontWeight: '600' }}>
                Enterprise Security
              </h4>
              <p style={{ color: '#6b7280', lineHeight: '1.6', fontSize: '0.95rem', margin: '0' }}>
                HIPAA-compliant infrastructure with end-to-end encryption and multi-factor authentication.
              </p>
            </div>

            <div style={cardStyle}>
              <div style={{ 
                width: '56px', 
                height: '56px', 
                borderRadius: '8px', 
                backgroundColor: '#fef3c7', 
                margin: '0 0 16px 0', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '20px', 
                color: '#d97706' 
              }}>
                ⚡
              </div>
              <h4 style={{ color: '#1f2937', marginBottom: '8px', fontSize: '1.125rem', fontWeight: '600' }}>
                High Performance
              </h4>
              <p style={{ color: '#6b7280', lineHeight: '1.6', fontSize: '0.95rem', margin: '0' }}>
                Cloud-native architecture ensuring 99.9% uptime and lightning-fast response times.
              </p>
            </div>

            <div style={cardStyle}>
              <div style={{ 
                width: '56px', 
                height: '56px', 
                borderRadius: '8px', 
                backgroundColor: '#d1fae5', 
                margin: '0 0 16px 0', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '20px', 
                color: '#059669' 
              }}>
                📱
              </div>
              <h4 style={{ color: '#1f2937', marginBottom: '8px', fontSize: '1.125rem', fontWeight: '600' }}>
                Cross-Platform Access
              </h4>
              <p style={{ color: '#6b7280', lineHeight: '1.6', fontSize: '0.95rem', margin: '0' }}>
                Responsive design optimized for desktop, tablet, and mobile healthcare workflows.
              </p>
            </div>

            <div style={cardStyle}>
              <div style={{ 
                width: '56px', 
                height: '56px', 
                borderRadius: '8px', 
                backgroundColor: '#fce7f3', 
                margin: '0 0 16px 0', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '20px', 
                color: '#be185d' 
              }}>
                🎯
              </div>
              <h4 style={{ color: '#1f2937', marginBottom: '8px', fontSize: '1.125rem', fontWeight: '600' }}>
                AI-Powered Insights
              </h4>
              <p style={{ color: '#6b7280', lineHeight: '1.6', fontSize: '0.95rem', margin: '0' }}>
                Machine learning algorithms for predictive analytics and clinical decision support.
              </p>
            </div>

            <div style={cardStyle}>
              <div style={{ 
                width: '56px', 
                height: '56px', 
                borderRadius: '8px', 
                backgroundColor: '#e0e7ff', 
                margin: '0 0 16px 0', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '20px', 
                color: '#4338ca' 
              }}>
                🔄
              </div>
              <h4 style={{ color: '#1f2937', marginBottom: '8px', fontSize: '1.125rem', fontWeight: '600' }}>
                Seamless Integration
              </h4>
              <p style={{ color: '#6b7280', lineHeight: '1.6', fontSize: '0.95rem', margin: '0' }}>
                HL7 FHIR compliant with 200+ healthcare system integrations available.
              </p>
            </div>

            <div style={cardStyle}>
              <div style={{ 
                width: '56px', 
                height: '56px', 
                borderRadius: '8px', 
                backgroundColor: '#fef2f2', 
                margin: '0 0 16px 0', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '20px', 
                color: '#dc2626' 
              }}>
                📊
              </div>
              <h4 style={{ color: '#1f2937', marginBottom: '8px', fontSize: '1.125rem', fontWeight: '600' }}>
                Advanced Analytics
              </h4>
              <p style={{ color: '#6b7280', lineHeight: '1.6', fontSize: '0.95rem', margin: '0' }}>
                Real-time dashboards and comprehensive reporting for data-driven decision making.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section style={{ 
        ...sectionStyle, 
        background: 'linear-gradient(135deg, #2c5aa0 0%, #1e3a8a 100%)', 
        color: '#ffffff',
        textAlign: 'center',
        paddingTop: '80px',
        paddingBottom: '80px'
      }}>
        <div style={containerStyle}>
          <h2 style={{ 
            fontSize: '2.5rem', 
            marginBottom: '16px',
            fontWeight: '700',
            lineHeight: '1.2'
          }}>
            Transform Your Healthcare Operations Today
          </h2>
          <p style={{ 
            fontSize: '1.125rem', 
            marginBottom: '40px', 
            maxWidth: '560px', 
            margin: '0 auto 40px auto',
            opacity: '0.95',
            lineHeight: '1.6'
          }}>
            Join over 500+ healthcare facilities already using our platform to deliver exceptional patient care
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link 
              to="/signup" 
              style={{
                padding: '16px 32px',
                backgroundColor: '#ffffff',
                color: '#1e3a8a',
                textDecoration: 'none',
                borderRadius: '6px',
                fontWeight: '600',
                fontSize: '1rem',
                transition: 'all 0.2s ease',
                display: 'inline-block',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              Start Free Trial
            </Link>
            <Link 
              to="/about" 
              style={{
                padding: '16px 32px',
                backgroundColor: 'transparent',
                color: '#ffffff',
                textDecoration: 'none',
                borderRadius: '6px',
                fontWeight: '600',
                fontSize: '1rem',
                transition: 'all 0.2s ease',
                display: 'inline-block',
                border: '2px solid rgba(255,255,255,0.3)'
              }}
            >
              View Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;