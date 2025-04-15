import { ImageItem } from '../types';

export const images: ImageItem[] = [
  {
    id: 1,
    title: "Q版求婚场景",
    author: "@balconychy",
    originalLink: "https://x.com/balconychy/status/1909417750587486469",
    imagePath: "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/examples/example_proposal_scene_q_realistic.jpeg",
    prompt: "将照片里的两个人转换成Q版 3D人物，场景换成求婚，背景换成淡雅五彩花瓣做的拱门，背景换成浪漫颜色，地上散落着玫瑰花瓣。除了人物采用Q版 3D人物风格，其他环境采用真实写实风格。",
    needsReferenceImage: true,
    referenceNote: "一张情侣照片。"
  },
  {
    id: 2,
    title: "立体相框",
    author: "@dotey",
    originalLink: "https://x.com/dotey/status/1908238003169903060",
    imagePath: "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/examples/example_polaroid_breakout.png",
    prompt: "将场景中的角色转化为3D Q版风格，放在一张拍立得照片上，相纸被一只手拿着，照片中的角色正从拍立得照片中走出，呈现出突破二维相片边框、进入二维现实空间的视觉效果。",
    needsReferenceImage: true,
    referenceNote: "一张半身或者全身单人照片。"
  },
  {
    id: 3,
    title: "复古宣传海报",
    author: "@dotey",
    originalLink: "https://x.com/dotey/status/1905251524248248650",
    imagePath: "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/examples/example_vintage_poster.jpeg",
    prompt: "复古宣传海报风格，突出中文文字，背景为红黄放射状图案。画面中心位置有一位美丽的年轻女性，以精致复古风格绘制，面带微笑，气质优雅，具有亲和力。主题是GPT最新AI绘画服务的广告促销，强调惊爆价9.9/张、适用各种场景、图像融合、局部重绘、每张提交3次修改、AI直出效果，无需修改，底部醒目标注有意向点右下我想要，右下角绘制一个手指点击按钮动作，左下角展示OpenAI标志。",
    needsReferenceImage: false
  },
  {
    id: 4,
    title: "Q 版中式婚礼图",
    author: "@balconychy",
    originalLink: "https://x.com/balconychy/status/1909418699150237917",
    imagePath: "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/examples/example_q_chinese_wedding.jpeg",
    prompt: "将照片里的两个人转换成Q版 3D人物，中式古装婚礼，大红颜色，背景囍字剪纸风格图案。服饰要求：写实，男士身着长袍马褂，主体为红色，上面以金色绣龙纹图案，彰显尊贵大气，胸前系着大红花，寓意喜庆吉祥。女士所穿是秀禾服，同样以红色为基调，饰有精美的金色花纹与凤凰刺绣，展现出典雅华丽之感，头上搭配花朵发饰，增添柔美温婉气质。二者皆为中式婚礼中经典着装，蕴含着对新人婚姻美满的祝福。头饰要求：男士：中式状元帽，主体红色，饰有金色纹样，帽顶有精致金饰，尽显传统儒雅庄重。女士：凤冠造型，以红色花朵为中心，搭配金色立体装饰与垂坠流苏，华丽富贵，古典韵味十足。",
    needsReferenceImage: true,
    referenceNote: "一张情侣照片。"
  },
  {
    id: 5,
    title: "吉卜力风格",
    author: "AnimeAI",
    originalLink: "https://animeai.online/#demo-gallery",
    imagePath: "https://animeai.online/demo/ghibli-style-mona-lisa.png",
    prompt: "以吉卜力风格重绘这张照片",
    needsReferenceImage: true,
    referenceNote: "一张人物或者其他照片。",
    additionalNote: "如果遇到违反内容政策的情况，提示词增加一句：如果背景里有不合适（敏感）的内容，可以进行修改或删除。"
  },
  {
    id: 6,
    title: "角色穿越传送门",
    author: "@dotey",
    originalLink: "https://x.com/dotey/status/1908910838636765204",
    imagePath: "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/examples/example_portal_crossing_handhold.jpeg",
    prompt: "照片中的角色的 3D Q 版形象穿过传送门，牵着观众的手，在将观众拉向前时动态地回头一看。传送门外的背景是观众的现实世界，一个典型的程序员的书房，有书桌，显示器和笔记本电脑，传送门内是角色所处的3D Q 版世界，细节可以参考照片，整体呈蓝色调，和现实世界形成鲜明对比。传送门散发着神秘的蓝色和紫色色调，是两个世界之间的完美椭圆形框架处在画面中间。从第三人称视角拍摄的摄像机角度，显示观看者的手被拉入角色世界。3：2 的宽高比。",
    needsReferenceImage: true,
    referenceNote: "一张半身或者全身单人照片。"
  },
  {
    id: 7,
    title: "个性化房间设计",
    author: "@ZHO_ZHO_ZHO",
    originalLink: "https://x.com/ZHO_ZHO_ZHO/status/1910698005193515370",
    imagePath: "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/examples/example_personalized_room.png",
    prompt: "为我生成我的房间设计（床、书架、沙发、电脑桌和电脑、墙上挂着绘画、绿植，窗外是城市夜景。可爱 3d 风格，c4d 渲染，轴测图。",
    needsReferenceImage: false,
    additionalNote: "注意：原文提示词是根据chatgpt的记忆内容为用户生成房间设计，此处稍作修改。请参考原文。"
  },
  {
    id: 8,
    title: "乐高收藏品",
    author: "@ZHO_ZHO_ZHO",
    originalLink: "https://x.com/ZHO_ZHO_ZHO/status/1910644499354968091",
    imagePath: "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/examples/example_lego_collectible.jpeg",
    prompt: "根据我上传的照片，生成一张纵向比例的照片，使用以下提示词：\n\n经典乐高人偶风格，一个微缩场景 —— 一只动物站在我身旁。这只动物的配色与我相匹配。\n\n请根据你对我的理解来创造这只动物（你可以选择任何你认为适合我的动物，不论是真实存在的，还是超现实的、幻想的，只要你觉得符合我的气质即可）。\n\n整个场景设定在一个透明玻璃立方体内，布景极简。\n\n微缩场景的底座是哑光黑色，配以银色装饰，风格简约且时尚。\n\n底座上有一块优雅雕刻的标签牌，字体为精致的衬线体，上面写着该动物的名称。\n\n底部设计中还巧妙融入了类似自然历史博物馆展示的生物学分类信息，以精细蚀刻的方式呈现。\n\n整体构图像是一件高端收藏艺术品：精心打造、策展般呈现、灯光细致。\n\n构图重在平衡。背景为渐变色，从深色到浅色过渡（颜色基于主色调进行选择）。",
    needsReferenceImage: true,
    referenceNote: "一张半身或者全身单人照片。"
  },
  {
    id: 9,
    title: "气球名画",
    author: "@ZHO_ZHO_ZHO",
    originalLink: "https://x.com/ZHO_ZHO_ZHO/status/1910976632141267237",
    imagePath: "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/examples/example_pearl_earring_balloon.jpeg",
    prompt: "将图片中的人物变成玩偶形状的氦气球",
    needsReferenceImage: true,
    referenceNote: "一张半身或者全身单人照片。"
  },
  {
    id: 10,
    title: "讽刺漫画生成",
    author: "@dotey",
    originalLink: "https://x.com/dotey/status/1910514811756065159",
    imagePath: "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/examples/example_maga_hat_cartoon.jpeg",
    prompt: "一幅讽刺漫画风格的插画，采用复古美式漫画风格，背景是一个多层货架，货架上都是一样的红色棒球帽，帽子正面印有大字标语MAKE AMERICA GREAT AGAIN，帽侧贴着白色标签写着MADE IN CHINA，特写视角聚焦其中一顶红色棒球帽。画面下方有价格牌，原价$50.00被粗黑线X划掉，改为$77.00，色调为怀旧的土黄与暗红色调，阴影处理带有90年代复古印刷质感。整体构图风格夸张讽刺，具讽刺政治消费主义的意味。",
    needsReferenceImage: false
  }
,
  {
    id: 11,
    title: "PS2 游戏封面 (GTA x Shrek)",
    author: "@dotey",
    originalLink: "https://x.com/dotey/status/1904978767090524372",
    imagePath: "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/examples/example_ps2_gta_shrek.jpeg",
    prompt: "Can you create a PS2 video game case of \"Grand Theft Auto: Far Far Away\" a GTA based in the Shrek Universe.",
    needsReferenceImage: false
  },
  {
    id: 12,
    title: "3D 情侣珠宝盒摆件",
    author: "@dotey",
    originalLink: "https://x.com/dotey/status/1909332895115714835",
    imagePath: "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/examples/example_3d_collectible_couple_box.jpeg",
    prompt: "根据照片上的内容打造一款细致精美、萌趣可爱的3D渲染收藏摆件，装置在柔和粉彩色调、温馨浪漫的展示盒中。展示盒为浅奶油色搭配柔和的金色装饰，形似精致的便携珠宝盒。打开盒盖，呈现出一幕温暖浪漫的场景：两位Q版角色正甜蜜相望。盒顶雕刻着\"FOREVER TOGETHER\"（永远在一起）的字样，周围点缀着小巧精致的星星与爱心图案。\n盒内站着照片上的女性，手中捧着一束小巧的白色花束。她的身旁是她的伴侣，照片上的男性。两人都拥有大而闪亮、充满表现力的眼睛，以及柔和、温暖的微笑，传递出浓浓的爱意和迷人的气质。\n他们身后有一扇圆形窗户，透过窗户能看到阳光明媚的中国古典小镇天际线和轻柔飘浮的云朵。盒内以温暖的柔和光线进行照明，背景中漂浮着花瓣点缀气氛。整个展示盒和角色的色调优雅和谐，营造出一个奢华而梦幻的迷你纪念品场景。\n尺寸：9:16",
    needsReferenceImage: true,
    referenceNote: "一张情侣照片。"
  },
  {
    id: 13,
    title: "3D Q版风格",
    author: "@dotey",
    originalLink: "https://x.com/dotey/status/1908194518345678865",
    imagePath: "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/examples/example_photo_to_3d_q.png",
    prompt: "将场景中的角色转化为3D Q版风格，同时保持原本的场景布置和服装造型不变。",
    needsReferenceImage: true,
    referenceNote: "一张照片。"
  },
  {
    id: 14,
    title: "《海贼王》主题手办制作",
    author: "@dotey",
    originalLink: "https://x.com/dotey/status/1909047547563213145",
    imagePath: "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/examples/example_one_piece_figure_creation.png",
    prompt: "把照片中的人物变成《海贼王》（One Piece）动漫主题手办包装盒的风格，以等距视角（isometric）呈现。包装盒内展示的是基于照片人物的《海贼王》动漫画风设计的形象，旁边搭配有日常必备物品（手枪、手表、西装和皮鞋）同时，在包装盒旁边还应呈现该手办本体的实物效果，采用逼真的、具有真实感的渲染风格。",
    needsReferenceImage: true,
    referenceNote: "一张半身或者全身照片。",
    additionalNote: "日常必备物品此处稍作修改。请参考原文。"
  },
  {
    id: 15,
    title: "讽刺海报生成",
    author: "@ZHO_ZHO_ZHO",
    originalLink: "https://x.com/ZHO_ZHO_ZHO/status/1905287637084274742",
    imagePath: "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/examples/example_gpt_involution_poster.png",
    prompt: "为我生成讽刺海报：GPT 4o 狂卷，都别干图像AI了 还是送外卖吧",
    needsReferenceImage: false
  },
  {
    id: 16,
    title: "布丁老虎机",
    author: "@ZHO_ZHO_ZHO",
    originalLink: "https://x.com/ZHO_ZHO_ZHO/status/1911107569073926613",
    imagePath: "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/examples/example_pudding_slot.jpeg",
    prompt: "生成一个布丁老虎机，三个轮盘，每个轮盘上有不同的布丁，有一个拉杆，老虎机上方有一个大大的\"布丁\"两个字，下方有一个投币口，整体是可爱的3D风格",
    needsReferenceImage: false
  },
  {
    id: 17,
    title: "动漫风格转换",
    author: "@dotey",
    originalLink: "https://x.com/dotey/status/1908194518345678865",
    imagePath: "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/examples/example_relativity_manga.jpeg",
    prompt: "将照片中的人物转换为动漫风格，保持原有的姿势、表情和服装。",
    needsReferenceImage: true,
    referenceNote: "一张人物照片。"
  },
  {
    id: 18,
    title: "3D 卡通风格",
    author: "@dotey",
    originalLink: "https://x.com/dotey/status/1908194518345678865",
    imagePath: "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/examples/example_social_media_doodle.jpeg",
    prompt: "将照片中的人物转换为3D卡通风格，保持原有的姿势、表情和服装。",
    needsReferenceImage: true,
    referenceNote: "一张人物照片。"
  },
  {
    id: 19,
    title: "像素艺术风格",
    author: "@dotey",
    originalLink: "https://x.com/dotey/status/1908194518345678865",
    imagePath: "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/examples/example_naruto_stickers.jpeg",
    prompt: "将照片中的人物转换为像素艺术风格，保持原有的姿势、表情和服装。",
    needsReferenceImage: true,
    referenceNote: "一张人物照片。"
  },
  {
    id: 20,
    title: "水彩画风格",
    author: "@dotey",
    originalLink: "https://x.com/dotey/status/1908194518345678865",
    imagePath: "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/examples/example_textbook_redraw.jpeg",
    prompt: "将照片中的人物转换为水彩画风格，保持原有的姿势、表情和服装。",
    needsReferenceImage: true,
    referenceNote: "一张人物照片。"
  },
  {
    id: 21,
    title: "RPG 角色卡",
    author: "@dotey",
    originalLink: "https://x.com/dotey/status/1908910838636765204",
    imagePath: "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/examples/example_rpg_card_designer.png",
    prompt: "将照片中的人物转换为RPG游戏角色卡片，包含姓名、职业、等级、属性值和技能描述。",
    needsReferenceImage: true,
    referenceNote: "一张人物照片。"
  },
  {
    id: 22,
    title: "3D 卡通人物",
    author: "@dotey",
    originalLink: "https://x.com/dotey/status/1908910838636765204",
    imagePath: "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/examples/example_titanic_q_realistic.jpeg",
    prompt: "将照片中的人物转换为3D卡通人物，保持原有的姿势、表情和服装。",
    needsReferenceImage: true,
    referenceNote: "一张人物照片。"
  },
  {
    id: 23,
    title: "动漫角色转换",
    author: "@dotey",
    originalLink: "https://x.com/dotey/status/1908910838636765204",
    imagePath: "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/examples/example_two_panel_manga_president.jpeg",
    prompt: "将照片中的人物转换为动漫角色，保持原有的姿势、表情和服装。",
    needsReferenceImage: true,
    referenceNote: "一张人物照片。"
  },
  {
    id: 24,
    title: "3D 渲染场景",
    author: "@ZHO_ZHO_ZHO",
    originalLink: "https://x.com/ZHO_ZHO_ZHO/status/1910698005193515370",
    imagePath: "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/examples/example_university_mascot_npu.jpeg",
    prompt: "创建一个3D渲染的场景，包含一张床、书架、沙发、电脑桌和电脑，墙上挂着绘画，有绿植，窗外是城市夜景。使用可爱的3D风格，C4D渲染，轴测图。",
    needsReferenceImage: false
  },
  {
    id: 25,
    title: "Q版人物转换",
    author: "@balconychy",
    originalLink: "https://x.com/balconychy/status/1909417750587486469",
    imagePath: "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/examples/example_paper_cutout_job_ad.jpeg",
    prompt: "将照片中的人物转换为Q版人物，保持原有的姿势、表情和服装。",
    needsReferenceImage: true,
    referenceNote: "一张人物照片。"
  },
  {
    id: 26,
    title: "像素艺术场景",
    author: "@dotey",
    originalLink: "https://x.com/dotey/status/1908194518345678865",
    imagePath: "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/examples/example_notebook_promo.png",
    prompt: "创建一个像素艺术风格的场景，包含一个小镇、树木、河流和山脉。",
    needsReferenceImage: false
  },
  {
    id: 27,
    title: "水墨画风格",
    author: "@dotey",
    originalLink: "https://x.com/dotey/status/1908194518345678865",
    imagePath: "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/examples/example_miniature_journey_west.jpeg",
    prompt: "将照片中的人物转换为中国水墨画风格，保持原有的姿势、表情和服装。",
    needsReferenceImage: true,
    referenceNote: "一张人物照片。"
  },
  {
    id: 28,
    title: "赛博朋克风格",
    author: "@dotey",
    originalLink: "https://x.com/dotey/status/1908194518345678865",
    imagePath: "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/examples/example_matryoshka_pearl_earring.png",
    prompt: "将照片中的人物转换为赛博朋克风格，保持原有的姿势、表情和服装。",
    needsReferenceImage: true,
    referenceNote: "一张人物照片。"
  },
  {
    id: 29,
    title: "复古游戏风格",
    author: "@dotey",
    originalLink: "https://x.com/dotey/status/1904978767090524372",
    imagePath: "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/examples/example_pearl_earring_ootd.png",
    prompt: "创建一个复古游戏风格的场景，包含像素艺术角色和环境。",
    needsReferenceImage: false
  },
  {
    id: 30,
    title: "卡通肖像",
    author: "@dotey",
    originalLink: "https://x.com/dotey/status/1908194518345678865",
    imagePath: "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/examples/example_minimalist_3d_toilet.png",
    prompt: "将照片中的人物转换为卡通肖像，保持原有的姿势、表情和服装。",
    needsReferenceImage: true,
    referenceNote: "一张人物照片。"
  },
  {
    id: 31,
    title: "油画风格",
    author: "@dotey",
    originalLink: "https://x.com/dotey/status/1908194518345678865",
    imagePath: "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/examples/example_minimalist_3d_toilet_txt.jpeg",
    prompt: "将照片中的人物转换为油画风格，保持原有的姿势、表情和服装。",
    needsReferenceImage: true,
    referenceNote: "一张人物照片。"
  },
  {
    id: 32,
    title: "浮世绘风格",
    author: "@dotey",
    originalLink: "https://x.com/dotey/status/1908194518345678865",
    imagePath: "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/examples/example_master_oats_ad.png",
    prompt: "将照片中的人物转换为浮世绘风格，保持原有的姿势、表情和服装。",
    needsReferenceImage: true,
    referenceNote: "一张人物照片。"
  },
  {
    id: 33,
    title: "低多边形风格",
    author: "@dotey",
    originalLink: "https://x.com/dotey/status/1908194518345678865",
    imagePath: "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/examples/funko-pop-james-bond-figure-and-box.png",
    prompt: "将照片中的人物转换为低多边形风格，保持原有的姿势、表情和服装。",
    needsReferenceImage: true,
    referenceNote: "一张人物照片。"
  },
  {
    id: 34,
    title: "黑白素描风格",
    author: "@dotey",
    originalLink: "https://x.com/dotey/status/1908194518345678865",
    imagePath: "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/examples/example_happy_capsule.png",
    prompt: "将照片中的人物转换为黑白素描风格，保持原有的姿势、表情和服装。",
    needsReferenceImage: true,
    referenceNote: "一张人物照片。"
  },
  {
    id: 35,
    title: "彩色铅笔风格",
    author: "@dotey",
    originalLink: "https://x.com/dotey/status/1908194518345678865",
    imagePath: "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/examples/example_art_figures_go.jpeg.jpeg",
    prompt: "将照片中的人物转换为彩色铅笔风格，保持原有的姿势、表情和服装。",
    needsReferenceImage: true,
    referenceNote: "一张人物照片。"
  },
  {
    id: 36,
    title: "马赛克风格",
    author: "@dotey",
    originalLink: "https://x.com/dotey/status/1908194518345678865",
    imagePath: "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/examples/example_hand_drawn_infographic_cognition.jpeg",
    prompt: "将照片中的人物转换为马赛克风格，保持原有的姿势、表情和服装。",
    needsReferenceImage: true,
    referenceNote: "一张人物照片。"
  },
  {
    id: 37,
    title: "涂鸦风格",
    author: "@dotey",
    originalLink: "https://x.com/dotey/status/1908194518345678865",
    imagePath: "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/examples/example_3d_q_snowglobe_couple.jpeg",
    prompt: "将照片中的人物转换为涂鸦风格，保持原有的姿势、表情和服装。",
    needsReferenceImage: true,
    referenceNote: "一张人物照片。"
  },
  {
    id: 38,
    title: "剪纸风格",
    author: "@dotey",
    originalLink: "https://x.com/dotey/status/1908194518345678865",
    imagePath: "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/examples/example_35mm_moscow_flying_island.jpeg",
    prompt: "将照片中的人物转换为剪纸风格，保持原有的姿势、表情和服装。",
    needsReferenceImage: true,
    referenceNote: "一张人物照片。"
  },
  {
    id: 39,
    title: "拼贴艺术风格",
    author: "@dotey",
    originalLink: "https://x.com/dotey/status/1908194518345678865",
    imagePath: "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/examples/example_3d_collectible_couple_box.jpeg",
    prompt: "将照片中的人物转换为拼贴艺术风格，保持原有的姿势、表情和服装。",
    needsReferenceImage: true,
    referenceNote: "一张人物照片。"
  },
  {
    id: 40,
    title: "印象派风格",
    author: "@dotey",
    originalLink: "https://x.com/dotey/status/1908194518345678865",
    imagePath: "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/examples/example_almanac_calendar_illustration.jpeg",
    prompt: "将照片中的人物转换为印象派风格，保持原有的姿势、表情和服装。",
    needsReferenceImage: true,
    referenceNote: "一张人物照片。"
  },
  {
    id: 41,
    title: "立体派风格",
    author: "@dotey",
    originalLink: "https://x.com/dotey/status/1908194518345678865",
    imagePath: "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/examples/example_chibi_emoji_pack.png",
    prompt: "将照片中的人物转换为立体派风格，保持原有的姿势、表情和服装。",
    needsReferenceImage: true,
    referenceNote: "一张人物照片。"
  },
  {
    id: 42,
    title: "波普艺术风格",
    author: "@dotey",
    originalLink: "https://x.com/dotey/status/1908194518345678865",
    imagePath: "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/examples/example_chinese_wedding_invitation.jpeg",
    prompt: "将照片中的人物转换为波普艺术风格，保持原有的姿势、表情和服装。",
    needsReferenceImage: true,
    referenceNote: "一张人物照片。"
  },
  {
    id: 43,
    title: "超现实主义风格",
    author: "@dotey",
    originalLink: "https://x.com/dotey/status/1908194518345678865",
    imagePath: "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/examples/example_digimon_style.jpeg",
    prompt: "将照片中的人物转换为超现实主义风格，保持原有的姿势、表情和服装。",
    needsReferenceImage: true,
    referenceNote: "一张人物照片。"
  },
  {
    id: 44,
    title: "极简主义风格",
    author: "@dotey",
    originalLink: "https://x.com/dotey/status/1908194518345678865",
    imagePath: "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/examples/example_einstein_stickfigure_emoji.jpeg",
    prompt: "将照片中的人物转换为极简主义风格，保持原有的姿势、表情和服装。",
    needsReferenceImage: true,
    referenceNote: "一张人物照片。"
  },
  {
    id: 45,
    title: "蒸汽波风格",
    author: "@dotey",
    originalLink: "https://x.com/dotey/status/1908194518345678865",
    imagePath: "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/examples/example_family_wedding_photo_q.jpeg",
    prompt: "将照片中的人物转换为蒸汽波风格，保持原有的姿势、表情和服装。",
    needsReferenceImage: true,
    referenceNote: "一张人物照片。"
  },
  {
    id: 46,
    title: "哥特风格",
    author: "@dotey",
    originalLink: "https://x.com/dotey/status/1908194518345678865",
    imagePath: "https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/examples/example_fantasy_computer_head_portal.jpeg",
    prompt: "将照片中的人物转换为哥特风格，保持原有的姿势、表情和服装。",
    needsReferenceImage: true,
    referenceNote: "一张人物照片。"
  }
];
