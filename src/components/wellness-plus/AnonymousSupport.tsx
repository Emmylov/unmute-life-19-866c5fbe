
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Heart, MessageCircle, Mic, MicOff, Send, User, ThumbsUp } from 'lucide-react';

interface AnonymousPost {
  id: string;
  message: string;
  date: Date;
  supportCount: number;
  responses: AnonymousResponse[];
  tag: string;
}

interface AnonymousResponse {
  id: string;
  message: string;
  isStaff: boolean;
  date: Date;
}

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
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [posts, setPosts] = useState<AnonymousPost[]>(samplePosts);
  const [showResponseInput, setShowResponseInput] = useState<string | null>(null);
  const [responseText, setResponseText] = useState("");
  const { toast } = useToast();

  const handleSubmit = () => {
    if (message.trim().length === 0) return;
    
    const newPost: AnonymousPost = {
      id: Date.now().toString(),
      message,
      date: new Date(),
      supportCount: 0,
      tag: 'General',
      responses: []
    };
    
    setPosts([newPost, ...posts]);
    setMessage("");
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

  const handleRespond = (postId: string) => {
    if (responseText.trim().length === 0) return;
    
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newResponse: AnonymousResponse = {
          id: `${postId}-${post.responses.length + 1}`,
          message: responseText,
          isStaff: false,
          date: new Date()
        };
        return { ...post, responses: [...post.responses, newResponse] };
      }
      return post;
    }));
    
    setResponseText("");
    setShowResponseInput(null);
    
    toast({
      title: "Response sent",
      description: "Thank you for your supportive message.",
    });
  };

  const formatDate = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
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
                <Card key={post.id} className="border-2 border-[#D6BCFA]/30">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <div className="bg-gray-200 rounded-full h-10 w-10 flex items-center justify-center mr-3">
                          <User className="h-6 w-6 text-gray-500" />
                        </div>
                        <div>
                          <div className="font-medium">Anonymous</div>
                          <div className="text-xs text-muted-foreground">{formatDate(post.date)}</div>
                        </div>
                      </div>
                      <Badge variant="outline">{post.tag}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{post.message}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <div className="flex gap-4">
                      <Button 
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground"
                        onClick={() => handleAddSupport(post.id)}
                      >
                        <Heart className="h-4 w-4 mr-1" />
                        <span>{post.supportCount}</span>
                      </Button>
                      <Button 
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground"
                        onClick={() => setShowResponseInput(showResponseInput === post.id ? null : post.id)}
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        <span>{post.responses.length}</span>
                      </Button>
                    </div>
                  </CardFooter>
                  
                  {/* Responses section */}
                  {(post.responses.length > 0 || showResponseInput === post.id) && (
                    <div className="px-6 pb-4">
                      {post.responses.map(response => (
                        <div key={response.id} className="mt-3 border-l-2 border-[#D6BCFA]/50 pl-4">
                          <div className="flex items-center">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-2 ${
                              response.isStaff ? "bg-[#E5DEFF]" : "bg-gray-100" 
                            }`}>
                              <User className={`h-4 w-4 ${
                                response.isStaff ? "text-[#9b87f5]" : "text-gray-500"
                              }`} />
                            </div>
                            <div>
                              <div className="flex items-center">
                                <div className="font-medium text-sm">
                                  {response.isStaff ? "Wellness Expert" : "Anonymous"}
                                </div>
                                {response.isStaff && (
                                  <Badge variant="outline" className="ml-2 py-0 h-5">Staff</Badge>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground">{formatDate(response.date)}</div>
                            </div>
                          </div>
                          <div className="mt-1 ml-10">
                            <p className="text-sm">{response.message}</p>
                          </div>
                        </div>
                      ))}
                      
                      {showResponseInput === post.id && (
                        <div className="mt-4 flex gap-2">
                          <Textarea 
                            value={responseText}
                            onChange={(e) => setResponseText(e.target.value)}
                            placeholder="Write a supportive response..."
                            className="min-h-[80px]"
                          />
                          <Button 
                            onClick={() => handleRespond(post.id)}
                            className="bg-[#9b87f5] hover:bg-[#7E69AB] self-end"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="share">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">How are you feeling?</h3>
                  <Textarea 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share your thoughts, feelings, or concerns anonymously..."
                    className="min-h-[150px]"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Badge variant="outline" className="mr-3">Anonymous</Badge>
                    <div className="text-xs text-muted-foreground">
                      Your identity is completely private
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsRecording(!isRecording)}
                    className={isRecording ? "text-red-500" : ""}
                  >
                    {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </Button>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <h3 className="text-sm font-medium mb-2 flex items-center">
                    <ThumbsUp className="h-4 w-4 mr-2 text-[#9b87f5]" />
                    Guidelines for sharing
                  </h3>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Be honest about your feelings, this is a safe space</li>
                    <li>• Don't include names or specific identifying details</li>
                    <li>• If you're in immediate danger, please contact emergency services</li>
                    <li>• Support others with kindness and empathy</li>
                  </ul>
                </div>
                
                <Button 
                  onClick={handleSubmit}
                  className="w-full bg-[#9b87f5] hover:bg-[#7E69AB]"
                  disabled={message.trim().length === 0}
                >
                  Share Anonymously
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnonymousSupport;
