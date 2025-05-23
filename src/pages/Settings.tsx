import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { updateUserProfile, updateUserSettings, getUserSettings } from "@/services/settings-service";
import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const Settings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    username: "",
    full_name: "",
    bio: "",
    email: "",
    avatar: "",
    website: "",
    location: "",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    mentionAlerts: true,
    commentAlerts: true,
    followAlerts: true,
  });

  const [privacySettings, setPrivacySettings] = useState({
    privateAccount: false,
    hideActivityStatus: false,
    blockListManagement: false,
    twoFactorAuth: false,
  });

  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchUserSettings();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;

      if (data) {
        setProfileData({
          username: data.username || "",
          full_name: data.full_name || "",
          bio: data.bio || "",
          email: user?.email || "",
          avatar: data.avatar || "",
          website: data.website || "",
          location: data.location || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    }
  };

  const fetchUserSettings = async () => {
    try {
      if (!user) return;
      
      const userSettings = await getUserSettings(user.id);

      if (userSettings?.settings) {
        // Safe to access settings now since getUserSettings always returns an object with settings
        
        // Notification settings
        if (userSettings.settings.notifications) {
          setNotificationSettings({
            emailNotifications: userSettings.settings.notifications.emailNotifications ?? true,
            pushNotifications: userSettings.settings.notifications.pushNotifications ?? true,
            mentionAlerts: userSettings.settings.notifications.mentionAlerts ?? true,
            commentAlerts: userSettings.settings.notifications.commentAlerts ?? true,
            followAlerts: userSettings.settings.notifications.followAlerts ?? true,
          });
        }
        
        // Privacy settings
        if (userSettings.settings.privacy) {
          setPrivacySettings({
            privateAccount: userSettings.settings.privacy.privateAccount ?? false,
            hideActivityStatus: userSettings.settings.privacy.hideActivityStatus ?? false,
            blockListManagement: userSettings.settings.privacy.blockListManagement ?? false,
            twoFactorAuth: userSettings.settings.privacy.twoFactorAuth ?? false,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching user settings:", error);
      toast({
        title: "Error",
        description: "Failed to load user settings",
        variant: "destructive",
      });
    }
  };

  const handleProfileUpdate = async () => {
    if (!user) return;
    
    try {
      await updateUserProfile(user.id, profileData);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleNotificationSettingsUpdate = async () => {
    if (!user) return;
    
    try {
      await updateUserSettings(user.id, {
        ...notificationSettings,
      }, "notifications");
      
      toast({
        title: "Success",
        description: "Notification settings updated",
      });
    } catch (error) {
      console.error("Error updating notification settings:", error);
      toast({
        title: "Error",
        description: "Failed to update notification settings",
        variant: "destructive",
      });
    }
  };

  const handlePrivacySettingsUpdate = async () => {
    if (!user) return;
    
    try {
      await updateUserSettings(user.id, {
        ...privacySettings,
      }, "privacy");
      
      toast({
        title: "Success",
        description: "Privacy settings updated",
      });
    } catch (error) {
      console.error("Error updating privacy settings:", error);
      toast({
        title: "Error",
        description: "Failed to update privacy settings",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNotificationToggle = (name: string, checked: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handlePrivacyToggle = (name: string, checked: boolean) => {
    setPrivacySettings(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>
        
        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          <div className="grid gap-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Profile Information</h2>
              <p className="text-muted-foreground">Update your profile information visible to others.</p>
            </div>
            
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label htmlFor="username">Username</label>
                <Input
                  id="username"
                  name="username"
                  value={profileData.username}
                  onChange={handleInputChange}
                  placeholder="Your username"
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="fullName">Full Name</label>
                <Input
                  id="fullName"
                  name="full_name"
                  value={profileData.full_name}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="email">Email</label>
                <Input
                  id="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  placeholder="Your email address"
                  disabled
                />
                <p className="text-xs text-muted-foreground">Email cannot be changed directly. Contact support for assistance.</p>
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="bio">Bio</label>
                <Input
                  id="bio"
                  name="bio"
                  value={profileData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself"
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="website">Website</label>
                <Input
                  id="website"
                  name="website"
                  value={profileData.website}
                  onChange={handleInputChange}
                  placeholder="Your website URL"
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="location">Location</label>
                <Input
                  id="location"
                  name="location"
                  value={profileData.location}
                  onChange={handleInputChange}
                  placeholder="Your location"
                />
              </div>
            </div>
            
            <Button onClick={handleProfileUpdate}>Save Profile</Button>
          </div>
        </TabsContent>
        
        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <div className="grid gap-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Notification Preferences</h2>
              <p className="text-muted-foreground">Control how you receive notifications from Unmute Life.</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Email Notifications</h3>
                  <p className="text-sm text-muted-foreground">Receive email updates about important activity.</p>
                </div>
                <Switch
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) => handleNotificationToggle("emailNotifications", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Push Notifications</h3>
                  <p className="text-sm text-muted-foreground">Get push notifications on your devices.</p>
                </div>
                <Switch
                  checked={notificationSettings.pushNotifications}
                  onCheckedChange={(checked) => handleNotificationToggle("pushNotifications", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Mention Alerts</h3>
                  <p className="text-sm text-muted-foreground">Get notified when someone mentions you.</p>
                </div>
                <Switch
                  checked={notificationSettings.mentionAlerts}
                  onCheckedChange={(checked) => handleNotificationToggle("mentionAlerts", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Comment Alerts</h3>
                  <p className="text-sm text-muted-foreground">Get notified when someone comments on your content.</p>
                </div>
                <Switch
                  checked={notificationSettings.commentAlerts}
                  onCheckedChange={(checked) => handleNotificationToggle("commentAlerts", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Follow Alerts</h3>
                  <p className="text-sm text-muted-foreground">Get notified when someone follows you.</p>
                </div>
                <Switch
                  checked={notificationSettings.followAlerts}
                  onCheckedChange={(checked) => handleNotificationToggle("followAlerts", checked)}
                />
              </div>
            </div>
            
            <Button onClick={handleNotificationSettingsUpdate}>Save Notification Settings</Button>
          </div>
        </TabsContent>
        
        {/* Privacy Settings */}
        <TabsContent value="privacy" className="space-y-6">
          <div className="grid gap-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Privacy & Security</h2>
              <p className="text-muted-foreground">Manage your account privacy and security settings.</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Private Account</h3>
                  <p className="text-sm text-muted-foreground">Only approved followers can see your content.</p>
                </div>
                <Switch
                  checked={privacySettings.privateAccount}
                  onCheckedChange={(checked) => handlePrivacyToggle("privateAccount", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Hide Activity Status</h3>
                  <p className="text-sm text-muted-foreground">Don't show when you're active on the platform.</p>
                </div>
                <Switch
                  checked={privacySettings.hideActivityStatus}
                  onCheckedChange={(checked) => handlePrivacyToggle("hideActivityStatus", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Block List Management</h3>
                  <p className="text-sm text-muted-foreground">Enable to manage your blocked accounts.</p>
                </div>
                <Switch
                  checked={privacySettings.blockListManagement}
                  onCheckedChange={(checked) => handlePrivacyToggle("blockListManagement", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
                </div>
                <Switch
                  checked={privacySettings.twoFactorAuth}
                  onCheckedChange={(checked) => handlePrivacyToggle("twoFactorAuth", checked)}
                />
              </div>
            </div>
            
            <Button onClick={handlePrivacySettingsUpdate}>Save Privacy Settings</Button>
          </div>
        </TabsContent>
        
        {/* Account Settings */}
        <TabsContent value="account" className="space-y-6">
          <div className="grid gap-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Account Management</h2>
              <p className="text-muted-foreground">Manage your account settings and data.</p>
            </div>
            
            <div className="space-y-6">
              {/* Change Password Section */}
              <div className="p-6 border border-border rounded-lg bg-card">
                <h3 className="font-medium text-lg mb-2">Change Password</h3>
                <p className="text-sm text-muted-foreground mb-4">Update your password regularly to keep your account secure.</p>
                <Button variant="outline">Change Password</Button>
              </div>
              
              {/* Delete Account Section */}
              <div className="p-6 border border-destructive/10 rounded-lg bg-destructive/5">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                  <div>
                    <h3 className="font-medium text-lg mb-2 text-destructive">Delete Account</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Permanently delete your account and all your data. This action cannot be undone.
                    </p>
                    <Link to="/delete-account">
                      <Button variant="destructive">Delete Account</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
