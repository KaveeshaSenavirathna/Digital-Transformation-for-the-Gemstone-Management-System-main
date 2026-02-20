const User = require('../Models/Marketplace/User');
const Product = require('../Models/Marketplace/Product');
const DashboardLogger = require('../utils/dashboardLogger');

// AI Recommendation Engine
class AIRecommendationEngine {
  constructor() {
    this.weights = {
      budget: 0.25,
      gemType: 0.20,
      color: 0.15,
      cut: 0.15,
      occasion: 0.10,
      style: 0.10,
      investment: 0.05
    };
  }

  // Calculate match score for a gem based on user preferences
  calculateMatchScore(gem, preferences) {
    let score = 0;
    let totalWeight = 0;

    // Budget match (25% weight)
    if (preferences.budget) {
      const { min, max } = preferences.budget;
      if (gem.price >= min && gem.price <= max) {
        score += this.weights.budget * 100;
      } else {
        // Partial score based on how close it is to budget range
        const budgetRange = max - min;
        const distance = Math.min(
          Math.abs(gem.price - min),
          Math.abs(gem.price - max)
        );
        const budgetScore = Math.max(0, 100 - (distance / budgetRange) * 100);
        score += this.weights.budget * budgetScore;
      }
      totalWeight += this.weights.budget;
    }

    // Gem type match (20% weight)
    if (preferences.gemTypes && preferences.gemTypes.length > 0) {
      const gemTypeMatch = preferences.gemTypes.includes(gem.category?.toLowerCase());
      score += this.weights.gemType * (gemTypeMatch ? 100 : 0);
      totalWeight += this.weights.gemType;
    }

    // Color match (15% weight)
    if (preferences.colors && preferences.colors.length > 0) {
      const colorMatch = preferences.colors.some(color => 
        gem.color?.toLowerCase().includes(color) || 
        gem.description?.toLowerCase().includes(color)
      );
      score += this.weights.color * (colorMatch ? 100 : 0);
      totalWeight += this.weights.color;
    }

    // Cut match (15% weight)
    if (preferences.cuts && preferences.cuts.length > 0) {
      const cutMatch = preferences.cuts.some(cut => 
        gem.cut?.toLowerCase().includes(cut) ||
        gem.description?.toLowerCase().includes(cut)
      );
      score += this.weights.cut * (cutMatch ? 100 : 0);
      totalWeight += this.weights.cut;
    }

    // Occasion match (10% weight)
    if (preferences.occasions && preferences.occasions.length > 0) {
      const occasionScore = this.calculateOccasionScore(gem, preferences.occasions);
      score += this.weights.occasion * occasionScore;
      totalWeight += this.weights.occasion;
    }

    // Style match (10% weight)
    if (preferences.styles && preferences.styles.length > 0) {
      const styleScore = this.calculateStyleScore(gem, preferences.styles);
      score += this.weights.style * styleScore;
      totalWeight += this.weights.style;
    }

    // Investment potential (5% weight)
    if (preferences.investment) {
      const investmentScore = this.calculateInvestmentScore(gem);
      score += this.weights.investment * investmentScore;
      totalWeight += this.weights.investment;
    }

    // Normalize score
    return totalWeight > 0 ? Math.round(score / totalWeight) : 0;
  }

  calculateOccasionScore(gem, occasions) {
    let score = 0;
    
    occasions.forEach(occasion => {
      switch (occasion) {
        case 'engagement':
          if (gem.category?.toLowerCase().includes('diamond') || 
              gem.cut?.toLowerCase().includes('round') ||
              gem.cut?.toLowerCase().includes('princess')) {
            score += 25;
          }
          break;
        case 'anniversary':
          if (gem.category?.toLowerCase().includes('sapphire') ||
              gem.category?.toLowerCase().includes('emerald')) {
            score += 25;
          }
          break;
        case 'investment':
          if (gem.certification || gem.origin || gem.price > 5000) {
            score += 25;
          }
          break;
        case 'collection':
          if (gem.rarity === 'rare' || gem.origin) {
            score += 25;
          }
          break;
        default:
          score += 10;
      }
    });
    
    return Math.min(100, score);
  }

  calculateStyleScore(gem, styles) {
    let score = 0;
    
    styles.forEach(style => {
      switch (style) {
        case 'classic':
          if (gem.cut?.toLowerCase().includes('round') ||
              gem.cut?.toLowerCase().includes('emerald')) {
            score += 25;
          }
          break;
        case 'modern':
          if (gem.cut?.toLowerCase().includes('princess') ||
              gem.cut?.toLowerCase().includes('cushion')) {
            score += 25;
          }
          break;
        case 'vintage':
          if (gem.cut?.toLowerCase().includes('marquise') ||
              gem.cut?.toLowerCase().includes('pear')) {
            score += 25;
          }
          break;
        case 'luxury':
          if (gem.price > 10000 || gem.certification) {
            score += 25;
          }
          break;
        default:
          score += 10;
      }
    });
    
    return Math.min(100, score);
  }

