# Contact Form Setup Guide

This guide explains how to set up the contact form to work with your Hostinger email.

## Overview

The contact form allows market owners to submit their information to be listed on the PlanetWiseLiving platform. When a user submits the form, the data is sent to your Hostinger email address (`contact@planetwiseliving.com`).

## Configuration Steps

### 1. Backend Setup

1. Install the required dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Create a `.env` file in the `backend` directory based on the `.env.example` file:
   ```bash
   cp .env.example .env
   ```

3. Update the email configuration in the `.env` file with your Hostinger email credentials:
   ```
   EMAIL_HOST=smtp.hostinger.com
   EMAIL_PORT=465
   EMAIL_SECURE=true
   EMAIL_USER=contact@planetwiseliving.com
   EMAIL_PASS=your_actual_password
   EMAIL_FROM=contact@planetwiseliving.com
   ```

4. Uncomment the email sending code in `backend/routes/api.js`:
   ```javascript
   // Send the email
   try {
     await sendContactFormEmail(formData);
     console.log('Email sent successfully to contact@planetwiseliving.com');
   } catch (emailError) {
     console.error('Error sending email:', emailError);
     // Continue execution even if email fails - we'll still log the submission
   }
   ```

### 2. Testing the Contact Form

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

3. Navigate to the Contact page in your browser and fill out the form.

4. Submit the form and check your Hostinger email inbox for the submission.

## Troubleshooting

If you encounter issues with the email sending functionality:

1. **Check SMTP Settings**: Verify that the SMTP settings for Hostinger are correct. Sometimes the host or port might be different.

2. **Email Password**: Make sure the email password in the `.env` file is correct and up to date.

3. **App Password**: If you have two-factor authentication enabled, you might need to create an app password specifically for this application.

4. **Check Logs**: Look at the server logs for any error messages related to email sending.

5. **Firewall Issues**: Ensure that your server's firewall allows outgoing connections on the SMTP port (usually 465 or 587).

## Security Considerations

- Never commit your `.env` file to version control.
- Consider using environment variables in production instead of a `.env` file.
- Regularly update your email password for security.
- Consider implementing rate limiting to prevent form spam.

## Additional Resources

- [Nodemailer Documentation](https://nodemailer.com/about/)
- [Hostinger Email Setup Guide](https://support.hostinger.com/en/articles/1583453-how-to-set-up-email-on-your-device) 