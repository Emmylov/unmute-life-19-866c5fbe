
import React from "react";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface ReelActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  isActive?: boolean;
  activeColor?: string;
  isMobile?: boolean;
  badge?: number;
  showAnimation?: boolean;
}

const ReelActionButton: React.FC<ReelActionButtonProps> = ({
  icon: Icon,
  label,
  onClick,
  isActive = false,
  activeColor = "text-primary fill-primary",
  isMobile = false,
  badge,
  showAnimation = false
}) => {
  const buttonSize = isMobile ? "w-11 h-11" : "w-12 h-12";
  const iconSize = isMobile ? "w-5 h-5" : "w-6 h-6";
  
  const pulseAnimation = showAnimation ? {
    animate: {
      scale: [1, 1.2, 1],
      transition: {
        duration: 0.5,
        repeat: 0,
        repeatType: "reverse"
      }
    }
  } : {};

  return (
    <div className="flex flex-col items-center">
      <motion.button
        onClick={onClick}
        className={`${buttonSize} rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center transition-colors ${
          isActive ? activeColor : "text-white"
        } hover:bg-black/40`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        {...pulseAnimation}
      >
        <Icon className={iconSize} fill={isActive ? "currentColor" : "none"} />
        
        {/* Badge for comment counts */}
        {badge && badge > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {badge > 99 ? "99+" : badge}
          </span>
        )}
      </motion.button>
      
      <span className={`text-xs mt-1 ${isActive ? "text-white font-medium" : "text-white/80"}`}>
        {label}
      </span>
    </div>
  );
};

export default ReelActionButton;
