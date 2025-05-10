
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Info, Phone, Video, MoreVertical, Sun, Moon, Smile } from "lucide-react";
import TextWrapper from "@/components/i18n/TextWrapper";

interface Profile {
  id: string;
  username: string;
  avatar: string;
  full_name?: string;
}

interface ChatHeaderProps {
  profile: Profile | null;
  moodStatus: string;
  setMoodStatus: (status: string) => void;
}

const moodEmojis: Record<string, {emoji: string, label: string}> = {
  "chill": {emoji: "😌", label: "Chill"},
  "happy": {emoji: "😄", label: "Happy"},
  "anxious": {emoji: "😣", label: "Anxious"},
  "focused": {emoji: "🧠", label: "Focused"},
  "tired": {emoji: "😴", label: "Tired"}
};

const ChatHeader = ({ profile, moodStatus, setMoodStatus }: ChatHeaderProps) => {
  if (!profile) return null;
  
  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex items-center justify-between">
      <div className="flex items-center">
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage src={profile?.avatar} />
          <AvatarFallback className="bg-unmute-purple text-white">
            <TextWrapper text={profile?.username?.charAt(0).toUpperCase() || "?"} />
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">
            <TextWrapper text={profile?.full_name || profile?.username || "Unknown User"} />
          </h3>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span className="text-xs text-gray-500"><TextWrapper text="Online" /></span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-1">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Smile className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] p-6">
            <h3 className="text-lg font-medium mb-4"><TextWrapper text="Set your mood" /></h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(moodEmojis).map(([key, {emoji, label}]) => (
                <Button
                  key={key}
                  variant={moodStatus === key ? "default" : "outline"}
                  className="flex items-center justify-center gap-2 h-12"
                  onClick={() => setMoodStatus(key)}
                >
                  <span className="text-xl"><TextWrapper text={emoji} /></span>
                  <span><TextWrapper text={label} /></span>
                </Button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
        
        <Button variant="ghost" size="icon" className="rounded-full">
          <Phone className="h-5 w-5" />
        </Button>
        
        <Button variant="ghost" size="icon" className="rounded-full">
          <Video className="h-5 w-5" />
        </Button>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Info className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] p-6">
            <div className="flex flex-col items-center mb-6">
              <Avatar className="h-20 w-20 mb-4">
                <AvatarImage src={profile?.avatar} />
                <AvatarFallback className="bg-unmute-purple text-white text-2xl">
                  <TextWrapper text={profile?.username?.charAt(0).toUpperCase() || "?"} />
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-bold">
                <TextWrapper text={profile?.full_name || profile?.username || "Unknown User"} />
              </h3>
              <p className="text-gray-500 text-sm"><TextWrapper text={`@${profile?.username}`} /></p>
              <div className="flex items-center mt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-xs text-gray-500"><TextWrapper text="Online" /></span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2"><TextWrapper text="Chat settings" /></h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span><TextWrapper text="Theme" /></span>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <Sun className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <Moon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2"><TextWrapper text="Shared media" /></h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-md"></div>
                  <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-md"></div>
                  <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-md"></div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default ChatHeader;
