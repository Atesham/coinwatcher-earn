
// Firebase Cloud Function for sending OTP via email
import * as functions from "firebase-functions";
import * as nodemailer from "nodemailer";

// Create a transporter using environment variables
// NOTE: For production, set these in Firebase Functions environment variables
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "ateshamali0@gmail.com",
    pass: process.env.EMAIL_PASSWORD || "Atesham@123" // Use app password for Gmail
  },
});

// Format OTP email with better styling
const createEmailTemplate = (otp: string) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #333; text-align: center;">Your One-Time Password</h2>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; text-align: center; margin: 20px 0;">
        <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px;">${otp}</span>
      </div>
      <p style="color: #666;">This OTP is valid for 10 minutes. Please do not share this code with anyone.</p>
      <p style="color: #666;">If you didn't request this code, please ignore this email.</p>
      <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
        <p style="color: #999; font-size: 12px;">© ${new Date().getFullYear()} CoinTap. All rights reserved.</p>
      </div>
    </div>
  `;
};

export const sendOTP = functions.https.onCall(async (data, context) => {
  // Properly access data from the callable function
  // First cast to unknown then to the expected type
  const { email, otp } = data as unknown as { email: string; otp: string };

  if (!email || !otp) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Email and OTP are required'
    );
  }

  const mailOptions = {
    from: process.env.EMAIL_USER || "ateshamali0@gmail.com",
    to: email,
    subject: "Your CoinTap Verification Code",
    html: createEmailTemplate(otp),
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: "OTP sent successfully" };
  } catch (error) {
    console.error("Email sending error:", error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to send OTP email',
      error
    );
  }
});
