
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Unmute T-Shirt",
    description: "Comfortable cotton tee with the Unmute logo",
    price: 24.99,
    image: "https://placehold.co/400x400/e2e8f0/1e293b?text=Unmute+Tshirt",
    category: "clothing"
  },
  {
    id: "2",
    name: "Expression Journal",
    description: "Premium journal for your daily thoughts",
    price: 18.99,
    image: "https://placehold.co/400x400/e2e8f0/1e293b?text=Journal",
    category: "accessories"
  },
  {
    id: "3",
    name: "Digital Wellness Pack",
    description: "Audio meditations and wellness guides",
    price: 14.99,
    image: "https://placehold.co/400x400/e2e8f0/1e293b?text=Digital+Pack",
    category: "digital"
  },
  {
    id: "4",
    name: "Unmute Hoodie",
    description: "Cozy hoodie perfect for any season",
    price: 39.99,
    image: "https://placehold.co/400x400/e2e8f0/1e293b?text=Hoodie",
    category: "clothing"
  },
  {
    id: "5",
    name: "Premium Membership",
    description: "1 year of premium features and exclusive content",
    price: 49.99,
    image: "https://placehold.co/400x400/e2e8f0/1e293b?text=Premium",
    category: "membership"
  },
  {
    id: "6",
    name: "Unmute Water Bottle",
    description: "Sustainable water bottle with our logo",
    price: 22.99,
    image: "https://placehold.co/400x400/e2e8f0/1e293b?text=Water+Bottle",
    category: "accessories"
  }
];

const ProductGrid = () => {
  const handleAddToCart = (product: Product) => {
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mockProducts.map((product) => (
        <Card key={product.id} className="overflow-hidden transition-all hover:shadow-md">
          <div className="aspect-square overflow-hidden">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform hover:scale-105"
            />
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg">{product.name}</h3>
            <p className="text-gray-500 text-sm mb-2">{product.description}</p>
            <p className="font-bold">${product.price.toFixed(2)}</p>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button 
              className="w-full flex items-center gap-2"
              onClick={() => handleAddToCart(product)}
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ProductGrid;
