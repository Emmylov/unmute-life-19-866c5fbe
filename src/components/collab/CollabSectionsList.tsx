
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusCircle, Pencil, Trash2, ArrowUp, ArrowDown, FileType, Mic, Image as ImageIcon, Video, Text, PenSquare } from "lucide-react";
import { CollabSection, CollabContributor, SectionType } from "./CollabCreator";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";

interface CollabSectionsListProps {
  sections: CollabSection[];
  contributors: CollabContributor[];
  onAddSection: (section: CollabSection) => void;
  onRemoveSection: (sectionId: string) => void;
  onUpdateSection: (section: CollabSection) => void;
  currentUserId: string;
}

const CollabSectionsList: React.FC<CollabSectionsListProps> = ({
  sections,
  contributors,
  onAddSection,
  onRemoveSection,
  onUpdateSection,
  currentUserId
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sectionType, setSectionType] = useState<SectionType>("Story");
  const [sectionTitle, setSectionTitle] = useState("");
  const [sectionContent, setSectionContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const { toast } = useToast();
  
  const sectionTypeIcons: Record<SectionType, React.ReactNode> = {
    "Story": <Text className="h-4 w-4" />,
    "Art": <PenSquare className="h-4 w-4" />,
    "Testimony": <FileType className="h-4 w-4" />,
    "Commentary": <Pencil className="h-4 w-4" />,
    "Voice": <Mic className="h-4 w-4" />,
    "Video": <Video className="h-4 w-4" />,
    "Photo": <ImageIcon className="h-4 w-4" />,
    "Other": <FileType className="h-4 w-4" />
  };
  
  const handleOpenDialog = (section?: CollabSection) => {
    if (section) {
      // Editing an existing section
      setEditingSectionId(section.id);
      setSectionType(section.type);
      setSectionTitle(section.title);
      setSectionContent(section.content);
      setMediaUrl(section.mediaUrl || "");
    } else {
      // Creating a new section
      setEditingSectionId(null);
      setSectionType("Story");
      setSectionTitle("");
      setSectionContent("");
      setMediaUrl("");
    }
    
    setIsDialogOpen(true);
  };
  
  const handleSubmit = () => {
    if (!sectionTitle) {
      toast({
        title: "Title required",
        description: "Please enter a title for your section",
        variant: "destructive",
      });
      return;
    }
    
    if (!sectionContent && !mediaUrl) {
      toast({
        title: "Content required",
        description: "Please add some content or media to your section",
        variant: "destructive",
      });
      return;
    }
    
    if (editingSectionId) {
      // Update existing section
      const updatedSection: CollabSection = {
        id: editingSectionId,
        type: sectionType,
        title: sectionTitle,
        content: sectionContent,
        mediaUrl: mediaUrl || undefined,
        contributorId: sections.find(s => s.id === editingSectionId)?.contributorId || currentUserId
      };
      
      onUpdateSection(updatedSection);
      toast({
        title: "Section updated",
        description: `Your "${sectionTitle}" section has been updated`
      });
    } else {
      // Create new section
      const newSection: CollabSection = {
        id: uuidv4(),
        type: sectionType,
        title: sectionTitle,
        content: sectionContent,
        mediaUrl: mediaUrl || undefined,
        contributorId: currentUserId
      };
      
      onAddSection(newSection);
      toast({
        title: "Section added",
        description: `Your "${sectionTitle}" section has been added`
      });
    }
    
    // Reset form and close dialog
    setIsDialogOpen(false);
    setSectionTitle("");
    setSectionContent("");
    setMediaUrl("");
    setEditingSectionId(null);
  };
  
  const canEditSection = (section: CollabSection) => {
    const currentUserRole = contributors.find(c => c.id === currentUserId)?.role;
    return section.contributorId === currentUserId || currentUserRole === "Editor";
  };
  
  const getContributorName = (contributorId: string) => {
    const contributor = contributors.find(c => c.id === contributorId);
    return contributor ? (contributor.fullName || contributor.username) : "Unknown";
  };
  
  const getContributorAvatar = (contributorId: string) => {
    return contributors.find(c => c.id === contributorId)?.avatar;
  };
  
  const getContributorUsername = (contributorId: string) => {
    return contributors.find(c => c.id === contributorId)?.username || "user";
  };
  
  // Move section up in the list
  const moveSectionUp = (index: number) => {
    if (index === 0) return;
    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[index - 1];
    newSections[index - 1] = temp;
    
    // Update all sections
    newSections.forEach(section => onUpdateSection(section));
  };
  
  // Move section down in the list
  const moveSectionDown = (index: number) => {
    if (index === sections.length - 1) return;
    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[index + 1];
    newSections[index + 1] = temp;
    
    // Update all sections
    newSections.forEach(section => onUpdateSection(section));
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Content Sections ({sections.length})</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} size="sm" className="bg-primary hover:bg-primary/90">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Section
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingSectionId ? "Edit Section" : "Add New Section"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="sectionType">Section Type</Label>
                <Select value={sectionType} onValueChange={(value) => setSectionType(value as SectionType)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Story">Story</SelectItem>
                    <SelectItem value="Art">Art</SelectItem>
                    <SelectItem value="Testimony">Testimony</SelectItem>
                    <SelectItem value="Commentary">Commentary</SelectItem>
                    <SelectItem value="Voice">Voice</SelectItem>
                    <SelectItem value="Video">Video</SelectItem>
                    <SelectItem value="Photo">Photo</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sectionTitle">Title</Label>
                <Input 
                  id="sectionTitle" 
                  placeholder="Section title" 
                  value={sectionTitle}
                  onChange={(e) => setSectionTitle(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sectionContent">Content</Label>
                <Textarea 
                  id="sectionContent" 
                  placeholder="Write your content here..." 
                  value={sectionContent}
                  onChange={(e) => setSectionContent(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mediaUrl">Media URL (optional)</Label>
                <Input 
                  id="mediaUrl" 
                  placeholder="Paste a link to an image, video, or audio file" 
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  For photos, videos or voice recordings related to this section
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90">
                {editingSectionId ? "Update Section" : "Add Section"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {sections.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-4">
            <PlusCircle className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-2">No sections yet</h3>
          <p className="text-gray-500 mb-4">Add different types of content to your collaboration</p>
          <Button 
            className="bg-primary hover:bg-primary/90"
            onClick={() => handleOpenDialog()}
          >
            Add Your First Section
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {sections.map((section, index) => (
            <Card key={section.id} className="relative">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-full bg-gray-100">
                    {sectionTypeIcons[section.type]}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{section.title}</h4>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">{section.type}</span>
                      <span className="mx-1">•</span>
                      <div className="flex items-center gap-1">
                        <Avatar className="h-4 w-4">
                          <AvatarImage src={getContributorAvatar(section.contributorId)} />
                          <AvatarFallback className="text-[8px]">
                            {getContributorUsername(section.contributorId)[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span>@{getContributorUsername(section.contributorId)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {canEditSection(section) && (
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-gray-500"
                        onClick={() => moveSectionUp(index)}
                        disabled={index === 0}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-gray-500"
                        onClick={() => moveSectionDown(index)}
                        disabled={index === sections.length - 1}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-primary"
                        onClick={() => handleOpenDialog(section)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => onRemoveSection(section.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                
                {section.content && (
                  <div className="text-sm text-gray-700 mb-2 whitespace-pre-wrap">
                    {section.content}
                  </div>
                )}
                
                {section.mediaUrl && (
                  <div className="bg-gray-50 rounded p-2 text-xs truncate flex items-center">
                    <FileType className="h-3 w-3 mr-1 text-gray-400" />
                    {section.mediaUrl}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {sections.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg mt-4 border-l-4 border-primary">
          <p className="text-sm text-gray-600 mb-2">
            <strong>Preview:</strong> Your collaboration will feature content from {contributors.length} contributor{contributors.length !== 1 ? 's' : ''}.
          </p>
          <p className="text-xs text-gray-500">
            The final post will display all sections in the order shown above, with proper attribution.
          </p>
        </div>
      )}
    </div>
  );
};

export default CollabSectionsList;
