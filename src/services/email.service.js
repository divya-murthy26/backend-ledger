require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

console.log(process.env.EMAIL_USER);
console.log(process.env.CLIENT_ID);
console.log(process.env.REFRESH_TOKEN);

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Backend-ledger" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

async function sendRegistrationEmail(userEmail, name) {
    const subject = 'Welcome to Backend-ledger!';
    const text = `Hello, ${name}! You have successfully registered on Backend-ledger.`;
    const html = `<h1>Hello, ${name}!</h1><p>You have successfully registered on Backend-ledger.</p>`;

    await sendEmail(userEmail, subject, text, html);
}
async function sendTranscationEmail(userEmail, name) {
    const subject = 'Transaction Notification';
    const text = `Hello, ${name}! You have a new transaction.`;
    const html = `<h1>Hello, ${name}!</h1><p>You have a new transaction.</p>`;

    await sendEmail(userEmail, subject, text, html);
}
async function sendTranscationFailureEmail(userEmail, name) {
    const subject = 'Transaction Notification';
    const text = `Hello, ${name}! Your transaction failed.`;
    const html = `<h1>Hello, ${name}!</h1><p>Your transaction failed.</p>`;

    await sendEmail(userEmail, subject, text, html);
}
module.exports = {
    transporter,
    sendEmail,
    sendRegistrationEmail,
    sendTranscationEmail,
    sendTranscationFailureEmail
};
