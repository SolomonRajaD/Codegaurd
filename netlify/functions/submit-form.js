// A library for sending emails from Node.js
const nodemailer = require('nodemailer');

// This is the main function that Netlify will run
exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Parse the form data from the request
  const { name, email, message } = JSON.parse(event.body);

  // Set up the email transporter using your Gmail account.
  // We use environment variables for security.
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  // Define the email options
  const mailOptions = {
    from: `"${name}" <${email}>`, // Sender's name and email
    to: process.env.GMAIL_USER,   // Your receiving email address
    subject: `New message from ${name} via CodeGuard Website`,
    html: `
      <p>You have a new contact form submission:</p>
      <ul>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Email:</strong> ${email}</li>
      </ul>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);

    // Return a success response
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Form submitted successfully!' }),
    };
  } catch (error) {
    // Return an error response
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error sending email.' }),
    };
  }
};