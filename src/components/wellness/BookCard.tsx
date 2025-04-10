
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ShoppingCart, Star } from 'lucide-react';

interface BookProps {
  id: string;
  title: string;
  coverUrl: string;
  description: string;
  price: number;
  rating: number;
  previewUrl: string;
}

interface BookCardProps {
  book: BookProps;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const handleDownloadPreview = () => {
    console.log("Downloading preview of", book.title);
    window.open(book.previewUrl, "_blank");
  };
  
  const handlePurchase = () => {
    console.log("Purchasing", book.title);
    // Payment flow would be initiated here
  };
  
  return (
    <Card className="overflow-hidden flex flex-col md:flex-row h-full">
      <div className="w-full md:w-1/3 p-4 flex justify-center">
        <img 
          src={book.coverUrl} 
          alt={book.title}
          className="object-contain h-64 md:h-auto max-w-full rounded shadow-sm"
        />
      </div>
      <div className="flex flex-col w-full md:w-2/3">
        <CardHeader className="pb-2">
          <CardTitle>{book.title}</CardTitle>
          <CardDescription className="flex">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-4 w-4 ${i < book.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
              />
            ))}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm">{book.description}</p>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-2 pt-2">
          <Button 
            variant="outline" 
            className="w-full sm:w-auto flex gap-2"
            onClick={handleDownloadPreview}
          >
            <Download className="h-4 w-4" />
            Free Preview
          </Button>
          <Button 
            className="w-full sm:w-auto flex gap-2 bg-[#9b87f5] hover:bg-[#7E69AB]"
            onClick={handlePurchase}
          >
            <ShoppingCart className="h-4 w-4" />
            Buy for ₦{book.price.toLocaleString()}
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
};

export default BookCard;
