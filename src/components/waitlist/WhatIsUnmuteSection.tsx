
import React from "react";
import { motion } from "framer-motion";
import { Mic, MessageSquare, BookOpen, Users } from "lucide-react";

interface WhatIsUnmuteSectionProps {
  className?: string;
}

const WhatIsUnmuteSection = ({ className }: WhatIsUnmuteSectionProps) => {
  const features = [
    {
      icon: <Mic className="h-8 w-8 text-unmute-purple" />,
      title: "Speak Freely",
      description: "Record your voice or video and share how you really feel."
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-unmute-pink" />,
      title: "Emotion-Based Posts",
      description: "Choose how you're feeling, then Unmute it into the world."
    },
    {
      icon: <BookOpen className="h-8 w-8 text-unmute-blue" />,
      title: "Wellness Tools",
      description: "Journal, breathe, and grow with content made for your peace."
    },
    {
      icon: <Users className="h-8 w-8 text-unmute-lavender" />,
      title: "Feel-Good Community",
      description: "No likes, no filters — just people being real and supportive."
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className={`py-16 bg-white/20 backdrop-blur-sm ${className}`}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Is Unmute?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A safe space to express yourself authentically and connect meaningfully
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={item} className="group">
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-gradient-to-br from-unmute-purple/10 to-unmute-pink/10 rounded-full">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-xl">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhatIsUnmuteSection;
