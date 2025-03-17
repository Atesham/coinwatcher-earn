
import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  User,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
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
  sendLoginLink: (email: string, isRegistration: boolean) => Promise<boolean>;
  completeSignIn: (email: string) => Promise<boolean>;
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

  // Check for email link sign-in when app loads
  useEffect(() => {
    const completeSignInWithEmailLink = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = localStorage.getItem("emailForSignIn");
        
        if (!email) {
          // User opened link on a different device, ask for email
          email = window.prompt("Please provide your email for confirmation");
        }
        
        if (email) {
          try {
            await completeSignIn(email);
            localStorage.removeItem("emailForSignIn");
          } catch (error) {
            console.error("Error signing in with email link:", error);
            toast({
              title: "Authentication Error",
              description: "Failed to complete authentication. Please try again.",
              variant: "destructive"
            });
          }
        }
      }
    };

    if (!loading && !user) {
      completeSignInWithEmailLink();
    }
  }, [loading, user]);

  // Send email link for authentication
  const sendLoginLink = async (email: string, isRegistration: boolean): Promise<boolean> => {
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

      // Configure action code settings
      const actionCodeSettings = {
        url: window.location.origin + '/verify',
        handleCodeInApp: true,
      };

      // Send sign-in link to email
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      
      // Save email to localStorage to use it later
      localStorage.setItem("emailForSignIn", email);
      
      toast({
        title: "Verification email sent",
        description: "Please check your email to complete the authentication process.",
      });
      
      return true;
    } catch (error) {
      console.error("Error sending email link:", error);
      toast({
        title: "Authentication Error",
        description: "Failed to send verification email. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Complete sign-in with email link
  const completeSignIn = async (email: string): Promise<boolean> => {
    try {
      const result = await signInWithEmailLink(auth, email, window.location.href);
      const user = result.user;
      const isNewUser = result.additionalUserInfo?.isNewUser;

      if (isNewUser) {
        // Create new user document in Firestore
        await setDoc(doc(db, "users", user.uid), {
          ...defaultUserData,
          email: user.email,
          displayName: user.displayName || email.split('@')[0],
        });
      }

      // Fetch updated user data
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        setUserData(userDoc.data() as UserData);
      }

      toast({
        title: "Authentication Successful",
        description: isNewUser ? "Your account has been created successfully!" : "You have been logged in successfully!",
      });

      // Redirect to home page
      navigate("/");
      return true;
    } catch (error) {
      console.error("Error completing sign-in:", error);
      toast({
        title: "Authentication Error",
        description: "Failed to complete authentication. Please try again.",
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
    sendLoginLink,
    completeSignIn,
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
