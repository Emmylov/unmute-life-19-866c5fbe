
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

// Initialize the Resend client with the API key
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const resend = new Resend(RESEND_API_KEY);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  name: string;
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Function invoked with method:", req.method);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("Handling OPTIONS request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Processing welcome email request");
    
    // Check if API key is available
    if (!RESEND_API_KEY) {
      console.error("Missing RESEND_API_KEY environment variable");
      throw new Error("Email service not configured properly");
    }
    console.log("API key is available");

    // Parse the request body
    const requestBody = await req.json().catch(e => {
      console.error("Error parsing request body:", e);
      throw new Error("Invalid request body format");
    });
    
    console.log("Received request body:", JSON.stringify(requestBody));
    
    const { name, email } = requestBody as WelcomeEmailRequest;
    
    if (!name || !email) {
      console.error("Missing required fields:", { name, email });
      throw new Error("Name and email are required");
    }

    if (!email.includes('@') || email.length < 5) {
      console.error("Invalid email format:", email);
      throw new Error("Valid email is required");
    }

    console.log(`Sending welcome email to ${name} <${email}>`);
    
    // Send the email
    console.log("About to send email with Resend");
    const emailResponse = await resend.emails.send({
      from: "Unmute <hello@unmute.app>", 
      to: [email],
      subject: "Welcome to Unmute! 💜",
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <div style="background: linear-gradient(135deg, #8a63d2 0%, #e23a98 100%); padding: 2px; border-radius: 12px;">
            <div style="background-color: white; border-radius: 10px; padding: 30px;">
              <h1 style="color: #8a63d2; font-size: 24px; margin-bottom: 20px;">Hey ${name}! 👋</h1>
              
              <p style="font-size: 16px; line-height: 1.5; margin-bottom: 25px;">
                Thank you for joining the Unmute movement! We're so excited to have you as one of our OG members.
              </p>
              
              <p style="font-size: 16px; line-height: 1.5; margin-bottom: 25px;">
                We're building a social space where you can truly express yourself without the toxicity and noise. 
                Unmute is all about reclaiming your digital peace and connecting authentically.
              </p>
              
              <div style="background-color: #f9f5ff; border-left: 4px solid #8a63d2; padding: 15px; margin-bottom: 25px; border-radius: 4px;">
                <p style="font-size: 16px; margin: 0;">
                  <strong>Your Unmute OG Starter Pack will be delivered to your inbox closer to launch!</strong>
                </p>
              </div>
              
              <p style="font-size: 16px; line-height: 1.5; margin-bottom: 25px;">
                We can't wait to unveil Unmute on <strong>April 18th, 2025</strong>. Keep an eye on your inbox - we'll be sharing exclusive content and early access with our OG community before our public launch.
              </p>
              
              <p style="font-size: 16px; line-height: 1.5;">
                With gratitude,<br>
                The Unmute Team 💜
              </p>
            </div>
          </div>
          
          <div style="text-align: center; padding-top: 20px; font-size: 12px; color: #666;">
            <p>© 2025 Unmute. All rights reserved.</p>
          </div>
        </div>
      `,
    }).catch(error => {
      console.error("Error in sending email:", error);
      throw new Error(`Failed to send email: ${error.message}`);
    });

    console.log("Email sending response:", JSON.stringify(emailResponse));

    // Return success response
    return new Response(JSON.stringify({ 
      success: true,
      message: "Welcome email sent successfully", 
      data: emailResponse 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-welcome-email function:", error);
    console.error("Error details:", error.message);
    if (error.response) {
      console.error("Error response:", JSON.stringify(error.response));
    }
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || "An unknown error occurred",
        details: error.response || null
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
