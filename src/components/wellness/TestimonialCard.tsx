
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Star, Quote } from 'lucide-react';

interface TestimonialProps {
  id: string;
  name: string;
  imageUrl?: string;
  text: string;
  rating: number;
}

interface TestimonialCardProps {
  testimonial: TestimonialProps;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  return (
    <Card className="overflow-hidden bg-[#F1F0FB]/50">
      <CardHeader className="pb-2 flex flex-row items-center gap-4">
        {testimonial.imageUrl ? (
          <div className="h-12 w-12 rounded-full overflow-hidden">
            <img 
              src={testimonial.imageUrl} 
              alt={testimonial.name}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="h-12 w-12 rounded-full bg-[#E5DEFF] flex items-center justify-center">
            <span className="text-lg font-semibold text-[#7E69AB]">
              {testimonial.name.charAt(0)}
            </span>
          </div>
        )}
        <div>
          <h3 className="font-medium">{testimonial.name}</h3>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-3 w-3 ${i < testimonial.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
              />
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <Quote className="absolute top-0 left-0 h-6 w-6 text-[#D6BCFA]/50 -translate-x-2 -translate-y-2" />
          <p className="text-sm pl-4 italic">&ldquo;{testimonial.text}&rdquo;</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard;
