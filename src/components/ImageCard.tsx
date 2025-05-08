import { ImageItem } from '../types';
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
    <div 
      className="group relative overflow-hidden rounded-lg shadow-lg cursor-pointer transition-all duration-300 ease-in-out hover:shadow-xl bg-white dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 h-full flex flex-col" 
      onClick={onClick}
    >
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 truncate overflow-hidden text-ellipsis" title={image.title}>{image.title}</h3>
      </div>
      
      <div className="relative pt-[100%] overflow-hidden">
        <img 
          src={image.imagePath} 
          alt={image.title} 
          className="absolute inset-0 object-cover w-full h-full transition-all duration-500 ease-in-out group-hover:scale-105"
          loading="lazy"
        />
      </div>

      <div className="p-3 flex items-center">
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">by {image.author}</p>
      </div>

      <div className="absolute inset-0 bg-black/80 flex flex-col justify-between p-6 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity duration-300 z-10">
        <div className="text-white text-sm mb-4 overflow-y-auto w-full flex-grow">
          <p className="font-bold text-base mb-2">提示词:</p>
          <p className="whitespace-pre-wrap break-words">{image.prompt.length > 150 ? `${image.prompt.substring(0, 150)}...` : image.prompt}</p>
        </div>
        <Button 
          variant="default" 
          size="sm" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          onClick={copyPrompt}
        >
          <Copy className="mr-2 h-4 w-4" />
          <span>复制提示词</span>
        </Button>
      </div>
    </div>
  );
}
