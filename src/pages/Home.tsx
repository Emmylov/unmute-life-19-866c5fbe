
import React, { useState } from 'react';
import AppLayout from "@/components/layout/AppLayout";
import HomeHeader from "@/components/home/HomeHeader";
import MoodSelector from "@/components/home/MoodSelector";
import PostCard from "@/components/home/PostCard";
import HomeRightSidebar from "@/components/home/HomeRightSidebar";
import HomeGreeting from "@/components/home/HomeGreeting";
import DailyRewardButton from "@/components/home/DailyRewardButton";
import DailyRewardModal from "@/components/rewards/DailyRewardModal";

const Home = () => {
  const [showRewardModal, setShowRewardModal] = useState(false);
  const posts = [
    {
      id: 1,
      author: "Sarah",
      username: "sarah_smiles",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
      date: "2 hours ago",
      content: "Just had a great meditation session! Feeling so refreshed and ready to tackle the day. 🧘‍♀️ #mindfulness #meditation",
      likes: 32,
      comments: 8,
      mood: "Calm",
      created_at: new Date().toISOString(),
      profiles: {
        username: "sarah_smiles",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
        full_name: "Sarah"
      }
    },
    {
      id: 2,
      author: "Tom",
      username: "tom_the_thinker",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
      date: "5 hours ago",
      content: "Finished a challenging workout! 💪 Endorphins are pumping and feeling amazing. Remember to push your limits! #fitness #motivation",
      likes: 54,
      comments: 12,
      mood: "Energetic",
      created_at: new Date().toISOString(),
      profiles: {
        username: "tom_the_thinker",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
        full_name: "Tom"
      }
    },
    {
      id: 3,
      author: "Emily",
      username: "emily_reads",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHVzZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
      date: "1 day ago",
      content: "Spent the afternoon reading in the park. 📚 Nothing beats a good book and fresh air. What are you reading today? #reading #books",
      likes: 41,
      comments: 6,
      mood: "Relaxed",
      created_at: new Date().toISOString(),
      profiles: {
        username: "emily_reads",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHVzZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
        full_name: "Emily"
      }
    }
  ];

  const handleMoodSelect = (mood: string) => {
    console.log(`Selected mood: ${mood}`);
  };

  // Mock profile data for HomeRightSidebar
  const profileData = {
    username: "user",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
    name: "User",
  };

  return (
    <AppLayout pageTitle="Home">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 px-3 sm:px-4">
        <div className="lg:col-span-8 space-y-4">
          <div className="flex justify-between items-center">
            <HomeGreeting />
            <DailyRewardButton onClick={() => setShowRewardModal(true)} />
          </div>
          
          <HomeHeader />
          <MoodSelector onSelect={handleMoodSelect} />
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
        
        <HomeRightSidebar profile={profileData} />
      </div>
      
      <DailyRewardModal open={showRewardModal} onOpenChange={setShowRewardModal} />
    </AppLayout>
  );
};

export default Home;
