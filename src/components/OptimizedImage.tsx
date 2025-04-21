import { useState, useEffect, useRef } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loadingClassName?: string;
  placeholderColor?: string;
}

/**
 * 优化的图片组件，支持懒加载、渐进式加载和错误处理
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  loadingClassName = 'opacity-0',
  placeholderColor = '#f3f4f6'
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // 使用IntersectionObserver实现懒加载
  useEffect(() => {
    if (!imgRef.current) return;

    // 如果浏览器支持原生懒加载，优先使用
    if ('loading' in HTMLImageElement.prototype) {
      imgRef.current.loading = 'lazy';
      return;
    }

    // 否则使用IntersectionObserver
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && imgRef.current) {
          // 当图片进入视口时，设置src
          const img = imgRef.current;
          img.src = src;
          
          // 停止观察
          observerRef.current?.unobserve(img);
        }
      });
    }, {
      rootMargin: '200px', // 提前200px开始加载
      threshold: 0.01 // 只要有1%进入视口就开始加载
    });

    observerRef.current.observe(imgRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [src]);

  // 图片加载完成或出错的处理
  const handleLoad = () => setIsLoaded(true);
  const handleError = () => {
    setError(true);
    setIsLoaded(true);
  };

  // 使用Service Worker缓存图片
  useEffect(() => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'PRECACHE',
        urls: [src]
      });
    }
  }, [src]);

  // 计算宽高比例
  const aspectRatio = width && height ? (height / width) : undefined;

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{
        backgroundColor: placeholderColor,
        aspectRatio: aspectRatio,
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : 'auto',
      }}
    >
      {error ? (
        <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-500">
          <span>图片加载失败</span>
        </div>
      ) : (
        <img
          ref={imgRef}
          alt={alt}
          width={width}
          height={height}
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : loadingClassName}`}
          // 如果浏览器支持原生懒加载，设置src；否则由IntersectionObserver设置
          {...('loading' in HTMLImageElement.prototype ? { src } : {})}
          decoding="async" // 异步解码，不阻塞主线程
        />
      )}
    </div>
  );
}
