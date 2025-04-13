
import React, { useState } from "react";

interface ReelCaptionProps {
  caption?: string | null;
}

const ReelCaption = ({ caption }: ReelCaptionProps) => {
  const [expanded, setExpanded] = useState(false);
  
  if (!caption) return null;
  
  const shouldTruncate = caption.length > 100;
  const displayText = shouldTruncate && !expanded 
    ? caption.substring(0, 100) + "..." 
    : caption;
  
  return (
    <div className="space-y-1">
      <p className="text-sm text-white/95 font-medium leading-relaxed">
        {displayText}
        {shouldTruncate && (
          <button 
            onClick={() => setExpanded(!expanded)}
            className="text-white/70 hover:text-white ml-1 text-xs font-semibold"
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}
      </p>
    </div>
  );
};

export default ReelCaption;
