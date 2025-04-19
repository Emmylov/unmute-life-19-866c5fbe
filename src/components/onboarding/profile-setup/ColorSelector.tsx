
import React from "react";
import { cn } from "@/lib/utils";

interface ColorSelectorProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
  colorOptions: string[];
}

const ColorSelector: React.FC<ColorSelectorProps> = ({
  selectedColor,
  onColorSelect,
  colorOptions,
}) => {
  const getColorClass = (color: string): string => {
    switch (color) {
      case "unmute-purple":
        return "bg-purple-500";
      case "unmute-pink":
        return "bg-pink-500";
      case "unmute-blue":
        return "bg-blue-500";
      case "unmute-green":
        return "bg-green-500";
      case "unmute-coral":
        return "bg-orange-500";
      case "unmute-teal":
        return "bg-teal-500";
      default:
        return "bg-purple-500";
    }
  };

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {colorOptions.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onColorSelect(color)}
          className={cn(
            getColorClass(color),
            "w-12 h-12 rounded-full transition-all",
            selectedColor === color
              ? "ring-4 ring-offset-2 ring-gray-300 scale-110"
              : "hover:scale-105"
          )}
          aria-label={`Select ${color} theme`}
        />
      ))}
    </div>
  );
};

export default ColorSelector;
