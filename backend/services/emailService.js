const nodemailer = require('nodemailer');

// Create a transporter object using SMTP transport for Hostinger
const createTransporter = () => {
  // Hostinger SMTP configuration
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.hostinger.com',
    port: process.env.EMAIL_PORT || 465,
    secure: true, // Hostinger uses SSL
    auth: {
      user: process.env.EMAIL_USER || 'contact@planetwiseliving.com',
      pass: process.env.EMAIL_PASS || 'your-hostinger-password' // Replace with actual password in .env file
    }
  });
};

/**
 * Send an email with the contact form data
 * @param {Object} formData - The form data from the contact form
 * @returns {Promise} - A promise that resolves when the email is sent
 */
const sendContactFormEmail = async (formData) => {
  const { name, email, phone, address, marketName, products, website, message } = formData;
  
  const transporter = createTransporter();
  
  const mailOptions = {
    from: '"PlanetWiseLiving Contact Form" <contact@planetwiseliving.com>',
    to: 'contact@planetwiseliving.com',
    replyTo: email, // Allow direct reply to the sender
    subject: `New Market Listing Request from ${name} - ${marketName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #2e7d32; border-bottom: 2px solid #e0e0e0; padding-bottom: 10px;">New Market Listing Request</h2>
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: #2e7d32;">Contact Information</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: #2e7d32;">Market Details</h3>
          <p><strong>Market Name:</strong> ${marketName}</p>
          ${address ? `<p><strong>Address:</strong> ${address}</p>` : ''}
          ${products ? `<p><strong>Products:</strong> ${products}</p>` : ''}
          ${website ? `<p><strong>Website:</strong> <a href="${website}">${website}</a></p>` : ''}
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: #2e7d32;">Message</h3>
          <p style="white-space: pre-line;">${message}</p>
        </div>
        
        <div style="font-size: 12px; color: #666; margin-top: 30px; padding-top: 10px; border-top: 1px solid #e0e0e0;">
          <p>This email was sent from the PlanetWiseLiving contact form.</p>
        </div>
      </div>
    `
  };
  
  return transporter.sendMail(mailOptions);
};

module.exports = {
  sendContactFormEmail
}; 