
import React, { useState } from "react";
import { Link } from "react-router-dom";

interface ReelCaptionProps {
  caption?: string;
}

const ReelCaption = ({ caption }: ReelCaptionProps) => {
  const [showFullCaption, setShowFullCaption] = useState(false);
  
  if (!caption) return null;
  
  const hashtags = caption.match(/#[\w]+/g) || [];

  return (
    <>
      <div className="mb-3">
        <p className="text-white text-sm">
          {showFullCaption ? caption : caption.length > 100 ? `${caption.substring(0, 100)}...` : caption}
          {caption.length > 100 && (
            <button 
              className="text-white/80 ml-1 font-medium"
              onClick={() => setShowFullCaption(!showFullCaption)}
            >
              {showFullCaption ? "See less" : "See more"}
            </button>
          )}
        </p>
      </div>
      
      {hashtags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {hashtags.map((tag, index) => (
            <Link 
              key={index} 
              to={`/explore?tag=${tag.substring(1)}`}
              className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs text-white hover:bg-white/30 transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default ReelCaption;
