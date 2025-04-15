import { ImageItem } from '../types';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogPortal, DialogOverlay } from './ui/dialog';
import { Button } from './ui/button';
import { Copy, X, ExternalLink } from 'lucide-react';
import { toast } from './ui/use-toast';
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import * as React from "react";

const CustomDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-zinc-200 bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg dark:border-zinc-800 dark:bg-zinc-950",
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPortal>
));
CustomDialogContent.displayName = "CustomDialogContent";

interface ImageDetailProps {
  image: ImageItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageDetail({ image, isOpen, onClose }: ImageDetailProps) {
  if (!image) return null;

  const copyPrompt = () => {
    navigator.clipboard.writeText(image.prompt);
    toast({
      title: "已复制提示词",
      description: "提示词已复制到剪贴板",
      duration: 2000,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <CustomDialogContent className="max-w-4xl w-[90vw] max-h-[90vh] overflow-y-auto detail-content">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center justify-between">
            <span>{image.title}</span>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <DialogDescription>
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

        <div className="my-6 flex flex-col md:flex-row gap-6">
          <div className="md:w-1/2">
            <img 
              src={image.imagePath} 
              alt={image.title} 
              className="w-full rounded-lg shadow-md"
            />
          </div>
          
          <div className="md:w-1/2 space-y-4">
            <div>
              <h3 className="text-lg font-bold mb-2">提示词:</h3>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md relative">
                <pre className="whitespace-pre-wrap text-sm">{image.prompt}</pre>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="absolute top-2 right-2"
                  onClick={copyPrompt}
                >
                  <Copy className="h-4 w-4" />
                </Button>
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
      </CustomDialogContent>
    </Dialog>
  );
}
