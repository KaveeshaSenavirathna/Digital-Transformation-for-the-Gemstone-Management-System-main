import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../MarketPlace/Header";
import Footer from "../MarketPlace/Footer";
import "../Styles/Home.css";
import "../Styles/About.css";

function About() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCount = cart.reduce((t, i) => t + (i.quantity || 1), 0);

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

  const Icon = ({ path, className }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d={path} />
    </svg>
  );

  const ICONS = {
    gem: "M12 2l3 4 5 2-2 5 0 0-6 9-6-9-2-5 5-2 3-4z",
    users:
      "M12 12a4 4 0 100-8 4 4 0 000 8zm6 8v-1a4 4 0 00-4-4H10a4 4 0 00-4 4v1h12z",
    globe:
      "M12 2a10 10 0 100 20 10 10 0 000-20zm0 18c-2.5 0-4.5-3.6-4.9-8h9.8c-.4 4.4-2.4 8-4.9 8zm4.9-10H7.1C7.5 5.6 9.5 2 12 2s4.5 3.6 4.9 8z",
    shield: "M12 2l7 4v6c0 5-3.4 9.7-7 10-3.6-.3-7-5-7-10V6l7-4z",
    award:
      "M12 2l2.39 4.84L20 8l-3.61 3.16L17.9 16 12 13.9 6.1 16l1.51-4.84L4 8l5.61-1.16L12 2z",
    sparkles:
      "M5 3l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4zm14 2l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z",
    trending: "M3 17l6-6 4 4 7-7 1 4-8 8-4-4-4 4z",
    check: "M9 16l-4-4 2-2 2 2 6-6 2 2-8 8z",
  };

  const stats = [
    { number: "50K+", label: "Gemstones Catalogued", icon: ICONS.gem },
    { number: "500+", label: "Certified Dealers", icon: ICONS.users },
    { number: "25+", label: "Countries Served", icon: ICONS.globe },
    { number: "99.9%", label: "Authentication Rate", icon: ICONS.shield },
  ];

  const values = [
    {
      icon: ICONS.shield,
      title: "Trust & Authenticity",
      description:
        "Every gemstone undergoes rigorous authentication using advanced gemological techniques and certified expertise.",
    },
    {
      icon: ICONS.sparkles,
      title: "Quality Excellence",
      description:
        "We maintain the highest standards in gemstone evaluation with accurate grading and detailed documentation.",
    },
    {
      icon: ICONS.trending,
      title: "Innovation",
      description:
        "Cutting-edge technology powers AI identification and secure verification for each gemstone.",
    },
    {
      icon: ICONS.users,
      title: "Community",
      description:
        "We connect dealers, collectors, and enthusiasts worldwide through transparent and reliable services.",
    },
    {
      icon: ICONS.award,
      title: "Excellence in Service",
      description:
        "We deliver exceptional customer service with personalized attention and expert guidance for every client.",
    },
    {
      icon: ICONS.globe,
      title: "Global Reach",
      description:
        "Our international network ensures seamless gemstone trading and authentication across multiple continents.",
    },
  ];

  const features = [
    "Advanced gemstone identification and grading",
    "Comprehensive inventory management",
    "Real-time market valuation",
    "Certificate and documentation tracking",
    "Multi-location warehouse management",
    "Detailed provenance tracking",
    "Advanced search and filtering",
    "Secure transaction processing",
  ];

  const team = [
    {
      name: "Dr. Sarah Mitchell",
      role: "Chief Gemologist",
      description:
        "GIA certified gemologist with 20+ years of experience in rare gemstone identification.",
    },
    {
      name: "Michael Chen",
      role: "Technology Director",
      description:
        "Blockchain developer specializing in secure asset tracking and authentication systems.",
    },
    {
      name: "Isabella Rodriguez",
      role: "Operations Manager",
      description:
        "International trade expert with experience in gemstone logistics and compliance.",
    },
    {
      name: "Dr. James Thompson",
      role: "Research & Development Lead",
      description:
        "PhD in Materials Science with expertise in advanced gemstone analysis and certification technologies.",
    },
  ];

  return (
    <div className="about-container">
      <Header
        isLoggedIn={isLoggedIn}
        cartCount={cartCount}
        notifications={[]}
        onLogout={handleLogout}
        onGoToCart={goToCart}
        onGoToProfile={goToProfile}
        onNavigate={navigate}
      />

      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <span className="hero-subtitle">About GemsFlow</span>
            <h1 className="hero-title">Precision. Trust. Transparency.</h1>
            <p className="hero-description">
              Revolutionizing gemstone management through technology and
              certified expertise with uncompromising commitment to
              authenticity.
            </p>
          </div>
        </div>
      </section>

      <section className="collections-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Mission</h2>
            <p>
              Transforming the gemstone industry by bridging traditional
              expertise and modern digital solutions.
            </p>
          </div>
          <div className="heritage-content">
            <div className="heritage-text">
              <h2>Confidence for Every Stone</h2>
              <p>
                We empower dealers, collectors, and enthusiasts with
                transparent, verified, and secure tools to manage precious
                stones across their lifecycle.
              </p>
              <div className="product-details" style={{ marginTop: 16 }}>
                <span className="detail-chip">GIA Aligned</span>
                <span className="detail-chip">Blockchain Secured</span>
                <span className="detail-chip">Global Network</span>
              </div>
            </div>
            <div className="heritage-images">
              <img
                src="https://images.unsplash.com/photo-1543571450-e67e45aba345?w=500&h=350&fit=crop"
                alt="Mission"
                className="heritage-img"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="values-section">
        <div className="container">
          <div className="section-header">
            <h2>Core Values</h2>
            <p>The principles that guide our work with gemstones</p>
          </div>
          <div className="values-grid">
            {values.map((v, i) => (
              <div key={i} className="value-card">
                <div className="value-icon-wrapper">
                  <Icon path={v.icon} className="value-icon" />
                </div>
                <div className="value-content">
                  <h3 className="value-title">{v.title}</h3>
                  <p className="value-description">{v.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Platform Features</h2>
            <p>End-to-end capabilities for gemstone operations</p>
          </div>
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon-wrapper">
                  <Icon path={ICONS.check} className="feature-icon" />
                </div>
                <div className="feature-content">
                  <p className="feature-text">{f}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="team-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Expert Team</h2>
            <p>Decades of gemological experience and technology leadership</p>
          </div>
          <div className="team-grid">
            {team.map((m, i) => (
              <div key={i} className={`team-card ${i === team.length - 1 ? 'team-card-last' : ''}`}>
                <div className="team-avatar">
                  <div className="avatar-placeholder">
                    <span className="avatar-initial">{m.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                </div>
                <div className="team-content">
                  <h3 className="team-name">{m.name}</h3>
                  <p className="team-role">{m.role}</p>
                  <p className="team-description">{m.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="about-cta">
        <div className="container">
          <div className="about-cta-box">
            <h2>Ready to Explore Premium Gemstones?</h2>
            <p>
              Browse our authenticated catalog or reach out to our team for
              guidance.
            </p>
            <div className="about-cta-actions">
              <button
                className="btn btn-primary"
                onClick={() => navigate("/explore")}
              >
                Explore Collection
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => navigate("/contact")}
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default About;
