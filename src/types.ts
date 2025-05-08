export interface ImageItem {
  id: number;
  timestamp: string;
  title: string;
  author: string;
  originalLink: string;
  imagePath: string;
  prompt: string;
  needsReferenceImage: boolean;
  referenceNote?: string;
  additionalNote?: string;
  category?: string;
}
