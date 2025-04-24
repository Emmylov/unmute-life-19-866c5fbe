
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import SEO from "@/components/shared/SEO";
import { motion } from "framer-motion";

const WellnessPlus = () => {
  return (
    <AppLayout>
      <SEO
        title="Wellness Plus | Unmute"
        description="Premium wellness features and content on Unmute"
        canonicalUrl="https://unmutelife.online/wellness-plus"
      />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Heart className="h-6 w-6 mr-2 text-pink-500" />
              <h1 className="text-2xl font-bold">Wellness Plus</h1>
              <Sparkles className="h-5 w-5 ml-2 text-yellow-500" />
            </div>
            <p className="text-gray-600">
              Elevate your wellness journey with premium features and personalized guidance.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-2 rounded-full mr-4">
                    <Sparkles className="h-5 w-5 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-semibold">Premium Wellness Features</h3>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-gray-600">
                    <span className="text-green-500 mr-2">✓</span> 
                    Advanced mood tracking
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="text-green-500 mr-2">✓</span> 
                    Personalized wellness recommendations
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="text-green-500 mr-2">✓</span> 
                    Wellness coach access
                  </li>
                  <li className="flex items-center text-gray-600">
                    <Lock className="h-3 w-3 mr-2 text-gray-400" />
                    Premium wellness content
                  </li>
                </ul>
                <Button className="w-full">Subscribe to Wellness Plus</Button>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-purple-100 p-2 rounded-full mr-4">
                    <Heart className="h-5 w-5 text-purple-500" />
                  </div>
                  <h3 className="text-lg font-semibold">Premium Wellness Content</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Access exclusive guided meditations, wellness courses, and expert advice.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="bg-gray-100 rounded-lg p-3 flex items-center">
                    <Lock className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-gray-500">Advanced Resilience Training</span>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3 flex items-center">
                    <Lock className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-gray-500">Wellness Expert Q&A Sessions</span>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3 flex items-center">
                    <Lock className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-gray-500">Premium Meditation Library</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Learn More
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mb-8">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Coming Soon to Wellness Plus</h3>
              <div className="space-y-4">
                <p className="text-gray-600">
                  We're constantly adding new features to enhance your wellness journey:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">•</span>
                    <span className="text-gray-600">AI-powered wellness coach</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">•</span>
                    <span className="text-gray-600">Integration with fitness trackers</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">•</span>
                    <span className="text-gray-600">Personalized nutrition recommendations</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </AppLayout>
  );
};

export default WellnessPlus;
