
import React from "react";

interface ColorSelectorProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

const themeColors = [
  { name: "Purple", value: "bg-unmute-purple" },
  { name: "Pink", value: "bg-unmute-pink" },
  { name: "Coral", value: "bg-unmute-coral" },
  { name: "Teal", value: "bg-unmute-teal" },
  { name: "Blue", value: "bg-blue-500" },
  { name: "Green", value: "bg-green-500" },
];

const ColorSelector: React.FC<ColorSelectorProps> = ({
  selectedColor,
  onColorSelect,
}) => {
  return (
    <div className="flex flex-wrap gap-4 sm:gap-3 justify-center sm:justify-start">
      {themeColors.map((color) => (
        <button
          key={color.value}
          className={`w-12 h-12 sm:w-10 sm:h-10 rounded-full ${color.value} transition-all ${
            selectedColor === color.value
              ? "ring-2 ring-offset-2 ring-unmute-purple"
              : ""
          }`}
          onClick={() => onColorSelect(color.value)}
          aria-label={`Select ${color.name} theme`}
        />
      ))}
    </div>
  );
};

export default ColorSelector;
