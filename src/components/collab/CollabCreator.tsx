
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CollabContributorPicker from "./CollabContributorPicker";
import CollabSectionsList from "./CollabSectionsList";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Pen, Mic, Image as ImageIcon, Video, Users, Sparkles, Save, RefreshCw } from "lucide-react";

// Define types for section types
export type SectionType = "Story" | "Art" | "Testimony" | "Commentary" | "Voice" | "Video" | "Photo" | "Other";
export type ContributorRole = "Editor" | "Contributor" | "Viewer";

// Define the contributor type
export interface CollabContributor {
  id: string;
  username: string;
  avatar?: string;
  fullName?: string;
  role: ContributorRole;
}

// Define the section type
export interface CollabSection {
  id: string;
  type: SectionType;
  title: string;
  content: string;
  mediaUrl?: string;
  contributorId: string;
}

const CollabCreator: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [activeTab, setActiveTab] = useState("details");
  const [contributors, setContributors] = useState<CollabContributor[]>([]);
  const [sections, setSections] = useState<CollabSection[]>([]);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingCaption, setIsGeneratingCaption] = useState(false);
  const [generatedCaption, setGeneratedCaption] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUser(user);
        
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (data) {
          setProfile(data);
          
          // Add current user as a contributor with Editor role
          setContributors([{
            id: user.id,
            username: data.username || "user",
            avatar: data.avatar,
            fullName: data.full_name,
            role: "Editor"
          }]);
        }
      }
    };
    
    getUser();
  }, []);
  
  const handleAddContributor = (contributor: CollabContributor) => {
    // Check if contributor already exists
    if (!contributors.find(c => c.id === contributor.id)) {
      setContributors([...contributors, contributor]);
      
      toast({
        title: "Contributor added",
        description: `${contributor.username} has been added to the collab`,
      });
    }
  };
  
  const handleRemoveContributor = (contributorId: string) => {
    setContributors(contributors.filter(c => c.id !== contributorId));
    // Also remove any sections by this contributor
    setSections(sections.filter(s => s.contributorId !== contributorId));
  };
  
  const handleUpdateContributor = (id: string, role: ContributorRole) => {
    setContributors(contributors.map(c => {
      if (c.id === id) {
        return { ...c, role };
      }
      return c;
    }));
  };
  
  const handleAddSection = (section: CollabSection) => {
    setSections([...sections, section]);
  };
  
  const handleRemoveSection = (sectionId: string) => {
    setSections(sections.filter(s => s.id !== sectionId));
  };
  
  const handleUpdateSection = (updatedSection: CollabSection) => {
    setSections(sections.map(s => {
      if (s.id === updatedSection.id) {
        return updatedSection;
      }
      return s;
    }));
  };
  
  const handleGenerateCaption = async () => {
    if (sections.length === 0) {
      toast({
        title: "No content to generate from",
        description: "Please add some content sections first",
        variant: "destructive",
      });
      return;
    }
    
    setIsGeneratingCaption(true);
    
    try {
      // In a real app, this would call an AI service
      // For now, we'll simulate it with a timeout
      setTimeout(() => {
        const sectionTypes = sections.map(s => s.type.toLowerCase());
        const contributorCount = contributors.length;
        
        let generatedText = "";
        
        if (sectionTypes.includes("story")) {
          generatedText += "A collaborative story ";
        } else if (sectionTypes.includes("testimony")) {
          generatedText += "Powerful testimonies ";
        } else {
          generatedText += "A creative collaboration ";
        }
        
        generatedText += `shared by ${contributorCount} voices. `;
        generatedText += "Together, we're unmuting important conversations.";
        
        const generatedTags = ["#unmutecollabs", "#collaboration", "#voices"];
        
        if (sectionTypes.includes("art")) generatedTags.push("#art");
        if (sectionTypes.includes("story")) generatedTags.push("#storytelling");
        if (sectionTypes.includes("testimony")) generatedTags.push("#testimony");
        if (sectionTypes.includes("commentary")) generatedTags.push("#perspectives");
        
        setGeneratedCaption(generatedText);
        setTags(generatedTags);
        setDescription(generatedText);
        
        toast({
          title: "Caption generated",
          description: "AI-generated caption and tags have been created",
        });
      }, 1500);
    } catch (error) {
      toast({
        title: "Error generating caption",
        description: "There was a problem generating your caption",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingCaption(false);
    }
  };
  
  const handleSaveCollab = async () => {
    if (!title) {
      toast({
        title: "Title required",
        description: "Please add a title for your collab",
        variant: "destructive",
      });
      return;
    }
    
    if (sections.length === 0) {
      toast({
        title: "No content",
        description: "Please add at least one content section",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, save to Supabase here
      // For this demo, we'll just simulate success
      setTimeout(() => {
        toast({
          title: "Collab created!",
          description: "Your collaborative post has been published",
        });
        navigate("/home");
      }, 1500);
    } catch (error) {
      toast({
        title: "Error saving collab",
        description: "There was a problem saving your collab post",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-md border-none">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-cosmic-crush" />
            Unmute Collabs
          </CardTitle>
          <CardDescription>
            Create content together with friends, artists, or advocates. Share your combined voices!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="contributors">Contributors</TabsTrigger>
              <TabsTrigger value="sections">Content Sections</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  placeholder="Title of your collaborative post" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="description">Description</Label>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleGenerateCaption}
                    disabled={isGeneratingCaption}
                    className="text-xs flex items-center gap-1"
                  >
                    {isGeneratingCaption ? (
                      <>
                        <RefreshCw className="h-3 w-3 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3 w-3" />
                        Generate with AI
                      </>
                    )}
                  </Button>
                </div>
                <Textarea 
                  id="description" 
                  placeholder="Describe what this collaboration is about" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              
              {(generatedCaption || tags.length > 0) && (
                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <h4 className="font-medium text-sm">AI-Generated Content</h4>
                  </div>
                  
                  {generatedCaption && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-600">{generatedCaption}</p>
                    </div>
                  )}
                  
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Badge 
                          key={tag} 
                          variant="secondary" 
                          className="bg-primary/10 text-primary hover:bg-primary/20"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="contributors" className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Current Contributors</h3>
                {contributors.length > 0 ? (
                  <div className="space-y-3">
                    {contributors.map((contributor) => (
                      <div key={contributor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={contributor.avatar} />
                            <AvatarFallback>
                              {contributor.username[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{contributor.fullName || contributor.username}</p>
                            <p className="text-sm text-gray-500">@{contributor.username}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {contributor.id === user?.id ? (
                            <Badge>You</Badge>
                          ) : (
                            <Select defaultValue={contributor.role} onValueChange={(value) => 
                              handleUpdateContributor(contributor.id, value as ContributorRole)
                            }>
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Editor">Editor</SelectItem>
                                <SelectItem value="Contributor">Contributor</SelectItem>
                                <SelectItem value="Viewer">Viewer</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                          
                          {contributor.id !== user?.id && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleRemoveContributor(contributor.id)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No contributors yet</p>
                )}
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-4">Add Contributors</h3>
                <CollabContributorPicker onAddContributor={handleAddContributor} currentContributors={contributors} />
              </div>
            </TabsContent>
            
            <TabsContent value="sections" className="space-y-6">
              <CollabSectionsList 
                sections={sections}
                contributors={contributors}
                onAddSection={handleAddSection}
                onRemoveSection={handleRemoveSection}
                onUpdateSection={handleUpdateSection}
                currentUserId={user?.id}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <Button 
            variant="outline" 
            onClick={() => navigate("/home")}
          >
            Cancel
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => setActiveTab(activeTab === "details" ? "contributors" : activeTab === "contributors" ? "sections" : "details")}
            >
              {activeTab === "details" ? "Next: Contributors" : activeTab === "contributors" ? "Next: Content" : "Back to Details"}
            </Button>
            <Button 
              onClick={handleSaveCollab}
              disabled={isLoading}
              className="bg-cosmic-crush hover:bg-cosmic-crush/90"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Publish Collab
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CollabCreator;
