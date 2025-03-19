import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Loader } from 'lucide-react';

const emailSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
  displayName: z.string().min(3, 'Display name must be at least 3 characters'),
});

type EmailFormValues = z.infer<typeof emailSchema>;
type OTPFormValues = z.infer<typeof otpSchema>;

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [email, setEmail] = useState("");
  const { generateOTP, verifyOTP } = useAuth();

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const otpForm = useForm<OTPFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "", displayName: "" },
  });

  const onSubmitEmail = async (data: EmailFormValues) => {
    setLoading(true);
    try {
      const success = await generateOTP(data.email, true);
      if (success) {
        setEmail(data.email);
        setShowOTPInput(true);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitOTP = async (data: OTPFormValues) => {
    setLoading(true);
    try {
      await verifyOTP(email, data.otp, true);
      navigate('/dashboard'); // Redirect after successful signup
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-app-dark flex flex-col justify-center p-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
        <p className="text-white/70">Start your mining journey</p>
      </div>

      <div className="glass-card rounded-xl p-8 w-full max-w-md mx-auto">
        {!showOTPInput ? (
          <Form {...emailForm}>
            <form onSubmit={emailForm.handleSubmit(onSubmitEmail)} className="space-y-6">
              <div>
                <input
                  {...emailForm.register("email")}
                  type="email"
                  placeholder="Enter your email"
                  className="w-full p-3 rounded bg-white/10 text-white"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-app-blue hover:bg-app-blue/90"
                disabled={loading}
              >
                {loading ? <Loader className="animate-spin" /> : "Continue with Email"}
              </Button>
            </form>
          </Form>
        ) : (
          <Form {...otpForm}>
            <form onSubmit={otpForm.handleSubmit(onSubmitOTP)} className="space-y-6">
              <div>
                <input
                  {...otpForm.register("displayName")}
                  type="text"
                  placeholder="Enter display name"
                  className="w-full p-3 rounded bg-white/10 text-white mb-4"
                />
                <input
                  {...otpForm.register("otp")}
                  type="text"
                  placeholder="Enter OTP"
                  className="w-full p-3 rounded bg-white/10 text-white"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Button 
                  type="submit" 
                  className="w-full bg-app-blue hover:bg-app-blue/90"
                  disabled={loading}
                >
                  {loading ? <Loader className="animate-spin" /> : "Create Account"}
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setShowOTPInput(false)}
                  className="text-white/70"
                >
                  Back to email
                </Button>
              </div>
            </form>
          </Form>
        )}

        <div className="mt-6 text-center text-white/70">
          <span>Already have an account? </span>
          <Link to="/login" className="text-app-blue hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;