/**
 * 图片工具函数
 */
import imageMap from '../data/image-map.json';

// 图片映射类型
interface ImageMapType {
  [key: string]: string;
}

// 将JSON映射转换为类型安全的对象
const typedImageMap = imageMap as ImageMapType;

// 获取图片URL，优先使用Cloudflare Pages静态资源
export function getImageUrl(originalUrl: string): string {
  // 如果是空URL，返回占位图片
  if (!originalUrl) {
    return getPlaceholderUrl();
  }
  
  // 检查是否在映射表中
  if (originalUrl in typedImageMap) {
    return typedImageMap[originalUrl];
  }
  
  // 检查是否是GitHub链接但不在映射表中
  if (originalUrl.includes('githubusercontent.com') || originalUrl.includes('github.com')) {
    console.warn(`GitHub图片未在映射表中: ${originalUrl}`);
    return getPlaceholderUrl();
  }
  
  // 其他URL直接返回
  return originalUrl;
}

// 获取占位图片URL
export function getPlaceholderUrl(): string {
  return '/images/placeholder.svg';
}
