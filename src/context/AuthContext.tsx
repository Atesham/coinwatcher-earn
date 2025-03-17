
import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  User,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  fetchSignInMethodsForEmail
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

type UserData = {
  email: string;
  displayName?: string;
  coins: number;
  miningRate: number;
  lastMined?: string;
  createdAt: string;
  level: number;
  rank?: string;
}

type AuthContextType = {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  generateOTP: (email: string, isRegistration: boolean) => Promise<boolean>;
  verifyOTP: (email: string, otp: string, isRegistration: boolean) => Promise<boolean>;
  signOut: () => Promise<void>;
  updateUserData: (data: Partial<UserData>) => Promise<void>;
};

const defaultUserData: UserData = {
  email: "",
  coins: 0,
  miningRate: 5,
  createdAt: new Date().toISOString(),
  level: 1,
  rank: "Bronze"
};

// Store OTPs temporarily in memory (in a real app, you might use a more secure method)
const otpStore: Record<string, { otp: string; isRegistration: boolean; timestamp: number }> = {};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        try {
          // Fetch user data from Firestore
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            setUserData(userDoc.data() as UserData);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Generate a 6-digit OTP
  const generateOTP = async (email: string, isRegistration: boolean): Promise<boolean> => {
    try {
      // Check if email already exists
      const methods = await fetchSignInMethodsForEmail(auth, email);
      
      if (isRegistration && methods.length > 0) {
        toast({
          title: "Email already registered",
          description: "This email is already registered. Please login instead.",
          variant: "destructive"
        });
        return false;
      }
      
      if (!isRegistration && methods.length === 0) {
        toast({
          title: "Email not registered",
          description: "This email is not registered. Please sign up instead.",
          variant: "destructive"
        });
        return false;
      }

      // Generate a 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store OTP in memory (with 10-minute expiration)
      otpStore[email] = {
        otp,
        isRegistration,
        timestamp: Date.now() + 10 * 60 * 1000 // 10 minutes expiration
      };
      
      // In a real app, you would send an email with the OTP
      // For demo purposes, we'll show it in a toast
      toast({
        title: "OTP Generated",
        description: `Your OTP is: ${otp} (In a real app, this would be sent to your email)`,
      });
      
      return true;
    } catch (error) {
      console.error("Error generating OTP:", error);
      toast({
        title: "Error",
        description: "Failed to generate OTP. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Verify OTP and sign in or register user
  const verifyOTP = async (email: string, otp: string, isRegistration: boolean): Promise<boolean> => {
    try {
      const storedData = otpStore[email];
      
      // Check if OTP exists and hasn't expired
      if (!storedData || Date.now() > storedData.timestamp) {
        toast({
          title: "OTP Expired",
          description: "Your OTP has expired. Please request a new one.",
          variant: "destructive"
        });
        return false;
      }

      // Check if OTP matches
      if (storedData.otp !== otp) {
        toast({
          title: "Invalid OTP",
          description: "The OTP you entered is incorrect. Please try again.",
          variant: "destructive"
        });
        return false;
      }

      // OTP is valid, proceed with sign in or registration
      let userCredential;
      
      if (isRegistration) {
        // Register new user
        userCredential = await createUserWithEmailAndPassword(auth, email, `password_${Math.random().toString(36)}`);
        
        // Create user document in Firestore
        await setDoc(doc(db, "users", userCredential.user.uid), {
          ...defaultUserData,
          email: email,
          displayName: email.split('@')[0],
        });
        
        // Send email verification (optional in OTP flow)
        await sendEmailVerification(userCredential.user);
      } else {
        // Sign in existing user (using email/password auth behind the scenes)
        // This requires that we set a password during registration
        try {
          userCredential = await signInWithEmailAndPassword(auth, email, `password_${Math.random().toString(36)}`);
        } catch (error) {
          // Handle case where user was created with the old method
          console.error("Sign in error:", error);
          toast({
            title: "Authentication Error",
            description: "Please use the 'Forgot Password' option to reset your password.",
            variant: "destructive"
          });
          return false;
        }
      }

      // Clear OTP from store after successful verification
      delete otpStore[email];

      // Fetch user data
      const userDocRef = doc(db, "users", userCredential.user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        setUserData(userDoc.data() as UserData);
      }

      toast({
        title: "Authentication Successful",
        description: isRegistration ? "Your account has been created successfully!" : "You have been logged in successfully!",
      });

      // Redirect to home page
      navigate("/");
      return true;
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast({
        title: "Authentication Error",
        description: "Failed to authenticate. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Sign out user
  const signOut = async (): Promise<void> => {
    try {
      await firebaseSignOut(auth);
      navigate("/login");
      toast({
        title: "Signed Out",
        description: "You have been signed out successfully.",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Update user data in Firestore
  const updateUserData = async (data: Partial<UserData>): Promise<void> => {
    if (!user) return;

    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, data);
      
      // Update local state
      setUserData(prev => prev ? { ...prev, ...data } : null);
    } catch (error) {
      console.error("Error updating user data:", error);
      toast({
        title: "Update Error",
        description: "Failed to update user data. Please try again.",
        variant: "destructive"
      });
    }
  };

  const value = {
    user,
    userData,
    loading,
    generateOTP,
    verifyOTP,
    signOut,
    updateUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
