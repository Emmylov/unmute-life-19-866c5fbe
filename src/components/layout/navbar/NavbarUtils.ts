
import { Home, Compass, Users, PlayCircle, MessageSquare, Bell, User, Heart, Bookmark, Settings, HelpCircle, Music, Gamepad2 } from 'lucide-react';

// Define navigation items
export const navigationItems = [
  { name: 'Home', href: '/home', icon: Home },
  { name: 'Explore', href: '/explore', icon: Compass },
  { name: 'Communities', href: '/communities', icon: Users },
  { name: 'Reels', href: '/reels', icon: PlayCircle },
  { name: 'Chat', href: '/chat', icon: MessageSquare },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Wellness', href: '/wellness', icon: Heart },
  { name: 'Saved', href: '/saved', icon: Bookmark },
  { name: 'Music', href: '/music', icon: Music },
  { name: 'Games', href: '/games', icon: Gamepad2 },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Help', href: '/help', icon: HelpCircle }
];

// Mark elements for tutorial
export const addTutorialAttributes = () => {
  // Add data-tutorial attributes to various elements for the tutorial system
  const elements = [
    { selector: '.home-feed', attribute: 'home-feed' },
    { selector: '.sidebar', attribute: 'sidebar' },
    { selector: '.create-post', attribute: 'create-post' },
    { selector: '.trending-section', attribute: 'trending' },
    { selector: '.daily-check-in', attribute: 'daily-check' },
  ];
  
  elements.forEach(({ selector, attribute }) => {
    const element = document.querySelector(selector);
    if (element) {
      element.setAttribute('data-tutorial', attribute);
    }
  });
};

// Generate user initials from name
export const getInitials = (name?: string): string => {
  if (!name || typeof name !== "string") return "U";
  
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

// Generate a background color based on user ID
export const getAvatarFallbackColor = (userId?: string): string => {
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
};
