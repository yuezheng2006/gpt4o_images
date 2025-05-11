import { supabase } from './supabaseClient'

export interface Category {
  id: number
  name: string
}

export async function getAllCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('ai_categories')
    .select('id, name')

  if (error) {
    console.error('Error fetching categories:', error.message)
    throw new Error(`Failed to fetch categories: ${error.message}`)
  }

  return data || []
}

export interface Image {
  id: number
  timestamp: string
  title: string
  author: string
  originalLink: string
  imagePath: string
  prompt: string
  needsReferenceImage: boolean
  referenceNote?: string
  additionalNote?: string
}

export async function getAllImages(): Promise<Image[]> {
  const { data, error } = await supabase.from('ai_images').select('*')

  if (error) {
    console.error('Error fetching images:', error.message)
    throw new Error(`Failed to fetch images: ${error.message}`)
  }

  return data || []
}

export async function getImagesWithCategories(): Promise<any[]> {
  const { data, error } = await supabase.from('ai_images').select(`
      id,
      title,
      imagePath,
      ai_categories (
        id,
        name
      )
    `)

  if (error) {
    console.error('Error fetching images with categories:', error.message)
    throw new Error(`Failed to fetch images with categories: ${error.message}`)
  }
  return data || []
}
