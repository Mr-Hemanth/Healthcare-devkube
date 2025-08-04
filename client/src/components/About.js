import React from 'react';

const About = () => {
  const cardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '24px',
    margin: '12px',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
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
  };

  const teamMember = {
    ...cardStyle,
    textAlign: 'center',
    maxWidth: '280px',
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
            About HealthTech Solutions
          </h1>
          <p style={{ 
            fontSize: '1.25rem', 
            maxWidth: '640px', 
            margin: '0 auto',
            opacity: '0.95',
            lineHeight: '1.6'
          }}>
            Leading the digital transformation of healthcare through innovative technology solutions and evidence-based care management
          </p>
        </div>
      </section>

      {/* Mission Section */}
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
              Our Mission & Values
            </h2>
            <p style={{ 
              fontSize: '1.125rem', 
              color: '#6b7280', 
              maxWidth: '560px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Empowering healthcare organizations with cutting-edge technology to deliver exceptional patient outcomes
            </p>
          </div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
            gap: '24px' 
          }}>
            <div style={cardStyle}>
              <div style={{ 
                width: '64px',
                height: '64px',
                backgroundColor: '#dbeafe',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 0 20px 0',
                fontSize: '24px',
                color: '#2563eb'
              }}>
                🏥
              </div>
              <h3 style={{ 
                color: '#1f2937', 
                marginBottom: '12px',
                fontSize: '1.25rem',
                fontWeight: '600'
              }}>
                Clinical Excellence
              </h3>
              <p style={{ 
                color: '#6b7280', 
                lineHeight: '1.6',
                fontSize: '0.95rem',
                margin: '0'
              }}>
                Committed to supporting evidence-based medicine through advanced clinical decision support systems and quality metrics tracking.
              </p>
            </div>
            
            <div style={cardStyle}>
              <div style={{ 
                width: '64px',
                height: '64px',
                backgroundColor: '#fef3c7',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 0 20px 0',
                fontSize: '24px',
                color: '#d97706'
              }}>
                💻
              </div>
              <h3 style={{ 
                color: '#1f2937', 
                marginBottom: '12px',
                fontSize: '1.25rem',
                fontWeight: '600'
              }}>
                Technology Innovation
              </h3>
              <p style={{ 
                color: '#6b7280', 
                lineHeight: '1.6',
                fontSize: '0.95rem',
                margin: '0'
              }}>
                Leveraging artificial intelligence, machine learning, and cloud computing to create scalable healthcare solutions.
              </p>
            </div>

            <div style={cardStyle}>
              <div style={{ 
                width: '64px',
                height: '64px',
                backgroundColor: '#d1fae5',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 0 20px 0',
                fontSize: '24px',
                color: '#059669'
              }}>
                👥
              </div>
              <h3 style={{ 
                color: '#1f2937', 
                marginBottom: '12px',
                fontSize: '1.25rem',
                fontWeight: '600'
              }}>
                Patient-Centric Focus
              </h3>
              <p style={{ 
                color: '#6b7280', 
                lineHeight: '1.6',
                fontSize: '0.95rem',
                margin: '0'
              }}>
                Designing intuitive workflows that enhance patient engagement while reducing administrative burden on healthcare staff.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
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
              Comprehensive Healthcare Solutions
            </h2>
            <p style={{ 
              fontSize: '1.125rem', 
              color: '#6b7280', 
              maxWidth: '560px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Enterprise-grade modules designed for modern healthcare workflows
            </p>
          </div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
            gap: '20px' 
          }}>
            <div style={cardStyle}>
              <h4 style={{ 
                color: '#2563eb', 
                marginBottom: '8px',
                fontSize: '1.125rem',
                fontWeight: '600'
              }}>
                Electronic Health Records
              </h4>
              <p style={{ 
                color: '#6b7280',
                fontSize: '0.95rem',
                lineHeight: '1.6',
                margin: '0'
              }}>
                HIPAA-compliant digital records with interoperability standards
              </p>
            </div>
            
            <div style={cardStyle}>
              <h4 style={{ 
                color: '#2563eb', 
                marginBottom: '8px',
                fontSize: '1.125rem',
                fontWeight: '600'
              }}>
                Practice Management
              </h4>
              <p style={{ 
                color: '#6b7280',
                fontSize: '0.95rem',
                lineHeight: '1.6',
                margin: '0'
              }}>
                Streamlined scheduling, patient flow, and resource optimization
              </p>
            </div>

            <div style={cardStyle}>
              <h4 style={{ 
                color: '#2563eb', 
                marginBottom: '8px',
                fontSize: '1.125rem',
                fontWeight: '600'
              }}>
                Revenue Cycle Management
              </h4>
              <p style={{ 
                color: '#6b7280',
                fontSize: '0.95rem',
                lineHeight: '1.6',
                margin: '0'
              }}>
                Automated billing, claims processing, and financial analytics
              </p>
            </div>

            <div style={cardStyle}>
              <h4 style={{ 
                color: '#2563eb', 
                marginBottom: '8px',
                fontSize: '1.125rem',
                fontWeight: '600'
              }}>
                Clinical Decision Support
              </h4>
              <p style={{ 
                color: '#6b7280',
                fontSize: '0.95rem',
                lineHeight: '1.6',
                margin: '0'
              }}>
                AI-powered alerts, guidelines, and diagnostic assistance
              </p>
            </div>

            <div style={cardStyle}>
              <h4 style={{ 
                color: '#2563eb', 
                marginBottom: '8px',
                fontSize: '1.125rem',
                fontWeight: '600'
              }}>
                Population Health Analytics
              </h4>
              <p style={{ 
                color: '#6b7280',
                fontSize: '0.95rem',
                lineHeight: '1.6',
                margin: '0'
              }}>
                Comprehensive reporting for quality metrics and outcomes
              </p>
            </div>

            <div style={cardStyle}>
              <h4 style={{ 
                color: '#2563eb', 
                marginBottom: '8px',
                fontSize: '1.125rem',
                fontWeight: '600'
              }}>
                Telehealth Integration
              </h4>
              <p style={{ 
                color: '#6b7280',
                fontSize: '0.95rem',
                lineHeight: '1.6',
                margin: '0'
              }}>
                Secure video consultations with seamless workflow integration
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
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
              Leadership Team
            </h2>
            <p style={{ 
              fontSize: '1.125rem', 
              color: '#6b7280', 
              maxWidth: '560px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Healthcare and technology experts dedicated to transforming patient care
            </p>
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            flexWrap: 'wrap', 
            gap: '24px' 
          }}>
            <div style={teamMember}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '50%', 
                backgroundColor: '#dbeafe', 
                margin: '0 auto 16px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '24px', 
                color: '#2563eb' 
              }}>
                👨‍⚕️
              </div>
              <h4 style={{ 
                color: '#1f2937', 
                marginBottom: '8px',
                fontSize: '1.125rem',
                fontWeight: '600'
              }}>
                Dr. Sarah Johnson, MD
              </h4>
              <p style={{ 
                color: '#6b7280', 
                marginBottom: '8px',
                fontSize: '0.95rem',
                fontWeight: '500'
              }}>
                Chief Medical Officer
              </p>
              <p style={{ 
                color: '#9ca3af', 
                fontSize: '0.875rem',
                lineHeight: '1.5',
                margin: '0'
              }}>
                Board-certified physician with 20+ years in healthcare informatics and quality improvement
              </p>
            </div>

            <div style={teamMember}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '50%', 
                backgroundColor: '#fef3c7', 
                margin: '0 auto 16px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '24px', 
                color: '#d97706' 
              }}>
                👨‍💻
              </div>
              <h4 style={{ 
                color: '#1f2937', 
                marginBottom: '8px',
                fontSize: '1.125rem',
                fontWeight: '600'
              }}>
                Michael Chen
              </h4>
              <p style={{ 
                color: '#6b7280', 
                marginBottom: '8px',
                fontSize: '0.95rem',
                fontWeight: '500'
              }}>
                Chief Technology Officer
              </p>
              <p style={{ 
                color: '#9ca3af', 
                fontSize: '0.875rem',
                lineHeight: '1.5',
                margin: '0'
              }}>
                Former Apple & Google engineer specializing in scalable healthcare platforms and AI integration
              </p>
            </div>

            <div style={teamMember}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '50%', 
                backgroundColor: '#d1fae5', 
                margin: '0 auto 16px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '24px', 
                color: '#059669' 
              }}>
                👩‍💼
              </div>
              <h4 style={{ 
                color: '#1f2937', 
                marginBottom: '8px',
                fontSize: '1.125rem',
                fontWeight: '600'
              }}>
                Lisa Rodriguez
              </h4>
              <p style={{ 
                color: '#6b7280', 
                marginBottom: '8px',
                fontSize: '0.95rem',
                fontWeight: '500'
              }}>
                VP of Customer Success
              </p>
              <p style={{ 
                color: '#9ca3af', 
                fontSize: '0.875rem',
                lineHeight: '1.5',
                margin: '0'
              }}>
                Healthcare operations expert ensuring seamless implementation and ongoing customer satisfaction
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;