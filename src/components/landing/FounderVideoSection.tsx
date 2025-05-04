
import React, { useState } from "react";
import { Video, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const FounderVideoSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">A Message from Our Founder</h2>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
            Hear directly from Ella about why Unmute was created and the vision behind this movement.
          </p>
          
          <Button 
            onClick={() => setIsModalOpen(true)}
            variant="outline" 
            size="lg"
            className="border-2 border-unmute-purple text-unmute-purple hover:bg-unmute-purple/10 px-6 py-6 h-auto flex items-center gap-2 mx-auto rounded-xl"
          >
            <Video className="w-5 h-5" />
            Watch My Story (2 min)
          </Button>
        </div>
      </div>
      
      {/* Video Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative bg-white rounded-xl overflow-hidden w-full max-w-4xl">
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-4 right-4 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="aspect-w-16 aspect-h-9">
              <iframe 
                className="w-full h-full"
                src="https://lovable-uploads.s3.amazonaws.com/default/founder-story.mp4" 
                title="Founder Story"
                allowFullScreen
              ></iframe>
            </div>
            
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2">A Message from Ella</h3>
              <p className="text-gray-600">
                "I'm Ella. I'm 16. I built Unmute because I was tired of being silenced. This is more than an app — it's our space. For everyone who's ever felt like their voice didn't matter, welcome home."
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default FounderVideoSection;
