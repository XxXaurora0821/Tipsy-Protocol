import { Locale, Question } from './types';

export const QUESTIONS_BY_LOCALE: Record<Locale, Question[]> = {
  en: [
    {
      id: 'mood',
      text: 'If your current mood had a color, what would it be?',
      options: [
        { id: 'm1', label: 'A quiet midnight blue', trait: 'calm' },
        { id: 'm2', label: 'A blazing sunset orange', trait: 'passionate' },
        { id: 'm3', label: 'A lively forest green', trait: 'vibrant' },
        { id: 'm4', label: 'A cool minimal gray', trait: 'sophisticated' }
      ]
    },
    {
      id: 'social',
      text: 'On your ideal evening, you would rather...',
      options: [
        { id: 'sc1', label: 'Read by the window while listening to rain', trait: 'introverted' },
        { id: 'sc2', label: 'Have a deep chat with a few close friends', trait: 'intimate' },
        { id: 'sc3', label: 'Feel the rhythm in a lively crowd', trait: 'extroverted' },
        { id: 'sc4', label: 'Meet new people at an elegant dinner', trait: 'ambitious' }
      ]
    },
    {
      id: 'taste_base',
      text: 'Your first impression of life feels more like...',
      options: [
        { id: 'tb1', label: 'Bittersweet, with depth that lingers', trait: 'complex' },
        { id: 'tb2', label: 'A direct hit of clean sweetness', trait: 'straightforward' },
        { id: 'tb3', label: 'A crisp and tangy freshness', trait: 'fresh' },
        { id: 'tb4', label: 'A spicy challenge full of adventure', trait: 'bold' }
      ]
    },
    {
      id: 'texture',
      text: 'Which texture do you naturally prefer?',
      options: [
        { id: 't1', label: 'Velvety and smooth', trait: 'silky' },
        { id: 't2', label: 'Crystal-cool and clean', trait: 'crisp' },
        { id: 't3', label: 'Sparkling and playful', trait: 'effervescent' },
        { id: 't4', label: 'Dense, gritty, and powerful', trait: 'rich' }
      ]
    },
    {
      id: 'travel',
      text: 'If you could leave right now, where would you go?',
      options: [
        { id: 'tr1', label: 'Historic old Kyoto', trait: 'zen' },
        { id: 'tr2', label: 'A sunny island beach', trait: 'relaxing' },
        { id: 'tr3', label: 'The nonstop pulse of New York', trait: 'urban' },
        { id: 'tr4', label: 'The misty Scottish Highlands', trait: 'mystical' }
      ]
    },
    {
      id: 'music',
      text: 'What soundtrack is playing in your mind right now?',
      options: [
        { id: 'mu1', label: 'Free-form improvised jazz', trait: 'creative' },
        { id: 'mu2', label: 'Precise and grand classical music', trait: 'structured' },
        { id: 'mu3', label: 'Vintage and melancholic blues', trait: 'nostalgic' },
        { id: 'mu4', label: 'Hard-driving electronic beats', trait: 'modern' }
      ]
    },
    {
      id: 'fashion',
      text: 'Your style usually reflects...',
      options: [
        { id: 'f1', label: 'A tailored formal suit', trait: 'formal' },
        { id: 'f2', label: 'Simple and natural fabrics', trait: 'natural' },
        { id: 'f3', label: 'Bold experimental design', trait: 'avant-garde' },
        { id: 'f4', label: 'Colorful bohemian expression', trait: 'expressive' }
      ]
    },
    {
      id: 'element',
      text: 'Which natural element feels most like you?',
      options: [
        { id: 'e1', label: 'Flowing, adaptive water', trait: 'adaptable' },
        { id: 'e2', label: 'Intense burning fire', trait: 'intense' },
        { id: 'e3', label: 'Grounded, supportive earth', trait: 'reliable' },
        { id: 'e4', label: 'Free and untouchable wind', trait: 'free-spirited' }
      ]
    },
    {
      id: 'afternoon',
      text: 'On a cozy afternoon, what would you pick first?',
      options: [
        { id: 'a1', label: 'A concentrated bitter espresso', trait: 'intense' },
        { id: 'a2', label: 'A fragrant and mellow oolong tea', trait: 'refined' },
        { id: 'a3', label: 'A rich Black Forest cake', trait: 'indulgent' },
        { id: 'a4', label: 'A plate of juicy tropical fruit', trait: 'clean' }
      ]
    },
    {
      id: 'ending',
      text: 'How do you want tonight to end?',
      options: [
        { id: 'ed1', label: 'Drift into deep sleep with a soft buzz', trait: 'dreamy' },
        { id: 'ed2', label: 'Finish a piece of work in a creative surge', trait: 'productive' },
        { id: 'ed3', label: 'Find comfort in a long gaze', trait: 'romantic' },
        { id: 'ed4', label: 'Feel the scale of the universe under the stars', trait: 'philosophical' }
      ]
    }
  ],
  zh: [
    {
      id: 'mood',
      text: '如果现在要为你的心情选一种底色，那会是？',
      options: [
        { id: 'm1', label: '静谧的午夜蓝', trait: 'calm' },
        { id: 'm2', label: '热烈的落日橘', trait: 'passionate' },
        { id: 'm3', label: '生机勃勃的森林绿', trait: 'vibrant' },
        { id: 'm4', label: '优雅高冷的极简灰', trait: 'sophisticated' }
      ]
    },
    {
      id: 'social',
      text: '在一个理想的夜晚，你更倾向于？',
      options: [
        { id: 'sc1', label: '独自在窗边听雨读书', trait: 'introverted' },
        { id: 'sc2', label: '与三两知己深度长谈', trait: 'intimate' },
        { id: 'sc3', label: '在人群中感受节奏的律动', trait: 'extroverted' },
        { id: 'sc4', label: '穿梭于高级晚宴结交新朋', trait: 'ambitious' }
      ]
    },
    {
      id: 'taste_base',
      text: '你对生活的初体验往往更接近？',
      options: [
        { id: 'tb1', label: '纯粹的苦涩中带着回甘', trait: 'complex' },
        { id: 'tb2', label: '直截了当的甜蜜直击', trait: 'straightforward' },
        { id: 'tb3', label: '酸涩清脆的清新质感', trait: 'fresh' },
        { id: 'tb4', label: '辛辣而充满挑战的冒险', trait: 'bold' }
      ]
    },
    {
      id: 'texture',
      text: '你更偏爱哪种感官触感？',
      options: [
        { id: 't1', label: '丝绒般顺滑绵密', trait: 'silky' },
        { id: 't2', label: '冰晶般清凉剔透', trait: 'crisp' },
        { id: 't3', label: '气泡般跳跃灵动', trait: 'effervescent' },
        { id: 't4', label: '砂砾般厚重有力', trait: 'rich' }
      ]
    },
    {
      id: 'travel',
      text: '如果要开启一场说走就走的旅行，目的地是？',
      options: [
        { id: 'tr1', label: '充满历史底蕴的古老京都', trait: 'zen' },
        { id: 'tr2', label: '阳光明媚的海岛沙滩', trait: 'relaxing' },
        { id: 'tr3', label: '不夜城纽约的繁华中心', trait: 'urban' },
        { id: 'tr4', label: '烟雾缭绕的苏格兰高地', trait: 'mystical' }
      ]
    },
    {
      id: 'music',
      text: '此时你耳边响起的旋律更像是？',
      options: [
        { id: 'mu1', label: '即兴且自由的爵士乐', trait: 'creative' },
        { id: 'mu2', label: '严谨且宏大的古典乐', trait: 'structured' },
        { id: 'mu3', label: '复古且忧郁的蓝调', trait: 'nostalgic' },
        { id: 'mu4', label: '节奏感极强的电子舞曲', trait: 'modern' }
      ]
    },
    {
      id: 'fashion',
      text: '你的着装风格通常折射出？',
      options: [
        { id: 'f1', label: '剪裁得体的正装西服', trait: 'formal' },
        { id: 'f2', label: '简约随性的棉麻质地', trait: 'natural' },
        { id: 'f3', label: '独具匠心的前卫设计', trait: 'avant-garde' },
        { id: 'f4', label: '色彩浓烈的波西米亚', trait: 'expressive' }
      ]
    },
    {
      id: 'element',
      text: '你觉得自己更像是自然界中的哪种元素？',
      options: [
        { id: 'e1', label: '温润流动的水', trait: 'adaptable' },
        { id: 'e2', label: '炽热燃烧的火', trait: 'intense' },
        { id: 'e3', label: '深厚承载的土', trait: 'reliable' },
        { id: 'e4', label: '自由无形的风', trait: 'free-spirited' }
      ]
    },
    {
      id: 'afternoon',
      text: '一个惬意的下午，你最想品尝？',
      options: [
        { id: 'a1', label: '一杯浓郁苦涩的浓缩咖啡', trait: 'intense' },
        { id: 'a2', label: '一壶清香淡雅的乌龙茶', trait: 'refined' },
        { id: 'a3', label: '一份甜入心扉的黑森林蛋糕', trait: 'indulgent' },
        { id: 'a4', label: '一盘清爽多汁的热带水果', trait: 'clean' }
      ]
    },
    {
      id: 'ending',
      text: '你希望今晚的最后一幕是？',
      options: [
        { id: 'ed1', label: '在微醺中陷入深度睡眠', trait: 'dreamy' },
        { id: 'ed2', label: '在灵光乍现中完成一件作品', trait: 'productive' },
        { id: 'ed3', label: '在长久的对视中获得慰藉', trait: 'romantic' },
        { id: 'ed4', label: '在星空下感受宇宙的宏大', trait: 'philosophical' }
      ]
    }
  ]
};
