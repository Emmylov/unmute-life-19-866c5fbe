
import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

interface ReelNavigationProps {
  hasNext: boolean;
  hasPrevious: boolean;
}

const ReelNavigation: React.FC<ReelNavigationProps> = ({ hasNext, hasPrevious }) => {
  return (
    <>
      {/* Previous reel indicator */}
      {hasPrevious && (
        <motion.div 
          className="absolute top-3 inset-x-0 flex justify-center pointer-events-none"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 0.6, y: 0 }}
          transition={{ duration: 0.3, delay: 1 }}
        >
          <div className="bg-black/30 backdrop-blur-sm rounded-full p-1 px-3 flex items-center gap-1">
            <ChevronUp className="h-4 w-4 text-white" />
            <span className="text-xs text-white">Swipe up</span>
          </div>
        </motion.div>
      )}

      {/* Next reel indicator */}
      {hasNext && (
        <motion.div 
          className="absolute bottom-12 inset-x-0 flex justify-center pointer-events-none"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.6, y: 0 }}
          transition={{ duration: 0.3, delay: 1 }}
        >
          <div className="bg-black/30 backdrop-blur-sm rounded-full p-1 px-3 flex items-center gap-1">
            <ChevronDown className="h-4 w-4 text-white" />
            <span className="text-xs text-white">Swipe down</span>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default ReelNavigation;
