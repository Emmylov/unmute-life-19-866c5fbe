
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Search, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CollabContributor } from "./CollabCreator";

interface CollabContributorPickerProps {
  onAddContributor: (contributor: CollabContributor) => void;
  currentContributors: CollabContributor[];
}

const CollabContributorPicker: React.FC<CollabContributorPickerProps> = ({
  onAddContributor,
  currentContributors
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const { toast } = useToast();
  
  // Debounce search
  useEffect(() => {
    if (!searchTerm || searchTerm.length < 2) {
      setResults([]);
      return;
    }
    
    const timer = setTimeout(() => {
      searchUsers();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);
  
  const searchUsers = async () => {
    if (!searchTerm || searchTerm.length < 2) return;
    
    setIsSearching(true);
    
    try {
      // Search for users in Supabase profiles
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar, full_name')
        .or(`username.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%`)
        .limit(5);
      
      if (error) throw error;
      
      // Filter out users already added as contributors
      const filteredData = data?.filter(user => 
        !currentContributors.some(c => c.id === user.id)
      ) || [];
      
      setResults(filteredData);
    } catch (error) {
      console.error("Error searching users:", error);
      toast({
        title: "Search failed",
        description: "Could not search for users",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleAddUser = (user: any) => {
    const newContributor: CollabContributor = {
      id: user.id,
      username: user.username || "user",
      avatar: user.avatar,
      fullName: user.full_name,
      role: "Contributor"
    };
    
    onAddContributor(newContributor);
    setSearchTerm("");
    setResults([]);
  };
  
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search by username or name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
        {isSearching && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      
      {results.length > 0 ? (
        <Card className="divide-y">
          {results.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>
                    {user.username?.[0]?.toUpperCase() || user.full_name?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.full_name || user.username}</p>
                  <p className="text-sm text-gray-500">@{user.username}</p>
                </div>
              </div>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => handleAddUser(user)}
                className="hover:bg-primary/10 text-primary"
              >
                <UserPlus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          ))}
        </Card>
      ) : searchTerm.length > 1 && !isSearching ? (
        <p className="text-center text-gray-500 py-4">No matching users found</p>
      ) : null}
      
      <div className="bg-gray-50 p-4 rounded-lg mt-4">
        <p className="text-sm text-gray-600 mb-2">
          <strong>Tip:</strong> You can invite friends by username or search for creators to collaborate with.
        </p>
        <p className="text-xs text-gray-500">
          Contributors can add content while Editors can also edit and remove content.
        </p>
      </div>
    </div>
  );
};

export default CollabContributorPicker;
