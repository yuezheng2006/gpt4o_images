import { ImageItem } from '../types';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Copy } from 'lucide-react';
import { toast } from './ui/use-toast';

interface ImageCardProps {
  image: ImageItem;
  onClick: () => void;
}

export function ImageCard({ image, onClick }: ImageCardProps) {
  const copyPrompt = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(image.prompt);
    toast({
      title: "已复制提示词",
      description: "提示词已复制到剪贴板",
      duration: 2000,
    });
  };

  return (
    <Card 
      className="overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl relative group image-card"
      onClick={onClick}
    >
      <CardContent className="p-0 relative">
        <img 
          src={image.imagePath} 
          alt={image.title} 
          className="w-full h-64 object-cover"
        />
        
        <div className="p-4">
          <h3 className="font-bold text-lg">{image.title}</h3>
          <p className="text-sm text-gray-500">by {image.author}</p>
        </div>

        <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center p-4 image-card-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="text-white text-sm mb-4 max-h-40 overflow-y-auto">
            <p className="font-bold mb-2">提示词:</p>
            <p className="whitespace-pre-wrap">{image.prompt.length > 150 ? `${image.prompt.substring(0, 150)}...` : image.prompt}</p>
          </div>
          <Button 
            variant="default" 
            size="sm" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            onClick={copyPrompt}
          >
            <Copy className="mr-2 h-4 w-4" />
            <span className="text-white">复制提示词</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
