
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const ReelsSkeleton = () => {
  return (
    <div className="relative w-full h-full bg-black/30">
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ 
            opacity: [0.5, 1, 0.5],
            scale: [0.98, 1, 0.98],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="w-full h-full"
        >
          <Skeleton className="w-full h-full bg-gradient-to-br from-gray-900/50 via-purple-900/30 to-gray-900/50" />
        </motion.div>
      </div>

      {/* Skeleton UI for controls */}
      <div className="absolute top-4 left-4 flex items-center space-x-2">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="space-y-1">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-2 w-16" />
        </div>
      </div>

      <div className="absolute bottom-4 left-4">
        <div className="space-y-2">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>

      <div className="absolute bottom-20 right-4 flex flex-col space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="w-12 h-12 rounded-full" />
        ))}
      </div>

      {/* Loading spinner in center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="w-16 h-16 rounded-full border-4 border-t-purple-600 border-r-purple-300 border-b-pink-500 border-l-transparent"
        />
      </div>
    </div>
  );
};

export default ReelsSkeleton;
