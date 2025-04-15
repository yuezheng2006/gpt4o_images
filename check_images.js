const https = require('https');
const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, 'src', 'data', 'images.ts');
const fileContent = fs.readFileSync(dataFilePath, 'utf8');

const urlRegex = /imagePath: "([^"]+)"/g;
let match;
const imageUrls = [];

while ((match = urlRegex.exec(fileContent)) !== null) {
  imageUrls.push(match[1]);
}

console.log(`Found ${imageUrls.length} image URLs to check`);

function checkUrl(url) {
  return new Promise((resolve) => {
    const req = https.get(url, (res) => {
      const statusCode = res.statusCode;
      res.resume(); // Consume response data to free up memory
      resolve({
        url,
        status: statusCode,
        accessible: statusCode >= 200 && statusCode < 400
      });
    });

    req.on('error', (err) => {
      resolve({
        url,
        status: 'error',
        accessible: false,
        error: err.message
      });
    });

    req.end();
  });
}

async function checkAllUrls() {
  console.log('Checking image URLs for accessibility...');
  
  const results = await Promise.all(imageUrls.map(checkUrl));
  
  const accessibleUrls = results.filter(r => r.accessible);
  const inaccessibleUrls = results.filter(r => !r.accessible);
  
  console.log(`\nResults: ${accessibleUrls.length} accessible, ${inaccessibleUrls.length} inaccessible\n`);
  
  if (inaccessibleUrls.length > 0) {
    console.log('Inaccessible URLs:');
    inaccessibleUrls.forEach(r => {
      console.log(`- ${r.url} (Status: ${r.status}${r.error ? ', Error: ' + r.error : ''})`);
    });
  }
}

checkAllUrls();
