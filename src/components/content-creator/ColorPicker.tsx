
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => {
  const commonColors = [
    "#FFFFFF", // White
    "#FFD700", // Gold
    "#FF69B4", // Hot Pink
    "#FF0000", // Red
    "#FFA500", // Orange
    "#FFFF00", // Yellow
    "#00FF00", // Lime
    "#00FFFF", // Cyan
    "#0000FF", // Blue
    "#800080", // Purple
  ];
  
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="relative w-full">
          <div 
            className="absolute left-2 top-2.5 w-6 h-6 rounded-full"
            style={{ backgroundColor: color }}
          />
          <Input
            type="text"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Input
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-10 p-1 cursor-pointer"
        />
      </div>
      
      <div className="grid grid-cols-5 gap-2">
        {commonColors.map((presetColor) => (
          <button
            key={presetColor}
            className="w-8 h-8 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            style={{ backgroundColor: presetColor }}
            onClick={() => onChange(presetColor)}
            title={presetColor}
            aria-label={`Select color ${presetColor}`}
          />
        ))}
      </div>
    </div>
  );
};
