const { sendContactFormEmail } = require('../services/emailService');

// Contact form submission endpoint
router.post('/contact', async (req, res) => {
  try {
    const formData = req.body;
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.marketName || !formData.message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide name, email, market name, and message.' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }
    
    // Send the email
    try {
      await sendContactFormEmail(formData);
      console.log('Email sent successfully to contact@planetwiseliving.com');
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      // Continue execution even if email fails - we'll still log the submission
    }
    
    // Log the submission
    console.log('Contact form submission:', formData);
    
    res.status(200).json({ 
      success: true, 
      message: 'Thank you for your interest! We have received your information and will get back to you soon.' 
    });
  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send message. Please try again later.' 
    });
  }
}); 