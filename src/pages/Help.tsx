
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircleQuestion, Search, Mail, BookOpen, Video, HelpCircle, ExternalLink } from "lucide-react";

const Help = () => {
  const faqItems = [
    {
      question: "How do I create an account?",
      answer: "To create an account, click on the 'Sign In' button in the top right corner and then select 'Create Account'. You can sign up using your email address or by connecting your Google account."
    },
    {
      question: "How do I post a reel?",
      answer: "To post a reel, click on the 'Create' button in the navigation bar, then select 'Reel'. You can upload a video from your device, add captions, music, and effects before posting."
    },
    {
      question: "What are the community guidelines?",
      answer: "Our community guidelines are designed to keep Unmute safe and supportive. We do not allow hate speech, bullying, harassment, violent content, or any form of discrimination. Always be respectful and considerate of others."
    },
    {
      question: "How do I report inappropriate content?",
      answer: "To report inappropriate content, click on the three dots (more options) next to the post, comment, or profile and select 'Report'. Choose the appropriate reason for reporting and submit."
    },
    {
      question: "How can I control who sees my content?",
      answer: "You can control your privacy settings by going to Settings > Privacy. From there, you can make your account private, control who can comment on your posts, and manage other privacy preferences."
    },
    {
      question: "Can I delete my account?",
      answer: "Yes, you can delete your account by going to Settings > Security > Deactivate Account. Please note that this action is permanent and cannot be undone once completed."
    },
    {
      question: "What is a Vibe Check?",
      answer: "Vibe Check is a feature that helps you express and track your mood and emotional wellbeing. You can access it through the Vibe Check tab in the navigation bar. It's a safe space to reflect on how you're feeling."
    },
    {
      question: "How does the Wellness feature work?",
      answer: "The Wellness feature provides resources and support for mental health and wellbeing. You can access guided meditations, journaling prompts, and connect with mental health professionals through the Wellness tab."
    }
  ];

  const helpCategories = [
    {
      title: "Getting Started",
      icon: <BookOpen className="h-5 w-5" />,
      description: "Learn the basics of using Unmute"
    },
    {
      title: "Account Settings",
      icon: <HelpCircle className="h-5 w-5" />,
      description: "Manage your profile and preferences"
    },
    {
      title: "Privacy & Safety",
      icon: <MessageCircleQuestion className="h-5 w-5" />,
      description: "Stay safe while using Unmute"
    },
    {
      title: "Creating Content",
      icon: <Video className="h-5 w-5" />,
      description: "Tips for making great posts and reels"
    }
  ];

  return (
    <AppLayout pageTitle="Help & Support">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Help & Support</h1>
          <p className="text-gray-600">
            Find answers to common questions or contact our support team
          </p>
        </div>
        
        {/* Search bar */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input 
            type="text"
            placeholder="Search for help with..."
            className="pl-10 bg-white border border-gray-200 focus-visible:ring-unmute-purple/30 rounded-lg w-full h-12 text-lg"
          />
        </div>
        
        {/* Help categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {helpCategories.map((category, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-unmute-purple/10 mb-4 text-unmute-purple">
                  {category.icon}
                </div>
                <h3 className="font-medium mb-2">{category.title}</h3>
                <p className="text-gray-500 text-sm">{category.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* FAQ Section */}
        <Card className="mb-10">
          <CardHeader>
            <CardTitle className="text-xl">Frequently Asked Questions</CardTitle>
            <CardDescription>Quick answers to common questions</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-medium">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
        
        {/* Contact Support */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-unmute-purple" />
                Email Support
              </CardTitle>
              <CardDescription>Get help from our support team</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-gray-600">
                Our support team typically responds within 24 hours on weekdays.
              </p>
              <Button className="w-full">Contact Support</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-unmute-purple" />
                Help Center
              </CardTitle>
              <CardDescription>Browse detailed guides and resources</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-gray-600">
                Find in-depth guides, tutorials, and troubleshooting tips in our Help Center.
              </p>
              <Button variant="outline" className="w-full flex items-center gap-2">
                Visit Help Center
                <ExternalLink className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Community Support */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Community Support</CardTitle>
            <CardDescription>Connect with other users and find solutions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-600">
              Join our community forums to connect with other Unmute users, share tips, and find solutions to common issues. Our community moderators are also there to help.
            </p>
            <Button variant="outline" className="flex items-center gap-2">
              Join Community Forums
              <ExternalLink className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Help;
