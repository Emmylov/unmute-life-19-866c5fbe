
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";

interface Testimonial {
  id: number;
  quote: string;
  author: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote: "Unmute helped me reclaim my peace.",
    author: "Jamie, 19"
  },
  {
    id: 2,
    quote: "Finally a space where I can express myself without fear.",
    author: "Alex, 22"
  },
  {
    id: 3,
    quote: "The most supportive community I've ever been part of online.",
    author: "Taylor, 25"
  },
  {
    id: 4,
    quote: "I've never felt more heard than in the Unmute beta.",
    author: "Jordan, 17"
  }
];

const TestimonialSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Auto-advance testimonials
  useEffect(() => {
    const timer = setTimeout(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentIndex]);

  const goToPrevious = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-2xl glass-card p-8 md:p-12 min-h-[16rem] md:min-h-[14rem] flex items-center">
        <AnimatePresence custom={direction} initial={false} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="text-center"
          >
            <Quote className="mx-auto mb-4 text-unmute-purple/40 h-10 w-10" />
            <p className="text-xl md:text-2xl mb-6 font-medium">
              "{testimonials[currentIndex].quote}"
            </p>
            <p className="text-muted-foreground">
              — {testimonials[currentIndex].author}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center mt-6 gap-2">
        <button
          onClick={goToPrevious}
          className="p-2 rounded-full bg-muted hover:bg-secondary transition-colors"
          aria-label="Previous testimonial"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-1">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-unmute-purple w-4"
                  : "bg-muted"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
        
        <button
          onClick={goToNext}
          className="p-2 rounded-full bg-muted hover:bg-secondary transition-colors"
          aria-label="Next testimonial"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default TestimonialSlider;
