
import React, { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const WhySection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeStatement, setActiveStatement] = useState(0);
  const statements = [
    "I built this app because social media made us louder but less heard.",
    "Because teens are drowning in likes and adults are fading into silence.",
    "Because we all need a space to feel whole again.",
    "Because your voice still matters."
  ];

  // Determine if section is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
          setActiveStatement(0);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.3,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Advance through statements when visible
  useEffect(() => {
    if (!isVisible) return;
    
    let timeout: NodeJS.Timeout;
    
    if (activeStatement < statements.length - 1) {
      timeout = setTimeout(() => {
        setActiveStatement(activeStatement + 1);
      }, 4000); // Each statement shows for 4 seconds
    }
    
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isVisible, activeStatement, statements.length]);
  
  // Scroll to features section
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section ref={sectionRef} className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white relative overflow-hidden">
      {/* Abstract background shapes */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-unmute-purple/20 filter blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-unmute-pink/20 filter blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 z-10 text-center">
        <div className="max-w-3xl mx-auto py-16">
          <div className="h-64 flex flex-col items-center justify-center mb-16">
            {statements.map((statement, index) => (
              <p 
                key={index}
                className={`text-2xl md:text-4xl font-light leading-relaxed transition-all duration-1000 absolute ${
                  index === activeStatement 
                    ? 'opacity-100 transform translate-y-0' 
                    : index < activeStatement 
                      ? 'opacity-0 transform -translate-y-16' 
                      : 'opacity-0 transform translate-y-16'
                }`}
              >
                <span className="text-unmute-purple text-4xl md:text-5xl font-serif">❝</span> {statement} <span className="text-unmute-purple text-4xl md:text-5xl font-serif">❞</span>
              </p>
            ))}
          </div>
          
          <div className={`transition-opacity duration-1000 ${activeStatement === statements.length - 1 ? 'opacity-100' : 'opacity-0'}`}>
            <Button 
              onClick={scrollToFeatures}
              className="bg-gradient-to-r from-unmute-purple to-unmute-pink hover:opacity-90 text-white px-8 py-6 h-auto text-lg rounded-full transition-all group hover:shadow-lg hover:shadow-unmute-purple/25"
              size="lg"
            >
              Start My Journey
              <ArrowDown className="ml-2 w-5 h-5 group-hover:translate-y-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhySection;
