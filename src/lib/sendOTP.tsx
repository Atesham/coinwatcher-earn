const functions = require("firebase-functions");
const nodemailer = require("nodemailer");

// Configure the email sender (Replace with your SMTP credentials)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your-email@gmail.com",
    pass: "your-email-password",
  },
});

exports.sendOTP = functions.https.onRequest(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).send("Invalid request");
  }

  const mailOptions = {
    from: "your-email@gmail.com",
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send("OTP sent successfully");
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).send("Failed to send OTP");
  }
});
