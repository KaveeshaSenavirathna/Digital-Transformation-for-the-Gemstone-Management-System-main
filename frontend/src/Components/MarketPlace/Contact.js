import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../MarketPlace/Header";
import Footer from "../MarketPlace/Footer";
import "../Styles/Home.css";
import "../Styles/Contact.css";

function Contact() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCount = cart.reduce((t, i) => t + (i.quantity || 1), 0);

  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    phone: "",
    subject: "",
    message: "",
    inquiryType: "general"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const goToCart = () =>
    isLoggedIn ? navigate("/cart") : navigate("/login_web");
  const goToProfile = () =>
    isLoggedIn ? navigate("/profile") : navigate("/login_web");
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("cart");
    navigate("/login_web");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setForm({ 
        name: "", 
        email: "", 
        phone: "",
        subject: "",
        message: "",
        inquiryType: "general"
      });
    }, 2000);
  };

  const contactMethods = [
    {
      icon: "📧",
      title: "Email Us",
      description: "Send us an email anytime",
      contact: "info@gemsflow.com",
      action: "mailto:info@gemsflow.com"
    },
    {
      icon: "📞",
      title: "Call Us",
      description: "Speak with our experts",
      contact: "+1 (555) 123-4567",
      action: "tel:+15551234567"
    },
    {
      icon: "💬",
      title: "Live Chat",
      description: "Chat with our support team",
      contact: "Available 24/7",
      action: "#"
    },
    {
      icon: "📍",
      title: "Visit Us",
      description: "Come see our showroom",
      contact: "123 Gem Street, Jewel City",
      action: "#"
    }
  ];

  const inquiryTypes = [
    { value: "general", label: "General Inquiry" },
    { value: "support", label: "Technical Support" },
    { value: "sales", label: "Sales Question" },
    { value: "partnership", label: "Partnership" },
    { value: "consultation", label: "Gem Consultation" },
    { value: "complaint", label: "Complaint" }
  ];

  if (isSubmitted) {
    return (
      <div className="contact-container">
        <Header
          isLoggedIn={isLoggedIn}
          cartCount={cartCount}
          notifications={[]}
          onLogout={handleLogout}
          onGoToCart={goToCart}
          onGoToProfile={goToProfile}
          onNavigate={navigate}
        />
        
        <div className="contact-success">
          <div className="success-content">
            <div className="success-icon">✅</div>
            <h2>Message Sent Successfully!</h2>
            <p>Thank you for contacting us. We'll get back to you within 24 hours.</p>
            <button 
              className="success-btn"
              onClick={() => setIsSubmitted(false)}
            >
              Send Another Message
            </button>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="contact-container">
      <Header
        isLoggedIn={isLoggedIn}
        cartCount={cartCount}
        notifications={[]}
        onLogout={handleLogout}
        onGoToCart={goToCart}
        onGoToProfile={goToProfile}
        onNavigate={navigate}
      />

      {/* Hero Section */}
      <section className="contact-hero">
        <div className="hero-content">
          <h1 className="hero-title">Get in Touch</h1>
          <p className="hero-description">
            We're here to help with all your gemstone needs. Reach out to our expert team for personalized assistance.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="contact-methods">
        <div className="container">
          <div className="section-header">
            <h2>Contact Information</h2>
            <p>Choose your preferred way to reach us</p>
          </div>
          <div className="methods-grid">
            {contactMethods.map((method, index) => (
              <div key={index} className="method-card">
                <div className="method-icon">{method.icon}</div>
                <h3 className="method-title">{method.title}</h3>
                <p className="method-description">{method.description}</p>
                <a href={method.action} className="method-contact">
                  {method.contact}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="contact-form-section">
        <div className="container">
          <div className="form-container">
            <div className="form-header">
              <h2>Send us a Message</h2>
              <p>Fill out the form below and we'll get back to you as soon as possible.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="inquiryType">Inquiry Type *</label>
                  <select
                    id="inquiryType"
                    name="inquiryType"
                    value={form.inquiryType}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    {inquiryTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Brief description of your inquiry"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  className="form-textarea"
                  rows={6}
                  placeholder="Please provide details about your inquiry..."
                  required
                />
              </div>
              
              <button 
                type="submit" 
                className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    Sending Message...
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="contact-faq">
        <div className="container">
          <div className="section-header">
            <h2>Frequently Asked Questions</h2>
            <p>Quick answers to common questions</p>
          </div>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>How quickly do you respond?</h3>
              <p>We typically respond to all inquiries within 24 hours during business days.</p>
            </div>
            <div className="faq-item">
              <h3>Do you offer gemstone consultations?</h3>
              <p>Yes! Our certified gemologists provide expert consultations for all types of gemstones.</p>
            </div>
            <div className="faq-item">
              <h3>What are your business hours?</h3>
              <p>Our support team is available Monday-Friday, 9 AM - 6 PM EST.</p>
            </div>
            <div className="faq-item">
              <h3>Can I schedule a virtual consultation?</h3>
              <p>Absolutely! We offer both in-person and virtual consultations to meet your needs.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Contact;
