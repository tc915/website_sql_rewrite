// Import the nodemailer library for sending emails and crypto for generating tokens
import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Create a transporter object using the nodemailer library
const transporter = nodemailer.createTransport({
    // Specify the email service provider to use
    service: "Outlook365",
    auth: {
        // Email address and password for authentication
        user: 'tc915004@outlook.com',
        pass: 'Tc1038668!278' // Note: Storing passwords in code is not recommended for security reasons
    }
});

/**
 * Sends an email to a specified recipient.
 * @param {string} to - Recipient's email address
 * @param {string} subject - Subject of the email
 * @param {string} text - Body of the email
 * @returns {Promise<void>} - Resolves when the email is sent successfully
 */
export const sendEmail = async (to, subject, text) => {
    // Define the email options including sender, recipient, subject, and body text
    const mailOptions = {
        from: 'tc915004@outlook.com', // Sender's email address
        to, // Recipient's email address
        subject, // Subject of the email
        text // Body of the email
    };

    try {
        // Attempt to send the email using the transporter object
        await transporter.sendMail(mailOptions);
    } catch (err) {
        // Log an error message if sending the email fails
        console.error(`Failed to send email to ${to}: ${err.message}`);
        // Throw a new error to indicate that email sending failed
        throw new Error('Error occurred while sending email');
    }
};

/**
 * Sends a verification email with a dynamic verification token.
 * @param {string} email - Recipient's email address
 * @param {string} verificationToken - Token used for email verification
 * @returns {Promise<void>} - Resolves when the verification email is sent successfully
 */
export const sendVerificationEmail = async (email, verificationToken) => {
    // Define the subject of the verification email
    const subject = 'Email Verification';
    // Define the body text of the verification email including the verification link
    const text = `Please verify your account by clicking this link:\nhttps://test.ideasthatfloat.com/register/verify-email/${verificationToken}\n\nThank You!`;

    // Send the verification email using the sendEmail function
    await sendEmail(email, subject, text);
};

/**
 * Sends a password reset email with a dynamic reset token.
 * @param {string} email - Recipient's email address
 * @param {string} resetPasswordToken - Token used for password reset
 * @returns {Promise<void>} - Resolves when the reset password email is sent successfully
 */
export const sendResetPasswordEmail = async (email, resetPasswordToken) => {
    // Define the subject of the reset password email
    const subject = 'Reset Password';
    // Define the body text of the reset password email including the reset link
    const text = `You can reset your password by clicking this link:\nhttps://test.ideasthatfloat.com/login/reset-password/${email.split('@')[0]}/${resetPasswordToken}\n\nThank You!`;

    // Send the reset password email using the sendEmail function
    await sendEmail(email, subject, text);
};
