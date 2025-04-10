
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  question: z.string().min(10, { message: "Question must be at least 10 characters long" }),
  isAnonymous: z.boolean().default(false),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms",
  }),
});

type FormValues = z.infer<typeof formSchema>;

// Sample questions and answers for demo
const previousQuestions = [
  {
    id: "q1",
    question: "How do I handle anxiety during social gatherings?",
    answer: "Start by identifying what specifically triggers your anxiety. Practice deep breathing techniques before events, and give yourself permission to step outside for short breaks if needed. Remember that most people are focused on themselves, not judging you.",
    userName: "Anonymous",
    date: "2 days ago",
    likes: 12
  },
  {
    id: "q2",
    question: "What's the proper etiquette for responding to a formal dinner invitation?",
    answer: "Always respond within 24-48 hours of receiving the invitation. Use similar formality in your response as was used in the invitation. If declining, express gratitude for being invited and briefly explain why you can't attend. If accepting, confirm the date, time, and any other details mentioned in the invitation.",
    userName: "Jessica T.",
    date: "1 week ago",
    likes: 24
  },
  {
    id: "q3",
    question: "How can I establish better boundaries with family members?",
    answer: "Begin by clarifying your own needs and limits. Communicate these boundaries clearly and directly, using 'I' statements rather than accusations. Be consistent in enforcing boundaries, and remember that it's okay to say no. Healthy relationships require mutual respect for each other's boundaries.",
    userName: "Michael K.",
    date: "2 weeks ago",
    likes: 31
  }
];

const AskChiomaSection = () => {
  const { toast } = useToast();
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
      isAnonymous: false,
      agreeToTerms: false,
    },
  });
  
  const onSubmit = (data: FormValues) => {
    console.log("Question submitted:", data);
    
    toast({
      title: "Question submitted",
      description: "Chioma will answer your question soon.",
    });
    
    form.reset();
  };
  
  const toggleQuestion = (id: string) => {
    setExpandedQuestion(expandedQuestion === id ? null : id);
  };
  
  const handleLike = (id: string) => {
    console.log("Liked question:", id);
    toast({
      title: "Thanks for your feedback",
      description: "Your like has been recorded.",
    });
  };
  
  return (
    <div className="space-y-8">
      {/* Ask a question form */}
      <Card>
        <CardHeader>
          <CardTitle>Ask Chioma a Question</CardTitle>
          <CardDescription>
            Get personalized advice from Chioma on wellness, etiquette, or personal development
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Question</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="What would you like to ask Chioma?"
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="isAnonymous"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Ask Anonymously</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Your name will not be displayed publicly
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="agreeToTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          I agree that my question may be shared publicly (with or without my name, based on the anonymous setting)
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              
              <Button type="submit" className="w-full bg-[#9b87f5] hover:bg-[#7E69AB]">
                Submit Question
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {/* Previous questions and answers */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Previous Questions</h3>
        
        {previousQuestions.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between">
                <div>
                  <CardTitle className="text-base">{item.question}</CardTitle>
                  <CardDescription>
                    Asked by {item.userName} • {item.date}
                  </CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => toggleQuestion(item.id)}
                >
                  {expandedQuestion === item.id ? "Hide" : "Show"} Answer
                </Button>
              </div>
            </CardHeader>
            
            {expandedQuestion === item.id && (
              <CardContent>
                <div className="border-l-4 border-[#D6BCFA] pl-4 py-2 bg-[#F1F0FB]/30 rounded-r">
                  <p className="text-sm font-semibold mb-1">Chioma says:</p>
                  <p className="text-sm">{item.answer}</p>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-muted-foreground"
                    onClick={() => handleLike(item.id)}
                  >
                    Helpful ({item.likes})
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AskChiomaSection;
