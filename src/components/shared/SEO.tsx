
import React from "react";
import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  keywords?: string[];
  ogType?: string;
  ogImage?: string;
  twitterCard?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = "Unmute | Speak your truth, find your community",
  description = "Join Unmute - the authentic social platform where your voice matters. Express yourself authentically and connect meaningfully with a supportive community.",
  canonicalUrl = "https://unmutelife.online",
  keywords = ["unmute", "social media", "authentic connection", "mental health", "community", "voice", "expression", "wellness"],
  ogType = "website",
  ogImage = "https://lovable-uploads.s3.amazonaws.com/08c4eb5b-4415-4b24-95f0-9dcb194018b2.png",
  twitterCard = "summary_large_image",
}) => {
  return (
    <>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(", ")} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Unmute" />

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:creator" content="@unmutelife" />

      {/* Mobile Specific */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="Unmute" />
      
      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Unmute" />
    </>
  );
};

export default SEO;
