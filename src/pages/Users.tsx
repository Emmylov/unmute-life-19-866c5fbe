import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Users, UserPlus, Sparkles } from "lucide-react";
import { useSocialActions } from "@/hooks/use-social-actions";
import AppLayout from "@/components/layout/AppLayout";
import UserCard from "@/components/users/UserCard";
import UserGrid from "@/components/users/UserGrid";
import SEO from "@/components/shared/SEO";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const UsersPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [featuredUsers, setFeaturedUsers] = useState<any[]>([]);
  const [trendingUsers, setTrendingUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const { checkFollowStatus } = useSocialActions();
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        // Fetch all users
        const { data: allUsers, error } = await supabase
          .from("profiles")
          .select("*")
          .order("followers", { ascending: false });
          
        if (error) throw error;
        
        // Initialize users with follow status
        if (allUsers) {
          // Filter out current user
          const othersUsers = allUsers.filter(u => u.id !== user?.id);
          
          // Set basic follow status for all users
          setUsers(othersUsers);
          
          // Update follow status for each user
          if (user) {
            for (const profile of othersUsers) {
              const isFollowing = await checkFollowStatus(profile.id);
              setUsers(current => 
                current.map(u => 
                  u.id === profile.id ? { ...u, isFollowing } : u
                )
              );
            }
          }
          
          // Set featured users (those with most followers)
          setFeaturedUsers(othersUsers.slice(0, 5));
          
          // Set trending users (recently active)
          setTrendingUsers([...othersUsers]
            .sort(() => 0.5 - Math.random())
            .slice(0, 5));
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [user, checkFollowStatus]);
  
  // Filter users based on search query
  const filteredUsers = users.filter(user => {
    const fullName = user.full_name?.toLowerCase() || "";
    const username = user.username?.toLowerCase() || "";
    const query = searchQuery.toLowerCase();
    
    return fullName.includes(query) || username.includes(query);
  });
  
  return (
    <AppLayout>
      <SEO
        title="Unmute | Discover Users"
        description="Discover and connect with other users on Unmute"
        canonicalUrl="https://unmutelife.online/users"
      />
      
      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="space-y-6"
      >
        <motion.div variants={item} className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-unmute-purple/10 via-unmute-pink/5 to-unmute-teal/10 rounded-2xl pointer-events-none" />
          <div className="relative p-6 md:p-8 rounded-2xl overflow-hidden backdrop-blur-sm">
            <motion.h1 
              className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-unmute-purple to-unmute-pink bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Discover Amazing People
            </motion.h1>
            <motion.p 
              className="text-gray-600 mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Connect with creators, build your community, and unmute your voice together
            </motion.p>
            
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                className="pl-10 bg-white/80 backdrop-blur-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </motion.div>
        
        <motion.div variants={item}>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-white/50 backdrop-blur-sm w-full grid grid-cols-3 mb-6">
              <TabsTrigger 
                value="all" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-unmute-purple data-[state=active]:to-unmute-pink data-[state=active]:text-white"
              >
                <Users className="h-4 w-4 mr-2" />
                All Users
              </TabsTrigger>
              <TabsTrigger 
                value="featured" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-unmute-purple data-[state=active]:to-unmute-pink data-[state=active]:text-white"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Featured
              </TabsTrigger>
              <TabsTrigger 
                value="trending" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-unmute-purple data-[state=active]:to-unmute-pink data-[state=active]:text-white"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Trending
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-6">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm animate-pulse h-32"></div>
                  ))}
                </div>
              ) : (
                <UserGrid users={filteredUsers} />
              )}
            </TabsContent>
            
            <TabsContent value="featured" className="space-y-6">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm animate-pulse h-32"></div>
                  ))}
                </div>
              ) : (
                <UserGrid users={featuredUsers} featured />
              )}
            </TabsContent>
            
            <TabsContent value="trending" className="space-y-6">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm animate-pulse h-32"></div>
                  ))}
                </div>
              ) : (
                <UserGrid users={trendingUsers} trending />
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
};

export default UsersPage;
