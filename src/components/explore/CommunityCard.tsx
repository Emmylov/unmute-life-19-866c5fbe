
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface CommunityCardProps {
  community: {
    id: string;
    name: string;
    members: number;
    description: string;
    coverImage: string;
  };
}

const CommunityCard = ({ community }: CommunityCardProps) => {
  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <Link to={`/communities/${community.id}`} className="block">
          <div className="relative h-24">
            <img
              src={community.coverImage}
              alt={community.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
          </div>
        </Link>
        <CardContent className="p-4">
          <Link to={`/communities/${community.id}`} className="block">
            <h3 className="font-semibold hover:text-unmute-purple transition-colors">{community.name}</h3>
          </Link>
          <p className="text-xs text-gray-500 mt-1">
            {community.members.toLocaleString()} members
          </p>
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-3 text-unmute-purple border-unmute-purple/30 hover:bg-unmute-purple/10"
          >
            Join
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CommunityCard;
