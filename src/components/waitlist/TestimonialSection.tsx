
import React, { useState, useEffect } from "react";
import { Quote } from "lucide-react";

interface TestimonialSectionProps {
  className?: string;
}

const TestimonialSection = ({ className }: TestimonialSectionProps) => {
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

  return (
    <div className={className}>
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
  );
};

export default TestimonialSection;
