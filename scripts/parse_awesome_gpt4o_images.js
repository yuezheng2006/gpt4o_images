// 自动化脚本：从 GitHub 仓库获取最新数据，解析 README.md 并生成 src/data/images.ts
// 用法：node scripts/parse_awesome_gpt4o_images.js [--force]
// --force: 强制重新生成所有数据，不进行增量更新
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'
import vm from 'vm' // 导入 vm 模块

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 定义路径常量
const REPO_DIR = path.resolve('.temp/awesome-gpt4o-images') // 新增：仓库目录
const SRC_MD = path.join(REPO_DIR, 'README.md') // 修改：使用 REPO_DIR
const OUTPUT_TS = path.resolve('./src/data/images.ts')
const BACKUP_TS = path.resolve('./.temp/images_backup.ts')

// 命令行参数
const FORCE_UPDATE = process.argv.includes('--force')

// 检查文本中的特殊字符
function checkSpecialChars(str) {
  const specialChars = str.match(/[^\x00-\x7F]/g) || []
  return [...new Set(specialChars)].join('')
}

// 提取案例块（按 ## 案例 N：... 分割）
function extractCases(md) {
  console.log(`[调试] 开始提取案例数据`)
  console.log(
    `[调试] 文本中的特殊字符: ${checkSpecialChars(md.substring(0, 1000))}`
  )

  // 先测试常规模式
  const regex = /## 案例\s*\d+：([\s\S]+?)(?=## |$)/g
  const cases = []
  let match
  let id = 1

  while ((match = regex.exec(md)) !== null) {
    const block = match[1].trim()
    // 提取字段（title, author, originalLink, imagePath, prompt, needsReferenceImage, referenceNote）
    // 从案例标题行提取标题和作者
    const headerMatch = block.match(/^([^\n]+)/)
    let title = ''
    let author = ''
    let authorLink = ''

    // 生成时间戳，基于案例ID，最新的案例时间最近
    const now = new Date()
    const timestamp = new Date(
      now.getTime() - (id - 1) * 24 * 60 * 60 * 1000
    ).toISOString() // 每个案例间隔一天，从当前时间往前推

    if (headerMatch) {
      const headerLine = headerMatch[1].trim()

      // 尝试匹配标准格式: 标题 (by [@作者](链接))
      const standardMatch = headerLine.match(
        /^([^\(]+?)\s*\(by \[@?([^\)]+)\]\(([^\)]+)\)\)/
      )

      // 尝试匹配另一种格式: 标题 (by @作者)
      const simpleMatch = headerLine.match(/^([^\(]+?)\s*\(by @?([^\)]+)\)/)

      // 尝试匹配第三种格式: 标题
      const titleOnlyMatch = headerLine.match(/^(.+)$/)

      if (standardMatch) {
        title = standardMatch[1].trim()
        author = standardMatch[2].trim()
        authorLink = standardMatch[3].trim()
      } else if (simpleMatch) {
        title = simpleMatch[1].trim()
        author = simpleMatch[2].trim()
        // 如果没有链接，使用默认的 Twitter 链接
        authorLink = `https://x.com/${author}`
      } else if (titleOnlyMatch) {
        title = titleOnlyMatch[1].trim()
        // 如果没有作者信息，设置为未知
        author = 'unknown'
        authorLink = ''
      }
    }

    // 从正文中匹配原文链接
    const originalLinkMatch = block.match(
      /\[原(文|链接|推文)链接\]\([^\)]+\)|\[原(文|链接|推文)链接\][:\：]\s*(https?:[^\s]+)/
    )
    let originalLink = originalLinkMatch
      ? originalLinkMatch[3] || originalLinkMatch[0].match(/\(([^\)]+)\)/)[1]
      : authorLink

    // 提取图片路径（支持相对和绝对路径）
    let imagePath = ''

    // 尝试多种图片匹配模式
    const absoluteImageMatch = block.match(/!\[.*?\]\((https?:[^\)]+)\)/)
    const relativeImageMatch = block.match(/!\[.*?\]\(\.\/examples\/([^\)]+)\)/)
    const imgTagMatch = block.match(
      /<img src="([^"]+)" width="\d+" alt="[^"]*">/
    )

    if (absoluteImageMatch) {
      imagePath = absoluteImageMatch[1].trim()
      console.log(`[调试] 找到绝对路径图片: ${imagePath.substring(0, 50)}...`)
    } else if (relativeImageMatch) {
      // 相对路径转绝对URL
      imagePath = `https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/examples/${relativeImageMatch[1].trim()}`
      console.log(`[调试] 找到相对路径图片: ${imagePath.substring(0, 50)}...`)
    } else if (imgTagMatch) {
      // 处理 HTML img 标签
      const imgSrc = imgTagMatch[1].trim()
      if (imgSrc.startsWith('http')) {
        imagePath = imgSrc
      } else if (imgSrc.startsWith('./')) {
        imagePath = `https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/${imgSrc.substring(2)}`
      } else {
        imagePath = `https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/${imgSrc}`
      }
      console.log(`[调试] 找到 img 标签图片: ${imagePath.substring(0, 50)}...`)
    }

    // 如果仍然没有找到图片，使用案例标题生成一个默认图片路径
    if (!imagePath && titleMatch) {
      const defaultImageName = `example_${titleMatch[1]
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')}.jpeg`
      imagePath = `https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/examples/${defaultImageName}`
      console.log(`[调试] 使用默认图片路径: ${imagePath}`)
    }

    // 提取提示词，支持多种格式
    let prompt = ''
    const promptMatch1 = block.match(/\*\*提示词[：:]?\*\*\s*```([\s\S]+?)```/)
    const promptMatch2 = block.match(/\*\*Prompt[：:]?\*\*\s*```([\s\S]+?)```/)
    const promptMatch3 = block.match(/```([\s\S]+?)```/)

    if (promptMatch1) {
      prompt = promptMatch1[1].replace(/^[\n\r]+|[\n\r]+$/g, '').trim()
    } else if (promptMatch2) {
      prompt = promptMatch2[1].replace(/^[\n\r]+|[\n\r]+$/g, '').trim()
    } else if (promptMatch3) {
      prompt = promptMatch3[1].replace(/^[\n\r]+|[\n\r]+$/g, '').trim()
    }

    const linkMatch = block.match(
      /[原链接|原文链接|原推文链接][:：]\s*(https?:[^\s]+)/
    )

    // 参考图片需求
    const refMatch = block.match(
      /\*\*需[上传|提供]参考图片\*\*\s*:?\s*([\s\S]+?)(?=(\n\n|$))/
    )

    // 检查是否有标题和图片路径
    if (title) {
      // 提取额外注释
      const additionalNoteMatch = block.match(/\*注意[^\*]*\*\s*([^\[]*)/)
      const additionalNote = additionalNoteMatch
        ? additionalNoteMatch[1].trim()
        : undefined

      cases.push({
        id: id++,
        timestamp: timestamp, // 添加时间戳字段
        title: title,
        author: author,
        originalLink: linkMatch ? linkMatch[1].trim() : originalLink,
        imagePath: imagePath,
        prompt: prompt,
        needsReferenceImage: !!refMatch,
        referenceNote: refMatch ? refMatch[1].trim() : undefined,
        additionalNote: additionalNote,
      })
    }
  }
  return cases
}

