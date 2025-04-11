
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, Leaf, Sparkles, Calendar, Play, FileText, Headphones, PlusCircle } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { testimonials, featuredContent, dailyDoses, books } from "@/data/wellness-data";
import { useIsMobile, useIsTablet } from "@/hooks/use-responsive";
import WelcomeBanner from "@/components/wellness/WelcomeBanner";
import ContentCard from "@/components/wellness/ContentCard";
import DailyDoseCard from "@/components/wellness/DailyDoseCard";
import BookCard from "@/components/wellness/BookCard";
import TestimonialCard from "@/components/wellness/TestimonialCard";
import SessionBookingForm from "@/components/wellness/SessionBookingForm";
import AskChiomaSection from "@/components/wellness/AskChiomaSection";
import AppLayout from '@/components/layout/AppLayout';

const Wellness = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  return (
    <AppLayout pageTitle="Wellness">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-6 md:py-8 max-w-7xl">
        {/* Wellness+ Banner */}
        <div className="mb-6 md:mb-8 p-3 md:p-4 rounded-lg bg-gradient-to-r from-[#F1F0FB] to-[#FDE1D3]/20 border border-[#D6BCFA]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div>
            <h2 className="text-base md:text-lg font-semibold mb-1 flex items-center">
              <PlusCircle className="h-4 w-4 md:h-5 md:w-5 text-[#9b87f5] mr-2" />
              Introducing Wellness+
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground">
              Experience our new emotional & mental wellbeing tools for deeper self-reflection and support.
            </p>
          </div>
          <Link to="/wellness/plus">
            <Button className="bg-[#9b87f5] hover:bg-[#7E69AB] text-sm h-9 px-4">
              Try Wellness+
            </Button>
          </Link>
        </div>
        
        {/* Welcome Banner */}
        <WelcomeBanner />
        
        {/* Main Content Sections */}
        <Tabs defaultValue="featured" className="mt-8 md:mt-12">
          <TabsList className="mb-6 w-full justify-start overflow-x-auto">
            <TabsTrigger value="featured" className="flex gap-2">
              <Sparkles className="h-4 w-4" />
              Featured
            </TabsTrigger>
            <TabsTrigger value="daily" className="flex gap-2">
              <Leaf className="h-4 w-4" />
              Daily Dose
            </TabsTrigger>
            <TabsTrigger value="books" className="flex gap-2">
              <FileText className="h-4 w-4" />
              Books
            </TabsTrigger>
            <TabsTrigger value="sessions" className="flex gap-2">
              <Calendar className="h-4 w-4" />
              Book a Session
            </TabsTrigger>
            <TabsTrigger value="ask" className="flex gap-2">
              <Heart className="h-4 w-4" />
              Ask Chioma
            </TabsTrigger>
          </TabsList>
          
          {/* Featured Content Tab */}
          <TabsContent value="featured">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Featured Content</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {featuredContent.map((content) => (
                <ContentCard key={content.id} content={content} />
              ))}
            </div>
          </TabsContent>
          
          {/* Daily Dose Tab */}
          <TabsContent value="daily">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Daily Dose from Chioma</h2>
            <Carousel className="w-full">
              <CarouselContent>
                {dailyDoses.map((dose) => (
                  <CarouselItem key={dose.id} className="sm:basis-1/2 lg:basis-1/3 pl-4">
                    <DailyDoseCard dose={dose} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="mt-4 flex justify-end gap-2">
                <CarouselPrevious className="relative static transform-none" />
                <CarouselNext className="relative static transform-none" />
              </div>
            </Carousel>
          </TabsContent>
          
          {/* Books Tab */}
          <TabsContent value="books">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Books & Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </TabsContent>
          
          {/* Book a Session Tab */}
          <TabsContent value="sessions">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Book a Counseling Session</h2>
            <SessionBookingForm />
          </TabsContent>
          
          {/* Ask Chioma Tab */}
          <TabsContent value="ask">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Ask Chioma</h2>
            <AskChiomaSection />
          </TabsContent>
        </Tabs>
        
        {/* Testimonials Section */}
        <section className="mt-12 md:mt-16 mb-10">
          <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Testimonials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </section>
        
        {/* Add padding at bottom for mobile view to account for bottom navigation */}
        {isMobile && <div className="h-16"></div>}
      </div>
    </AppLayout>
  );
};

export default Wellness;
