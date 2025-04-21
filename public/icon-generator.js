// u8fd9u4e2au811au672cu7528u4e8eu751fu6210PWAu56feu6807
// u4f7fu7528u65b9u6cd5: node icon-generator.js
const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// u751fu6210u4e0du540cu5c3au5bf8u7684u56feu6807
function generateIcons() {
  const sizes = [192, 512];
  
  sizes.forEach(size => {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // u7ed8u5236u6e10u53d8u80ccu666f
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#6b9eff');
    gradient.addColorStop(1, '#a259f7');
    ctx.fillStyle = gradient;
    
    // u7ed8u5236u5706u89d2u77e9u5f62
    const radius = size * 0.25; // u5706u89d2u534au5f84
    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(size - radius, 0);
    ctx.quadraticCurveTo(size, 0, size, radius);
    ctx.lineTo(size, size - radius);
    ctx.quadraticCurveTo(size, size, size - radius, size);
    ctx.lineTo(radius, size);
    ctx.quadraticCurveTo(0, size, 0, size - radius);
    ctx.lineTo(0, radius);
    ctx.quadraticCurveTo(0, 0, radius, 0);
    ctx.closePath();
    ctx.fill();
    
    // u7ed8u5236u6587u5b57
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${size * 0.4}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('4O', size / 2, size * 0.4);
    
    // u7ed8u5236u76f8u673au56feu6807
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    const cameraWidth = size * 0.28;
    const cameraHeight = size * 0.18;
    const cameraX = size * 0.2;
    const cameraY = size * 0.62;
    
    // u76f8u673au4e3bu4f53
    ctx.fillRect(cameraX, cameraY, cameraWidth, cameraHeight);
    
    // u76f8u673au955cu5934
    ctx.fillStyle = 'rgba(162, 89, 247, 0.7)';
    ctx.beginPath();
    ctx.arc(cameraX + cameraWidth/2, cameraY + cameraHeight/2, cameraHeight * 0.3, 0, Math.PI * 2);
    ctx.fill();
    
    // u76f8u673au95eau5149u706f
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillRect(cameraX + cameraWidth/3, cameraY - cameraHeight * 0.3, cameraWidth/3, cameraHeight * 0.3);
    
    // u5c06u56feu50cfu4fddu5b58u4e3aPNG
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(__dirname, `icon-${size}.png`), buffer);
    console.log(`u751fu6210u4e86 ${size}x${size} u56feu6807`);
  });
  
  // u751fu6210Apple Touch Icon
  const appleIconSize = 180;
  const appleCanvas = createCanvas(appleIconSize, appleIconSize);
  const appleCtx = appleCanvas.getContext('2d');
  
  // u7ed8u5236u6e10u53d8u80ccu666f
  const appleGradient = appleCtx.createLinearGradient(0, 0, appleIconSize, appleIconSize);
  appleGradient.addColorStop(0, '#6b9eff');
  appleGradient.addColorStop(1, '#a259f7');
  appleCtx.fillStyle = appleGradient;
  appleCtx.fillRect(0, 0, appleIconSize, appleIconSize);
  
  // u7ed8u5236u6587u5b57
  appleCtx.fillStyle = '#fff';
  appleCtx.font = `bold ${appleIconSize * 0.4}px Arial, sans-serif`;
  appleCtx.textAlign = 'center';
  appleCtx.textBaseline = 'middle';
  appleCtx.fillText('4O', appleIconSize / 2, appleIconSize * 0.4);
  
  // u7ed8u5236u76f8u673au56feu6807
  appleCtx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  const appleCameraWidth = appleIconSize * 0.28;
  const appleCameraHeight = appleIconSize * 0.18;
  const appleCameraX = appleIconSize * 0.2;
  const appleCameraY = appleIconSize * 0.62;
  
  // u76f8u673au4e3bu4f53
  appleCtx.fillRect(appleCameraX, appleCameraY, appleCameraWidth, appleCameraHeight);
  
  // u76f8u673au955cu5934
  appleCtx.fillStyle = 'rgba(162, 89, 247, 0.7)';
  appleCtx.beginPath();
  appleCtx.arc(appleCameraX + appleCameraWidth/2, appleCameraY + appleCameraHeight/2, appleCameraHeight * 0.3, 0, Math.PI * 2);
  appleCtx.fill();
  
  // u76f8u673au95eau5149u706f
  appleCtx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  appleCtx.fillRect(appleCameraX + appleCameraWidth/3, appleCameraY - appleCameraHeight * 0.3, appleCameraWidth/3, appleCameraHeight * 0.3);
  
  // u5c06u56feu50cfu4fddu5b58u4e3aPNG
  const appleBuffer = appleCanvas.toBuffer('image/png');
  fs.writeFileSync(path.join(__dirname, 'apple-touch-icon.png'), appleBuffer);
  console.log(`u751fu6210u4e86 Apple Touch Icon`);
}

try {
  generateIcons();
} catch (error) {
  console.error('u751fu6210u56feu6807u65f6u51fau9519:', error);
  console.log('u8bf7u5148u5b89u88c5u4f9du8d56: npm install canvas');
}
