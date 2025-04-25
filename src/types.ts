export interface ImageItem {
  id: number;
  title: string;
  author: string;
  originalLink: string;
  imagePath: string;
  prompt: string;
  needsReferenceImage: boolean;
  category?: string;
  referenceNote?: string;
  additionalNote?: string;
}
