// 自动化脚本：从 GitHub 仓库获取最新数据，解析 README.md 并生成 src/data/images.ts
// 用法：node scripts/parse_awesome_gpt4o_images.js [--force]
// --force: 强制重新生成所有数据，不进行增量更新
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 定义路径常量
const SRC_MD = path.resolve('.temp/awesome-gpt4o-images/README.md');
const OUTPUT_TS = path.resolve('./src/data/images.ts');
const BACKUP_TS = path.resolve('./.temp/images_backup.ts');

// 命令行参数
const FORCE_UPDATE = process.argv.includes('--force');

// 检查文本中的特殊字符
 function checkSpecialChars(str) {
  const specialChars = str.match(/[^\x00-\x7F]/g) || [];
  return [...new Set(specialChars)].join('');
}

// 提取案例块（按 ## 案例 N：... 分割）
function extractCases(md) {
  console.log(`[调试] 开始提取案例数据`);
  console.log(`[调试] 文本中的特殊字符: ${checkSpecialChars(md.substring(0, 1000))}`);
  
  // 先测试常规模式
  const regex = /## 案例\s*\d+：([\s\S]+?)(?=## |$)/g;
  const cases = [];
  let match;
  let id = 1;
  
  while ((match = regex.exec(md)) !== null) {
    const block = match[1].trim();
    // 提取字段（title, author, originalLink, imagePath, prompt, needsReferenceImage, referenceNote）
    // 从案例标题行提取标题和作者
    const headerMatch = block.match(/^([^\n]+)/);
    let title = '';
    let author = '';
    let authorLink = '';
    
    if (headerMatch) {
      const headerLine = headerMatch[1].trim();
      
      // 尝试匹配标准格式: 标题 (by [@作者](链接))
      const standardMatch = headerLine.match(/^([^\(]+?)\s*\(by \[@?([^\)]+)\]\(([^\)]+)\)\)/);
      
      // 尝试匹配另一种格式: 标题 (by @作者)
      const simpleMatch = headerLine.match(/^([^\(]+?)\s*\(by @?([^\)]+)\)/);
      
      // 尝试匹配第三种格式: 标题
      const titleOnlyMatch = headerLine.match(/^(.+)$/);
      
      if (standardMatch) {
        title = standardMatch[1].trim();
        author = standardMatch[2].trim();
        authorLink = standardMatch[3].trim();
      } else if (simpleMatch) {
        title = simpleMatch[1].trim();
        author = simpleMatch[2].trim();
        // 如果没有链接，使用默认的 Twitter 链接
        authorLink = `https://x.com/${author}`;
      } else if (titleOnlyMatch) {
        title = titleOnlyMatch[1].trim();
        // 如果没有作者信息，设置为未知
        author = 'unknown';
        authorLink = '';
      }
    }
    
    // 从正文中匹配原文链接
    const originalLinkMatch = block.match(/\[原(文|链接|推文)链接\]\([^\)]+\)|\[原(文|链接|推文)链接\][:\：]\s*(https?:[^\s]+)/);
    let originalLink = originalLinkMatch ? (originalLinkMatch[3] || originalLinkMatch[0].match(/\(([^\)]+)\)/)[1]) : authorLink;
    
    // 提取图片路径（支持相对和绝对路径）
    let imagePath = '';
    
    // 尝试多种图片匹配模式
    const absoluteImageMatch = block.match(/!\[.*?\]\((https?:[^\)]+)\)/); 
    const relativeImageMatch = block.match(/!\[.*?\]\(\.\/examples\/([^\)]+)\)/); 
    const imgTagMatch = block.match(/<img src="([^"]+)" width="\d+" alt="[^"]*">/); 
    
    if (absoluteImageMatch) {
      imagePath = absoluteImageMatch[1].trim();
      console.log(`[调试] 找到绝对路径图片: ${imagePath.substring(0, 50)}...`);
    } else if (relativeImageMatch) {
      // 相对路径转绝对URL
      imagePath = `https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/examples/${relativeImageMatch[1].trim()}`;
      console.log(`[调试] 找到相对路径图片: ${imagePath.substring(0, 50)}...`);
    } else if (imgTagMatch) {
      // 处理 HTML img 标签
      const imgSrc = imgTagMatch[1].trim();
      if (imgSrc.startsWith('http')) {
        imagePath = imgSrc;
      } else if (imgSrc.startsWith('./')) {
        imagePath = `https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/${imgSrc.substring(2)}`;
      } else {
        imagePath = `https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/${imgSrc}`;
      }
      console.log(`[调试] 找到 img 标签图片: ${imagePath.substring(0, 50)}...`);
    }
    
    // 如果仍然没有找到图片，使用案例标题生成一个默认图片路径
    if (!imagePath && titleMatch) {
      const defaultImageName = `example_${titleMatch[1].trim().toLowerCase().replace(/[^a-z0-9]+/g, '_')}.jpeg`;
      imagePath = `https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/examples/${defaultImageName}`;
      console.log(`[调试] 使用默认图片路径: ${imagePath}`);
    }
    
    // 提取提示词，支持多种格式
    let prompt = '';
    const promptMatch1 = block.match(/\*\*提示词[：:]?\*\*\s*```([\s\S]+?)```/);
    const promptMatch2 = block.match(/\*\*Prompt[：:]?\*\*\s*```([\s\S]+?)```/);
    const promptMatch3 = block.match(/```([\s\S]+?)```/);
    
    if (promptMatch1) {
      prompt = promptMatch1[1].replace(/^[\n\r]+|[\n\r]+$/g, '').trim();
    } else if (promptMatch2) {
      prompt = promptMatch2[1].replace(/^[\n\r]+|[\n\r]+$/g, '').trim();
    } else if (promptMatch3) {
      prompt = promptMatch3[1].replace(/^[\n\r]+|[\n\r]+$/g, '').trim();
    }
    
    const linkMatch = block.match(/[原链接|原文链接|原推文链接][:：]\s*(https?:[^\s]+)/);
    
    // 参考图片需求
    const refMatch = block.match(/\*\*需[上传|提供]参考图片\*\*\s*:?\s*([\s\S]+?)(?=(\n\n|$))/);
    
    // 检查是否有标题和图片路径
    if (title) {
      // 提取额外注释
      const additionalNoteMatch = block.match(/\*注意[^\*]*\*\s*([^\[]*)/);
      const additionalNote = additionalNoteMatch ? additionalNoteMatch[1].trim() : undefined;
      
      cases.push({
        id: id++,
        title: title,
        author: author,
        originalLink: linkMatch ? linkMatch[1].trim() : originalLink,
        imagePath: imagePath,
        prompt: prompt,
        needsReferenceImage: !!refMatch,
        referenceNote: refMatch ? refMatch[1].trim() : undefined,
        additionalNote: additionalNote
      });
    }
  }
  return cases;
}

