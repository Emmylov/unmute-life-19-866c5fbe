
import React from "react";
import { Helmet } from "react-helmet-async";
import AppLayout from "@/components/layout/AppLayout";
import StoreHeader from "@/components/store/StoreHeader";
import ProductGrid from "@/components/store/ProductGrid";
import SEO from "@/components/shared/SEO";

const Store = () => {
  return (
    <AppLayout>
      <SEO 
        title="Unmute Store | Express yourself with our merchandise"
        description="Shop the official Unmute store for clothing, accessories, and digital products that help you express yourself authentically."
        keywords={["unmute store", "merchandise", "online shop", "express yourself", "digital products"]}
      />
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <StoreHeader />
        <ProductGrid />
      </div>
    </AppLayout>
  );
};

export default Store;
