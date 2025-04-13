
import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ReelActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  isActive?: boolean;
  activeColor?: string;
  isMobile?: boolean;
}

const ReelActionButton: React.FC<ReelActionButtonProps> = ({
  icon: Icon,
  label,
  onClick,
  isActive = false,
  activeColor = "text-primary",
  isMobile = false
}) => {
  // Adjust size and styling based on screen size
  const iconSize = isMobile ? "w-5 h-5" : "w-6 h-6";
  const buttonSize = isMobile ? "w-11 h-11" : "w-14 h-14";
  const labelSize = isMobile ? "text-xs" : "text-sm";
  
  return (
    <div className="flex flex-col items-center">
      <motion.button
        type="button"
        onClick={onClick}
        className={cn(
          `${buttonSize} rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 flex items-center justify-center transition-all`,
          isActive ? activeColor : "text-white"
        )}
        aria-label={label}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Icon className={iconSize} fill={isActive ? "currentColor" : "none"} />
      </motion.button>
      {label && (
        <motion.span 
          className={`${labelSize} text-white font-medium bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full mt-1`}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {label}
        </motion.span>
      )}
    </div>
  );
};

export default ReelActionButton;
