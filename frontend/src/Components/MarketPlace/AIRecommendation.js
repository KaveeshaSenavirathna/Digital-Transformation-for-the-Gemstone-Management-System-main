import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import '../Styles/AIRecommendation.css';

const AIRecommendation = ({ isLoggedIn, onClose, onShowNotification }) => {
  const [preferences, setPreferences] = useState({
    budget: { min: 100, max: 10000 },
    gemTypes: [],
    colors: [],
    cuts: [],
    occasions: [],
    styles: [],
    investment: false,
    rarity: 'medium'
  });
  
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();

  const gemTypes = [
    { id: 'diamond', name: 'Diamond', icon: '💎', color: '#b9f2ff' },
    { id: 'emerald', name: 'Emerald', icon: '💚', color: '#50c878' },
    { id: 'sapphire', name: 'Sapphire', icon: '💙', color: '#0f52ba' },
    { id: 'ruby', name: 'Ruby', icon: '❤️', color: '#e0115f' },
    { id: 'topaz', name: 'Topaz', icon: '💛', color: '#ffcc33' },
    { id: 'amethyst', name: 'Amethyst', icon: '💜', color: '#9966cc' },
    { id: 'aquamarine', name: 'Aquamarine', icon: '🌊', color: '#7fffd4' },
    { id: 'opal', name: 'Opal', icon: '🌈', color: '#ff6b6b' }
  ];

  const colors = [
    { id: 'white', name: 'White/Clear', color: '#ffffff' },
    { id: 'blue', name: 'Blue', color: '#0f52ba' },
    { id: 'red', name: 'Red', color: '#e0115f' },
    { id: 'green', name: 'Green', color: '#50c878' },
    { id: 'yellow', name: 'Yellow', color: '#ffcc33' },
    { id: 'purple', name: 'Purple', color: '#9966cc' },
    { id: 'pink', name: 'Pink', color: '#ff69b4' },
    { id: 'orange', name: 'Orange', color: '#ff8c00' }
  ];

  const cuts = [
    { id: 'round', name: 'Round Brilliant', description: 'Classic and timeless' },
    { id: 'princess', name: 'Princess', description: 'Modern square cut' },
    { id: 'emerald', name: 'Emerald', description: 'Elegant step cut' },
    { id: 'oval', name: 'Oval', description: 'Elongated and flattering' },
    { id: 'marquise', name: 'Marquise', description: 'Unique boat shape' },
    { id: 'pear', name: 'Pear', description: 'Teardrop elegance' },
    { id: 'cushion', name: 'Cushion', description: 'Vintage charm' },
    { id: 'heart', name: 'Heart', description: 'Romantic symbol' }
  ];

  const occasions = [
    { id: 'engagement', name: 'Engagement', icon: '💍' },
    { id: 'anniversary', name: 'Anniversary', icon: '🎂' },
    { id: 'birthday', name: 'Birthday', icon: '🎁' },
    { id: 'graduation', name: 'Graduation', icon: '🎓' },
    { id: 'investment', name: 'Investment', icon: '📈' },
    { id: 'collection', name: 'Collection', icon: '🏆' },
    { id: 'gift', name: 'Gift', icon: '🎀' },
    { id: 'self', name: 'Self-Treat', icon: '✨' }
  ];

  const styles = [
    { id: 'classic', name: 'Classic', description: 'Timeless elegance' },
    { id: 'modern', name: 'Modern', description: 'Contemporary design' },
    { id: 'vintage', name: 'Vintage', description: 'Retro charm' },
    { id: 'minimalist', name: 'Minimalist', description: 'Simple beauty' },
    { id: 'luxury', name: 'Luxury', description: 'High-end sophistication' },
    { id: 'bohemian', name: 'Bohemian', description: 'Free-spirited style' }
  ];

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserProfile();
    }
  }, [isLoggedIn]);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserProfile(response.data);
      
      // Pre-fill preferences based on user history
      if (response.data.preferences) {
        setPreferences(prev => ({
          ...prev,
          ...response.data.preferences
        }));
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handlePreferenceChange = (category, value) => {
    setPreferences(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  const handleBudgetChange = (type, value) => {
    setPreferences(prev => ({
      ...prev,
      budget: {
        ...prev.budget,
        [type]: parseInt(value)
      }
    }));
  };

  const generateRecommendations = async () => {
    setLoading(true);
    try {
      // Simulate AI recommendation API call
      const response = await api.post('/ai/recommendations', {
        preferences,
        userProfile,
        timestamp: new Date().toISOString()
      });

      setRecommendations(response.data.recommendations || generateMockRecommendations());
      setCurrentStep(3);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      // Fallback to mock recommendations
      setRecommendations(generateMockRecommendations());
      setCurrentStep(3);
    } finally {
      setLoading(false);
    }
  };

  const generateMockRecommendations = () => {
    const mockGems = [
      {
        id: 1,
        name: "Premium Blue Sapphire",
        type: "Sapphire",
        price: 2500,
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=300&fit=crop",
        cut: "Round Brilliant",
        carat: 1.5,
        color: "Blue",
        clarity: "VS1",
        origin: "Sri Lanka",
        certification: "GIA",
        matchScore: 95,
        reasons: ["Matches your blue color preference", "Within your budget range", "High investment potential"]
      },
      {
        id: 2,
        name: "Classic Diamond Solitaire",
        type: "Diamond",
        price: 8500,
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=300&fit=crop",
        cut: "Round Brilliant",
        carat: 1.0,
        color: "D",
        clarity: "VVS1",
        origin: "Botswana",
        certification: "GIA",
        matchScore: 88,
        reasons: ["Perfect for engagement", "Excellent cut quality", "Certified authenticity"]
      },
      {
        id: 3,
        name: "Vivid Green Emerald",
        type: "Emerald",
        price: 3200,
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop",
        cut: "Emerald Cut",
        carat: 2.0,
        color: "Green",
        clarity: "VS2",
        origin: "Colombia",
        certification: "GIA",
        matchScore: 92,
        reasons: ["Matches your green preference", "Large carat weight", "Colombian origin"]
      }
    ];

    return mockGems;
  };

  const savePreferences = async () => {
    if (isLoggedIn) {
      try {
        const token = localStorage.getItem('token');
        await api.post('/users/preferences', {
          preferences,
          updatedAt: new Date().toISOString()
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (error) {
        console.error('Error saving preferences:', error);
      }
    }
  };

  const viewGemDetails = (gemId) => {
    navigate(`/product/${gemId}`);
    onClose();
  };

  const renderStep1 = () => (
    <div className="ai-step">
      <h3>What's your budget range?</h3>
      <div className="budget-slider">
        <div className="budget-inputs">
          <div className="budget-input">
            <label>Minimum: ${preferences.budget.min}</label>
            <input
              type="range"
              min="50"
              max="50000"
              step="50"
              value={preferences.budget.min}
              onChange={(e) => handleBudgetChange('min', e.target.value)}
            />
          </div>
          <div className="budget-input">
            <label>Maximum: ${preferences.budget.max}</label>
            <input
              type="range"
              min="100"
              max="100000"
              step="100"
              value={preferences.budget.max}
              onChange={(e) => handleBudgetChange('max', e.target.value)}
            />
          </div>
        </div>
        <div className="budget-display">
          ${preferences.budget.min.toLocaleString()} - ${preferences.budget.max.toLocaleString()}
        </div>
      </div>

      <h3>Which gem types interest you?</h3>
      <div className="preference-grid">
        {gemTypes.map(gem => (
          <button
            key={gem.id}
            className={`preference-item ${preferences.gemTypes.includes(gem.id) ? 'selected' : ''}`}
            onClick={() => handlePreferenceChange('gemTypes', gem.id)}
            style={{ '--gem-color': gem.color }}
          >
            <span className="gem-icon">{gem.icon}</span>
            <span className="gem-name">{gem.name}</span>
          </button>
        ))}
      </div>

      <h3>What colors do you prefer?</h3>
      <div className="color-grid">
        {colors.map(color => (
          <button
            key={color.id}
            className={`color-item ${preferences.colors.includes(color.id) ? 'selected' : ''}`}
            onClick={() => handlePreferenceChange('colors', color.id)}
            style={{ backgroundColor: color.color }}
            title={color.name}
          >
            {color.name}
          </button>
        ))}
      </div>

      <button className="ai-btn-primary" onClick={() => setCurrentStep(2)}>
        Continue to Cuts & Styles
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="ai-step">
      <h3>What cuts appeal to you?</h3>
      <div className="cut-grid">
        {cuts.map(cut => (
          <button
            key={cut.id}
            className={`cut-item ${preferences.cuts.includes(cut.id) ? 'selected' : ''}`}
            onClick={() => handlePreferenceChange('cuts', cut.id)}
          >
            <div className="cut-name">{cut.name}</div>
            <div className="cut-description">{cut.description}</div>
          </button>
        ))}
      </div>

      <h3>What's the occasion?</h3>
      <div className="occasion-grid">
        {occasions.map(occasion => (
          <button
            key={occasion.id}
            className={`occasion-item ${preferences.occasions.includes(occasion.id) ? 'selected' : ''}`}
            onClick={() => handlePreferenceChange('occasions', occasion.id)}
          >
            <span className="occasion-icon">{occasion.icon}</span>
            <span className="occasion-name">{occasion.name}</span>
          </button>
        ))}
      </div>

      <h3>What style speaks to you?</h3>
      <div className="style-grid">
        {styles.map(style => (
          <button
            key={style.id}
            className={`style-item ${preferences.styles.includes(style.id) ? 'selected' : ''}`}
            onClick={() => handlePreferenceChange('styles', style.id)}
          >
            <div className="style-name">{style.name}</div>
            <div className="style-description">{style.description}</div>
          </button>
        ))}
      </div>

      <div className="investment-option">
        <label className="investment-label">
          <input
            type="checkbox"
            checked={preferences.investment}
            onChange={(e) => setPreferences(prev => ({ ...prev, investment: e.target.checked }))}
          />
          <span>I'm interested in investment-grade gems</span>
        </label>
      </div>

      <div className="ai-step-actions">
        <button className="ai-btn-secondary" onClick={() => setCurrentStep(1)}>
          Back
        </button>
        <button className="ai-btn-primary" onClick={generateRecommendations}>
          <span>Generate My Recommendations</span>
          <span className="ai-icon">✨</span>
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="ai-step">
      <div className="recommendations-header">
        <h3>Your Personalized Recommendations</h3>
        <p>Based on your preferences, here are gems we think you'll love:</p>
      </div>

      {loading ? (
        <div className="loading-recommendations">
          <div className="ai-loading-spinner"></div>
          <p>Our AI is analyzing your preferences...</p>
        </div>
      ) : (
        <div className="recommendations-grid">
          {recommendations.map((gem, index) => (
            <div key={gem.id} className="recommendation-card">
              <div className="recommendation-header">
                <div className="match-score">
                  <span className="score-number">{gem.matchScore}%</span>
                  <span className="score-label">Match</span>
                </div>
                <div className="recommendation-badge">AI Recommended</div>
              </div>
              
              <div className="gem-image">
                <img src={gem.image} alt={gem.name} />
                <div className="gem-overlay">
                  <button 
                    className="view-details-btn"
                    onClick={() => viewGemDetails(gem.id)}
                  >
                    View Details
                  </button>
                </div>
              </div>

              <div className="gem-info">
                <h4>{gem.name}</h4>
                <div className="gem-specs">
                  <span className="spec">{gem.cut}</span>
                  <span className="spec">{gem.carat}ct</span>
                  <span className="spec">{gem.color}</span>
                </div>
                <div className="gem-price">${gem.price.toLocaleString()}</div>
                <div className="gem-origin">Origin: {gem.origin}</div>
                <div className="gem-certification">Certified: {gem.certification}</div>
              </div>

              <div className="recommendation-reasons">
                <h5>Why we recommend this:</h5>
                <ul>
                  {gem.reasons.map((reason, idx) => (
                    <li key={idx}>{reason}</li>
                  ))}
                </ul>
              </div>

              <div className="recommendation-actions">
                <button 
                  className="ai-btn-primary"
                  onClick={() => viewGemDetails(gem.id)}
                >
                  View Gem
                </button>
                <button className="ai-btn-secondary">
                  Save for Later
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="recommendations-actions">
        <button className="ai-btn-secondary" onClick={() => setCurrentStep(1)}>
          Adjust Preferences
        </button>
        <button className="ai-btn-primary" onClick={savePreferences}>
          Save My Preferences
        </button>
      </div>
    </div>
  );

  return (
    <div className="ai-recommendation-modal">
      <div className="ai-modal-content">
        <div className="ai-modal-header">
          <h2>AI Gem Recommendation</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="ai-progress">
          <div className="progress-step">
            <div className={`step-circle ${currentStep >= 1 ? 'active' : ''}`}>1</div>
            <span>Preferences</span>
          </div>
          <div className="progress-step">
            <div className={`step-circle ${currentStep >= 2 ? 'active' : ''}`}>2</div>
            <span>Style & Occasion</span>
          </div>
          <div className="progress-step">
            <div className={`step-circle ${currentStep >= 3 ? 'active' : ''}`}>3</div>
            <span>Recommendations</span>
          </div>
        </div>

        <div className="ai-modal-body">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </div>
      </div>
    </div>
  );
};

export default AIRecommendation;
