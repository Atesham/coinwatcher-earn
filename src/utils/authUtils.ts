
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
