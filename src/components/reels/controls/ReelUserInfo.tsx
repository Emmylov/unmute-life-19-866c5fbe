
import React from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/utils";
import { Tables } from "@/integrations/supabase/types";

interface ReelUserInfoProps {
  user: Tables<"profiles">;
}

const ReelUserInfo = ({ user }: ReelUserInfoProps) => {
  return (
    <div className="flex justify-between items-center pointer-events-auto z-10">
      <Link to={`/profile/${user?.username || user?.id}`} className="flex items-center space-x-2">
        <Avatar className="h-10 w-10 border-2 border-white">
          <AvatarImage src={user?.avatar || ""} alt={user?.username || "User"} />
          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
            {getInitials(user?.full_name || user?.username || "U")}
          </AvatarFallback>
        </Avatar>
        <div>
          <h4 className="text-white font-medium text-sm">
            {user?.full_name || user?.username || "User"}
          </h4>
          <p className="text-white/80 text-xs">@{user?.username || "username"}</p>
        </div>
      </Link>
      
      <Button size="sm" variant="secondary" className="rounded-full text-xs h-8 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white">
        Follow
      </Button>
    </div>
  );
};

export default ReelUserInfo;
