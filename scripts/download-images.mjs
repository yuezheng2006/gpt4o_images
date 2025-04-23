// u4e0bu8f7dGitHubu56feu7247u5230u672cu5730u9759u6001u8d44u6e90u76eeu5f55u7684u811au672c
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// u83b7u53d6u5f53u524du6587u4ef6u7684u76eeu5f55u8defu5f84
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// u624bu52a8u5bfcu5165imagesu6570u636e
const imagesData = [
  {
    "id": 1,
    "title": "u865au6784u63a8u6587u622au56fe (u7231u56e0u65afu5766)",
    "imagePath": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/examples/example_fake_tweet_einstein.jpeg"
  },
  {
    "id": 2,
    "title": "Emoji u7c07u7ed2u5730u6bef",
    "imagePath": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/examples/example_tufted_rug_dino_emoji.jpeg"
  },
  {
    "id": 3,
    "title": "u5f69u8272u77e2u91cfu827au672fu6d77u62a5",
    "imagePath": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/examples/example_vector_poster_london.png"
  },
  {
    "id": 4,
    "title": "u4e91u5f69u827au672f",
    "imagePath": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/examples/example_cloud_art_dragon_great_wall.png"
  },
  {
    "id": 5,
    "title": "8u4f4du50cfu7d20u56feu6807",
    "imagePath": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/examples/example_8bit_pixel_burger.jpeg"
  },
  {
    "id": 6,
    "title": "u8ff7u4f60 3D u5efau7b51",
    "imagePath": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/examples/example_miniature_3d_building.jpeg"
  },
  {
    "id": 7,
    "title": "u4f4eu591au8fb9u5f62 (Low-Poly) 3D u6e32u67d3",
    "imagePath": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/examples/example_lowpoly_3d_render.jpeg"
  },
  {
    "id": 8,
    "title": "\"u6781u5176u5e73u51e1\"u7684iPhoneu81eau62cd",
    "imagePath": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/examples/example_mundane_iphone_selfie.jpeg"
  },
  {
    "id": 9,
    "title": "Emoji u5145u6c14u611fu96c6u57ab",
    "imagePath": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/examples/example_emoji_inflatable_cushion.jpeg"
  },
  {
    "id": 10,
    "title": "u7eb8u827au98ceu683c Emoji u56feu6807",
    "imagePath": "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/examples/example_papercraft_emoji_icon.jpeg"
  }
];

// u521bu5efau76eeu6807u76eeu5f55
const targetDir = path.join(__dirname, '../public/images');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// u4e0bu8f7du56feu7247u51fdu6570
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const fullPath = path.join(targetDir, filename);
    
    // u5982u679cu6587u4ef6u5df2u5b58u5728uff0cu8df3u8fc7u4e0bu8f7d
    if (fs.existsSync(fullPath)) {
      console.log(`u6587u4ef6u5df2u5b58u5728uff0cu8df3u8fc7: ${filename}`);
      return resolve(filename);
    }
    
    console.log(`u5f00u59cbu4e0bu8f7d: ${url} -> ${filename}`);
    
    // u521bu5efau6587u4ef6u5199u5165u6d41
    const file = fs.createWriteStream(fullPath);
    
    // u53d1u8d77HTTPSu8bf7u6c42
    const request = https.get(url, (response) => {
      // u68c0u67e5u72b6u6001u7801
      if (response.statusCode !== 200) {
        fs.unlink(fullPath, () => {}); // u5220u9664u90e8u5206u4e0bu8f7du7684u6587u4ef6
        reject(new Error(`u4e0bu8f7du5931u8d25uff0cu72b6u6001u7801: ${response.statusCode}`));
        return;
      }
      
      // u5c06u54cdu5e94u6d41u5199u5165u6587u4ef6
      response.pipe(file);
    });
    
    // u5904u7406u8bf7u6c42u9519u8bef
    request.on('error', (err) => {
      fs.unlink(fullPath, () => {}); // u5220u9664u90e8u5206u4e0bu8f7du7684u6587u4ef6
      reject(err);
    });
    
    // u6587u4ef6u5199u5165u5b8cu6210
    file.on('finish', () => {
      file.close();
      console.log(`u4e0bu8f7du5b8cu6210: ${filename}`);
      resolve(filename);
    });
    
    // u6587u4ef6u5199u5165u9519u8bef
    file.on('error', (err) => {
      fs.unlink(fullPath, () => {}); // u5220u9664u90e8u5206u4e0bu8f7du7684u6587u4ef6
      reject(err);
    });
  });
}

// u5904u7406u6240u6709u56feu7247
async function processAllImages() {
  // u521bu5efau6620u5c04u8868uff0cu7528u4e8eu66f4u65b0u56feu7247u8defu5f84
  const imageMap = {};
  
  // u4e0bu8f7du6240u6709u56feu7247
  for (const image of imagesData) {
    if (image.imagePath && image.imagePath.includes('githubusercontent.com')) {
      try {
        // u4eceURLu4e2du63d0u53d6u6587u4ef6u540d
        const urlParts = image.imagePath.split('/');
        const originalFilename = urlParts[urlParts.length - 1];
        
        // u4f7fu7528IDu548cu539fu59cbu6587u4ef6u540du521bu5efau65b0u6587u4ef6u540d
        const filename = `${image.id}_${originalFilename}`;
        
        // u4e0bu8f7du56feu7247
        await downloadImage(image.imagePath, filename);
        
        // u6dfbu52a0u5230u6620u5c04u8868
        imageMap[image.imagePath] = `/images/${filename}`;
      } catch (error) {
        console.error(`u4e0bu8f7du56feu7247u5931u8d25 ${image.id}: ${error.message}`);
      }
    }
  }
  
  // u5c06u6620u5c04u8868u5199u5165u6587u4ef6uff0cu4f9bu4ee3u7801u4f7fu7528
  fs.writeFileSync(
    path.join(__dirname, '../src/data/image-map.json'),
    JSON.stringify(imageMap, null, 2)
  );
  
  console.log('u6240u6709u56feu7247u5904u7406u5b8cu6210uff01');
  console.log(`u603bu5171u4e0bu8f7du4e86 ${Object.keys(imageMap).length} u5f20u56feu7247`);
}

// u6267u884cu4e3bu51fdu6570
processAllImages().catch(console.error);