  calculateInvestmentScore(gem) {
    let score = 0;
    
    // Certification adds value
    if (gem.certification) score += 30;
    
    // Origin adds value
    if (gem.origin) score += 20;
    
    // Price range indicates investment potential
    if (gem.price > 10000) score += 30;
    else if (gem.price > 5000) score += 20;
    else if (gem.price > 1000) score += 10;
    
    // Rarity
    if (gem.rarity === 'rare') score += 20;
    else if (gem.rarity === 'uncommon') score += 10;
    
    return Math.min(100, score);
  }

  // Generate personalized recommendations
  async generateRecommendations(preferences, userProfile = null) {
    try {
      // Get all available gems
      const gems = await Product.find({ isActive: true }).limit(100);
      
      if (gems.length === 0) {
        return this.getFallbackRecommendations();
      }

      // Calculate match scores for all gems
      const scoredGems = gems.map(gem => ({
        ...gem.toObject(),
        matchScore: this.calculateMatchScore(gem, preferences)
      }));

      // Sort by match score and get top recommendations
      const topRecommendations = scoredGems
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 6)
        .map(gem => this.formatRecommendation(gem, preferences));

      // If we don't have enough high-scoring gems, add some fallbacks
      if (topRecommendations.length < 3) {
        const fallbacks = this.getFallbackRecommendations();
        topRecommendations.push(...fallbacks.slice(0, 3 - topRecommendations.length));
      }

      return topRecommendations;
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return this.getFallbackRecommendations();
    }
  }

  formatRecommendation(gem, preferences) {
    const reasons = this.generateRecommendationReasons(gem, preferences);
    
    return {
      id: gem._id,
      name: gem.name || `${gem.category} Gem`,
      type: gem.category,
      price: gem.price || Math.floor(Math.random() * 10000) + 500,
      image: gem.images?.[0] || this.getDefaultGemImage(gem.category),
      cut: gem.cut || this.getRandomCut(),
      carat: gem.carat || (Math.random() * 3 + 0.5).toFixed(1),
      color: gem.color || this.getRandomColor(gem.category),
      clarity: gem.clarity || this.getRandomClarity(),
      origin: gem.origin || this.getRandomOrigin(),
      certification: gem.certification || (Math.random() > 0.5 ? 'GIA' : null),
      matchScore: gem.matchScore,
      reasons: reasons
    };
  }

  generateRecommendationReasons(gem, preferences) {
    const reasons = [];
    
    // Budget reason
    if (preferences.budget) {
      const { min, max } = preferences.budget;
      if (gem.price >= min && gem.price <= max) {
        reasons.push("Perfectly fits your budget range");
      } else if (gem.price < min) {
        reasons.push("Great value within your budget");
      }
    }
    
    // Gem type reason
    if (preferences.gemTypes?.includes(gem.category?.toLowerCase())) {
      reasons.push(`Matches your ${gem.category} preference`);
    }
    
    // Color reason
    if (preferences.colors?.some(color => 
      gem.color?.toLowerCase().includes(color))) {
      reasons.push(`Beautiful ${gem.color} color you love`);
    }
    
    // Cut reason
    if (preferences.cuts?.some(cut => 
      gem.cut?.toLowerCase().includes(cut))) {
      reasons.push(`Elegant ${gem.cut} cut as requested`);
    }
    
    // Occasion reason
    if (preferences.occasions?.includes('engagement') && 
        gem.category?.toLowerCase().includes('diamond')) {
      reasons.push("Perfect for engagement rings");
    }
    
    if (preferences.investment && gem.certification) {
      reasons.push("Certified gem with investment potential");
    }
    
    // Default reasons if none match
    if (reasons.length === 0) {
      reasons.push("High-quality gemstone", "Excellent value", "Popular choice");
    }
    
    return reasons.slice(0, 3); // Limit to 3 reasons
  }

  getDefaultGemImage(category) {
    const imageMap = {
      'diamond': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=300&fit=crop',
      'emerald': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop',
      'sapphire': 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=300&fit=crop',
      'ruby': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      'topaz': 'https://images.unsplash.com/photo-1594736797933-d0c29d4b0284?w=400&h=300&fit=crop',
      'amethyst': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
    };
    
    return imageMap[category?.toLowerCase()] || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=300&fit=crop';
  }

  getRandomCut() {
    const cuts = ['Round Brilliant', 'Princess', 'Emerald', 'Oval', 'Marquise', 'Pear', 'Cushion', 'Heart'];
    return cuts[Math.floor(Math.random() * cuts.length)];
  }

  getRandomColor(category) {
    const colorMap = {
      'diamond': ['D', 'E', 'F', 'G', 'H'],
      'emerald': ['Green', 'Deep Green', 'Forest Green'],
      'sapphire': ['Blue', 'Royal Blue', 'Cornflower Blue'],
      'ruby': ['Red', 'Deep Red', 'Pigeon Blood Red'],
      'topaz': ['Blue', 'Yellow', 'Pink', 'White'],
      'amethyst': ['Purple', 'Deep Purple', 'Lavender']
    };
    
    const colors = colorMap[category?.toLowerCase()] || ['Blue', 'Red', 'Green', 'Yellow'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  getRandomClarity() {
    const clarities = ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2'];
    return clarities[Math.floor(Math.random() * clarities.length)];
  }

  getRandomOrigin() {
    const origins = ['Sri Lanka', 'Colombia', 'Botswana', 'South Africa', 'India', 'Brazil', 'Myanmar', 'Tanzania'];
    return origins[Math.floor(Math.random() * origins.length)];
  }

  getFallbackRecommendations() {
    return [
      {
        id: 'fallback-1',
        name: "Premium Blue Sapphire",
        type: "Sapphire",
        price: 2500,
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=300&fit=crop",
        cut: "Round Brilliant",
        carat: "1.5",
        color: "Blue",
        clarity: "VS1",
        origin: "Sri Lanka",
        certification: "GIA",
        matchScore: 85,
        reasons: ["High-quality sapphire", "Excellent cut", "Certified authenticity"]
      },
      {
        id: 'fallback-2',
        name: "Classic Diamond Solitaire",
        type: "Diamond",
        price: 8500,
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=300&fit=crop",
        cut: "Round Brilliant",
        carat: "1.0",
        color: "D",
        clarity: "VVS1",
        origin: "Botswana",
        certification: "GIA",
        matchScore: 80,
        reasons: ["Perfect for engagement", "Excellent clarity", "Premium quality"]
      },
      {
        id: 'fallback-3',
        name: "Vivid Green Emerald",
        type: "Emerald",
        price: 3200,
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop",
        cut: "Emerald Cut",
        carat: "2.0",
        color: "Green",
        clarity: "VS2",
        origin: "Colombia",
        certification: "GIA",
        matchScore: 75,
        reasons: ["Beautiful green color", "Large carat weight", "Colombian origin"]
      }
    ];
  }
}

// Initialize AI engine
const aiEngine = new AIRecommendationEngine();

// Controller functions
exports.generateRecommendations = async (req, res) => {
  try {
    const { preferences, userProfile } = req.body;
    
    if (!preferences) {
      return res.status(400).json({ 
        message: "User preferences are required" 
      });
    }

    // Log recommendation request
    DashboardLogger.logDashboardAccess(
      "AI Recommendation Request", 
      userProfile?.email || "anonymous", 
      "AI_USER"
    );

    // Generate recommendations using AI engine
    const recommendations = await aiEngine.generateRecommendations(preferences, userProfile);
    
    res.json({
      success: true,
      recommendations: recommendations,
      timestamp: new Date().toISOString(),
      preferences: preferences
    });

  } catch (error) {
    console.error("AI Recommendation error:", error);
    res.status(500).json({ 
      message: "Error generating recommendations",
      error: error.message 
    });
  }
};

exports.saveUserPreferences = async (req, res) => {
  try {
    const { preferences } = req.body;
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: "User authentication required" });
    }

    if (!preferences) {
      return res.status(400).json({ message: "Preferences data is required" });
    }

    // Update user preferences
    const user = await User.findByIdAndUpdate(
      userId,
      { 
        preferences: preferences,
        preferencesUpdatedAt: new Date()
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Log preference save
    DashboardLogger.logDashboardAccess(
      "User Preferences Saved", 
      user.email, 
      "AI_USER"
    );

    res.json({
      success: true,
      message: "Preferences saved successfully",
      preferences: user.preferences
    });

  } catch (error) {
    console.error("Save preferences error:", error);
    res.status(500).json({ 
      message: "Error saving preferences",
      error: error.message 
    });
  }
};

exports.getUserPreferences = async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: "User authentication required" });
    }

    const user = await User.findById(userId).select('preferences preferencesUpdatedAt');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      preferences: user.preferences || {},
      lastUpdated: user.preferencesUpdatedAt
    });

  } catch (error) {
    console.error("Get preferences error:", error);
    res.status(500).json({ 
      message: "Error retrieving preferences",
      error: error.message 
    });
  }
};

exports.getRecommendationStats = async (req, res) => {
  try {
    // Get statistics about recommendation usage
    const stats = {
      totalRecommendations: 0,
      popularGemTypes: [],
      averageMatchScore: 0,
      topPreferences: {}
    };

    // This would typically query a recommendations log table
    // For now, return mock stats
    res.json({
      success: true,
      stats: stats
    });

  } catch (error) {
    console.error("Get recommendation stats error:", error);
    res.status(500).json({ 
      message: "Error retrieving recommendation statistics",
      error: error.message 
    });
  }
};
