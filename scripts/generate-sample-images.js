// 生成示例图片的脚本
const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// 图片映射表
const imageMap = require('../src/data/image-map.json');

// 创建目标目录
const targetDir = path.join(__dirname, '../public/images');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// 颜色列表
const colors = [
  '#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33F3',
  '#33FFF3', '#FF8033', '#8033FF', '#33FF80', '#FF3380'
];

// 为每个映射的图片创建一个示例图片
Object.entries(imageMap).forEach(([originalUrl, localPath], index) => {
  // 从路径中提取文件名
  const filename = path.basename(localPath);
  const fullPath = path.join(targetDir, filename);
  
  // 如果文件已存在，跳过
  if (fs.existsSync(fullPath)) {
    console.log(`文件已存在，跳过: ${filename}`);
    return;
  }
  
  // 提取原始URL中的信息
  const urlParts = originalUrl.split('/');
  const originalFilename = urlParts[urlParts.length - 1];
  
  // 创建画布
  const canvas = createCanvas(800, 600);
  const ctx = canvas.getContext('2d');
  
  // 设置背景色
  ctx.fillStyle = colors[index % colors.length];
  ctx.fillRect(0, 0, 800, 600);
  
  // 添加文本
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 40px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(`GPT-4o 生成图片示例`, 400, 200);
  
  // 添加文件名
  ctx.font = '30px Arial';
  ctx.fillText(originalFilename, 400, 300);
  
  // 添加ID
  ctx.font = '24px Arial';
  ctx.fillText(`ID: ${index + 1}`, 400, 400);
  
  // 将画布保存为图片
  const buffer = canvas.toBuffer('image/jpeg');
  fs.writeFileSync(fullPath, buffer);
  
  console.log(`已生成示例图片: ${filename}`);
});

console.log('所有示例图片生成完成！');
