export interface SlideContent {
  id: number;
  type: 'title' | 'text' | 'bullet' | 'image' | 'two-column' | 'quote' | 'section' | 'thank-you';
  title: string;
  subtitle?: string;
  content?: string | string[];
  leftColumn?: { title: string; items: string[] };
  rightColumn?: { title: string; items: string[] };
  quoteAuthor?: string;
  badge?: string;
  iconName?: string;
}

export const SAMPLE_PRESENTATION_TITLE = 'Introduction to Artificial Intelligence';

export const SAMPLE_SLIDES: SlideContent[] = [
  {
    id: 1,
    type: 'title',
    title: 'Introduction to Artificial Intelligence',
    subtitle: 'Exploring the Foundations, Applications, and Future of Intelligent Systems',
    badge: 'Live Presentation',
  },
  {
    id: 2,
    type: 'text',
    title: 'What is Artificial Intelligence?',
    subtitle: 'Understanding modern machine intelligence',
    content: [
      'Artificial Intelligence (AI) refers to the simulation of human intelligence in machines that are programmed to think, learn, and solve complex problems.',
      'From simple rule-based automation to complex neural networks, AI empowers software to perceive environments, reason through options, and make autonomous decisions.',
    ],
    badge: 'Foundations',
  },
  {
    id: 3,
    type: 'two-column',
    title: 'AI vs Machine Learning vs Deep Learning',
    subtitle: 'A hierarchical relationship of technologies',
    leftColumn: {
      title: 'Machine Learning (ML)',
      items: [
        'A subset of AI focused on data-driven learning',
        'Algorithms parse data, learn rules, and make predictions',
        'Requires feature engineering by domain experts',
        'Includes Supervised, Unsupervised, and Reinforcement Learning',
      ],
    },
    rightColumn: {
      title: 'Deep Learning (DL)',
      items: [
        'A specialized subset of Machine Learning using Neural Networks',
        'Inspired by the biological neural structure of the human brain',
        'Automatically extracts features from raw data (images, audio, text)',
        'Powers modern breakthroughs in GenAI, Vision, and LLMs',
      ],
    },
    badge: 'Hierarchy',
  },
  {
    id: 4,
    type: 'bullet',
    title: 'Real-World Applications of AI',
    subtitle: 'Transforming global industries today',
    content: [
      '🏥 Healthcare: Automated medical image diagnosis, precision drug discovery, and predictive patient monitoring.',
      '💳 Finance: Algorithmic trading, real-time fraud detection, and credit scoring risk models.',
      '🚗 Transportation: Self-driving vehicles, traffic optimization, and autonomous delivery drones.',
      '🎨 Creative & Tech: Natural language assistants, automated code synthesis, and generative media creation.',
    ],
    badge: 'Impact',
  },
  {
    id: 5,
    type: 'section',
    title: 'The Machine Learning Pipeline',
    subtitle: 'From Raw Data to Production Intelligence',
    badge: 'Architecture',
  },
  {
    id: 6,
    type: 'two-column',
    title: 'Generative AI & Large Language Models',
    subtitle: 'The frontier of multimodal foundation models',
    leftColumn: {
      title: 'Transformer Architecture',
      items: [
        'Introduced in 2017 ("Attention Is All You Need")',
        'Self-attention mechanisms process sequence context in parallel',
        'Enables scaling to hundreds of billions of parameters',
      ],
    },
    rightColumn: {
      title: 'Capabilities & Uses',
      items: [
        'Text Generation & Summarization',
        'Code Autocompletion & Refactoring',
        'Image, Video, & Audio Synthesis',
        'Autonomous Reasoning & Tool-Use Agents',
      ],
    },
    badge: 'Generative AI',
  },
  {
    id: 7,
    type: 'quote',
    title: 'The Vision for Tomorrow',
    content: 'The development of full artificial intelligence could spell the end of the human race... or it could be the greatest event in human history. The tools we build today shape our collective tomorrow.',
    quoteAuthor: 'Stephen Hawking',
    badge: 'Perspective',
  },
  {
    id: 8,
    type: 'thank-you',
    title: 'Thank You!',
    subtitle: 'Questions & Live Q&A Session',
    content: ['Session Hosted via LiveControl', 'Control the room. Engage everyone.'],
    badge: 'LiveControl',
  },
];
