import { ImageItem } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Copy, ExternalLink } from 'lucide-react';
import { toast } from './ui/use-toast';
import { useRef } from 'react';

interface ImageDetailProps {
  image: ImageItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageDetail({ image, isOpen, onClose }: ImageDetailProps) {
  // 初始化引用
  const promptCopyButtonRef = useRef<HTMLButtonElement>(null);

  // 如果没有图片数据，不渲染任何内容
  if (!image) return null;
  
  // 复制提示词到剪贴板
  const copyPrompt = () => {
    if (!image) return;
    navigator.clipboard.writeText(image.prompt);
    toast({
      title: "已复制提示词",
      description: "提示词已复制到剪贴板",
      duration: 2000,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-[95vw] h-auto max-h-[95vh] overflow-hidden p-3 md:p-6" forceMount>
        <DialogHeader className="pb-1">
          <DialogTitle className="text-lg md:text-2xl">
            <span className="truncate pr-2">{image.title}</span>
          </DialogTitle>
          <DialogDescription className="text-sm">
            by {image.author} | 
            <a 
              href={image.originalLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-1 text-blue-500 hover:underline inline-flex items-center"
            >
              原文链接 <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </DialogDescription>

        </DialogHeader>

        {/* 桌面端布局 - 保持不变 */}
        <div className="hidden md:flex my-2 md:my-4 flex-row gap-4" style={{ maxHeight: 'calc(85vh - 110px)' }}>
          <div className="w-1/2 flex-shrink-0 max-h-none overflow-hidden">
            <div className="relative w-full" style={{ paddingBottom: '75%' }}>
              <img 
                src={image.imagePath} 
                alt={image.title} 
                className="absolute inset-0 w-full h-full object-contain rounded-lg shadow-md"
                loading="eager"
              />
            </div>
          </div>
          
          <div className="w-1/2 space-y-3 overflow-y-auto pr-2" style={{ maxHeight: '100%' }}>
            <div>
              <h3 className="text-lg font-bold mb-2">提示词:</h3>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 pb-14 rounded-md relative">
                <pre className="whitespace-pre-wrap text-sm overflow-y-auto" style={{ maxHeight: '100%', paddingBottom: '2rem' }}>{image.prompt}</pre>
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={copyPrompt}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    <span className="text-xs">复制提示词</span>
                  </Button>
                </div>
              </div>
            </div>

            {image.needsReferenceImage && (
              <div>
                <h3 className="text-lg font-bold mb-2">需要参考图片:</h3>
                <p>{image.referenceNote}</p>
              </div>
            )}

            {image.additionalNote && (
              <div>
                <h3 className="text-lg font-bold mb-2">附加说明:</h3>
                <p>{image.additionalNote}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* 移动端布局 - 简化版：prompt在上，图片在下 */}
        <div className="md:hidden overflow-y-auto" style={{ maxHeight: 'calc(80vh - 130px)' }}>
          {/* 提示词内容 */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-base font-bold">提示词:</h3>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 h-8"
                onClick={copyPrompt}
                ref={promptCopyButtonRef}
              >
                <Copy className="h-4 w-4 mr-1" />
                <span className="text-xs">复制提示词</span>
              </Button>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
              <pre className="whitespace-pre-wrap text-sm">{image.prompt}</pre>
            </div>
            
            {image.needsReferenceImage && (
              <div className="mt-4">
                <h3 className="text-base font-bold mb-1">需要参考图片:</h3>
                <p>{image.referenceNote}</p>
              </div>
            )}

            {image.additionalNote && (
              <div className="mt-4">
                <h3 className="text-base font-bold mb-1">附加说明:</h3>
                <p>{image.additionalNote}</p>
              </div>
            )}
          </div>
          
          {/* 图片内容 - 更小 并预留图片空间 */}
          <div className="mt-4">
            <div className="flex justify-center">
              <div 
                className="relative w-full flex items-center justify-center" 
                style={{ height: '30vh' }}
              >
                <img 
                  src={image.imagePath} 
                  alt={image.title} 
                  className="max-w-full max-h-full object-contain rounded-lg shadow-md" 
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
