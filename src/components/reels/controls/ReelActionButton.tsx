
import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface ReelActionButtonProps {
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  activeColor?: string;
  onClick?: () => void;
}

const ReelActionButton = ({ 
  icon: Icon, 
  label, 
  isActive = false, 
  activeColor = "", 
  onClick 
}: ReelActionButtonProps) => {
  const iconColorClass = isActive 
    ? activeColor || "text-white" 
    : "text-white";
  
  const fillAttribute = isActive ? activeColor || "none" : "none";

  return (
    <motion.button 
      whileHover={{ scale: 1.1 }} 
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center"
      onClick={onClick}
    >
      <div className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center">
        <Icon className={`w-6 h-6 ${iconColorClass}`} fill={fillAttribute} />
      </div>
      <span className="text-white text-xs mt-1 font-medium">
        {label}
      </span>
    </motion.button>
  );
};

export default ReelActionButton;
