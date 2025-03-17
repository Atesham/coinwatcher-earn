
<<<<<<< HEAD
// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { useAuth } from '@/context/AuthContext';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Mail, KeyRound } from 'lucide-react';
// import { z } from 'zod';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import {
//   InputOTP,
//   InputOTPGroup,
//   InputOTPSlot,
// } from "@/components/ui/input-otp";

// const emailSchema = z.object({
//   email: z.string().email({ message: "Please enter a valid email address" }),
// });

// const otpSchema = z.object({
//   otp: z.string().length(6, { message: "OTP must be 6 digits" }),
// });

// type EmailFormValues = z.infer<typeof emailSchema>;
// type OTPFormValues = z.infer<typeof otpSchema>;

// const Login: React.FC = () => {
//   const { generateOTP, verifyOTP } = useAuth();
//   const [loading, setLoading] = useState(false);
//   const [showOTPInput, setShowOTPInput] = useState(false);
//   const [email, setEmail] = useState("");

//   const emailForm = useForm<EmailFormValues>({
//     resolver: zodResolver(emailSchema),
//     defaultValues: {
//       email: "",
//     },
//   });

//   const otpForm = useForm<OTPFormValues>({
//     resolver: zodResolver(otpSchema),
//     defaultValues: {
//       otp: "",
//     },
//   });

//   const onSubmitEmail = async (data: EmailFormValues) => {
//     setLoading(true);
//     const result = await generateOTP(data.email, false);
//     setLoading(false);
    
//     if (result) {
//       setEmail(data.email);
//       setShowOTPInput(true);
//     }
//   };

//   const onSubmitOTP = async (data: OTPFormValues) => {
//     setLoading(true);
//     await verifyOTP(email, data.otp, false);
//     setLoading(false);
//   };

//   const goBack = () => {
//     setShowOTPInput(false);
//     otpForm.reset();
//   };

//   return (
//     <div className="min-h-screen bg-app-dark flex flex-col justify-center p-6">
//       <div className="mb-8 text-center">
//         <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
//         <p className="text-white/70">Login to continue mining coins</p>
//       </div>

//       <div className="glass-card rounded-xl p-6 w-full max-w-md mx-auto">
//         {!showOTPInput ? (
//           <Form {...emailForm}>
//             <form onSubmit={emailForm.handleSubmit(onSubmitEmail)} className="space-y-4">
//               <FormField
//                 control={emailForm.control}
//                 name="email"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white">Email Address</FormLabel>
//                     <FormControl>
//                       <div className="relative">
//                         <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 h-5 w-5" />
//                         <Input
//                           placeholder="your@email.com"
//                           className="pl-10 bg-app-card border-white/10"
//                           {...field}
//                         />
//                       </div>
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <Button 
//                 type="submit" 
//                 className="w-full bg-app-blue hover:bg-app-blue/90"
//                 disabled={loading}
//               >
//                 {loading ? "Sending OTP..." : "Get OTP"}
//               </Button>
//             </form>
//           </Form>
//         ) : (
//           <Form {...otpForm}>
//             <form onSubmit={otpForm.handleSubmit(onSubmitOTP)} className="space-y-4">
//               <div className="text-center mb-4">
//                 <p className="text-white mb-1">Enter the 6-digit OTP sent to</p>
//                 <p className="text-app-blue font-semibold">{email}</p>
//               </div>

//               <FormField
//                 control={otpForm.control}
//                 name="otp"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormControl>
//                       <div className="flex justify-center">
//                         <InputOTP maxLength={6} {...field}>
//                           <InputOTPGroup>
//                             <InputOTPSlot index={0} className="bg-app-card border-white/10 text-white" />
//                             <InputOTPSlot index={1} className="bg-app-card border-white/10 text-white" />
//                             <InputOTPSlot index={2} className="bg-app-card border-white/10 text-white" />
//                             <InputOTPSlot index={3} className="bg-app-card border-white/10 text-white" />
//                             <InputOTPSlot index={4} className="bg-app-card border-white/10 text-white" />
//                             <InputOTPSlot index={5} className="bg-app-card border-white/10 text-white" />
//                           </InputOTPGroup>
//                         </InputOTP>
//                       </div>
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <div className="flex flex-col space-y-2">
//                 <Button 
//                   type="submit" 
//                   className="w-full bg-app-blue hover:bg-app-blue/90"
//                   disabled={loading}
//                 >
//                   {loading ? "Verifying..." : "Verify OTP"}
//                 </Button>
                
