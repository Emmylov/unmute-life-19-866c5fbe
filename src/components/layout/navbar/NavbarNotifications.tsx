
import React from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

const NavbarNotifications = () => {
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="relative text-gray-500 h-6 w-6"
    >
      <Bell className="h-3 w-3" />
      <span className="absolute top-0 right-0 h-1.5 w-1.5 rounded-full bg-unmute-pink"></span>
    </Button>
  );
};

export default NavbarNotifications;
