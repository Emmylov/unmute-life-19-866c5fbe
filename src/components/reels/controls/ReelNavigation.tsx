
import React from "react";
import { motion } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";

interface ReelNavigationProps {
  hasNext: boolean;
  hasPrevious: boolean;
}

const ReelNavigation = ({ hasNext, hasPrevious }: ReelNavigationProps) => {
  return (
    <>
      {hasNext && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white"
          whileHover={{ y: -4, opacity: 1 }}
          title="Next reel"
        >
          <ChevronUp className="w-6 h-6 animate-bounce" />
        </motion.div>
      )}
      
      {hasPrevious && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          className="absolute top-6 left-1/2 transform -translate-x-1/2 text-white"
          whileHover={{ y: 4, opacity: 1 }}
          title="Previous reel"
        >
          <ChevronDown className="w-6 h-6 animate-bounce" />
        </motion.div>
      )}
    </>
  );
};

export default ReelNavigation;