//                 <Button 
//                   type="button" 
//                   variant="ghost" 
//                   className="text-white/70"
//                   onClick={goBack}
//                   disabled={loading}
//                 >
//                   Back to email
//                 </Button>
                
//                 <Button 
//                   type="button" 
//                   variant="ghost" 
//                   className="text-white/70"
//                   onClick={() => {
//                     setLoading(true);
//                     generateOTP(email, false).finally(() => setLoading(false));
//                   }}
//                   disabled={loading}
//                 >
//                   Resend OTP
//                 </Button>
//               </div>
//             </form>
//           </Form>
//         )}

//         <div className="mt-6 text-center text-white/70">
//           <span>Don't have an account? </span>
//           <Link to="/signup" className="text-app-blue hover:underline">
//             Sign up
//           </Link>
//         </div>
//       </div>

//       <div className="mt-8 text-center text-white/40 text-sm">
//         CoinTap v1.0.0
//       </div>
//     </div>
//   );
// };

// export default Login;




import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
=======
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, KeyRound } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
>>>>>>> a77fa27bd1932898ac83a91c422a7cd9ae5d352b
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
<<<<<<< HEAD
import { getAuth, signInWithEmailLink, sendSignInLinkToEmail, signInWithCustomToken } from "firebase/auth";
import { db } from "@/lib/firebase";  // Ensure Firebase is initialized
import { doc, setDoc, getDoc } from "firebase/firestore";
=======
>>>>>>> a77fa27bd1932898ac83a91c422a7cd9ae5d352b

const emailSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

const otpSchema = z.object({
  otp: z.string().length(6, { message: "OTP must be 6 digits" }),
});

type EmailFormValues = z.infer<typeof emailSchema>;
type OTPFormValues = z.infer<typeof otpSchema>;

