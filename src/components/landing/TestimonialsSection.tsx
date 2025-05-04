
import React, { useState, useEffect } from "react";
import { Users } from "lucide-react";

interface Testimonial {
  id: number;
  quote: string;
  style: string;
}

const TestimonialsSection = () => {
  const [visibleTestimonials, setVisibleTestimonials] = useState<Testimonial[]>([]);
  
  const testimonials: Testimonial[] = [
    { id: 1, quote: "This app saved my relationship with myself.", style: "top-1/4 left-[10%] bg-purple-100 text-purple-800" },
    { id: 2, quote: "I cried the first time I used Unmute.", style: "top-2/3 left-[20%] bg-pink-100 text-pink-800" },
    { id: 3, quote: "I'm 42. And I finally feel seen.", style: "top-1/2 left-[60%] bg-blue-100 text-blue-800" },
    { id: 4, quote: "It's not about clout here. It's about connection.", style: "top-1/4 left-[70%] bg-green-100 text-green-800" },
    { id: 5, quote: "Found my voice again after years of silence.", style: "top-3/4 left-[80%] bg-orange-100 text-orange-800" },
    { id: 6, quote: "Better than therapy (but I still go to therapy too!)", style: "top-1/6 left-[40%] bg-indigo-100 text-indigo-800" },
    { id: 7, quote: "I didn't know how much I needed this.", style: "top-2/3 left-[50%] bg-teal-100 text-teal-800" },
    { id: 8, quote: "My teens and I both use it. Separately, of course.", style: "top-2/5 left-[30%] bg-amber-100 text-amber-800" },
  ];
  
  // Animate testimonials appearing
  useEffect(() => {
    const showTestimonials = async () => {
      const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
      
      for (let i = 0; i < testimonials.length; i++) {
        await delay(400);
        setVisibleTestimonials(prev => [...prev, testimonials[i]]);
      }
    };
    
    showTestimonials();
  }, []);

  return (
    <section className="py-20 bg-white relative min-h-[600px] overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center p-2 bg-gray-100 rounded-full mb-4">
            <Users className="w-6 h-6 text-unmute-purple" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">What People Are Saying</h2>
        </div>
      </div>
      
      {/* Floating testimonials */}
      <div className="absolute inset-0 overflow-hidden">
        {visibleTestimonials.map((testimonial) => (
          <div 
            key={testimonial.id}
            className={`absolute px-6 py-4 rounded-xl shadow-md transform transition-all duration-700 ease-out animate-float max-w-xs ${testimonial.style}`}
            style={{ 
              animationDelay: `${testimonial.id * 0.5}s`,
              animationDuration: `${10 + Math.random() * 10}s`
            }}
          >
            "{testimonial.quote}"
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
