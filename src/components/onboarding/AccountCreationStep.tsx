
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, ArrowRight, UserPlus, LogIn } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-responsive";

interface AccountCreationStepProps {
  onNext: () => void;
}

const AccountCreationStep = ({ onNext }: AccountCreationStepProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"signup" | "signin">("signup");
  const { toast: shadcnToast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Clear error when user changes input
  useEffect(() => {
    if (error) {
      setError(null);
    }
  }, [email, password]);
  
  const validateForm = () => {
    setError(null);
    
    if (!email) {
      setError("Email is required");
      return false;
    }
    
    if (!email.includes('@') || !email.includes('.')) {
      setError("Please enter a valid email address");
      return false;
    }
    
    if (!password) {
      setError("Password is required");
      return false;
    }
    
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    
    return true;
  };
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Check if user was actually created
      if (data.user) {
        toast.success("Account created!", {
          description: "Welcome to Unmute. Let's continue with your onboarding."
        });
        onNext();
      } else {
        toast.info("Check your email", {
          description: "We sent a confirmation link to verify your account."
        });
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      
      // Handle common signup errors with user-friendly messages
      if (error.message.includes("already registered")) {
        toast.error("Email already in use", {
          description: "Please try signing in instead or use a different email"
        });
      } else {
        toast.error("Error creating account", {
          description: error.message || "Something went wrong"
        });
      }
      setError(error.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast.success("Welcome back!", {
        description: "Successfully signed in"
      });
      
      // Redirect existing users directly to home
      navigate("/home");
    } catch (error: any) {
      console.error("Signin error:", error);
      
      // Provide more user-friendly error messages
      if (error.message.includes("Invalid login")) {
        toast.error("Invalid credentials", {
          description: "Please check your email and password"
        });
      } else {
        toast.error("Sign in failed", {
          description: error.message || "Please try again"
        });
      }
      setError(error.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col flex-grow p-4 sm:p-6 overflow-y-auto">
      <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-center">Join Unmute</h2>
      <p className="text-center text-gray-600 mb-6">Let your voice be heard</p>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 text-sm">
          {error}
        </div>
      )}
      
      <div className="flex justify-center space-x-4 mb-8">
        <button className="flex items-center justify-center bg-[#4285F4] text-white rounded-full h-12 w-12">
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
            <path fill="none" d="M1 1h22v22H1z" />
          </svg>
        </button>
      </div>
      
      <div className="flex items-center mb-4">
        <Separator className="flex-grow" />
        <span className="px-4 text-sm text-gray-500">or use email</span>
        <Separator className="flex-grow" />
      </div>
      
      <Tabs defaultValue="signup" className="w-full" onValueChange={(value) => setActiveTab(value as "signup" | "signin")}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="signup" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            <span className="hidden sm:inline">Create Account</span>
            <span className="sm:hidden">Sign Up</span>
          </TabsTrigger>
          <TabsTrigger value="signin" className="flex items-center gap-2">
            <LogIn className="h-4 w-4" />
            <span>Sign In</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="signup">
          <form onSubmit={handleSignUp} className="space-y-3 sm:space-y-4">
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>
            
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
            </div>
            
            <Button 
              type="submit" 
              className="unmute-primary-button w-full py-4 sm:py-5 text-base mt-2"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </TabsContent>
        
        <TabsContent value="signin">
          <form onSubmit={handleSignIn} className="space-y-3 sm:space-y-4">
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="signin-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="signin-password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="signin-password"
                  type="password"
                  placeholder="Enter your password"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="text-right">
                <Button variant="link" className="text-xs p-0 h-auto" onClick={() => alert("Password reset feature coming soon!")}>
                  Forgot password?
                </Button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="unmute-primary-button w-full py-4 sm:py-5 text-base mt-2"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountCreationStep;