// 从现有的 images.ts 文件中读取数据
function getExistingImages() {
  try {
    if (!fs.existsSync(OUTPUT_TS)) {
      console.log(`[信息] 文件 ${OUTPUT_TS} 不存在，将创建新文件`)
      return []
    }
    const content = fs.readFileSync(OUTPUT_TS, 'utf-8')

    // --- 新策略：查找起始行和括号，然后扫描匹配的结束括号 ---
    const startLineRegex =
      /^\s*export\s+const\s+images:\s*ImageItem\s*\[\s*\]\s*=/m
    const startLineMatch = content.match(startLineRegex)

    if (!startLineMatch) {
      console.log(
        '[警告] 在 images.ts 文件中未找到 "export const images: ImageItem[] =" 定义行'
      )
      return []
    }

    const definitionLineIndex = startLineMatch.index
    const contentAfterDefinition = content.substring(
      definitionLineIndex + startLineMatch[0].length
    )

    let startIndex = -1
    for (let i = 0; i < contentAfterDefinition.length; i++) {
      if (contentAfterDefinition[i] === '[') {
        startIndex = i
        break
      }
    }

    if (startIndex === -1) {
      console.log('[警告] 找到了定义行，但未找到起始方括号 "["')
      return []
    }

    // 从第一个 '[' 之后开始扫描
    const scanStartIndex =
      definitionLineIndex + startLineMatch[0].length + startIndex + 1
    let balance = 1 // 起始 '[' 算一个层级
    let endIndex = -1

    for (let i = scanStartIndex; i < content.length; i++) {
      if (content[i] === '[') {
        balance++
      } else if (content[i] === ']') {
        balance--
        if (balance === 0) {
          endIndex = i
          break
        }
      }
      // 简单处理字符串和注释中的括号（可能不完美，但对纯数据对象够用）
      else if (content[i] === '"' || content[i] === "'" || content[i] === '`') {
        const quoteChar = content[i]
        i++ // 跳过引号本身
        while (
          i < content.length &&
          (content[i] !== quoteChar || content[i - 1] === '\\')
        ) {
          i++ // 跳过字符串内容，处理转义字符
        }
      } else if (content[i] === '/' && content[i + 1] === '/') {
        i++ // 跳过第二个斜杠
        while (i < content.length && content[i] !== '\n') {
          i++ // 跳过单行注释内容
        }
      } else if (content[i] === '/' && content[i + 1] === '*') {
        i += 2 // 跳过 /*
        while (
          i < content.length &&
          !(content[i] === '*' && content[i + 1] === '/')
        ) {
          i++ // 跳过多行注释内容
        }
        if (i < content.length) {
          i++ // 跳过 */ 中的 /
        }
      }
    }

    if (endIndex === -1) {
      console.log('[警告] 找到了起始方括号 "["，但未找到匹配的结束方括号 "]"')
      return []
    }

    // 提取方括号之间的内容
    const arrayContent = content.substring(scanStartIndex, endIndex)
    // console.log('[调试] 提取到的数组内容片段:', arrayContent.substring(0, 200) + '...');

    try {
      // 使用 vm.runInNewContext 解析提取的内容，外面套上[]使其成为有效数组
      const existingImages = vm.runInNewContext('([' + arrayContent + '])')

      if (!Array.isArray(existingImages)) {
        console.error('[错误] 解析出的数据不是一个数组。')
        return []
      }

      console.log(
        `[信息] 成功解析 images.ts，找到 ${existingImages.length} 条现有图片数据。`
      )
      return existingImages
    } catch (e) {
      console.error('[错误] 使用 vm 解析提取的数组内容时出错:', e.message)
      // console.error('[调试] 错误详情:', e);
      // console.error('[调试] 尝试解析的数据片段:', arrayContent.substring(0, 500) + '...');
      console.log('[警告] 无法解析 images.ts 中的数据，将创建新文件')
      return []
    }
  } catch (error) {
    console.log(
      `[警告] 读取或处理 ${OUTPUT_TS} 文件时出错: ${error.message}。将创建新文件`
    )
    return []
  }
}

