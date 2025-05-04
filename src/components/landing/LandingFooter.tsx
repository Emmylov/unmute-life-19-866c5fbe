
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { toast } from "sonner";

const LandingFooter = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Thank you for subscribing!");
      setEmail("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-black text-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              This isn't social media. This is soul media.
            </h2>
            <p className="text-gray-400">Join our movement and help shape the future of authentic connection.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="md:col-span-1">
              <h3 className="text-xl font-bold mb-4">Navigation</h3>
              <ul className="space-y-2">
                <li><Link to="/onboarding" className="text-gray-400 hover:text-white transition-colors">About</Link></li>
                <li><Link to="/help" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/auth" className="text-gray-400 hover:text-white transition-colors">Join Now</Link></li>
              </ul>
            </div>
            
            <div className="md:col-span-1">
              <h3 className="text-xl font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Community Guidelines</Link></li>
              </ul>
            </div>
            
            <div className="md:col-span-1">
              <h3 className="text-xl font-bold mb-4">Stay Updated</h3>
              <form onSubmit={handleSubscribe} className="flex flex-col space-y-3">
                <input 
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/10 rounded-lg px-4 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-unmute-purple"
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-unmute-purple hover:bg-unmute-purple/90 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  {isSubmitting ? "Subscribing..." : "Subscribe"}
                </Button>
              </form>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-gray-800 text-center">
            <div className="mb-4">
              <h1 className="text-2xl font-bold">
                <span className="unmute-gradient-text">Unmute</span>
              </h1>
              <p className="text-sm text-gray-500">Built by Ella Iyayi 🦋</p>
            </div>
            <p className="text-gray-500 text-sm">© 2025 Unmute. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