// 从现有的 images.ts 文件中读取数据
function getExistingImages() {
  try {
    // 检查文件是否存在
    if (!fs.existsSync(OUTPUT_TS)) {
      console.log('[信息] 没有找到现有的 images.ts 文件，将创建新文件');
      return [];
    }
    
    // 备份现有文件
    fs.copyFileSync(OUTPUT_TS, BACKUP_TS);
    console.log(`[信息] 已备份现有文件到 ${BACKUP_TS}`);
    
    // 读取文件内容
    const content = fs.readFileSync(OUTPUT_TS, 'utf-8');
    
    // 使用正则表达式提取 JSON 数据部分
    const match = content.match(/export const images: ImageItem\[\] = (\[\s\S+?\]);/);
    if (!match) {
      console.log('[警告] 无法解析现有的 images.ts 文件，将创建新文件');
      return [];
    }
    
    // 解析 JSON 数据
    const jsonStr = match[1];
    const existingImages = JSON.parse(jsonStr);
    console.log(`[信息] 成功读取现有数据，共 ${existingImages.length} 条记录`);
    return existingImages;
  } catch (error) {
    console.error('[错误] 读取现有数据时出错:', error.message);
    return [];
  }
}

// 合并新旧数据，保留ID并添加新项目
function mergeImages(existingImages, newImages) {
  if (FORCE_UPDATE) {
    console.log('[信息] 强制更新模式，将替换所有现有数据');
    return newImages;
  }
  
  // 创建标题到ID的映射
  const titleToId = {};
  const authorTitleMap = {};
  
  // 为现有图片创建映射
  existingImages.forEach(item => {
    const key = `${item.title}_${item.author}`;
    titleToId[key] = item.id;
    authorTitleMap[key] = item;
  });
  
  // 合并新旧数据
  const merged = [];
  const usedIds = new Set();
  let maxId = existingImages.length > 0 ? Math.max(...existingImages.map(item => item.id)) : 0;
  
  // 处理新数据
  newImages.forEach(newItem => {
    const key = `${newItem.title}_${newItem.author}`;
    
    if (key in titleToId) {
      // 更新现有项目
      const id = titleToId[key];
      usedIds.add(id);
      
      // 检查是否有变化
      const existingItem = authorTitleMap[key];
      const hasChanges = (
        existingItem.originalLink !== newItem.originalLink ||
        existingItem.imagePath !== newItem.imagePath ||
        existingItem.prompt !== newItem.prompt ||
        existingItem.needsReferenceImage !== newItem.needsReferenceImage ||
        existingItem.referenceNote !== newItem.referenceNote ||
        (existingItem.additionalNote || '') !== (newItem.additionalNote || '')
      );
      
      if (hasChanges) {
        console.log(`[信息] 更新项目: ${newItem.title} (ID: ${id})`);
        merged.push({
          ...newItem,
          id: id
        });
      } else {
        // 没有变化，保留原始项目
        merged.push(existingItem);
      }
    } else {
      // 添加新项目
      maxId++;
      console.log(`[信息] 添加新项目: ${newItem.title} (ID: ${maxId})`);
      merged.push({
        ...newItem,
        id: maxId
      });
    }
  });
  
  // 检查是否有被删除的项目
  const removedItems = existingImages.filter(item => !usedIds.has(item.id) && !merged.some(m => m.id === item.id));
  if (removedItems.length > 0) {
    console.log(`[警告] 发现 ${removedItems.length} 个项目在新数据中不存在:`);
    removedItems.forEach(item => {
      console.log(`  - ${item.title} (ID: ${item.id})`);
    });
    
    // 保留被删除的项目
    merged.push(...removedItems);
  }
  
  // 按ID排序
  return merged.sort((a, b) => a.id - b.id);
}