// 合并数据并生成差异报告
function compareAndMerge(originalExistingImages, newRawImages) {
  console.log('[信息] 开始比较和合并数据...')

  let addedCount = 0
  let removedCount = 0
  const finalImages = []
  let nextId = 1 // Start ID counter

  // 1. Map existing images by imagePath and find max ID
  const existingImageMap = new Map()
  if (originalExistingImages && originalExistingImages.length > 0) {
    originalExistingImages.forEach((img) => {
      if (img.imagePath) {
        // Only map if imagePath exists
        existingImageMap.set(img.imagePath, { ...img }) // Store a copy
        nextId = Math.max(nextId, img.id + 1)
      } else {
        console.warn(
          `[警告] 现有图片缺少 imagePath，将无法匹配: ID=${img.id}, Title=${img.title}`
        )
      }
    })
  }
  console.log(
    `[调试] 现有图片映射完成，Map size: ${existingImageMap.size}, nextId: ${nextId}`
  )

  // 2. Process new raw images
  const processedNewImagePaths = new Set() // Track processed new image paths to handle duplicates in source MD
  newRawImages.forEach((rawImg) => {
    if (!rawImg.imagePath) {
      console.warn(
        `[警告] 新提取的案例缺少 imagePath，将被跳过: Title=${rawImg.title}`
      )
      return // Skip items without an image path
    }
    if (processedNewImagePaths.has(rawImg.imagePath)) {
      console.warn(
        `[警告] 在新提取的数据中发现重复的 imagePath，将跳过后续重复项: ${rawImg.imagePath}`
      )
      return
    }
    processedNewImagePaths.add(rawImg.imagePath)

    const existingMatch = existingImageMap.get(rawImg.imagePath)

    if (existingMatch) {
      // Found a match - update existing item with new data, keep ID
      const updatedImage = {
        ...rawImg, // Take all fields from the new raw image
        id: existingMatch.id, // Keep the original ID
      }
      finalImages.push(updatedImage)
      existingImageMap.delete(rawImg.imagePath) // Remove from map, indicating it's processed and not removed
    } else {
      // No match - this is a new item
      const newImage = {
        ...rawImg,
        id: nextId++, // Assign a new ID
      }
      finalImages.push(newImage)
      addedCount++
    }
  })

  // 3. Identify removed images
  // Any images left in existingImageMap were not found in the new data
  removedCount = existingImageMap.size
  existingImageMap.forEach((removedImg) => {
    console.log(
      `[调试] 标记为删除的图片: ID=${removedImg.id}, Path=${removedImg.imagePath}`
    )
  })

  // 4. Sort final list by ID
  finalImages.sort((a, b) => a.id - b.id)

  console.log(
    `[信息] 比较合并完成. 新增: ${addedCount}, 删除: ${removedCount}, 最终: ${finalImages.length}`
  )

  return { finalImages, addedCount, removedCount }
}

