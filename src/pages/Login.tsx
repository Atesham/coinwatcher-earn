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
});

type EmailFormValues = z.infer<typeof emailSchema>;
type OTPFormValues = z.infer<typeof otpSchema>;

const Login: React.FC = () => {
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
    defaultValues: { otp: "" },
  });

  const onSubmitEmail = async (data: EmailFormValues) => {
    setLoading(true);
    try {
      const success = await generateOTP(data.email, false);
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
      await verifyOTP(email, data.otp, false);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error:", error);
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
                  {loading ? <Loader className="animate-spin" /> : "Verify OTP"}
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