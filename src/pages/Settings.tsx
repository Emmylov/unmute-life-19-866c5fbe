
import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Bell, ShieldAlert, UserCircle, KeyRound, Bug, Globe, Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getInitials } from "@/lib/utils";

const Settings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    username: "",
    full_name: "",
    bio: "",
    email: user?.email || ""
  });
  
  const [notifications, setNotifications] = useState({
    mentions: true,
    comments: true,
    followers: true,
    messages: true,
    updates: false,
    newsletter: false
  });
  
  const [privacy, setPrivacy] = useState({
    privateAccount: false,
    showActivity: true,
    allowTagging: true,
    allowComments: true
  });
  
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };
  
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    try {
      setLoading(true);
      const file = e.target.files[0];
      toast.success("Avatar uploaded successfully");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Failed to upload avatar");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <AppLayout pageTitle="Settings">
      <div className="container max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-64 flex-shrink-0">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Manage your account settings</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs defaultValue="account" orientation="vertical" className="w-full">
                  <TabsList className="flex flex-col h-auto items-stretch bg-transparent border-r p-0 space-y-1">
                    <TabsTrigger 
                      value="account" 
                      className="justify-start data-[state=active]:text-primary data-[state=active]:bg-primary/5 px-3 py-2"
                    >
                      <UserCircle className="h-4 w-4 mr-2" />
                      Account
                    </TabsTrigger>
                    <TabsTrigger 
                      value="notifications" 
                      className="justify-start data-[state=active]:text-primary data-[state=active]:bg-primary/5 px-3 py-2"
                    >
                      <Bell className="h-4 w-4 mr-2" />
                      Notifications
                    </TabsTrigger>
                    <TabsTrigger 
                      value="privacy" 
                      className="justify-start data-[state=active]:text-primary data-[state=active]:bg-primary/5 px-3 py-2"
                    >
                      <ShieldAlert className="h-4 w-4 mr-2" />
                      Privacy
                    </TabsTrigger>
                    <TabsTrigger 
                      value="security" 
                      className="justify-start data-[state=active]:text-primary data-[state=active]:bg-primary/5 px-3 py-2"
                    >
                      <KeyRound className="h-4 w-4 mr-2" />
                      Security
                    </TabsTrigger>
                    <TabsTrigger 
                      value="support" 
                      className="justify-start data-[state=active]:text-primary data-[state=active]:bg-primary/5 px-3 py-2"
                    >
                      <Bug className="h-4 w-4 mr-2" />
                      Help & Support
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex-1">
            <Tabs defaultValue="account" className="w-full">
              <TabsContent value="account" className="space-y-6 mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>
                      Update your profile information and how others see you
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProfileUpdate}>
                      <div className="mb-6 flex flex-col items-center sm:flex-row sm:items-start gap-6">
                        <Avatar className="w-24 h-24 border-4 border-white shadow relative">
                          <AvatarImage src={user?.user_metadata?.avatar_url} />
                          <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                            {getInitials(user?.user_metadata?.full_name || user?.email || "")}
                          </AvatarFallback>
                          
                          <label 
                            htmlFor="avatar-upload"
                            className="absolute -bottom-1 -right-1 bg-primary text-white p-1.5 rounded-full cursor-pointer shadow hover:bg-primary/90 transition-colors"
                          >
                            <Camera className="h-4 w-4" />
                            <span className="sr-only">Upload avatar</span>
                          </label>
                          <input 
                            id="avatar-upload" 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleAvatarChange}
                          />
                        </Avatar>
                        
                        <div className="space-y-4 flex-1">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="username">Username</Label>
                              <Input 
                                id="username"
                                placeholder="your_username"
                                value={profile.username}
                                onChange={e => setProfile({...profile, username: e.target.value})}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="full_name">Full Name</Label>
                              <Input 
                                id="full_name"
                                placeholder="Your Name"
                                value={profile.full_name}
                                onChange={e => setProfile({...profile, full_name: e.target.value})}
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input 
                              id="email"
                              type="email"
                              placeholder="your.email@example.com"
                              value={profile.email}
                              onChange={e => setProfile({...profile, email: e.target.value})}
                              disabled
                            />
                            <p className="text-xs text-muted-foreground">
                              To change your email address, please contact support.
                            </p>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Input 
                              id="bio"
                              placeholder="Tell us a little about yourself"
                              value={profile.bio}
                              onChange={e => setProfile({...profile, bio: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button type="submit" disabled={loading}>
                          {loading ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Account Preferences</CardTitle>
                    <CardDescription>
                      Manage your account settings and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-sm">Language</h4>
                          <p className="text-sm text-muted-foreground">Select your preferred language</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          <span className="text-sm">English (US)</span>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-sm">Auto-play Videos</h4>
                          <p className="text-sm text-muted-foreground">Videos will play automatically</p>
                        </div>
                        <Switch id="autoplay" defaultChecked />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-sm">Dark Mode</h4>
                          <p className="text-sm text-muted-foreground">Toggle dark mode on or off</p>
                        </div>
                        <Switch id="darkmode" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="notifications" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>
                      Manage how and when you receive notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">New Mentions</h4>
                          <p className="text-sm text-muted-foreground">When someone mentions you</p>
                        </div>
                        <Switch 
                          checked={notifications.mentions}
                          onCheckedChange={(checked) => 
                            setNotifications({...notifications, mentions: checked})
                          }
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Comments</h4>
                          <p className="text-sm text-muted-foreground">When someone comments on your content</p>
                        </div>
                        <Switch 
                          checked={notifications.comments}
                          onCheckedChange={(checked) => 
                            setNotifications({...notifications, comments: checked})
                          }
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">New Followers</h4>
                          <p className="text-sm text-muted-foreground">When someone follows you</p>
                        </div>
                        <Switch 
                          checked={notifications.followers}
                          onCheckedChange={(checked) => 
                            setNotifications({...notifications, followers: checked})
                          }
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Direct Messages</h4>
                          <p className="text-sm text-muted-foreground">When someone sends you a message</p>
                        </div>
                        <Switch 
                          checked={notifications.messages}
                          onCheckedChange={(checked) => 
                            setNotifications({...notifications, messages: checked})
                          }
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">App Updates</h4>
                          <p className="text-sm text-muted-foreground">About new features and updates</p>
                        </div>
                        <Switch 
                          checked={notifications.updates}
                          onCheckedChange={(checked) => 
                            setNotifications({...notifications, updates: checked})
                          }
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Newsletter</h4>
                          <p className="text-sm text-muted-foreground">Receive our weekly newsletter</p>
                        </div>
                        <Switch 
                          checked={notifications.newsletter}
                          onCheckedChange={(checked) => 
                            setNotifications({...notifications, newsletter: checked})
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="privacy" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Privacy Settings</CardTitle>
                    <CardDescription>
                      Control who can see your content and how your data is used
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Private Account</h4>
                          <p className="text-sm text-muted-foreground">Only approved followers can see your content</p>
                        </div>
                        <Switch 
                          checked={privacy.privateAccount}
                          onCheckedChange={(checked) => 
                            setPrivacy({...privacy, privateAccount: checked})
                          }
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Activity Status</h4>
                          <p className="text-sm text-muted-foreground">Let others see when you're active</p>
                        </div>
                        <Switch 
                          checked={privacy.showActivity}
                          onCheckedChange={(checked) => 
                            setPrivacy({...privacy, showActivity: checked})
                          }
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Allow Tagging</h4>
                          <p className="text-sm text-muted-foreground">Let others tag you in their content</p>
                        </div>
                        <Switch 
                          checked={privacy.allowTagging}
                          onCheckedChange={(checked) => 
                            setPrivacy({...privacy, allowTagging: checked})
                          }
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Allow Comments</h4>
                          <p className="text-sm text-muted-foreground">Let others comment on your content</p>
                        </div>
                        <Switch 
                          checked={privacy.allowComments}
                          onCheckedChange={(checked) => 
                            setPrivacy({...privacy, allowComments: checked})
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="security" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>
                      Manage your account security settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button variant="outline" className="w-full justify-start">
                        <KeyRound className="h-4 w-4 mr-2" />
                        Change Password
                      </Button>
                      
                      <Button variant="outline" className="w-full justify-start">
                        <Mail className="h-4 w-4 mr-2" />
                        Enable Two-Factor Authentication
                      </Button>
                      
                      <Button variant="outline" className="w-full justify-start" variant="destructive">
                        Deactivate Account
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="support" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Help & Support</CardTitle>
                    <CardDescription>
                      Get help with your account or report issues
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button variant="outline" className="w-full justify-start">
                        View Help Center
                      </Button>
                      
                      <Button variant="outline" className="w-full justify-start">
                        Report a Problem
                      </Button>
                      
                      <Button variant="outline" className="w-full justify-start">
                        Contact Support
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Settings;
