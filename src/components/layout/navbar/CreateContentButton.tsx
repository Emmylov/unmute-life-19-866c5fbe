
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Video, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsDesktop } from "@/hooks/use-responsive";

const CreateContentButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isDesktop = useIsDesktop();
  
  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        className={`relative text-unmute-purple hover:text-unmute-purple/80 transition-colors h-7 w-7 ${location.pathname === '/create' ? 'bg-unmute-purple/10' : ''}`}
        onClick={() => navigate('/create')}
      >
        <PlusCircle className="h-3.5 w-3.5" />
        <span className="sr-only">Create</span>
      </Button>
      
      <Button 
        className={`hidden sm:flex items-center gap-1 unmute-primary-button px-2 py-0.5 h-7 text-xs`}
        onClick={() => navigate('/create')}
      >
        <Video className="h-3 w-3" />
        {isDesktop ? "Create" : ""}
      </Button>
    </>
  );
};

export default CreateContentButton;
