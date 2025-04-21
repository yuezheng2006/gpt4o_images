import { useState, useEffect } from 'react'
import './App.css'
import { images } from './data/images'
import { ImageCard } from './components/ImageCard'
import { ImageDetail } from './components/ImageDetail'
import { ImageItem } from './types'
import { Toaster } from 'sonner'
import { AuthProvider } from './components/AuthProvider'
import { GoogleLoginButton } from './components/GoogleLoginButton'
import { UserMenu } from './components/UserMenu'
import { useAuth } from './components/AuthProvider'

function loadGoogleScript() {
  const script = document.createElement('script')
  script.src = 'https://accounts.google.com/gsi/client'
  script.async = true
  script.defer = true
  document.body.appendChild(script)
  return () => {
    document.body.removeChild(script)
  }
}

function AppContent() {
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const { isAuthenticated, login } = useAuth()

  const handleImageClick = (image: ImageItem) => {
    setSelectedImage(image)
    setIsDetailOpen(true)
  }

  const handleCloseDetail = () => {
    setIsDetailOpen(false)
  }

  useEffect(() => {
    const cleanup = loadGoogleScript()
    return cleanup
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto py-6 px-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Awesome GPT-4o Images ✨
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              展示 OpenAI 最新多模态模型 GPT‑4o 生成的精彩案例，点击图片查看详情
            </p>
          </div>
          <div>
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <GoogleLoginButton 
                onSuccess={(response) => login(response.credential)}
                className="w-auto"
              />
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((image) => (
            <div key={image.id} className="h-full aspect-[1/1.2] block group">
              <ImageCard 
                image={image} 
                onClick={() => handleImageClick(image)} 
              />
            </div>
          ))}
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6">
        <div className="container mx-auto px-4 text-center text-gray-500 dark:text-gray-400">
          <p className="mb-2">数据来源: <a href="https://github.com/jamez-bondos/awesome-gpt4o-images" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">jamez-bondos/awesome-gpt4o-images</a></p>
          <p>在线预览: <a href="https://gpto-images-website-sjtvw658.devinapps.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">https://gpto-images-website-sjtvw658.devinapps.com</a></p>
        </div>
      </footer>

      <ImageDetail 
        image={selectedImage} 
        isOpen={isDetailOpen} 
        onClose={handleCloseDetail} 
      />
      
      <Toaster position="top-right" />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