const Login: React.FC = () => {
  const auth = getAuth();
  const [loading, setLoading] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [email, setEmail] = useState("");
  const [generatedOTP, setGeneratedOTP] = useState("");  // Store OTP temporarily

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const otpForm = useForm<OTPFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  // Function to generate a 6-digit OTP
  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Function to send OTP via Firebase Firestore (simulate email)
  const sendOTP = async (email: string) => {
    // Check if email is registered in Firestore
    const userRef = doc(db, "users", email);
    const userSnap = await getDoc(userRef);
  
    if (!userSnap.exists()) {
      alert("Email not registered. Please sign up first.");
      return;
    }
  
    const otp = generateOTP();
    setGeneratedOTP(otp); // Store OTP temporarily
  
    try {
      // Store OTP in Firestore
      await setDoc(doc(db, "otps", email), {
        otp,
        timestamp: new Date().toISOString(),
      });
  
      // Call a backend function to send a real email
      await fetch("/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
  
      alert(`OTP sent to ${email}`); // Remove this once email sending is confirmed
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP. Try again.");
    }
  };
  
  const onSubmitEmail = async (data: EmailFormValues) => {
    setLoading(true);
  
    // Check if email is registered
    const userRef = doc(db, "users", data.email);
    const userSnap = await getDoc(userRef);
  
    if (!userSnap.exists()) {
      setLoading(false);
      if (window.confirm("This email is not registered. Do you want to create an account?")) {
        window.location.href = "/signup"; // Redirect to signup page
      }
      return;
    }
  
    // If email exists, proceed with OTP
    await sendOTP(data.email);
    setEmail(data.email);
    setShowOTPInput(true);
    setLoading(false);
  };
  
  const onSubmitOTP = async (data: OTPFormValues) => {
    setLoading(true);

    // Fetch OTP from Firestore
    const otpDoc = await getDoc(doc(db, "otps", email));
    const storedOTP = otpDoc.exists() ? otpDoc.data().otp : null;

    if (storedOTP && storedOTP === data.otp) {
      // Generate a Firebase auth token
      const customToken = `FAKE_CUSTOM_TOKEN_${email}`; // Replace this with your Firebase backend token system

      await signInWithCustomToken(auth, customToken);
      alert("Login Successful!");
    } else {
      alert("Invalid OTP. Try again.");
    }

    setLoading(false);
    
    if (result) {
      setEmail(data.email);
      setShowOTPInput(true);
    }
  };

  const onSubmitOTP = async (data: OTPFormValues) => {
    setLoading(true);
    await verifyOTP(email, data.otp, false);
    setLoading(false);
  };

  const goBack = () => {
    setShowOTPInput(false);
    otpForm.reset();
  };

  return (
    <div className="min-h-screen bg-app-dark flex flex-col justify-center p-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
        <p className="text-white/70">Login to continue mining coins</p>
      </div>

      <div className="glass-card rounded-xl p-6 w-full max-w-md mx-auto">
        {!showOTPInput ? (
          <Form {...emailForm}>
            <form onSubmit={emailForm.handleSubmit(onSubmitEmail)} className="space-y-4">
              <FormField
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Email Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 h-5 w-5" />
                        <Input
                          placeholder="your@email.com"
                          className="pl-10 bg-app-card border-white/10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full bg-app-blue hover:bg-app-blue/90"
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "Get OTP"}
              </Button>
            </form>
          </Form>
        ) : (
          <Form {...otpForm}>
            <form onSubmit={otpForm.handleSubmit(onSubmitOTP)} className="space-y-4">
              <div className="text-center mb-4">
                <p className="text-white mb-1">Enter the 6-digit OTP sent to</p>
                <p className="text-app-blue font-semibold">{email}</p>
              </div>

              <FormField
                control={otpForm.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex justify-center">
                        <InputOTP maxLength={6} {...field}>
                          <InputOTPGroup>
<<<<<<< HEAD
                            {Array(6).fill(0).map((_, i) => (
                              <InputOTPSlot key={i} index={i} className="bg-app-card border-white/10 text-white" />
                            ))}
=======
                            <InputOTPSlot index={0} className="bg-app-card border-white/10 text-white" />
                            <InputOTPSlot index={1} className="bg-app-card border-white/10 text-white" />
                            <InputOTPSlot index={2} className="bg-app-card border-white/10 text-white" />
                            <InputOTPSlot index={3} className="bg-app-card border-white/10 text-white" />
                            <InputOTPSlot index={4} className="bg-app-card border-white/10 text-white" />
                            <InputOTPSlot index={5} className="bg-app-card border-white/10 text-white" />
>>>>>>> a77fa27bd1932898ac83a91c422a7cd9ae5d352b
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col space-y-2">
                <Button 
                  type="submit" 
                  className="w-full bg-app-blue hover:bg-app-blue/90"
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </Button>
                
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="text-white/70"
<<<<<<< HEAD
                  onClick={() => {
                    setShowOTPInput(false);
                    otpForm.reset();
                  }}
=======
                  onClick={goBack}
>>>>>>> a77fa27bd1932898ac83a91c422a7cd9ae5d352b
                  disabled={loading}
                >
                  Back to email
                </Button>
                
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="text-white/70"
<<<<<<< HEAD
                  onClick={() => sendOTP(email)}
=======
                  onClick={() => {
                    setLoading(true);
                    generateOTP(email, false).finally(() => setLoading(false));
                  }}
>>>>>>> a77fa27bd1932898ac83a91c422a7cd9ae5d352b
                  disabled={loading}
                >
                  Resend OTP
                </Button>
              </div>
            </form>
          </Form>
        )}

        <div className="mt-6 text-center text-white/70">
          <span>Don't have an account? </span>
          <Link to="/signup" className="text-app-blue hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
