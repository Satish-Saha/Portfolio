// const express = require('express');
// const nodemailer = require('nodemailer');
// const cors = require('cors');
// const path = require('path');
// require('dotenv').config();

// This is bcz project is using ES modules ("type": "module" in package.json), but using CommonJS require() syntax that's why
// import express from 'express';
// import nodemailer from 'nodemailer';
// import cors from 'cors';
// import dotenv from 'dotenv';

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// // CORS configuration for production
// app.use(cors({
//   origin: [
//     'http://localhost:5173',
//     'http://localhost:3000',
//     'https://portfolio-self-five-t5org9rkfp.vercel.app/' // Replace with your actual frontend domain
//   ],
//   credentials: true
// }));

// app.use(express.json());

// // Create transporter for nodemailer
// const transporter = nodemailer.createTransport({
//   service: 'gmail', // You can use other services like Outlook, Yahoo, etc.
//   auth: {
//     user: process.env.EMAIL_USER, // Your email
//     pass: process.env.EMAIL_PASS, // Your email password or app password
//   },
// });

// // Test email configuration
// transporter.verify((error, success) => {
//   if (error) {
//     console.log('Error with email configuration:', error);
//   } else {
//     console.log('Email server is ready to send messages');
//   }
// });

// app.get('/', (req, res) => {
//   res.send('Portfolio backend is running');
// });

// // Contact form endpoint
// app.post('/contact', async (req, res) => {
//   const { firstName, lastName, email, phone, message } = req.body;

//   try {
//     // Email to yourself (the portfolio owner)
//     const mailOptions = {
//       from: process.env.EMAIL_USER, // Your email
//       to: process.env.EMAIL_USER, // Where you want to receive messages
//       subject: `New Portfolio Message from ${firstName} ${lastName}`,
//       html: `
//         <h3>New Contact Form Submission</h3>
//         <p><strong>Name:</strong> ${firstName} ${lastName}</p>
//         <p><strong>Email:</strong> ${email}</p>
//         <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
//         <p><strong>Message:</strong></p>
//         <p>${message}</p>
//         <hr>
//         <p>Sent from your portfolio website</p>
//       `
//     };

//     await transporter.sendMail(mailOptions);

//     // Optional: Send confirmation email to the user
//     const userConfirmation = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: 'Thank you for contacting me!',
//       html: `
//         <h3>Thank you for your message, ${firstName}!</h3>
//         <p>I have received your message and will get back to you as soon as possible.</p>
//         <p><strong>Your message:</strong></p>
//         <p>${message}</p>
//         <hr>
//         <p>Best regards,<br>Satish</p>
//       `
//     };

//     await transporter.sendMail(userConfirmation);

//     res.status(200).json({
//       code: 200,
//       message: 'Message sent successfully!'
//     });
//   } catch (error) {
//     console.error('Error sending email:', error);
//     res.status(500).json({
//       code: 500,
//       message: 'Error sending message. Please try again later.'
//     });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Resend } from 'resend';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const resend = new Resend(process.env.RESEND_API_KEY);

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://portfolio-sigma-seven-ysbdo9ojh2.vercel.app'
  ],
  credentials: true
}));

app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('Portfolio backend is running');
});

// Contact route
app.post('/contact', async (req, res) => {
  const { firstName, lastName, email, phone, message } = req.body;

  console.log('Incoming contact form data:', req.body);
  console.log('Using RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅ set' : '❌ missing');

  try {
    // Send mail to yourself
    await resend.emails.send({
      from: 'Satish <onboarding@resend.dev>',
      to: process.env.EMAIL_USER,
      subject: `New Portfolio Message from ${firstName} ${lastName}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    // Confirmation email to user
    await resend.emails.send({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting me!',
      html: `
        <h3>Thank you for your message, ${firstName}!</h3>
        <p>I have received your message and will get back to you soon.</p>
        <p><strong>Your message:</strong></p>
        <p>${message}</p>
        <p>— Satish</p>
      `,
    });

    
    console.log('Resend API result:', result);
    res.status(200).json({ code: 200, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ code: 500, message: 'Error sending message.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});