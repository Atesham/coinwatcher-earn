import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { db } from "@/lib/firebase";
import { doc, setDoc, getDocs, query, where, collection } from "firebase/firestore";

const emailSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

const otpSchema = z.object({
  otp: z.string().length(6, { message: "OTP must be 6 digits" }),
});

type EmailFormValues = z.infer<typeof emailSchema>;
type OTPFormValues = z.infer<typeof otpSchema>;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [email, setEmail] = useState("");
  const [generatedOTP, setGeneratedOTP] = useState("");

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const otpForm = useForm<OTPFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

  const checkEmailExists = async (email: string) => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const sendOTP = async (email: string) => {
    const otp = generateOTP();
    setGeneratedOTP(otp);

    try {
      await setDoc(doc(db, "otps", email), { otp, timestamp: new Date().toISOString() });
      alert(`OTP sent to ${email}`);
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP. Try again.");
    }
  };

  const onSubmitEmail = async (data: { email: string }) => {
    setLoading(true);
    const email = data.email.trim();
    setEmail(email);

    try {
      const emailExists = await checkEmailExists(email);

      if (!emailExists) {
        if (window.confirm("This email is not registered. Do you want to sign up?")) {
          navigate("/signup");
        }
        setLoading(false);
        return;
      }

      await sendOTP(email);
      setShowOTPInput(true);
    } catch (error) {
      console.error("Firebase Error:", error);
      alert("Error checking email. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmitOTP = async (data: OTPFormValues) => {
    setLoading(true);
    try {
      const otpDoc = await getDocs(query(collection(db, "otps"), where("otp", "==", generatedOTP)));
      const isValidOTP = !otpDoc.empty;

      if (isValidOTP) {
        alert("Login Successful!");
        navigate("/dashboard");
      } else {
        alert("Invalid OTP. Try again.");
      }
    } catch (error) {
      console.error("OTP Verification Error:", error);
      alert("Error verifying OTP. Try again.");
    } finally {
      setLoading(false);
    }
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
                            {[...Array(6)].map((_, i) => (
                              <InputOTPSlot key={i} index={i} className="bg-app-card border-white/10 text-white" />
                            ))}
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
                  {loading ? "Verifying OTP..." : "Login"}
                </Button>
                
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="text-white/70"
                  onClick={() => setShowOTPInput(false)}
                  disabled={loading}
                >
                  Back to email
                </Button>
                
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="text-white/70"
                  onClick={() => {
                    setLoading(true);
                    sendOTP(email).finally(() => setLoading(false));
                  }}
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

      <div className="mt-8 text-center text-white/40 text-sm">
        CoinTap v1.0.0
      </div>
    </div>
  );
};

export default Login;


// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Mail } from "lucide-react";
// import { z } from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { db } from "@/lib/firebase";
// import { doc, setDoc, getDocs, query, where, collection } from "firebase/firestore";

// const emailSchema = z.object({
//   email: z.string().email({ message: "Please enter a valid email address" }),
// });

// const otpSchema = z.object({
//   otp: z.string().length(6, { message: "OTP must be 6 digits" }),
// });

// type EmailFormValues = z.infer<typeof emailSchema>;
// type OTPFormValues = z.infer<typeof otpSchema>;

// const Login: React.FC = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [showOTPInput, setShowOTPInput] = useState(false);
//   const [email, setEmail] = useState("");
//   const [generatedOTP, setGeneratedOTP] = useState("");

//   const emailForm = useForm<EmailFormValues>({
//     resolver: zodResolver(emailSchema),
//     defaultValues: { email: "" },
//   });

//   const otpForm = useForm<OTPFormValues>({
//     resolver: zodResolver(otpSchema),
//     defaultValues: { otp: "" },
//   });

//   const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

//   // Check if email exists in Firestore
//   const checkEmailExists = async (email: string) => {
//     const usersRef = collection(db, "users");
//     const q = query(usersRef, where("email", "==", email));
//     const querySnapshot = await getDocs(q);
//     return !querySnapshot.empty; // Returns true if email exists
//   };

//   const sendOTP = async (email: string) => {
//     const otp = generateOTP();
//     setGeneratedOTP(otp);

//     try {
//       await setDoc(doc(db, "otps", email), { otp, timestamp: new Date().toISOString() });
//       alert(`OTP sent to ${email}`);
//     } catch (error) {
//       console.error("Error sending OTP:", error);
//       alert("Failed to send OTP. Try again.");
//     }
//   };

//   const onSubmitEmail = async (data: { email: string }) => {
//     setLoading(true);
//     const email = data.email.trim();
//     setEmail(email);

//     try {
//       const emailExists = await checkEmailExists(email);

//       if (!emailExists) {
//         if (window.confirm("This email is not registered. Do you want to sign up?")) {
//           navigate("/signup");
//         }
//         setLoading(false);
//         return;
//       }

//       await sendOTP(email);
//       setShowOTPInput(true);
//     } catch (error) {
//       console.error("Firebase Error:", error);
//       alert("Error checking email. Try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onSubmitOTP = async (data: OTPFormValues) => {
//     setLoading(true);
//     try {
//       const otpDoc = await getDocs(query(collection(db, "otps"), where("otp", "==", generatedOTP)));
//       const isValidOTP = !otpDoc.empty;

//       if (isValidOTP) {
//         alert("Login Successful!");
//         navigate("/index");
//       } else {
//         alert("Invalid OTP. Try again.");
//       }
//     } catch (error) {
//       console.error("OTP Verification Error:", error);
//       alert("Error verifying OTP. Try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (

// <div className="min-h-screen bg-app-dark flex flex-col justify-center p-6">
//        <div className="mb-8 text-center">
//          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
//          <p className="text-white/70">Login to continue mining coins</p>
//        </div>


// <div className="glass-card rounded-xl p-6 w-full max-w-md mx-auto">
//           {!showOTPInput ? (
//           <form onSubmit={emailForm.handleSubmit(onSubmitEmail)} className="space-y-4">
//             <div>
//               <label className="block text-gray-300">Email Address</label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                 <Input
//                   placeholder="your@email.com"
//                   className="pl-10 w-full bg-gray-700 text-white border border-gray-600"
//                   {...emailForm.register("email")}
//                 />
//               </div>
//             </div>

//             <Button 
//                  type="submit" 
//                  className="w-full bg-app-blue hover:bg-app-blue/90"
//                  disabled={loading}
//                >
//                  {loading ? "Sending OTP..." : "Get OTP"}
//                </Button>


//           </form>
//         ) : (
//           <form onSubmit={otpForm.handleSubmit(onSubmitOTP)} className="space-y-4">
//             <div>
//               <label className="block text-gray-300">Enter OTP</label>
//               <Input
//                 maxLength={6}
//                 className="w-full bg-gray-700 text-white border border-gray-600"
//                 {...otpForm.register("otp")}
//               />
//             </div>
//             <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500" disabled={loading}>
//               {loading ? "Verifying..." : "Verify OTP"}
//             </Button>
//           </form>
//         )}

// <div className="mt-6 text-center text-white/70">
//            <span>Don't have an account? </span>
//            <Link to="/signup" className="text-app-blue hover:underline">
//              Sign up
//            </Link>
//          </div>
       
//       </div>
//     </div>
    
//   );
// };

// export default Login;



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