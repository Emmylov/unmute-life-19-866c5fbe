
import React, { useState } from "react";
import { Link } from "react-router-dom";

interface ReelCaptionProps {
  caption?: string | null;
}

const ReelCaption = ({ caption }: ReelCaptionProps) => {
  const [showFullCaption, setShowFullCaption] = useState(false);
  
  if (!caption) return null;
  
  const hashtags = caption.match(/#[\w]+/g) || [];
  
  const renderCaptionWithHashtags = () => {
    if (!caption) return null;
    
    const parts = caption.split(/(#\w+)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('#')) {
        return (
          <Link 
            key={index}
            to={`/explore?tag=${part.substring(1)}`}
            className="text-blue-400 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {part}
          </Link>
        );
      } else {
        return <span key={index}>{part}</span>;
      }
    });
  };

  return (
    <>
      <div className="mb-3">
        <p className="text-white text-sm">
          {showFullCaption ? (
            renderCaptionWithHashtags()
          ) : caption.length > 100 ? (
            <>
              <span>{caption.substring(0, 100)}</span>...
            </>
          ) : (
            renderCaptionWithHashtags()
          )}
          
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
              onClick={(e) => e.stopPropagation()}
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
