import { useState, useEffect } from 'react';
import { ImageItem } from '../types';
import { Button } from './ui/button';
import { Copy } from 'lucide-react';
import { toast } from './ui/use-toast';

interface ImageCardProps {
  image: ImageItem;
  onClick: () => void;
}

// 图片代理函数
function getProxiedImageUrl(originalUrl: string): string {
  // 检查是否是GitHub链接
  if (originalUrl.includes('githubusercontent.com') || originalUrl.includes('github.com')) {
    // 使用Cloudflare Function代理
    return `/api/image-proxy?url=${encodeURIComponent(originalUrl)}`;
  }
  return originalUrl;
}

// 获取占位图片URL
function getPlaceholderUrl(): string {
  return '/fallback-image.svg';
}

export function ImageCard({ image, onClick }: ImageCardProps) {
  // 使用占位图片开始
  const [imageSrc, setImageSrc] = useState<string>(getPlaceholderUrl());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // 图片加载状态处理
  useEffect(() => {
    // 重置状态
    setIsLoading(true);
    setImageSrc(getPlaceholderUrl());
    
    // 创建一个隐藏的Image对象来预加载
    const img = new Image();
    
    // 先尝试加载原始URL
    img.src = image.imagePath;
    
    img.onload = () => {
      // 原始URL加载成功，使用原始URL
      setImageSrc(image.imagePath);
      setIsLoading(false);
    };
    
    img.onerror = () => {
      // 原始URL加载失败，尝试使用代理URL
      const proxyImg = new Image();
      proxyImg.src = getProxiedImageUrl(image.imagePath);
      
      proxyImg.onload = () => {
        // 代理URL加载成功
        setImageSrc(getProxiedImageUrl(image.imagePath));
        setIsLoading(false);
      };
      
      proxyImg.onerror = () => {
        // 代理URL也加载失败，使用备用图片
        setImageSrc('/fallback-image.svg');
        setIsLoading(false);
        console.error(`图片加载失败: ${image.title}`);
      };
    };
    
    // 清理函数
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [image.imagePath]);
  
  const copyPrompt = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(image.prompt);
    toast({
      title: "已复制提示词",
      description: "提示词已复制到剪贴板",
      duration: 2000,
    });
  };
  
  // 已不需要这些处理函数，因为我们在useEffect中处理了加载逻辑

  return (
    <div 
      className="relative w-full h-full rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer bg-white dark:bg-gray-800 flex flex-col"
      onClick={onClick}
    >
      {/* 加载指示器 */}
      {isLoading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-100 dark:bg-slate-800 animate-pulse">
          <span className="text-sm text-slate-500 dark:text-slate-400">加载中...</span>
        </div>
      )}
      
      {/* 卡片主体 */}
      <div className="flex flex-col h-full w-full">
        <div className="w-full h-64 overflow-hidden">
          <img 
            src={imageSrc} 
            alt={image.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        
        <div className="p-4 flex-grow flex flex-col justify-between">
          <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2">{image.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">by {image.author}</p>
        </div>
      </div>

      {/* Hover 覆盖层 */}
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
