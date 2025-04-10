
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, MessageCircle, UserPlus, Lock, Globe } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface SupportCircle {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  messageCount: number;
  category: string;
  isPrivate: boolean;
  imageUrl?: string;
}

const supportCircles: SupportCircle[] = [
  {
    id: '1',
    name: 'Single Parents Support',
    description: 'A safe space for single parents to share challenges, advice, and encouragement.',
    memberCount: 124,
    messageCount: 843,
    category: 'Parenting',
    isPrivate: false,
    imageUrl: 'https://images.unsplash.com/photo-1536640712-4d4c36ff0e4e?q=80&w=500'
  },
  {
    id: '2',
    name: 'Healing from Loss',
    description: 'Support for those grieving and healing from the loss of loved ones.',
    memberCount: 78,
    messageCount: 631,
    category: 'Grief',
    isPrivate: false,
    imageUrl: 'https://images.unsplash.com/photo-1516410529446-2c777cb7366d?q=80&w=500'
  },
  {
    id: '3',
    name: 'Christian Encouragement',
    description: 'Daily scripture, prayer requests, and faith-based support.',
    memberCount: 206,
    messageCount: 1547,
    category: 'Faith',
    isPrivate: false,
    imageUrl: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?q=80&w=500'
  },
  {
    id: '4',
    name: 'Anxiety & Stress Relief',
    description: 'Strategies, support, and understanding for managing anxiety and stress.',
    memberCount: 183,
    messageCount: 1203,
    category: 'Mental Health',
    isPrivate: false,
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=500'
  },
  {
    id: '5',
    name: 'Teen Parents',
    description: 'Support for young parents navigating parenthood, education, and personal growth.',
    memberCount: 56,
    messageCount: 421,
    category: 'Parenting',
    isPrivate: true,
    imageUrl: 'https://images.unsplash.com/photo-1531983412531-1f49a365ffed?q=80&w=500'
  },
  {
    id: '6',
    name: 'Career Transitions',
    description: 'Support for professionals in career transitions or seeking new opportunities.',
    memberCount: 92,
    messageCount: 647,
    category: 'Professional',
    isPrivate: false,
    imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=500'
  }
];

const SupportCircles = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Support Circles</h2>
        <Button 
          onClick={() => setCreateDialogOpen(true)}
          className="bg-[#9b87f5] hover:bg-[#7E69AB] flex gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Circle
        </Button>
      </div>
      
      <p className="text-muted-foreground">
        Join supportive communities of people going through similar experiences.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {supportCircles.map(circle => (
          <CircleCard key={circle.id} circle={circle} />
        ))}
      </div>
      
      <CreateCircleDialog open={createDialogOpen} setOpen={setCreateDialogOpen} />
    </div>
  );
};

interface CircleCardProps {
  circle: SupportCircle;
}

const CircleCard = ({ circle }: CircleCardProps) => {
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  
  return (
    <>
      <Card className="overflow-hidden">
        <div className="h-32 overflow-hidden">
          {circle.imageUrl ? (
            <img 
              src={circle.imageUrl} 
              alt={circle.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-[#E5DEFF] to-[#FDE1D3]"></div>
          )}
        </div>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                {circle.name}
                {circle.isPrivate && <Lock className="h-3.5 w-3.5 text-muted-foreground" />}
              </CardTitle>
              <Badge variant="outline" className="mt-1">
                {circle.category}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{circle.description}</p>
          
          <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              <span>{circle.memberCount} members</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-3.5 w-3.5" />
              <span>{circle.messageCount} messages</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <Button 
            onClick={() => setShowJoinDialog(true)}
            variant="outline"
            className="w-full"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Join Circle
          </Button>
        </CardFooter>
      </Card>
      
      <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join "{circle.name}"</DialogTitle>
            <DialogDescription>
              {circle.isPrivate ? 
                "This is a private circle. Your request to join will be reviewed by moderators." :
                "You're about to join this support circle. Please be respectful of all members."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <h4 className="font-medium mb-2">Community Guidelines:</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Be respectful and supportive of other members</li>
              <li>Maintain confidentiality - what's shared here stays here</li>
              <li>Avoid giving medical or professional advice</li>
              <li>Focus on personal experiences rather than opinions</li>
              <li>Report any concerning content to moderators</li>
            </ul>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setShowJoinDialog(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#9b87f5] hover:bg-[#7E69AB]"
              onClick={() => {
                // Would handle joining logic here
                setShowJoinDialog(false);
              }}
            >
              I Agree & Join
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

interface CreateCircleDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const CreateCircleDialog = ({ open, setOpen }: CreateCircleDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create a New Support Circle</DialogTitle>
          <DialogDescription>
            Create a safe space for people with similar experiences to connect and support each other.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <form className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="circle-name" className="text-sm font-medium">Circle Name</label>
              <input 
                id="circle-name"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Give your circle a descriptive name"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="circle-description" className="text-sm font-medium">Description</label>
              <textarea 
                id="circle-description"
                className="w-full px-3 py-2 border rounded-md min-h-[100px]"
                placeholder="Tell potential members what this circle is about"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="circle-category" className="text-sm font-medium">Category</label>
              <select 
                id="circle-category"
                className="w-full px-3 py-2 border rounded-md"
              >
                <option>Mental Health</option>
                <option>Parenting</option>
                <option>Relationships</option>
                <option>Faith</option>
                <option>Grief</option>
                <option>Professional</option>
                <option>Other</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="is-private" 
                className="rounded border-gray-300"
              />
              <label htmlFor="is-private" className="text-sm">
                Make this circle private (members must request to join)
              </label>
            </div>
          </form>
        </div>
        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            className="bg-[#9b87f5] hover:bg-[#7E69AB]"
            onClick={() => {
              // Would handle creation logic here
              setOpen(false);
            }}
          >
            Create Circle
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SupportCircles;
