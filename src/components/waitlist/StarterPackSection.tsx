
import React from "react";
import { motion } from "framer-motion";
import { Gift, BookOpen, Music, Award, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface StarterPackSectionProps {
  className?: string;
}

const StarterPackSection = ({ className }: StarterPackSectionProps) => {
  const navigate = useNavigate();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className={`py-16 ${className}`}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-unmute-purple/20 to-unmute-pink/20 text-unmute-purple font-medium mb-4"
          >
            <Sparkles className="w-4 h-4" />
            Launch Day Special
          </motion.div>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
        >
          <motion.div variants={item} className="group">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 bg-gradient-to-br from-unmute-purple/10 to-unmute-pink/10 rounded-full">
                  <Gift className="h-8 w-8 text-unmute-purple" />
                </div>
                <h3 className="font-semibold text-lg">Custom Wallpaper</h3>
                <p className="text-sm text-gray-600">Exclusive phone & desktop designs</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={item} className="group">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 bg-gradient-to-br from-unmute-purple/10 to-unmute-pink/10 rounded-full">
                  <BookOpen className="h-8 w-8 text-unmute-pink" />
                </div>
                <h3 className="font-semibold text-lg">Digital Guidebook</h3>
                <p className="text-sm text-gray-600">Wellness tips & platform secrets</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={item} className="group">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 bg-gradient-to-br from-unmute-purple/10 to-unmute-pink/10 rounded-full">
                  <Music className="h-8 w-8 text-unmute-blue" />
                </div>
                <h3 className="font-semibold text-lg">Focus Playlist</h3>
                <p className="text-sm text-gray-600">Curated tracks for mindfulness</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={item} className="group">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 bg-gradient-to-br from-unmute-purple/10 to-unmute-pink/10 rounded-full">
                  <Award className="h-8 w-8 text-unmute-lavender" />
                </div>
                <h3 className="font-semibold text-lg">OG Badge</h3>
                <p className="text-sm text-gray-600">Lifetime profile verification</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <Button 
            onClick={() => navigate('/auth')}
            className="bg-unmute-purple hover:bg-unmute-purple/90 text-white px-8 py-6 h-auto text-lg rounded-full"
            size="lg"
          >
            <Gift className="mr-2 h-5 w-5" />
            Claim Your OG Pack
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default StarterPackSection;
