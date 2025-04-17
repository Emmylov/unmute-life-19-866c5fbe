
// Create placeholder components for the missing imports in Home.tsx

import React from 'react';

export const PostFeed = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="text-center py-10 text-gray-500">
        Posts will appear here
      </div>
    </div>
  );
};

export const StoriesBar = () => {
  return (
    <div className="flex overflow-x-auto gap-2 py-2">
      <div className="w-16 h-16 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center">
        <span className="text-xs">Story</span>
      </div>
      <div className="w-16 h-16 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center">
        <span className="text-xs">Story</span>
      </div>
      <div className="w-16 h-16 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center">
        <span className="text-xs">Story</span>
      </div>
    </div>
  );
};

export const SuggestedUsers = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-medium mb-3">Suggested Users</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200"></div>
            <span className="text-sm">User Name</span>
          </div>
          <button className="text-xs text-primary">Follow</button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200"></div>
            <span className="text-sm">User Name</span>
          </div>
          <button className="text-xs text-primary">Follow</button>
        </div>
      </div>
    </div>
  );
};
