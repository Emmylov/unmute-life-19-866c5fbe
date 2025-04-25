
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name?: string): string {
  if (!name || typeof name !== "string") return "U";
  
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

export function getAvatarFallbackColor(userId?: string): string {
  if (!userId) return "bg-unmute-purple";
  
  // List of color classes to choose from
  const colors = [
    "bg-unmute-purple",
    "bg-unmute-pink",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-orange-500",
    "bg-red-500",
    "bg-purple-500",
    "bg-indigo-500",
    "bg-teal-500"
  ];
  
  // Use the sum of character codes as a deterministic way to pick a color
  const charSum = userId.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  
  // Return a color based on the charSum
  return colors[charSum % colors.length];
}

export function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
