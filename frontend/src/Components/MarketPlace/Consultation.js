import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Consultation.css';

const Consultation = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Consultation Details
    consultationType: '',
    preferredDate: '',
    preferredTime: '',
    timezone: 'UTC',
    
    // Gemstone Interests
    gemTypes: [],
    budget: '',
    purpose: '',
    experience: '',
    
    // Additional Information
    specificQuestions: '',
    urgency: 'normal',
    communicationPreference: 'email',
    
    // Location
    location: '',
    virtualPreference: true
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const consultationTypes = [
    {
      id: 'investment',
      title: 'Investment Consultation',
      description: 'Expert advice on gemstone investments and portfolio building',
      duration: '60 minutes',
      price: '$150',
      icon: '💎'
    },
    {
      id: 'collection',
      title: 'Collection Building',
      description: 'Guidance on creating a meaningful gemstone collection',
      duration: '45 minutes',
      price: '$100',
      icon: '🏛️'
    },
    {
      id: 'certification',
      title: 'Certification & Authentication',
      description: 'Professional gemstone certification and authenticity verification',
      duration: '30 minutes',
      price: '$75',
      icon: '🔍'
    },
    {
      id: 'custom',
      title: 'Custom Design Consultation',
      description: 'Personalized jewelry design and gemstone selection',
      duration: '90 minutes',
      price: '$200',
      icon: '🎨'
    },
    {
      id: 'education',
      title: 'Educational Session',
      description: 'Learn about gemstones, their properties, and care',
      duration: '45 minutes',
      price: '$80',
      icon: '📚'
    },
    {
      id: 'appraisal',
      title: 'Gemstone Appraisal',
      description: 'Professional valuation of your existing gemstones',
      duration: '60 minutes',
      price: '$120',
      icon: '💰'
    }
  ];

  const gemTypes = [
    'Diamond', 'Ruby', 'Sapphire', 'Emerald', 'Amethyst', 'Citrine',
    'Topaz', 'Garnet', 'Peridot', 'Aquamarine', 'Opal', 'Pearl',
    'Tanzanite', 'Alexandrite', 'Tourmaline', 'Spinel', 'Other'
  ];

  const purposes = [
    'Investment',
    'Personal Collection',
    'Jewelry Design',
    'Gift',
    'Heirloom',
    'Learning',
    'Certification',
    'Appraisal'
  ];

  const experienceLevels = [
    'Beginner',
    'Intermediate',
    'Advanced',
    'Collector',
    'Professional'
  ];

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
    '05:00 PM', '06:00 PM'
  ];

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        break;
      case 2:
        if (!formData.consultationType) newErrors.consultationType = 'Please select a consultation type';
        if (!formData.preferredDate) newErrors.preferredDate = 'Please select a preferred date';
        if (!formData.preferredTime) newErrors.preferredTime = 'Please select a preferred time';
        break;
      case 3:
        if (formData.gemTypes.length === 0) newErrors.gemTypes = 'Please select at least one gem type';
        if (!formData.purpose) newErrors.purpose = 'Please select a purpose';
        if (!formData.experience) newErrors.experience = 'Please select your experience level';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleGemTypeToggle = (gemType) => {
    setFormData(prev => ({
      ...prev,
      gemTypes: prev.gemTypes.includes(gemType)
        ? prev.gemTypes.filter(type => type !== gemType)
        : [...prev.gemTypes, gemType]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(3)) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/consultation/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setSubmitted(true);
        // Reset form after successful submission
        setTimeout(() => {
          setFormData({
            firstName: '', lastName: '', email: '', phone: '',
            consultationType: '', preferredDate: '', preferredTime: '', timezone: 'UTC',
            gemTypes: [], budget: '', purpose: '', experience: '',
            specificQuestions: '', urgency: 'normal', communicationPreference: 'email',
            location: '', virtualPreference: true
          });
          setCurrentStep(1);
          setSubmitted(false);
        }, 5000);
      } else {
        throw new Error('Failed to book consultation');
      }
    } catch (error) {
      console.error('Error booking consultation:', error);
      setErrors({ submit: 'Failed to book consultation. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  if (submitted) {
    return (
      <div className="consultation-container">
        <div className="consultation-success">
          <div className="success-animation">
            <div className="success-icon">
              <div className="checkmark">
                <div className="checkmark-circle"></div>
                <div className="checkmark-stem"></div>
                <div className="checkmark-kick"></div>
              </div>
            </div>
            <div className="success-particles">
              <div className="particle particle-1">✨</div>
              <div className="particle particle-2">💎</div>
              <div className="particle particle-3">⭐</div>
              <div className="particle particle-4">✨</div>
              <div className="particle particle-5">💎</div>
            </div>
          </div>
          
          <div className="success-content">
            <h2 className="success-title">Consultation Booked Successfully!</h2>
            <p className="success-message">
              Thank you for choosing our expert consultation service. Our certified gemologists will contact you within 24 hours to confirm your appointment.
            </p>
            
            <div className="success-details">
              <div className="detail-card">
                <div className="detail-header">
                  <div className="detail-icon">📅</div>
                  <h3>Appointment Details</h3>
                </div>
                <div className="detail-content">
                  <div className="detail-row">
                    <span className="detail-label">Consultation Type:</span>
                    <span className="detail-value">{consultationTypes.find(t => t.id === formData.consultationType)?.title}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Preferred Date:</span>
                    <span className="detail-value">{new Date(formData.preferredDate).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Preferred Time:</span>
                    <span className="detail-value">{formData.preferredTime}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Duration:</span>
                    <span className="detail-value">{consultationTypes.find(t => t.id === formData.consultationType)?.duration}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Fee:</span>
                    <span className="detail-value">{consultationTypes.find(t => t.id === formData.consultationType)?.price}</span>
                  </div>
                </div>
              </div>
              
              <div className="detail-card">
                <div className="detail-header">
                  <div className="detail-icon">👤</div>
                  <h3>Contact Information</h3>
                </div>
                <div className="detail-content">
                  <div className="detail-row">
                    <span className="detail-label">Name:</span>
                    <span className="detail-value">{formData.firstName} {formData.lastName}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{formData.email}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Phone:</span>
                    <span className="detail-value">{formData.phone}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Communication:</span>
                    <span className="detail-value">{formData.communicationPreference}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="success-actions">
              <button 
                className="success-btn primary"
                onClick={() => navigate('/')}
              >
                <span className="btn-icon">🏠</span>
                Return to Home
              </button>
              <button 
                className="success-btn secondary"
                onClick={() => navigate('/web_home')}
              >
                <span className="btn-icon">💎</span>
                Browse Gems
              </button>
              <button 
                className="success-btn tertiary"
                onClick={() => {
                  setSubmitted(false);
                  setCurrentStep(1);
                  setFormData({
                    firstName: '', lastName: '', email: '', phone: '',
                    consultationType: '', preferredDate: '', preferredTime: '', timezone: 'UTC',
                    gemTypes: [], budget: '', purpose: '', experience: '',
                    specificQuestions: '', urgency: 'normal', communicationPreference: 'email',
                    location: '', virtualPreference: true
                  });
                }}
              >
                <span className="btn-icon">📅</span>
                Book Another
              </button>
            </div>
            
            <div className="success-footer">
              <div className="footer-info">
                <div className="info-item">
                  <span className="info-icon">📧</span>
                  <span>Confirmation email sent to {formData.email}</span>
                </div>
                <div className="info-item">
                  <span className="info-icon">⏰</span>
                  <span>Response time: Within 24 hours</span>
                </div>
                <div className="info-item">
                  <span className="info-icon">🔒</span>
                  <span>Your data is secure and private</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="consultation-container">
      <div className="consultation-header">
        <h1>Book Your Gemstone Consultation</h1>
        <p>Get expert advice from our certified gemologists</p>
      </div>

      <div className="consultation-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(currentStep / 3) * 100}%` }}
          ></div>
        </div>
        <div className="progress-steps">
          <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">Personal Info</span>
          </div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">Consultation Details</span>
          </div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-label">Preferences</span>
          </div>
        </div>
      </div>

      <form className="consultation-form" onSubmit={handleSubmit}>
        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <div className="form-step">
            <h2>Personal Information</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name *</label>
                <input
                  type="text"
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={errors.firstName ? 'error' : ''}
                />
                {errors.firstName && <span className="error-message">{errors.firstName}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name *</label>
                <input
                  type="text"
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={errors.lastName ? 'error' : ''}
                />
                {errors.lastName && <span className="error-message">{errors.lastName}</span>}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={errors.phone ? 'error' : ''}
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Consultation Details */}
        {currentStep === 2 && (
          <div className="form-step">
            <h2>Consultation Details</h2>
            
            <div className="consultation-types">
              <h3>Select Consultation Type *</h3>
              <div className="type-grid">
                {consultationTypes.map(type => (
                  <div
                    key={type.id}
                    className={`type-card ${formData.consultationType === type.id ? 'selected' : ''}`}
                    onClick={() => handleInputChange('consultationType', type.id)}
                  >
                    <div className="type-icon">{type.icon}</div>
                    <h4>{type.title}</h4>
                    <p>{type.description}</p>
                    <div className="type-details">
                      <span className="duration">{type.duration}</span>
                      <span className="price">{type.price}</span>
                    </div>
                  </div>
                ))}
              </div>
              {errors.consultationType && <span className="error-message">{errors.consultationType}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="preferredDate">Preferred Date *</label>
                <input
                  type="date"
                  id="preferredDate"
                  value={formData.preferredDate}
                  onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                  min={getMinDate()}
                  max={getMaxDate()}
                  className={errors.preferredDate ? 'error' : ''}
                />
                {errors.preferredDate && <span className="error-message">{errors.preferredDate}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="preferredTime">Preferred Time *</label>
                <select
                  id="preferredTime"
                  value={formData.preferredTime}
                  onChange={(e) => handleInputChange('preferredTime', e.target.value)}
                  className={errors.preferredTime ? 'error' : ''}
                >
                  <option value="">Select Time</option>
                  {timeSlots.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
                {errors.preferredTime && <span className="error-message">{errors.preferredTime}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="timezone">Timezone</label>
              <select
                id="timezone"
                value={formData.timezone}
                onChange={(e) => handleInputChange('timezone', e.target.value)}
              >
                <option value="UTC">UTC</option>
                <option value="EST">Eastern Time (EST)</option>
                <option value="PST">Pacific Time (PST)</option>
                <option value="GMT">Greenwich Mean Time (GMT)</option>
                <option value="CET">Central European Time (CET)</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 3: Preferences */}
        {currentStep === 3 && (
          <div className="form-step">
            <h2>Your Preferences</h2>
            
            <div className="form-group">
              <label>Gem Types of Interest *</label>
              <div className="gem-types-grid">
                {gemTypes.map(gemType => (
                  <button
                    key={gemType}
                    type="button"
                    className={`gem-type-btn ${formData.gemTypes.includes(gemType) ? 'selected' : ''}`}
                    onClick={() => handleGemTypeToggle(gemType)}
                  >
                    {gemType}
                  </button>
                ))}
              </div>
              {errors.gemTypes && <span className="error-message">{errors.gemTypes}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="purpose">Purpose *</label>
                <select
                  id="purpose"
                  value={formData.purpose}
                  onChange={(e) => handleInputChange('purpose', e.target.value)}
                  className={errors.purpose ? 'error' : ''}
                >
                  <option value="">Select Purpose</option>
                  {purposes.map(purpose => (
                    <option key={purpose} value={purpose}>{purpose}</option>
                  ))}
                </select>
                {errors.purpose && <span className="error-message">{errors.purpose}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="experience">Experience Level *</label>
                <select
                  id="experience"
                  value={formData.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  className={errors.experience ? 'error' : ''}
                >
                  <option value="">Select Experience</option>
                  {experienceLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
                {errors.experience && <span className="error-message">{errors.experience}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="budget">Budget Range (Optional)</label>
              <select
                id="budget"
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
              >
                <option value="">Select Budget Range</option>
                <option value="under-1000">Under $1,000</option>
                <option value="1000-5000">$1,000 - $5,000</option>
                <option value="5000-10000">$5,000 - $10,000</option>
                <option value="10000-25000">$10,000 - $25,000</option>
                <option value="25000-50000">$25,000 - $50,000</option>
                <option value="over-50000">Over $50,000</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="specificQuestions">Specific Questions or Requirements</label>
              <textarea
                id="specificQuestions"
                value={formData.specificQuestions}
                onChange={(e) => handleInputChange('specificQuestions', e.target.value)}
                rows="4"
                placeholder="Tell us about any specific questions, requirements, or goals for your consultation..."
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="urgency">Urgency</label>
                <select
                  id="urgency"
                  value={formData.urgency}
                  onChange={(e) => handleInputChange('urgency', e.target.value)}
                >
                  <option value="normal">Normal (1-2 weeks)</option>
                  <option value="urgent">Urgent (3-5 days)</option>
                  <option value="asap">ASAP (1-2 days)</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="communicationPreference">Communication Preference</label>
                <select
                  id="communicationPreference"
                  value={formData.communicationPreference}
                  onChange={(e) => handleInputChange('communicationPreference', e.target.value)}
                >
                  <option value="email">Email</option>
                  <option value="phone">Phone Call</option>
                  <option value="video">Video Call</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="form-navigation">
          {currentStep > 1 && (
            <button type="button" onClick={handlePrevious} className="btn-secondary">
              Previous
            </button>
          )}
          
          {currentStep < 3 ? (
            <button type="button" onClick={handleNext} className="btn-primary">
              Next
            </button>
          ) : (
            <button 
              type="submit" 
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Booking...' : 'Book Consultation'}
            </button>
          )}
        </div>

        {errors.submit && (
          <div className="error-message submit-error">{errors.submit}</div>
        )}
      </form>
    </div>
  );
};

export default Consultation;
