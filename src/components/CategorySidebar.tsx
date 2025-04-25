import React from 'react';

interface CategorySidebarProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  isMobile?: boolean; // 添加移动端标记属性
  // 添加一个可选的属性，用于获取每个分类的图片数量
  getCategoryCount?: (category: string | null) => number;
}

export const CategorySidebar: React.FC<CategorySidebarProps> = ({ 
  categories,
  selectedCategory,
  onSelectCategory,
  isMobile = false, // 默认为非移动端
  getCategoryCount = () => 0 // 默认返回0
}) => {
  // 将 'All' 添加到分类列表的最前面
  const allCategories = [null, ...categories]; 

  return (
    <aside className={`
      w-64 p-4 
      ${isMobile ? 'border-none' : 'border-r border-gray-200 dark:border-gray-700'} 
      ${isMobile ? 'h-full' : 'sticky top-4 self-start max-h-[calc(100vh-2rem)]'} 
      overflow-y-auto transition-all duration-300 ease-in-out
    `}>
      {/* 移动端显示关闭按钮 */}
      {isMobile && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold dark:text-white">分类浏览</h2>
          <button 
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" 
            onClick={() => onSelectCategory(selectedCategory)}
            aria-label="关闭分类菜单"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
      
      {/* 非移动端标题 */}
      {!isMobile && <h2 className="text-xl font-bold mb-4 dark:text-white">分类浏览</h2>}
      
      <ul className="space-y-2">

        {allCategories.map((category, index) => {
          const isSelected = category === selectedCategory;
          const categoryName = category === null ? '全部' : category; // + Also change 'All' to '全部'
          return (
            <li key={index}>
              <button
                className={`
                  w-full text-left px-3 py-2 rounded flex justify-between items-center
                  ${isSelected ? 'bg-blue-500 text-white shadow-md' : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300'} 
                  ${isMobile ? 'text-base' : ''}
                  transition-all duration-200 ease-in-out
                `}
                onClick={() => onSelectCategory(category)}
              >
                <span>{categoryName}</span>
                {/* 添加分类计数徽章 */}
                <span className={`
                  text-xs rounded-full px-2 py-1 min-w-[1.75rem] text-center
                  ${isSelected ? 'bg-white bg-opacity-20 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}
                `}>
                  {getCategoryCount(category)}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};
