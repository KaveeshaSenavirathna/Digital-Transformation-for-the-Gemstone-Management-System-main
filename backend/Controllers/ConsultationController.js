const UserRequests = require('../Models/Marketplace/Request');
const DashboardLogger = require('../utils/dashboardLogger');

// Book a new consultation
const bookConsultation = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      consultationType,
      preferredDate,
      preferredTime,
      timezone,
      gemTypes,
      budget,
      purpose,
      experience,
      specificQuestions,
      urgency,
      communicationPreference,
      location,
      virtualPreference
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !consultationType || !preferredDate || !preferredTime) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Check for existing consultation on the same date/time
    const existingConsultation = await UserRequests.findOne({
      requestType: 'consultation',
      preferredDate: new Date(preferredDate),
      preferredTime,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingConsultation) {
      return res.status(409).json({
        success: false,
        message: 'Time slot is already booked. Please choose a different time.'
      });
    }

    // Create new consultation request
    const consultationRequest = new UserRequests({
      requestType: 'consultation',
      firstName,
      lastName,
      email,
      phone,
      consultationType,
      preferredDate: new Date(preferredDate),
      preferredTime,
      timezone,
      gemTypes: gemTypes || [],
      budget,
      purpose,
      experience,
      specificQuestions,
      urgency: urgency || 'normal',
      communicationPreference: communicationPreference || 'email',
      location,
      virtualPreference: virtualPreference !== false,
      contactMethod: 'appointment' // Default for consultation requests
    });

    await consultationRequest.save();

    // Log the consultation booking
    DashboardLogger.logDashboardAccess(
      'Consultation Booked',
      email,
      'CUSTOMER',
      {
        consultationType,
        preferredDate,
        preferredTime,
        requestId: consultationRequest._id
      }
    );

    res.status(201).json({
      success: true,
      message: 'Consultation booked successfully',
      data: {
        requestId: consultationRequest._id,
        summary: consultationRequest.getSummary()
      }
    });

  } catch (error) {
    console.error('Error booking consultation:', error);
    DashboardLogger.error('Consultation Booking Error', {
      error: error.message,
      stack: error.stack
    });

    res.status(500).json({
      success: false,
      message: 'Failed to book consultation',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get all consultations (admin)
const getAllConsultations = async (req, res) => {
  try {
    const { status, consultationType, page = 1, limit = 10 } = req.query;
    
    const query = { requestType: 'consultation' };
    if (status) query.status = status;
    if (consultationType) query.consultationType = consultationType;

    const consultations = await UserRequests.find(query)
      .populate('assignedGemologist', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await UserRequests.countDocuments(query);

    res.json({
      success: true,
      data: {
        consultations: consultations.map(consultation => consultation.getSummary()),
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Error fetching consultations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch consultations'
    });
  }
};

// Get consultation by ID
const getConsultationById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const consultation = await UserRequests.findOne({ 
      _id: id, 
      requestType: 'consultation' 
    }).populate('assignedGemologist', 'firstName lastName email phone');

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found'
      });
    }

    res.json({
      success: true,
      data: consultation
    });

  } catch (error) {
    console.error('Error fetching consultation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch consultation'
    });
  }
};

// Update consultation status
const updateConsultationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, assignedGemologist, confirmedDate, confirmedTime, meetingLink } = req.body;

    const consultation = await UserRequests.findOne({ 
      _id: id, 
      requestType: 'consultation' 
    });
    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found'
      });
    }

    // Update fields
    if (status) consultation.status = status;
    if (notes) consultation.notes = notes;
    if (assignedGemologist) consultation.assignedGemologist = assignedGemologist;
    if (confirmedDate) consultation.confirmedDate = new Date(confirmedDate);
    if (confirmedTime) consultation.confirmedTime = confirmedTime;
    if (meetingLink) consultation.meetingLink = meetingLink;

    consultation.updatedAt = new Date();
    await consultation.save();

    DashboardLogger.logDashboardAccess(
      'Consultation Status Updated',
      req.user?.email || 'admin',
      'ADMIN',
      {
        requestId: id,
        newStatus: status,
        previousStatus: consultation.status
      }
    );

    res.json({
      success: true,
      message: 'Consultation updated successfully',
      data: consultation.getSummary()
    });

  } catch (error) {
    console.error('Error updating consultation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update consultation'
    });
  }
};

// Get consultations by email (customer)
const getConsultationsByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    
    const consultations = await UserRequests.find({ 
      email, 
      requestType: 'consultation' 
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: consultations.map(consultation => consultation.getSummary())
    });

  } catch (error) {
    console.error('Error fetching customer consultations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch consultations'
    });
  }
};

// Cancel consultation
const cancelConsultation = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const consultation = await UserRequests.findOne({ 
      _id: id, 
      requestType: 'consultation' 
    });
    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found'
      });
    }

    if (consultation.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Consultation is already cancelled'
      });
    }

    consultation.status = 'cancelled';
    consultation.notes = reason || 'Cancelled by customer';
    consultation.updatedAt = new Date();
    await consultation.save();

    DashboardLogger.logDashboardAccess(
      'Consultation Cancelled',
      consultation.email,
      'CUSTOMER',
      {
        requestId: id,
        reason: reason || 'No reason provided'
      }
    );

    res.json({
      success: true,
      message: 'Consultation cancelled successfully'
    });

  } catch (error) {
    console.error('Error cancelling consultation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel consultation'
    });
  }
};

// Get consultation statistics
const getConsultationStats = async (req, res) => {
  try {
    const stats = await UserRequests.aggregate([
      {
        $match: { requestType: 'consultation' }
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          confirmed: { $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] } },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
          cancelled: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } },
          totalRevenue: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'paid'] }, '$consultationFee', 0] } }
        }
      }
    ]);

    const typeStats = await UserRequests.aggregate([
      {
        $match: { requestType: 'consultation' }
      },
      {
        $group: {
          _id: '$consultationType',
          count: { $sum: 1 },
          revenue: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'paid'] }, '$consultationFee', 0] } }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {
          total: 0,
          pending: 0,
          confirmed: 0,
          completed: 0,
          cancelled: 0,
          totalRevenue: 0
        },
        byType: typeStats
      }
    });

  } catch (error) {
    console.error('Error fetching consultation stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
};

module.exports = {
  bookConsultation,
  getAllConsultations,
  getConsultationById,
  updateConsultationStatus,
  getConsultationsByEmail,
  cancelConsultation,
  getConsultationStats
};
