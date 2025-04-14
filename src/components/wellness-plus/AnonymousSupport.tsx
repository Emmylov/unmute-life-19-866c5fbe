
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import AnonymousPostCard from './anonymous-support/AnonymousPostCard';
import ShareForm from './anonymous-support/ShareForm';
import { AnonymousPost } from './anonymous-support/types';

const samplePosts: AnonymousPost[] = [
  {
    id: '1',
    message: "I feel like I'm constantly disappointing my parents no matter what I do. I got into a good college and have good grades but they never seem satisfied. I don't know how to make them proud anymore.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    supportCount: 12,
    tag: 'Family',
    responses: [
      {
        id: '1-1',
        message: "It sounds like you're putting a lot of pressure on yourself. Remember that your worth isn't determined by your parents' approval. Have you tried having an honest conversation with them about how their expectations make you feel?",
        isStaff: true,
        date: new Date(Date.now() - 1000 * 60 * 60 * 1) // 1 hour ago
      }
    ]
  },
  {
    id: '2',
    message: "Does anyone else feel completely overwhelmed by social media? I feel like I'm constantly comparing myself to others and it's affecting my mental health. I want to quit but also feel like I'll be completely disconnected from everyone.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    supportCount: 28,
    tag: 'Mental Health',
    responses: [
      {
        id: '2-1',
        message: "I felt the same way last year and decided to take a 30-day break. It was hard at first but SO worth it. I realized most of my friends were happy to text or call, and I didn't miss as much as I thought I would.",
        isStaff: false,
        date: new Date(Date.now() - 1000 * 60 * 60 * 7) // 7 hours ago
      },
      {
        id: '2-2',
        message: "Social media comparison is very real and you're not alone in feeling this way. Consider setting time limits, curating your feed more carefully, or taking short breaks. Remember that most people only share their highlights, not their struggles.",
        isStaff: true,
        date: new Date(Date.now() - 1000 * 60 * 60 * 6) // 6 hours ago
      }
    ]
  }
];

const AnonymousSupport = () => {
  const [activeTab, setActiveTab] = useState("read");
  const [posts, setPosts] = useState<AnonymousPost[]>(samplePosts);
  const { toast } = useToast();

  const handleSubmit = (message: string) => {
    const newPost: AnonymousPost = {
      id: Date.now().toString(),
      message,
      date: new Date(),
      supportCount: 0,
      tag: 'General',
      responses: []
    };
    
    setPosts([newPost, ...posts]);
    setActiveTab("read");
    
    toast({
      title: "Message shared anonymously",
      description: "Thank you for sharing. Someone will respond soon.",
    });
  };

  const handleAddSupport = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, supportCount: post.supportCount + 1 };
      }
      return post;
    }));
  };

  const handleAddResponse = (postId: string, message: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newResponse = {
          id: `${postId}-${post.responses.length + 1}`,
          message,
          isStaff: false,
          date: new Date()
        };
        return { ...post, responses: [...post.responses, newResponse] };
      }
      return post;
    }));
    
    toast({
      title: "Response sent",
      description: "Thank you for your supportive message.",
    });
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Let It Out</CardTitle>
          <CardDescription>
            Share your feelings anonymously and get support from the community and wellness experts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="w-full">
              <TabsTrigger value="read" className="flex-1">Read Messages</TabsTrigger>
              <TabsTrigger value="share" className="flex-1">Share Anonymously</TabsTrigger>
            </TabsList>
            
            <TabsContent value="read" className="space-y-6">
              {posts.map(post => (
                <AnonymousPostCard 
                  key={post.id} 
                  post={post} 
                  onAddSupport={handleAddSupport}
                  onAddResponse={handleAddResponse}
                />
              ))}
            </TabsContent>
            
            <TabsContent value="share">
              <ShareForm onSubmit={handleSubmit} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnonymousSupport;
