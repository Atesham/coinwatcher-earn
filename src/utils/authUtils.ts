
// Store OTPs temporarily in memory (in a real app, you might use a more secure method)
export const otpStore: Record<string, { otp: string; isRegistration: boolean; timestamp: number }> = {};

// Generate a 6-digit OTP
export const generateOTPCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Check if OTP is valid and not expired
export const isValidOTP = (email: string, otp: string): boolean => {
  const storedData = otpStore[email];
  
  // Check if OTP exists and hasn't expired
  if (!storedData || Date.now() > storedData.timestamp) {
    return false;
  }

  // Check if OTP matches
  return storedData.otp === otp;
};

// Store OTP with expiration
export const storeOTP = (email: string, otp: string, isRegistration: boolean): void => {
  // Store OTP in memory (with 10-minute expiration)
  otpStore[email] = {
    otp,
    isRegistration,
    timestamp: Date.now() + 10 * 60 * 1000 // 10 minutes expiration
  };
};

// Clear OTP from store
export const clearOTP = (email: string): void => {
  delete otpStore[email];
};

// Function to send OTP email
export const sendOTPEmail = async (email: string, otp: string): Promise<boolean> => {
  try {
    // For local development, log the OTP to console
    console.log(`[DEV] OTP for ${email}: ${otp}`);
    
    // In production, we would call the Firebase Function
    // Uncomment the following code when deployed:
    /*
    const sendOTPFunction = firebase.functions().httpsCallable('sendOTP');
    const result = await sendOTPFunction({ email, otp });
    return result.data.success;
    */
    
    // For now, just return true to simulate success
    return true;
  } catch (error) {
    console.error("Error sending OTP email:", error);
    return false;
  }
};
