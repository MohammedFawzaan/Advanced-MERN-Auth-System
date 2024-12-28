import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com', // Brevo SMTP server
    port: 587,                   // SMTP port
    secure: false,               // Use STARTTLS (false)
    auth: {
        user: process.env.SMTP_USER,     // Brevo email
        pass: process.env.SMTP_PASSWORD, // Brevo API key
    }
});

export default transporter;