import nodemailer from 'nodemailer'
import crypto from 'crypto'


const transporter = nodemailer.createTransport({
    service: "Outlook365",
    auth: {
        user: 'tc915004@outlook.com',
        pass: 'Tc1038668!278'
    }
})

/**
 * @param {string} to - Recipient's email address
 * @param {string} subjet - Subject of the email
 * @param {string} text - Body of the email
 * @returns {Promise<void>}
 */

export const sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: 'tc915004@outlook.com',
        to,
        subject,
        text
    }

    try {
        await transporter.sendEmail(mailOptions)
    } catch (err) {
        console.error(`Failed to send email to ${to}: ${err.message}`)
        throw new Error('Error occurred while sending email')
    }
}

/**
 * Generate verification email with dynamic content
 * @param {string} email - Recipient's email address
 * @param {string} verificationToken - Token for verification
 * @returns {Promise<void>}
 */

export const sendVerificationEmail = async (email, verificationToken) => {
    const subject = 'Email Verification'
    const text = `Please verify your account by clicking this link:\nhttps://test.ideasthatfloat.com/register/verify-email/${verificationToken}\n\nThank You!`

    await sendEmail(email, subject, text)
}


export const sendResetPasswordEmail = async (email, resetPasswordToken) => {
    const subject = 'Reset Password'
    const text = `You can reset your password by clicking this link:\nhttps://test.ideasthatfloat.com/login/reset-password/${email.split('@')[0]}/${resetPasswordToken}\n\nThank You!`

    await sendEmail(email, subject, text)
}