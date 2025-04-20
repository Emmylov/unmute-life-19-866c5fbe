
import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQSectionProps {
  className?: string;
}

const FAQSection = ({ className }: FAQSectionProps) => {
  const faqs = [
    {
      question: "Is Unmute free?",
      answer: "Yes! Unmute is completely free to use. We have optional premium features planned for the future, but the core platform will always be free for everyone."
    },
    {
      question: "Can I post anonymously?",
      answer: "Absolutely! We understand that sometimes vulnerability requires privacy. You can choose to post anonymously on specific content while maintaining your profile for other interactions."
    },
    {
      question: "Is it safe?",
      answer: "We've built Unmute with safety as a top priority. We have community guidelines, content moderation, and privacy settings to help you control your experience and keep it positive. Your wellbeing matters to us."
    },
    {
      question: "Can I delete a post?",
      answer: "Yes, you have complete control over your content. You can delete any of your posts at any time, without any trace left on the platform."
    },
    {
      question: "What makes Unmute different?",
      answer: "Unmute focuses on emotional wellbeing and authentic expression. Instead of likes and follower counts, we emphasize meaningful interactions and community support. Our platform integrates wellness tools directly into your social experience."
    }
  ];

  return (
    <section className={className}>
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about joining the Unmute community
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-lg border border-white/40">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium text-lg">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
