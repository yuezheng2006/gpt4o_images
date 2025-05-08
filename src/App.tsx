import { useState, useEffect, useMemo } from 'react'
import './App.css'
import { images as originalImages } from './data/images'
import { imageCategories } from './data/imageCategories'
import { ImageCard } from './components/ImageCard'
import { ImageDetail } from './components/ImageDetail'
import { CategorySidebar } from './components/CategorySidebar'
import { ImageItem } from './types'
import { Toaster } from 'sonner'
import { AuthProvider } from './components/AuthProvider'
import { GoogleLoginButton } from './components/GoogleLoginButton'
import { UserMenu } from './components/UserMenu'
import { useAuth } from './components/AuthProvider'
import ReloadPrompt from './components/ReloadPrompt'

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
  const [processedImages, setProcessedImages] = useState<ImageItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    // 创建一个包含所有原始图片的拷贝
    const mergedImages = originalImages.map((img) => ({ ...img }))

    // 使用新的数据结构为图片设置分类
    for (const [category, imageIds] of Object.entries(imageCategories)) {
      for (const id of imageIds) {
        const image = mergedImages.find((img) => img.id === id)
        if (image) {
          ;(image as ImageItem & { category: string }).category = category
        }
      }
    }

    setProcessedImages(mergedImages)

    const cleanup = loadGoogleScript()
    return cleanup
  }, [])

  // 直接从分类映射文件中获取分类列表
  const categories = useMemo(() => {
    return Object.keys(imageCategories)
  }, [])

  // 初始化时处理图片数据，添加分类信息
  useEffect(() => {
    // 处理原始图片数据，添加分类属性
    const processImages = () => {
      // 先创建一个深拷贝，避免修改原始数据
      const imagesWithCategories = originalImages.map((img) => {
        return { ...img }
      })

      // 遍历所有分类，为图片添加分类信息
      Object.entries(imageCategories).forEach(([categoryName, imageIds]) => {
        // 每个分类中的所有ID
        imageIds.forEach((id) => {
          // 找到对应的图片并设置分类
          const imageToUpdate = imagesWithCategories.find(
            (img) => img.id === id
          )
          if (imageToUpdate) {
            // 使用明确的类型断言
            ;(imageToUpdate as unknown as { category: string }).category =
              categoryName
          }
        })
      })

      // 更新状态，明确转换为 ImageItem[] 类型
      setProcessedImages(imagesWithCategories as ImageItem[])
    }

    // 执行处理
    processImages()
  }, [])

  // 根据选中的分类过滤图片
  const filteredImages = useMemo(() => {
    // 如果没有选中分类或选择了"全部"，显示所有图片
    if (!selectedCategory) {
      return processedImages
    }

    // 使用分类属性过滤图片，使用类型断言保证类型安全
    return processedImages.filter(
      (image) =>
        (image as unknown as { category: string }).category === selectedCategory
    )
  }, [processedImages, selectedCategory])

  const handleImageClick = (image: ImageItem) => {
    setSelectedImage(image)
    setIsDetailOpen(true)
  }

  const handleCloseDetail = () => {
    setIsDetailOpen(false)
  }

  const handleSelectCategory = (category: string | null) => {
    setSelectedCategory(category)
  }

  // 获取每个分类的图片数量
  const getCategoryCount = (category: string | null) => {
    if (!category) {
      // 如果是 '全部' 分类，返回所有图片数量
      return processedImages.length
    }
    // 返回当前分类的图片数量
    return processedImages.filter((img) => {
      const imgCategory = (img as unknown as { category: string }).category
      return imgCategory === category
    }).length
  }

  // 滚动到顶部功能
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // 计算是否显示返回顶部按钮
  const [showBackToTop, setShowBackToTop] = useState(false)

  // 监听滚动事件，控制返回顶部按钮的显示/隐藏
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300)
    }

    // 添加滚动事件监听器
    window.addEventListener('scroll', handleScroll)
    // 首次运行时计算一次
    handleScroll()

    // 组件卸载时移除事件监听器
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto py-6 px-4 flex justify-between items-center">
          <div className="flex items-center">
            {/* 移动端菜单按钮 */}
            {isMobile && (
              <button
                onClick={toggleMobileSidebar}
                className="mr-3 text-gray-600 dark:text-gray-300 focus:outline-none"
                aria-label="打开分类菜单"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            )}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Awesome GPT-4o Images ✨
              </h1>
              <p className="mt-2 text-sm md:text-base text-gray-600 dark:text-gray-300">
                展示 OpenAI 最新多模态模型 GPT‑4o
                生成的精彩案例，点击图片查看详情
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
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

      {/* 移动端分类选择栏 - 只在侧边栏打开时显示 */}
      {isMobile && (
        <div
          className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${isMobileSidebarOpen ? 'bg-opacity-50 visible' : 'bg-opacity-0 invisible pointer-events-none'}`}
          onClick={toggleMobileSidebar}
        >
          <div
            className={`absolute top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 z-50 shadow-xl transform transition-transform duration-300 ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <CategorySidebar
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={(category) => {
                handleSelectCategory(category)
                setIsMobileSidebarOpen(false) // 选择后自动关闭侧边栏
              }}
              getCategoryCount={getCategoryCount}
              isMobile={true}
            />
          </div>
        </div>
      )}

      <div className="flex flex-1 container mx-auto py-4 md:py-8 px-2 md:px-4">
        {/* 桌面端侧边栏 - 只在非移动设备上显示 */}
        {!isMobile && (
          <CategorySidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
            getCategoryCount={getCategoryCount}
            isMobile={false}
          />
        )}

        <main className="flex-1 md:ml-6">
          {/* 移动端当前分类显示 */}
          {isMobile && (
            <div className="mb-4 flex items-center">
              <span className="text-gray-600 dark:text-gray-300 mr-2">
                当前分类:
              </span>
              <span className="font-medium text-blue-500">
                {selectedCategory || '全部'}
              </span>
              <span className="text-sm text-gray-500 ml-2">
                ({getCategoryCount(selectedCategory)} 张)
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-8">
            {filteredImages.slice().map((image) => (
              <div key={image.id} className="block group relative">
                <ImageCard
                  image={image}
                  onClick={() => handleImageClick(image)}
                />
              </div>
            ))}
          </div>
        </main>
      </div>

      <ImageDetail
        image={selectedImage}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
      />

      {/* 移动端底部导航栏 */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg py-2 px-4 z-30">
          <div className="flex justify-around items-center">
            <button
              onClick={toggleMobileSidebar}
              className="flex flex-col items-center justify-center text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 p-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs mt-1">分类</span>
            </button>
            <button
              onClick={scrollToTop}
              className="flex flex-col items-center justify-center text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 p-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs mt-1">顶部</span>
            </button>
          </div>
        </div>
      )}

      {/* 扁端返回顶部按钮 */}
      {!isMobile && showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed right-6 bottom-6 p-3 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition-opacity duration-300"
          aria-label="返回顶部"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 11l7-7 7 7M5 19l7-7 7 7"
            />
          </svg>
        </button>
      )}

      <Toaster position="top-right" />
      <ReloadPrompt />
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
