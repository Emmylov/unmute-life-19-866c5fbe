
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const FeaturesCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const features: Feature[] = [
    {
      title: "Mental Wellness Rooms",
      description: "Join conversations in a safe space where you can freely express your emotions.",
      icon: <span className="text-4xl">🧠</span>,
      color: "from-purple-500/20 to-blue-500/20"
    },
    {
      title: "Unfiltered Audio Diaries",
      description: "Record and share your thoughts with anonymity and without judgment.",
      icon: <span className="text-4xl">🎙️</span>,
      color: "from-pink-500/20 to-red-500/20"
    },
    {
      title: "Mentorship Circles",
      description: "Connect with mentors of different ages and backgrounds for guidance.",
      icon: <span className="text-4xl">🧓</span>,
      color: "from-green-500/20 to-teal-500/20"
    },
    {
      title: "Resonance, Not Likes",
      description: "Experience genuine connections without the pressure of traditional social media.",
      icon: <span className="text-4xl">✨</span>,
      color: "from-amber-500/20 to-yellow-500/20"
    },
  ];

  const nextFeature = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % features.length);
  };

  const prevFeature = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? features.length - 1 : prevIndex - 1));
  };

  // Fix: Make sure the handler expects a number parameter
  const handleSelect = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section className="py-16 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Features That <span className="text-primary">Set Us Apart</span>
        </h2>
        
        <div className="relative max-w-3xl mx-auto">
          <div className="overflow-hidden rounded-xl">
            <div 
              className="flex transition-transform duration-300 ease-in-out" 
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {features.map((feature, index) => (
                <div key={index} className="min-w-full p-4">
                  <Card className={`p-8 h-full bg-gradient-to-br ${feature.color} border-none shadow-lg`}>
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-4 transform transition-transform hover:scale-110">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
          
          <Button 
            onClick={prevFeature}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2 bg-white dark:bg-gray-800 shadow-lg rounded-full p-2 h-auto w-auto"
            size="icon"
            variant="ghost"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <Button 
            onClick={nextFeature}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-2 bg-white dark:bg-gray-800 shadow-lg rounded-full p-2 h-auto w-auto"
            size="icon"
            variant="ghost"
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex justify-center mt-6 space-x-2">
          {features.map((_, index) => (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                index === currentIndex ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesCarousel;
