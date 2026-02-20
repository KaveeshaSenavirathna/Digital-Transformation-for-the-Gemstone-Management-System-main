import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../Styles/MainHome.css";

// Import your slideshow images
import slideImage1 from '../Galary/hero-image01.jpg';
import slideImage2 from '../Galary/hero-image02.jpg';
import slideImage3 from '../Galary/hero-image03.jpg';

const slides = [
    {
        image: slideImage1,
        title: "Digital Transformation for Gemstone Management",
        description: "Revolutionize your gemstone business with our comprehensive management system. Streamline operations, enhance productivity, and drive growth."
    },
    {
        image: slideImage2,
        title: "Advanced Production & Process Control",
        description: "Optimize your production workflows with real-time monitoring, quality assurance, and automated process management."
    },
    {
        image: slideImage3,
        title: "Intelligent Analytics & Reporting",
        description: "Make data-driven decisions with comprehensive analytics, performance insights, and detailed reporting capabilities."
    }
];

const dashboardModules = [
    {
        title: "Core Operations",
        modules: [
            { name: "Web Portal", icon: "web", path: "/web_home", description: "Main web interface" },
            { name: "Customer & Order", icon: "customer-order", path: "/d_loging", description: "Customer management" },
            { name: "Production", icon: "production", path: "/d_loging", description: "Production control" },
            { name: "Inventory", icon: "inventory", path: "/d_loging", description: "Stock management" }
        ]
    },
    {
        title: "Management & Analytics",
        modules: [
            { name: "Employee", icon: "employee", path: "/d_loging", description: "HR management" },
            { name: "Certificate", icon: "certificate", path: "/d_loging", description: "Certification system" },
            { name: "Finance", icon: "accounts", path: "/d_loging", description: "Financial management" },
            { name: "Analysis", icon: "analysis", path: "/d_loging", description: "Business analytics" }
        ]
    }
];

function WebHome() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isLoaded, setIsLoaded] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Initialize loading state
    useEffect(() => {
        setIsLoaded(true);
    }, []);

    // Slideshow effect
    useEffect(() => {
        const slideInterval = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
        }, 5000); // Change slide every 5 seconds for better engagement

        return () => clearInterval(slideInterval);
    }, []);

    // Time and Date effect
    useEffect(() => {
        const timerInterval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timerInterval);
    }, []);

    const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const formattedDate = currentTime.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });


    // Placeholder for icon components (you'd typically use a library like Font Awesome or Heroicons)
    const Icon = ({ name }) => {
        let svg = null;
        switch (name) {
            case 'web': svg = <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>; break;
            case 'customer-order': svg = <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><path d="M22 11V3H12v8"></path><path d="M16 6h6"></path><path d="M16 10h6"></path></svg>; break;
            case 'production': svg = <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>; break;
            case 'inventory': svg = <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.5 14.5L12 1.5 3.5 14.5 12 22.5z"></path><path d="M12 1.5L20.5 14.5M12 1.5L3.5 14.5M12 22.5L3.5 14.5M12 22.5L20.5 14.5"></path><path d="M3.5 14.5L12 1.5L20.5 14.5"></path></svg>; break;
            case 'employee': svg = <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>; break;
            case 'certificate': svg = <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>; break;
            case 'accounts': svg = <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 10h-6"></path><path d="M22 14h-6"></path></svg>; break;
            case 'analysis': svg = <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"></path><path d="M18.7 8.3L13 14 9.3 10.3 3 17"></path></svg>; break;
            case 'support': svg = <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12l2 2 4-4"></path><path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"></path></svg>; break;
            case 'contact': svg = <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>; break;
            case 'arrow-right': svg = <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9,18 15,12 9,6"></polyline></svg>; break;
            default: svg = null;
        }
        return svg ? <span className="button-icon">{svg}</span> : null;
    };


    return (
        <div className={`web-home-container ${isLoaded ? 'loaded' : ''}`}>
            <div className="left-panel">
                <div className="datetime-display">
                    <span className="time">{formattedTime}</span>
                    <span className="date">{formattedDate}</span>
                </div>
                
                {/* Slide indicators */}
                <div className="slide-indicators">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            className={`indicator ${currentSlide === index ? 'active' : ''}`}
                            onClick={() => setCurrentSlide(index)}
                        />
                    ))}
                </div>

                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`slide ${currentSlide === index ? 'active' : ''}`}
                        style={{ backgroundImage: `url(${slide.image})` }}
                    >
                        <div className="image-overlay">
                            <div className="overlay-content">
                                <h2>{slide.title}</h2>
                                <p>{slide.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="right-panel">
                <div className="menu-container">
                    <button className="menu-icon" onClick={toggleMenu}>
                        <span className="hamburger-line"></span>
                        <span className="hamburger-line"></span>
                        <span className="hamburger-line"></span>
                    </button>
                    {isMenuOpen && (
                        <div className="dropdown-menu">
                            <Link to="/support" className="dropdown-item">
                                <Icon name="support" /> Support
                            </Link>
                            <Link to="/contact" className="dropdown-item">
                                <Icon name="contact" /> Contact
                            </Link>
                        </div>
                    )}
                </div>

                <div className="welcome-section">
                    <h1 className="page-title">
                        <span className="title-highlight">Digital Transformation</span>
                    </h1>
                    <p className="welcome-description">
                        Streamline your business operations with our comprehensive management platform. 
                        Access all your tools and data from one centralized location.
                    </p>
                </div>

                {dashboardModules.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="section">
                        <h3 className="section-title">
                            <span className="section-icon">⚡</span>
                            {section.title}
                        </h3>
                        <div className="button-grid">
                            {section.modules.map((module, moduleIndex) => (
                                <Link 
                                    key={moduleIndex}
                                    to={module.path} 
                                    className="styled-button"
                                    style={{ animationDelay: `${moduleIndex * 0.1}s` }}
                                >
                                    <div className="button-content">
                                        <div className="button-icon">
                                            <Icon name={module.icon} />
                                        </div>
                                        <div className="button-text">
                                            <span className="button-name">{module.name}</span>
                                            <span className="button-description">{module.description}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}

                <div className="call-to-action">
                    <div className="cta-content">
                        <h3>Ready to Transform Your Business?</h3>
                        <p>Get started with our comprehensive gemstone management system today.</p>
                        <Link to="/d_loging" className="cta-button">
                            <Icon name="arrow-right" />
                            Get Started
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WebHome;