// 获取最新的仓库数据
function updateRepository() {
  try {
    // 确保 .temp 目录存在
    if (!fs.existsSync('.temp')) {
      fs.mkdirSync('.temp', { recursive: true });
      console.log('[信息] 创建 .temp 目录');
    }
    
    const repoPath = '.temp/awesome-gpt4o-images';
    const repoUrl = 'https://github.com/jamez-bondos/awesome-gpt4o-images.git';
    
    if (fs.existsSync(repoPath)) {
      // 如果仓库已存在，执行 git pull
      console.log('[信息] 更新现有仓库...');
      execSync('git pull', { cwd: repoPath, stdio: 'inherit' });
    } else {
      // 如果仓库不存在，执行 git clone
      console.log('[信息] 克隆仓库...');
      execSync(`git clone --depth=1 ${repoUrl} ${repoPath}`, { stdio: 'inherit' });
    }
    
    console.log('[信息] 仓库更新完成');
    return true;
  } catch (error) {
    console.error('[错误] 更新仓库时出错:', error.message);
    return false;
  }
}

function main() {
  // 更新仓库
  if (!updateRepository()) {
    console.error('[错误] 无法更新仓库，操作已取消');
    return;
  }
  
  // 读取现有数据
  const existingImages = getExistingImages();
  
  // 检查 README.md 是否存在
  if (!fs.existsSync(SRC_MD)) {
    console.error(`[错误] 源文件 ${SRC_MD} 不存在`);
    return;
  }
  
  // 读取并解析 README.md
  const md = fs.readFileSync(SRC_MD, 'utf-8');
  console.log(`[信息] 读取README.md，字符数: ${md.length}`);

  
  // 测试案例标题正则表达式
  const titleRegex = /## 案例\s*\d+：([\s\S]+?)(?=## |$)/g;
  let titleMatch;
  let titleCount = 0;
  while ((titleMatch = titleRegex.exec(md)) !== null) {
    titleCount++;
  }
  console.log(`[信息] 总共找到 ${titleCount} 个标题匹配`);

  // 重置正则匹配指针
  titleRegex.lastIndex = 0;
  
  // 提取案例数据
  const cases = extractCases(md);
  console.log(`[信息] 提取到 ${cases.length} 个案例数据`);
  
  // 过滤无效案例 - 只要有标题就保留
  const filtered = cases.filter(c => c.title);
  console.log(`[信息] 过滤后有效案例: ${filtered.length}`);
  
  // 检查案例数量是否与目录中的案例数量匹配
  const tocMatch = md.match(/\*\s+\[案例\s*(\d+)/g);
  if (tocMatch) {
    const tocCaseCount = tocMatch.length;
    console.log(`[信息] 目录中共有 ${tocCaseCount} 个案例`);
    
    if (filtered.length < tocCaseCount) {
      console.log(`[警告] 提取到的案例数量 (${filtered.length}) 少于目录中的案例数量 (${tocCaseCount})`);
    }
  }

  if (filtered.length === 0) {
    console.error('[错误] 没有提取到有效数据，操作已取消');
    // 如果没有提取到数据，把匹配到的文本块写入调试文件
    fs.writeFileSync('./.temp/debug_content.txt', md.substring(0, 2000), 'utf-8');
    console.log('[信息] 已将前2000个字符写入 ./.temp/debug_content.txt 以便调试');
    return;
  }
  
  // 合并新旧数据
  const mergedImages = mergeImages(existingImages, filtered);
  console.log(`[信息] 合并后共有 ${mergedImages.length} 条记录`);
  
  // 生成 TypeScript 文件
  const timestamp = new Date().toISOString();
  const tsContent =
    `// 本文件由脚本自动生成 (${timestamp})\n` +
    `// 共 ${mergedImages.length} 条记录\n` +
    'import { ImageItem } from \'../types\';\n\n' +
    'export const images: ImageItem[] = ' +
    JSON.stringify(mergedImages, null, 2) +
    ';\n';

  // 写入文件
  fs.writeFileSync(OUTPUT_TS, tsContent, 'utf-8');
  console.log('[信息] 转换完成，输出到', OUTPUT_TS);
}

main();
