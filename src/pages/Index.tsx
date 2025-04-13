import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { CountdownTimer } from "@/components/ui/countdown-timer";
import { Gift, BookOpen, Music, Award, Check, Quote } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const signupSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email")
});

type SignupFormValues = z.infer<typeof signupSchema>;

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  // Set the launch date to April 18, 2025
  const launchDate = new Date("2025-04-18T00:00:00");
  
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: ""
    }
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          setIsAuthenticated(true);
          // Redirect authenticated users directly to home
          navigate('/home');
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);
  
  const testimonials = [
    "Unmute helped me reclaim my peace.",
    "Finally a safe space on social media.",
    "Unmute gives me control over my digital life.",
    "A platform that prioritizes my wellbeing.",
    "The community here is supportive and uplifting."
  ];
  
  const [currentQuote, setCurrentQuote] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [testimonials.length]);
  
  const onSubmit = async (values: SignupFormValues) => {
    setSubmitting(true);
    
    try {
      // First store the signup in waitlist table
      const { error: waitlistError } = await supabase
        .from('waitlist')
        .insert({
          name: values.name,
          email: values.email
        });
      
      if (waitlistError) {
        throw waitlistError;
      }
      
      // Send welcome email
      const response = await fetch(`${supabase.supabaseUrl}/functions/v1/send-welcome-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabase.supabaseKey}`
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Email sending error:", errorData);
        // We'll still show success but log the error
      }
      
      toast.success("You're on the list! Check your email for your OG Starter Pack confirmation.");
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-unmute-purple/10 to-unmute-pink/10">
      {/* Header & Hero Section */}
      <header className="w-full py-6 px-6 flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold">
          <span className="unmute-gradient-text">Unmute</span>
        </h1>
        
        <div className="space-x-4">
          <Link to="/onboarding" className="text-sm text-gray-600 hover:text-unmute-purple">
            Learn More
          </Link>
        </div>
      </header>
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-6 py-12 md:py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="unmute-gradient-text">Unmute Is Launching Soon!</span>
          </h1>
          
          {/* Countdown Timer */}
          <div className="max-w-lg mx-auto mb-12">
            <CountdownTimer targetDate={launchDate} className="transform scale-110" />
          </div>
          
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Join the movement. Be one of the first. Get the OG Starter Pack.
          </p>
          
          {/* Signup Form */}
          <div className="max-w-md mx-auto bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-16 relative overflow-hidden border border-white/60">
            {/* Decorative floating elements */}
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-unmute-purple/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-unmute-pink/20 rounded-full blur-lg"></div>
            
            <h3 className="text-xl font-bold mb-4">Reserve Your Spot</h3>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                          placeholder="Your name" 
                          {...field}
                          className="h-12 text-base"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                          placeholder="Your email" 
                          type="email" 
                          {...field}
                          className="h-12 text-base" 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="unmute-primary-button w-full h-12 text-lg font-medium"
                  disabled={submitting}
                >
                  {submitting ? "Adding you..." : "Unmute Me"}
                </Button>
              </form>
            </Form>
            
            <div className="mt-4 text-sm text-gray-500">
              We'll send you early access information closer to launch.
            </div>
          </div>
        </section>
        
        {/* Digital Goodies Section */}
        <section className="bg-white/50 py-16">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
              OG Starter Pack Goodies
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              <GoodieCard 
                icon={<Gift className="h-8 w-8 text-unmute-purple" />}
                title="Custom Wallpaper"
                description="Exclusive phone & desktop designs"
              />
              
              <GoodieCard 
                icon={<BookOpen className="h-8 w-8 text-unmute-pink" />}
                title="Digital Guidebook"
                description="Wellness tips & platform secrets"
              />
              
              <GoodieCard 
                icon={<Music className="h-8 w-8 text-unmute-blue" />}
                title="Focus Playlist"
                description="Curated tracks for mindfulness"
              />
              
              <GoodieCard 
                icon={<Award className="h-8 w-8 text-unmute-lavender" />}
                title="OG Badge"
                description="Lifetime profile verification"
              />
            </div>
          </div>
        </section>
        
        {/* Wall of Voices */}
        <section className="py-16 bg-gradient-to-b from-white/0 to-unmute-purple/10">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Wall of Voices</h2>
            
            <div className="flex items-center justify-center mb-6">
              <div className="h-1 w-16 bg-gradient-to-r from-unmute-purple to-unmute-pink rounded-full"></div>
            </div>
            
            <p className="text-lg md:text-xl mb-12">
              Everyone who signs up before launch gets featured on our OG wall &<br className="hidden md:block" /> gets a special in-app badge.
            </p>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg max-w-2xl mx-auto">
              <div className="flex justify-center mb-4">
                <Quote className="h-10 w-10 text-unmute-purple opacity-30" />
              </div>
              
              <p className="text-xl italic text-gray-700 min-h-[80px]">
                {testimonials[currentQuote]}
              </p>
              
              <div className="mt-8 flex justify-center space-x-2">
                {testimonials.map((_, index) => (
                  <button 
                    key={index} 
                    className={`h-2 w-2 rounded-full ${index === currentQuote ? 'bg-unmute-purple' : 'bg-gray-300'}`}
                    onClick={() => setCurrentQuote(index)}
                    aria-label={`Testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-white/80 py-8 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h1 className="text-xl font-bold">
                <span className="unmute-gradient-text">Unmute</span>
              </h1>
              <p className="text-sm text-gray-500">© 2025 Unmute. All rights reserved.</p>
            </div>
            
            <div className="flex space-x-6 text-sm">
              <Link to="/onboarding" className="text-gray-600 hover:text-unmute-purple">About</Link>
              <Link to="/help" className="text-gray-600 hover:text-unmute-purple">Contact</Link>
              <Link to="#" className="text-gray-600 hover:text-unmute-purple">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

interface GoodieCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const GoodieCard = ({ icon, title, description }: GoodieCardProps) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center shadow-md transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px] border border-white/60">
      <div className="flex justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-bold mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};

export default Index;
