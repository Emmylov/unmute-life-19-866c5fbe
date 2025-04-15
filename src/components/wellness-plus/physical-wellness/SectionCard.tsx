
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, CalendarCheck, Dumbbell, Utensils, Video, BookText, Users, ScrollText } from 'lucide-react';
import { PhysicalWellnessPreference, WellnessSection } from './types';

interface SectionCardProps {
  section: WellnessSection;
  preferences: PhysicalWellnessPreference | null;
}

const SectionCard: React.FC<SectionCardProps> = ({ section, preferences }) => {
  // Function to get the right icon based on the name
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Heart':
        return <Heart className="h-5 w-5" />;
      case 'CalendarCheck':
        return <CalendarCheck className="h-5 w-5" />;
      case 'Dumbbell':
        return <Dumbbell className="h-5 w-5" />;
      case 'Utensils':
        return <Utensils className="h-5 w-5" />;
      case 'Video':
        return <Video className="h-5 w-5" />;
      case 'BookText':
        return <BookText className="h-5 w-5" />;
      case 'Users':
        return <Users className="h-5 w-5" />;
      case 'ScrollText':
        return <ScrollText className="h-5 w-5" />;
      default:
        return <Heart className="h-5 w-5" />;
    }
  };

  // Extract color classes
  const colorClasses = section.color || 'bg-gray-100 text-gray-500';

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer overflow-hidden">
      <div className="relative h-full">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className={`p-2 rounded-md ${colorClasses}`}>
              {getIcon(section.icon)}
            </div>
            {preferences?.softMode ? (
              <div className="w-8 h-1 bg-primary/20 rounded-full"></div>
            ) : null}
          </div>
          <CardTitle className={`text-lg mt-2 ${preferences?.softMode ? 'text-primary/80' : ''}`}>
            {section.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className={preferences?.softMode ? 'text-xs' : 'text-sm'}>
            {preferences?.softMode 
              ? section.description.split(' ').slice(0, 8).join(' ') + '...' 
              : section.description}
          </CardDescription>
          
          {/* Label for identity-specific content */}
          {section.forIdentities !== 'all' && Array.isArray(section.forIdentities) && (
            <div className="mt-3">
              <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                Personalized content
              </span>
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
};

export default SectionCard;
