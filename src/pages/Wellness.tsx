
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Leaf, Sparkles, Calendar, Play, FileText, Headphones } from 'lucide-react';
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
import WelcomeBanner from "@/components/wellness/WelcomeBanner";
import ContentCard from "@/components/wellness/ContentCard";
import DailyDoseCard from "@/components/wellness/DailyDoseCard";
import BookCard from "@/components/wellness/BookCard";
import TestimonialCard from "@/components/wellness/TestimonialCard";
import SessionBookingForm from "@/components/wellness/SessionBookingForm";
import AskChiomaSection from "@/components/wellness/AskChiomaSection";

const Wellness = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-10 max-w-7xl">
      {/* Welcome Banner */}
      <WelcomeBanner />
      
      {/* Main Content Sections */}
      <Tabs defaultValue="featured" className="mt-12">
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
          <h2 className="text-2xl font-semibold mb-6">Featured Content</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {featuredContent.map((content) => (
              <ContentCard key={content.id} content={content} />
            ))}
          </div>
        </TabsContent>
        
        {/* Daily Dose Tab */}
        <TabsContent value="daily">
          <h2 className="text-2xl font-semibold mb-6">Daily Dose from Chioma</h2>
          <Carousel className="w-full">
            <CarouselContent>
              {dailyDoses.map((dose) => (
                <CarouselItem key={dose.id} className="md:basis-1/2 lg:basis-1/3">
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
          <h2 className="text-2xl font-semibold mb-6">Books & Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </TabsContent>
        
        {/* Book a Session Tab */}
        <TabsContent value="sessions">
          <h2 className="text-2xl font-semibold mb-6">Book a Counseling Session</h2>
          <SessionBookingForm />
        </TabsContent>
        
        {/* Ask Chioma Tab */}
        <TabsContent value="ask">
          <h2 className="text-2xl font-semibold mb-6">Ask Chioma</h2>
          <AskChiomaSection />
        </TabsContent>
      </Tabs>
      
      {/* Testimonials Section */}
      <section className="mt-16 mb-10">
        <h2 className="text-2xl font-semibold mb-6">Testimonials</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Wellness;
