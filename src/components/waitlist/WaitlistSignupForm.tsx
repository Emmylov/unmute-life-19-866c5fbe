
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { supabase, SUPABASE_URL, SUPABASE_KEY } from "@/integrations/supabase/client";

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
      const { error: waitlistError } = await supabase
        .from('waitlist')
        .insert({
          name: values.name,
          email: values.email
        });
      
      if (waitlistError) {
        console.error("Error adding to waitlist:", waitlistError);
        throw waitlistError;
      }
      
      console.log("Successfully added to waitlist, now sending welcome email");
      
      toast.success("You're on the list!", {
        description: "Your spot is reserved for the OG Starter Pack!"
      });
      
      try {
        console.log("Calling send-welcome-email function with:", values);
        
        const emailEndpoint = `${SUPABASE_URL}/functions/v1/send-welcome-email`;
        console.log("Email endpoint:", emailEndpoint);
        
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
        
        console.log("Response status:", response.status);
        
        const responseText = await response.text();
        console.log("Raw response:", responseText);
        
        let responseData;
        try {
          responseData = JSON.parse(responseText);
          console.log("Parsed response data:", responseData);
        } catch (e) {
          console.error("Error parsing response:", e);
        }
        
        if (response.ok) {
          console.log("Email sent successfully");
          toast.success("Welcome email sent!", {
            description: "Check your inbox for your OG Starter Pack confirmation."
          });
        } else {
          console.error("Email sending failed with status:", response.status);
          console.error("Response data:", responseData);
          toast.error("Couldn't send welcome email", {
            description: "But don't worry, you're still on the list!"
          });
        }
      } catch (emailError) {
        console.error("Error sending welcome email:", emailError);
        toast.error("Couldn't send welcome email", {
          description: "But don't worry, you're still on the list!"
        });
      }
      
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Something went wrong", {
        description: "Please try again or contact support."
      });
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
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="unmute-primary-button w-full h-12 text-lg font-medium"
            disabled={submitting}
            aria-label="Join waitlist"
          >
            {submitting ? "Adding you..." : "Unmute Me"}
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
