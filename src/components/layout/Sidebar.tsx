
import React from "react";
import { NavLink } from "react-router-dom";
import { 
  Home, 
  Search, 
  Compass, 
  Video, 
  Users, 
  Bell,
  Bookmark,
  Settings,
  HelpCircle,
  User
} from "lucide-react";

const Sidebar = () => {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <h2 className="text-lg font-semibold">Menu</h2>
        
        <nav className="mt-6 flex flex-col space-y-1">
          <SidebarLink to="/home" icon={<Home className="h-5 w-5" />} label="Home" />
          <SidebarLink to="/explore" icon={<Compass className="h-5 w-5" />} label="Explore" />
          <SidebarLink to="/reels" icon={<Video className="h-5 w-5" />} label="Reels" />
          <SidebarLink to="/communities" icon={<Users className="h-5 w-5" />} label="Communities" />
          <SidebarLink to="/notifications" icon={<Bell className="h-5 w-5" />} label="Notifications" />
          <SidebarLink to="/saved" icon={<Bookmark className="h-5 w-5" />} label="Saved" />
        </nav>
        
        <h2 className="text-lg font-semibold mt-8">Account</h2>
        
        <nav className="mt-6 flex flex-col space-y-1">
          <SidebarLink to="/profile" icon={<User className="h-5 w-5" />} label="Profile" />
          <SidebarLink to="/settings" icon={<Settings className="h-5 w-5" />} label="Settings" />
          <SidebarLink to="/help" icon={<HelpCircle className="h-5 w-5" />} label="Help" />
        </nav>
      </div>
    </aside>
  );
};

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const SidebarLink = ({ to, icon, label }: SidebarLinkProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `
        flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors
        ${
          isActive
            ? "bg-gradient-to-r from-unmute-purple-light/20 to-unmute-purple/10 text-unmute-purple"
            : "text-gray-600 hover:bg-gray-100"
        }
      `}
    >
      <span className="mr-3">{icon}</span>
      {label}
    </NavLink>
  );
};

export default Sidebar;
