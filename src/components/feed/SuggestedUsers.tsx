
import React from 'react';
import { Button } from '@/components/ui/button';

const SuggestedUsers = () => {
  // Placeholder data for demonstration
  const suggestedUsers = [
    {
      id: '1',
      username: 'mindful_maria',
      fullName: 'Maria Chen',
      avatar: null,
      mutualConnections: 3
    },
    {
      id: '2',
      username: 'wellness_will',
      fullName: 'William Johnson',
      avatar: null,
      mutualConnections: 1
    },
    {
      id: '3',
      username: 'calm_carla',
      fullName: 'Carla Rodriguez',
      avatar: null,
      mutualConnections: 5
    }
  ];

  if (suggestedUsers.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-medium mb-3">Suggested Users</h3>
      <div className="space-y-3">
        {suggestedUsers.map(user => (
          <div key={user.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center text-primary text-xs font-medium">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.username} className="w-full h-full rounded-full object-cover" />
                ) : (
                  user.username[0].toUpperCase()
                )}
              </div>
              <div>
                <p className="text-sm font-medium">{user.username}</p>
                <p className="text-xs text-muted-foreground">{user.mutualConnections} mutual connection{user.mutualConnections !== 1 ? 's' : ''}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-primary text-xs">
              Follow
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedUsers;
