
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
