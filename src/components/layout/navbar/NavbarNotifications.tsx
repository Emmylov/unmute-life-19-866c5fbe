
import React from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

const NavbarNotifications = () => {
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="relative text-gray-500 h-7 w-7"
    >
      <Bell className="h-3.5 w-3.5" />
      <span className="absolute top-0 right-0 h-1.5 w-1.5 rounded-full bg-unmute-pink"></span>
    </Button>
  );
};

export default NavbarNotifications;
