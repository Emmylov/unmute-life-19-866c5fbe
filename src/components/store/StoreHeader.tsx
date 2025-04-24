
import React from "react";
import { ShoppingBag, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

const StoreHeader = () => {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <ShoppingBag className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Unmute Store</h1>
        </div>
        <Button size="sm" variant="outline" className="flex items-center gap-2">
          <Info className="h-4 w-4" />
          <span>How It Works</span>
        </Button>
      </div>
      
      <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl">
        Express yourself with official Unmute merchandise. All purchases support our mission to create 
        a more authentic social space where everyone feels heard.
      </p>
      
      <div className="flex flex-wrap gap-3 mb-6">
        <Button variant="outline" className="rounded-full">All Items</Button>
        <Button variant="ghost" className="rounded-full">Clothing</Button>
        <Button variant="ghost" className="rounded-full">Accessories</Button>
        <Button variant="ghost" className="rounded-full">Digital</Button>
        <Button variant="ghost" className="rounded-full">Membership</Button>
      </div>
    </div>
  );
};

export default StoreHeader;
