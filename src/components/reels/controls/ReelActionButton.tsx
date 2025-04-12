
import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const buttonSize = isMobile ? "w-10 h-10" : "w-12 h-12";
  const labelSize = isMobile ? "text-xs" : "text-sm";
  
  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={onClick}
        className={cn(
          `${buttonSize} rounded-full bg-black/30 backdrop-blur-md hover:bg-black/50 flex items-center justify-center transition-colors`,
          isActive ? activeColor : "text-white"
        )}
        aria-label={label}
      >
        <Icon className={iconSize} fill={isActive ? "currentColor" : "none"} />
      </button>
      {label && (
        <span className={`${labelSize} text-white/90 mt-1`}>
          {label}
        </span>
      )}
    </div>
  );
};

export default ReelActionButton;
