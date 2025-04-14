
import React from "react";

interface GoodieCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const GoodieCard = ({ icon, title, description }: GoodieCardProps) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center shadow-md transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px] border border-white/60">
      <div className="flex justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-bold mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};

export default GoodieCard;
