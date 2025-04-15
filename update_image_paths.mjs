// Script to update image paths in the data file
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the data file content
const dataFilePath = path.join(__dirname, 'src', 'data', 'images.ts');
const fileContent = fs.readFileSync(dataFilePath, 'utf8');

// Define mappings for incorrect paths to correct ones
const pathMappings = {
  // Style-specific images that don't exist
  'example_anime_style_conversion.jpeg': 'example_relativity_manga.jpeg',
  'example_3d_cartoon_style.jpeg': 'example_social_media_doodle.jpeg',
  'example_pixel_art_style.jpeg': 'example_naruto_stickers.jpeg',
  'example_watercolor_style.jpeg': 'example_textbook_redraw.jpeg',
  'example_rpg_character_card.jpeg': 'example_rpg_card_designer.png',
  'example_3d_cartoon_character.jpeg': 'example_titanic_q_realistic.jpeg',
  'example_anime_character_conversion.jpeg': 'example_two_panel_manga_president.jpeg',
  'example_3d_rendered_scene.jpeg': 'example_university_mascot_npu.jpeg',
  'example_q_character_conversion.jpeg': 'example_paper_cutout_job_ad.jpeg',
  'example_pixel_art_scene.jpeg': 'example_notebook_promo.png',
  'example_ink_painting_style.jpeg': 'example_miniature_journey_west.jpeg',
  'example_cyberpunk_style.jpeg': 'example_matryoshka_pearl_earring.png',
  'example_retro_game_style.jpeg': 'example_pearl_earring_ootd.png',
  'example_cartoon_portrait.jpeg': 'example_minimalist_3d_toilet.png',
  'example_oil_painting_style.jpeg': 'example_minimalist_3d_toilet_txt.jpeg',
  'example_ukiyo_e_style.jpeg': 'example_master_oats_ad.png',
  'example_low_poly_style.jpeg': 'funko-pop-james-bond-figure-and-box.png',
  'example_pencil_sketch_style.jpeg': 'example_happy_capsule.png',
  'example_colored_pencil_style.jpeg': 'example_art_figures_go.jpeg.jpeg',
  'example_mosaic_style.jpeg': 'example_hand_drawn_infographic_cognition.jpeg',
  'example_graffiti_style.jpeg': 'example_3d_q_snowglobe_couple.jpeg',
  'example_paper_cut_style.jpeg': 'example_35mm_moscow_flying_island.jpeg',
  'example_collage_art_style.jpeg': 'example_3d_collectible_couple_box.jpeg',
  'example_impressionist_style.jpeg': 'example_almanac_calendar_illustration.jpeg',
  'example_cubist_style.jpeg': 'example_chibi_emoji_pack.png',
  'example_pop_art_style.jpeg': 'example_chinese_wedding_invitation.jpeg',
  'example_surrealist_style.jpeg': 'example_digimon_style.jpeg',
  'example_minimalist_style.jpeg': 'example_einstein_stickfigure_emoji.jpeg',
  'example_vaporwave_style.jpeg': 'example_family_wedding_photo_q.jpeg',
  'example_gothic_style.jpeg': 'example_fantasy_computer_head_portal.jpeg'
};

// Update the file content with correct paths
let updatedContent = fileContent;
for (const [incorrectPath, correctPath] of Object.entries(pathMappings)) {
  const incorrectFullPath = `https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/examples/${incorrectPath}`;
  const correctFullPath = `https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/examples/${correctPath}`;
  
  updatedContent = updatedContent.replace(
    new RegExp(incorrectFullPath.replace(/\./g, '\\.'), 'g'), 
    correctFullPath
  );
}

// Write the updated content back to the file
fs.writeFileSync(dataFilePath, updatedContent);

console.log('Image paths updated successfully!');
