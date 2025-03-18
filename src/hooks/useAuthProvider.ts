
import { useState, useEffect } from "react";
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
import { UserData, defaultUserData } from "@/types/auth";
import { generateOTPCode, storeOTP, isValidOTP, clearOTP, sendOTPEmail } from "@/utils/authUtils";

export const useAuthProvider = () => {
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

  // Generate OTP and send to email
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
      const otp = generateOTPCode();
      
      // Store OTP with expiration
      storeOTP(email, otp, isRegistration);
      
      // Send OTP email
      const emailSent = await sendOTPEmail(email, otp);
      
      if (emailSent) {
        toast({
          title: "OTP Sent",
          description: "An OTP has been sent to your email address. Please check your inbox.",
        });
        return true;
      } else {
        toast({
          title: "Email Error",
          description: "Failed to send OTP email. Please try again.",
          variant: "destructive"
        });
        return false;
      }
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
      // Validate OTP
      if (!isValidOTP(email, otp)) {
        toast({
          title: "Invalid OTP",
          description: "The OTP you entered is incorrect or has expired. Please try again.",
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
      clearOTP(email);

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

  return {
    user,
    userData,
    loading,
    generateOTP,
    verifyOTP,
    signOut,
    updateUserData,
  };
};