// 新增：更新 awesome-gpt4o-images 仓库
function updateRepository() {
  console.log(`[信息] 检查并更新数据源仓库: ${REPO_DIR}`)
  if (!fs.existsSync(REPO_DIR)) {
    console.warn(`[警告] 数据源目录不存在: ${REPO_DIR}`)
    console.warn(
      '[警告] 请先手动克隆仓库: git clone https://github.com/jamez-bondos/awesome-gpt4o-images.git .temp/awesome-gpt4o-images'
    )
    return false // 表示更新失败或未进行
  }

  try {
    console.log(`[信息] 正在执行 git pull...`)
    // 设置 GIT_TERMINAL_PROMPT=0 避免 git pull 卡在输入用户名/密码
    const output = execSync('git pull', {
      cwd: REPO_DIR,
      encoding: 'utf-8',
      env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
    })
    console.log(`[信息] git pull 输出:\n${output}`)
    console.log('[信息] 数据源仓库更新成功')
    return true // 表示更新成功
  } catch (error) {
    console.error('[错误] 更新数据源仓库时出错:', error.message)
    if (error.stdout) console.error('stdout:', error.stdout)
    if (error.stderr) console.error('stderr:', error.stderr)
    console.error('[错误] 请检查 git 配置或网络连接，或尝试手动更新。')
    return false // 表示更新失败
  }
}

// 主函数
async function main() {
  console.log('[信息] 开始执行图片数据更新脚本...')

  // 步骤 1: 更新数据源仓库
  const repoUpdated = updateRepository()
  // 可以选择如果更新失败是否中断，这里暂时不中断，继续使用本地旧数据
  // if (!repoUpdated) {
  //   console.error('[错误] 数据源更新失败，脚本终止。');
  //   process.exit(1);
  // }

  // 步骤 2: 读取现有数据（用于比较和保留ID）
  const originalExistingImages = getExistingImages()

  // 步骤 3: 读取并解析最新的 Markdown 文件
  if (!fs.existsSync(SRC_MD)) {
    console.error(`[错误] 源 Markdown 文件未找到: ${SRC_MD}`)
    console.error('[错误] 请确保数据源仓库已克隆且包含 README.md')
    process.exit(1)
  }
  console.log(`[信息] 正在读取 Markdown 文件: ${SRC_MD}`)
  const mdContent = fs.readFileSync(SRC_MD, 'utf-8')
  console.log(`[信息] Markdown 文件读取成功，长度: ${mdContent.length}`)
  const newRawImages = extractCases(mdContent)
  console.log(`[信息] 从 Markdown 文件中提取到 ${newRawImages.length} 个案例`)

  // 步骤 4: 合并数据并生成差异报告
  // 使用新的 compareAndMerge 函数
  const { finalImages, addedCount, removedCount } = compareAndMerge(
    originalExistingImages,
    newRawImages
  )

  console.log(`[报告] 数据处理完成。`)
  console.log(`[报告]   原始数量: ${originalExistingImages.length}`)
  console.log(`[报告]   新增数量: ${addedCount}`)
  console.log(`[报告]   删除数量: ${removedCount}`)
  console.log(`[报告]   最终数量: ${finalImages.length}`)

  // 步骤 5: 写入新数据到 TypeScript 文件
  if (finalImages.length > 0 || FORCE_UPDATE) {
    console.log(`[信息] 准备写入 ${finalImages.length} 条数据到 ${OUTPUT_TS}`)
    const tsContent = `// Generated by scripts/parse_awesome_gpt4o_images.js
// Do not edit this file manually.
// Last updated: ${new Date().toISOString()}

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
}

export const images: ImageItem[] = ${JSON.stringify(finalImages, null, 2)};
`
    try {
      fs.writeFileSync(OUTPUT_TS, tsContent, 'utf-8')
      console.log(`[信息] 成功写入数据到 ${OUTPUT_TS}`)
    } catch (error) {
      console.error(`[错误] 写入文件 ${OUTPUT_TS} 时出错:`, error.message)
      // 尝试恢复备份
      if (fs.existsSync(BACKUP_TS)) {
        try {
          fs.copyFileSync(BACKUP_TS, OUTPUT_TS)
          console.log(`[信息] 已从备份 ${BACKUP_TS} 恢复 ${OUTPUT_TS}`)
        } catch (backupError) {
          console.error(`[错误] 恢复备份文件时出错:`, backupError.message)
        }
      }
      process.exit(1) // 写入失败则退出
    }
  } else {
    console.log('[信息] 没有需要写入的新数据或未强制更新。')
  }

  console.log('[信息] 脚本执行完毕。')
}

main()
