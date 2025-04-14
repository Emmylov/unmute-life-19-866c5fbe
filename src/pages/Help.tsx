
import React, { useState } from "react";
import { Search, BookOpen, Settings, Lock, FileText, Video, MessageCircle, Flag, Ban, UserRound, Tool, Newspaper, Medal, Gift, Bot, Bug } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const Help = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const helpCategories = [
    {
      title: "Getting Started",
      icon: <BookOpen className="h-5 w-5" />,
      description: "Learn the basics of using Unmute",
      articles: [
        { title: "Creating your account", link: "#" },
        { title: "Setting up your profile", link: "#" },
        { title: "Finding and following friends", link: "#" },
        { title: "Your first post", link: "#" }
      ]
    },
    {
      title: "Privacy & Safety",
      icon: <Lock className="h-5 w-5" />,
      description: "Stay safe while using Unmute",
      articles: [
        { title: "Privacy settings guide", link: "#" },
        { title: "Blocking and reporting", link: "#" },
        { title: "Content moderation", link: "#" },
        { title: "Data protection", link: "#" }
      ]
    },
    {
      title: "Content Creation",
      icon: <Video className="h-5 w-5" />,
      description: "Tips for making great content",
      articles: [
        { title: "Creating reels", link: "#" },
        { title: "Using audio and music", link: "#" },
        { title: "Editing tools guide", link: "#" },
        { title: "Content guidelines", link: "#" }
      ]
    },
    {
      title: "Wellness Features",
      icon: <MessageCircle className="h-5 w-5" />,
      description: "Mental health and wellbeing tools",
      articles: [
        { title: "Using Wellness+", link: "#" },
        { title: "Daily check-ins", link: "#" },
        { title: "Support circles", link: "#" },
        { title: "Mental health resources", link: "#" }
      ]
    }
  ];

  return (
    <AppLayout pageTitle="Help Center">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">How can we help you?</h1>
          <p className="text-gray-600 mb-6">
            Search our help center or browse categories below
          </p>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for help articles..."
              className="pl-10 py-6 text-lg rounded-xl"
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {helpCategories.map((category) => (
            <Card key={category.title} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    {category.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {category.articles.map((article) => (
                    <li key={article.title}>
                      <a href={article.link} className="text-sm text-gray-600 hover:text-primary">
                        {article.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Articles */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Featured Articles</CardTitle>
            <CardDescription>Most popular help articles and guides</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {[
                { icon: <Medal className="h-4 w-4" />, title: "Getting Started with Unmute", badge: "Popular" },
                { icon: <Gift className="h-4 w-4" />, title: "Wellness+ Features Guide", badge: "New" },
                { icon: <Bot className="h-4 w-4" />, title: "Understanding Content Guidelines", badge: "Essential" },
                { icon: <Bug className="h-4 w-4" />, title: "Reporting Technical Issues", badge: "Support" }
              ].map((article) => (
                <div key={article.title} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gray-100">
                      {article.icon}
                    </div>
                    <span className="font-medium">{article.title}</span>
                  </div>
                  <Badge variant="secondary">{article.badge}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card>
          <CardHeader>
            <CardTitle>Still need help?</CardTitle>
            <CardDescription>Get in touch with our support team</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button variant="outline" className="flex-1">
              <MessageCircle className="mr-2 h-4 w-4" />
              Contact Support
            </Button>
            <Button variant="outline" className="flex-1">
              <Flag className="mr-2 h-4 w-4" />
              Report an Issue
            </Button>
            <Button variant="outline" className="flex-1">
              <Tool className="mr-2 h-4 w-4" />
              Technical Support
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Help;
