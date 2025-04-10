
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, FileText, Headphones, Clock, Tag, Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Resource {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  type: 'video' | 'audio' | 'article';
  category: string;
  duration: string;
  author: string;
  url: string;
}

const resources: Resource[] = [
  {
    id: '1',
    title: "Finding Peace in Chaos",
    description: "Learn techniques to stay centered during life's most turbulent moments",
    imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=500",
    type: 'video',
    category: 'Mental Health',
    duration: '12 min',
    author: 'Chioma Iyayi',
    url: '#'
  },
  {
    id: '2',
    title: "Healing from Past Trauma",
    description: "A gentle approach to processing and moving beyond traumatic experiences",
    imageUrl: "https://images.unsplash.com/photo-1506126279646-a697353d3166?q=80&w=500",
    type: 'article',
    category: 'Healing',
    duration: '8 min read',
    author: 'Chioma Iyayi',
    url: '#'
  },
  {
    id: '3',
    title: "Morning Meditation for Parents",
    description: "Start your day with calm and intention before the parenting challenges begin",
    imageUrl: "https://images.unsplash.com/photo-1545389336-cf090694435e?q=80&w=500",
    type: 'audio',
    category: 'Parenting',
    duration: '15 min',
    author: 'Chioma Iyayi',
    url: '#'
  },
  {
    id: '4',
    title: "Setting Boundaries with Love",
    description: "How to establish healthy boundaries without guilt or conflict",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=500",
    type: 'video',
    category: 'Relationships',
    duration: '22 min',
    author: 'Chioma Iyayi',
    url: '#'
  },
  {
    id: '5',
    title: "Finding Your Purpose After Loss",
    description: "Rebuilding meaning and direction when life takes unexpected turns",
    imageUrl: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=500",
    type: 'article',
    category: 'Spiritual Growth',
    duration: '10 min read',
    author: 'Chioma Iyayi',
    url: '#'
  },
  {
    id: '6',
    title: "Calming Anxiety Meditation",
    description: "A guided practice to ease anxious thoughts and find centeredness",
    imageUrl: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=500",
    type: 'audio',
    category: 'Mental Health',
    duration: '18 min',
    author: 'Chioma Iyayi',
    url: '#'
  }
];

const ResourceLibrary = () => {
  const getIcon = (type: string) => {
    switch(type) {
      case 'video': return <PlayCircle className="h-5 w-5" />;
      case 'article': return <FileText className="h-5 w-5" />;
      case 'audio': return <Headphones className="h-5 w-5" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Resource Library</h2>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search resources..." 
            className="pl-8"
          />
        </div>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="mental-health">Mental Health</TabsTrigger>
          <TabsTrigger value="parenting">Parenting</TabsTrigger>
          <TabsTrigger value="relationships">Relationships</TabsTrigger>
          <TabsTrigger value="spiritual">Spiritual Growth</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map(resource => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="mental-health" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources
              .filter(resource => resource.category === 'Mental Health')
              .map(resource => (
                <ResourceCard key={resource.id} resource={resource} />
              ))
            }
          </div>
        </TabsContent>
        
        <TabsContent value="parenting" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources
              .filter(resource => resource.category === 'Parenting')
              .map(resource => (
                <ResourceCard key={resource.id} resource={resource} />
              ))
            }
          </div>
        </TabsContent>
        
        <TabsContent value="relationships" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources
              .filter(resource => resource.category === 'Relationships')
              .map(resource => (
                <ResourceCard key={resource.id} resource={resource} />
              ))
            }
          </div>
        </TabsContent>
        
        <TabsContent value="spiritual" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources
              .filter(resource => resource.category === 'Spiritual Growth')
              .map(resource => (
                <ResourceCard key={resource.id} resource={resource} />
              ))
            }
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface ResourceCardProps {
  resource: Resource;
}

const ResourceCard = ({ resource }: ResourceCardProps) => {
  const getIcon = (type: string) => {
    switch(type) {
      case 'video': return <PlayCircle className="h-5 w-5" />;
      case 'article': return <FileText className="h-5 w-5" />;
      case 'audio': return <Headphones className="h-5 w-5" />;
      default: return null;
    }
  };
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="aspect-video w-full overflow-hidden">
        <img 
          src={resource.imageUrl} 
          alt={resource.title}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{resource.title}</CardTitle>
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            {getIcon(resource.type)}
          </span>
        </div>
        <CardDescription className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1">
            <Tag className="h-3 w-3" />
            {resource.category}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {resource.duration}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm">
        <p>{resource.description}</p>
        <div className="text-xs text-muted-foreground mt-2">
          By {resource.author}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button 
          className="w-full bg-[#9b87f5] hover:bg-[#7E69AB]"
          onClick={() => window.open(resource.url, '_blank')}
        >
          {resource.type === 'video' ? 'Watch Video' : 
           resource.type === 'audio' ? 'Listen Now' : 'Read Article'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ResourceLibrary;
