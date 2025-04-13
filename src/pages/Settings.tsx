
import React, { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Lock, BellRing, Eye, Globe, ShieldCheck, User, Smartphone, CreditCard, Languages } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    bio: "",
    email: "",
    phone: ""
  });
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        
        if (user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (data && !error) {
            setProfile(data);
            setFormData({
              username: data.username || "",
              full_name: data.full_name || "",
              bio: data.bio || "",
              email: user.email || "",
              phone: data.phone || ""
            });
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user data");
      }
    };
    
    fetchUserData();
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleProfileUpdate = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const updates = {
        id: user.id,
        username: formData.username,
        full_name: formData.full_name,
        bio: formData.bio,
        phone: formData.phone,
        updated_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('profiles')
        .upsert(updates);
        
      if (error) throw error;
      
      toast.success("Profile updated successfully");
      setProfile((prev: any) => ({ ...prev, ...updates }));
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };
  
  const handleEmailUpdate = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.updateUser({ 
        email: formData.email 
      });
      
      if (error) throw error;
      
      toast.success("Verification email sent. Please check your inbox.");
    } catch (error) {
      console.error("Error updating email:", error);
      toast.error("Failed to update email");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <AppLayout pageTitle="Settings">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-gray-600">
            Manage your account settings and preferences
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-1 sticky top-16 z-10 mb-6">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <TabsTrigger value="profile" className="data-[state=active]:bg-primary/10">
                <User className="h-4 w-4 mr-2 hidden sm:inline" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="account" className="data-[state=active]:bg-primary/10">
                <Lock className="h-4 w-4 mr-2 hidden sm:inline" />
                Account
              </TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-primary/10">
                <BellRing className="h-4 w-4 mr-2 hidden sm:inline" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="privacy" className="data-[state=active]:bg-primary/10">
                <Eye className="h-4 w-4 mr-2 hidden sm:inline" />
                Privacy
              </TabsTrigger>
            </TabsList>
          </div>
          
          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your profile information visible to other users
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                  <Avatar className="w-20 h-20 border-2 border-white shadow-md">
                    <AvatarImage src={profile?.avatar_url || ''} />
                    <AvatarFallback className="bg-gradient-to-br from-primary/90 to-primary/50 text-white text-xl">
                      {profile?.username?.charAt(0)?.toUpperCase() || profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-medium">{profile?.full_name || 'Your Name'}</h3>
                    <p className="text-sm text-gray-500 mb-2">@{profile?.username || 'username'}</p>
                    <Button size="sm" variant="outline">Change Avatar</Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input 
                      id="full_name" 
                      name="full_name"
                      value={formData.full_name} 
                      onChange={handleInputChange}
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input 
                      id="username" 
                      name="username"
                      value={formData.username} 
                      onChange={handleInputChange}
                      placeholder="username" 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea 
                    id="bio" 
                    name="bio"
                    value={formData.bio || ''}
                    onChange={handleInputChange}
                    placeholder="Tell others a little about yourself..." 
                    className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                
                <Button 
                  onClick={handleProfileUpdate} 
                  className="w-full md:w-auto" 
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Manage how others can contact you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="email" 
                        name="email"
                        value={formData.email} 
                        onChange={handleInputChange}
                        placeholder="your.email@example.com" 
                      />
                      <Button onClick={handleEmailUpdate} disabled={loading} variant="outline">
                        Update
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      name="phone"
                      value={formData.phone} 
                      onChange={handleInputChange}
                      placeholder="+1 (555) 123-4567" 
                    />
                  </div>
                </div>
                
                <Button onClick={handleProfileUpdate} disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Account Tab */}
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Security</CardTitle>
                <CardDescription>
                  Manage your account security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Password</h3>
                      <p className="text-sm text-gray-500">Last changed 3 months ago</p>
                    </div>
                    <Button variant="outline">Change Password</Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Active Sessions</h3>
                      <p className="text-sm text-gray-500">Manage devices where you're currently logged in</p>
                    </div>
                    <Button variant="outline">Manage Sessions</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Danger Zone</CardTitle>
                <CardDescription>
                  Actions that can permanently affect your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-red-50 border border-red-100 rounded-md p-4">
                  <h3 className="text-red-600 font-medium mb-2">Delete Account</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Once deleted, all your data will be permanently removed and cannot be recovered.
                  </p>
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Manage how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Push Notifications</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>New Comments</Label>
                        <p className="text-sm text-gray-500">When someone comments on your post</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Likes</Label>
                        <p className="text-sm text-gray-500">When someone likes your content</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>New Followers</Label>
                        <p className="text-sm text-gray-500">When someone follows you</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Direct Messages</Label>
                        <p className="text-sm text-gray-500">When you receive a new message</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <h3 className="font-medium">Email Notifications</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Product Updates</Label>
                        <p className="text-sm text-gray-500">Get notified about new features</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Account Digests</Label>
                        <p className="text-sm text-gray-500">Weekly summary of account activity</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
                
                <Button>Save Notification Settings</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Quiet Hours</CardTitle>
                <CardDescription>
                  Set times when you don't want to receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Quiet Hours</Label>
                    <p className="text-sm text-gray-500">Pause notifications during specific hours</p>
                  </div>
                  <Switch />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>From</Label>
                    <Input type="time" defaultValue="22:00" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>To</Label>
                    <Input type="time" defaultValue="07:00" />
                  </div>
                </div>
                
                <Button>Save Quiet Hours</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>
                  Control who can see your content and interact with you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base font-medium">Private Account</Label>
                      <p className="text-sm text-gray-500">Only approved followers can see your content</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <Separator />
                  
                  <h3 className="font-medium">Who Can...</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <Label>See your content</Label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30">
                        <option>Everyone</option>
                        <option>Followers only</option>
                        <option>No one</option>
                      </select>
                    </div>
                    
                    <div className="space-y-1">
                      <Label>Comment on your posts</Label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30">
                        <option>Everyone</option>
                        <option>Followers only</option>
                        <option>No one</option>
                      </select>
                    </div>
                    
                    <div className="space-y-1">
                      <Label>Message you</Label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30">
                        <option>Everyone</option>
                        <option>Followers only</option>
                        <option>No one</option>
                      </select>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base font-medium">Hide Activity Status</Label>
                      <p className="text-sm text-gray-500">Hide when you're active on the platform</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base font-medium">Show Content in Explore</Label>
                      <p className="text-sm text-gray-500">Allow your content to appear in explore feed</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <Button>Save Privacy Settings</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Blocked Accounts</CardTitle>
                <CardDescription>
                  Manage accounts you've blocked
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <p>You haven't blocked any accounts yet</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Settings;
