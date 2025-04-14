
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { supabase, SUPABASE_URL, SUPABASE_KEY } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { handleApiError, safeAsync } from "@/utils/error-handler";

const signupSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email")
});

type SignupFormValues = z.infer<typeof signupSchema>;

interface WaitlistSignupFormProps {
  className?: string;
}

const WaitlistSignupForm = ({ className }: WaitlistSignupFormProps) => {
  const [submitting, setSubmitting] = useState(false);
  
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: ""
    }
  });

  const onSubmit = async (values: SignupFormValues) => {
    setSubmitting(true);
    
    try {
      // First check if email is already in waitlist to prevent duplicates
      const { data: existingEntries, error: fetchError } = await supabase
        .from('waitlist')
        .select('*')
        .eq('email', values.email);
      
      if (fetchError) {
        throw fetchError;
      }
      
      if (existingEntries && existingEntries.length > 0) {
        toast.info("You're already on our list!", {
          description: "We have your information and will contact you soon."
        });
        form.reset();
        return;
      }
      
      // Add to waitlist
      const { error: waitlistError } = await supabase
        .from('waitlist')
        .insert({
          name: values.name,
          email: values.email
        });
      
      if (waitlistError) {
        throw waitlistError;
      }
      
      console.log("Successfully added to waitlist, now sending welcome email");
      
      toast.success("You're on the list!", {
        description: "Your spot is reserved for the OG Starter Pack!"
      });
      
      // Send welcome email using the safer async approach
      const { error: emailError } = await safeAsync(async () => {
        const emailEndpoint = `${SUPABASE_URL}/functions/v1/send-welcome-email`;
        
        const response = await fetch(emailEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_KEY}`
          },
          body: JSON.stringify({
            name: values.name,
            email: values.email
          })
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Email sending failed: ${errorText}`);
        }
        
        return response.json();
      });
      
      if (!emailError) {
        toast.success("Welcome email sent!", {
          description: "Check your inbox for your OG Starter Pack confirmation."
        });
      }
      
      form.reset();
    } catch (error) {
      handleApiError(error, "Failed to join waitlist");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 relative overflow-hidden border border-white/60 ${className}`}>
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-unmute-purple/20 rounded-full blur-xl"></div>
      <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-unmute-pink/20 rounded-full blur-lg"></div>
      
      <h3 className="text-xl font-bold mb-4">Reserve Your Spot</h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input 
                    placeholder="Your name" 
                    {...field}
                    className="h-12 text-base"
                    aria-label="Your name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input 
                    placeholder="Your email" 
                    type="email" 
                    {...field}
                    className="h-12 text-base"
                    aria-label="Your email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="unmute-primary-button w-full h-12 text-lg font-medium"
            disabled={submitting}
            aria-label="Join waitlist"
          >
            {submitting ? (
              <div className="flex items-center justify-center gap-2">
                <LoadingSpinner size="small" color="white" />
                <span>Adding you...</span>
              </div>
            ) : "Unmute Me"}
          </Button>
        </form>
      </Form>
      
      <div className="mt-4 text-sm text-gray-500">
        We'll send you early access information closer to launch.
      </div>
    </div>
  );
};

export default WaitlistSignupForm;
