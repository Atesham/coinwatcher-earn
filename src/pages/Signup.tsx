
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const signupSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type SignupFormValues = z.infer<typeof signupSchema>;

const Signup: React.FC = () => {
  const { sendLoginLink } = useAuth();
  const [loading, setLoading] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    setLoading(true);
    await sendLoginLink(data.email, true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-app-dark flex flex-col justify-center p-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
        <p className="text-white/70">Start mining coins today</p>
      </div>

      <div className="glass-card rounded-xl p-6 w-full max-w-md mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
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
              {loading ? "Creating Account..." : "Sign Up with Email Link"}
            </Button>
          </form>
        </Form>

        <div className="mt-6 text-center text-white/70">
          <span>Already have an account? </span>
          <Link to="/login" className="text-app-blue hover:underline">
            Login
          </Link>
        </div>
      </div>

      <div className="mt-8 text-center text-white/40 text-sm">
        CoinTap v1.0.0
      </div>
    </div>
  );
};

export default Signup;
