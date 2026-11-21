export interface PinnedScripture {
  ref: string;
  verses: {
    verseNum: string;
    telugu: string;
    english: string;
  }[];
}

export interface SlideContent {
  id: number;
  type: 'title' | 'text' | 'bullet' | 'image' | 'two-column' | 'quote' | 'section' | 'thank-you';
  title: string;
  subtitle?: string;
  content?: string | string[];
  teluguText?: string;
  englishText?: string;
  expectedAnswer?: string;
  imageUrl?: string;
  pinnedScripture?: PinnedScripture;
  leftColumn?: { title: string; items: string[] };
  rightColumn?: { title: string; items: string[] };
  quoteAuthor?: string;
  badge?: string;
}

export const JAMES_SCRIPTURE_REFERENCE: PinnedScripture = {
  ref: 'James 4:13–15 (యాకోబు 4:13–15)',
  verses: [
    {
      verseNum: '13',
      telugu: 'నేడైనను రేపైనను ఒకానొక పట్టణమునకు వెళ్లి అక్కడ ఒక సంవత్సరముండి వ్యాపారముచేసి లాభము సంపాదింతము రండని చెప్పుకొనువార లారా,',
      english: "Now listen, you who say, 'Today or tomorrow we will go to this or that city, spend a year there, carry on business and make money.'",
    },
    {
      verseNum: '14',
      telugu: 'రేపేమి సంభవించునో మీకు తెలియదు. మీ జీవమేపాటిది? మీరు కొంతసేపు కనబడి అంతలో మాయమైపోవు ఆవిరి వంటివారే.',
      english: 'Why, you do not even know what will happen tomorrow. What is your life? You are a mist that appears for a little while and then vanishes.',
    },
    {
      verseNum: '15',
      telugu: 'కనుక ప్రభువు చిత్తమైతే మనము బ్రదికియుండి ఇది అది చేతమని చెప్పుకొనవలెను.',
      english: "Instead, you ought to say, 'If it is the Lord\\'s will, we will live and do this or that.'",
    },
  ],
};

export const PRIORITY_BIBLE_STUDY_TITLE = 'Priority Bible Study';
export const AI_PRESENTATION_TITLE = 'Introduction to Artificial Intelligence';
export const SAMPLE_PRESENTATION_TITLE = PRIORITY_BIBLE_STUDY_TITLE;

export const PRIORITY_BIBLE_STUDY_SLIDES: SlideContent[] = [
  {
    id: 1,
    type: 'text',
    title: 'James 4:13–15 (యాకోబు 4:13–15)',
    subtitle: 'Priority Bible Study — Scriptural Foundation',
    badge: 'Scripture',
    content: [
      '13. నేడైనను రేపైనను ఒకానొక పట్టణమునకు వెళ్లి అక్కడ ఒక సంవత్సరముండి వ్యాపారముచేసి లాభము సంపాదింతము రండని చెప్పుకొనువార లారా,',
      "13. Now listen, you who say, 'Today or tomorrow we will go to this or that city, spend a year there, carry on business and make money.'",
      '14. రేపేమి సంభవించునో మీకు తెలియదు. మీ జీవమేపాటిది? మీరు కొంతసేపు కనబడి అంతలో మాయమైపోవు ఆవిరి వంటివారే.',
      '14. Why, you do not even know what will happen tomorrow. What is your life? You are a mist that appears for a little while and then vanishes.',
      '15. కనుక ప్రభువు చిత్తమైతే మనము బ్రదికియుండి ఇది అది చేతమని చెప్పుకొనవలెను.',
      "15. Instead, you ought to say, 'If it is the Lord\\'s will, we will live and do this or that.'",
    ],
  },
  {
    id: 2,
    type: 'text',
    title: 'Question 1',
    subtitle: 'Observation from Scripture',
    badge: 'Question 1',
    pinnedScripture: JAMES_SCRIPTURE_REFERENCE,
    englishText: 'According to verse 13, what were these people planning to do?',
    teluguText: '13వ వచనములో ఈ వ్యక్తులు ఏమి చేయాలని ప్రణాళిక వేసుకున్నారు?',
  },
  {
    id: 3,
    type: 'text',
    title: 'Answer',
    subtitle: 'Observation from Verse 13',
    badge: 'Answer',
    pinnedScripture: JAMES_SCRIPTURE_REFERENCE,
    expectedAnswer: 'They planned to travel, stay for a year, do business, and make profits.',
  },
  {
    id: 4,
    type: 'text',
    title: 'Question 2',
    subtitle: 'Spiritual Discernment',
    badge: 'Question 2',
    pinnedScripture: JAMES_SCRIPTURE_REFERENCE,
    englishText: 'What was wrong with their attitude toward the future?',
    teluguText: 'భవిష్యత్తు గురించి వారి ఆలోచనలో ఉన్న తప్పు ఏమిటి?',
  },
  {
    id: 5,
    type: 'text',
    title: 'Answer',
    subtitle: 'Self-Reliance vs. God-Reliance',
    badge: 'Answer',
    pinnedScripture: JAMES_SCRIPTURE_REFERENCE,
    expectedAnswer: 'They were speaking as if they had complete control over their future without acknowledging God.',
  },
  {
    id: 6,
    type: 'text',
    title: 'Question 3',
    subtitle: 'The Uncertainty of Tomorrow',
    badge: 'Question 3',
    pinnedScripture: JAMES_SCRIPTURE_REFERENCE,
    englishText: 'Why does James say, "You know not what shall be on the morrow"?',
    teluguText: '"రేపు ఏమి జరుగునో మీకు తెలియదు" అని యాకోబు ఎందుకు చెబుతున్నాడు?',
  },
  {
    id: 7,
    type: 'text',
    title: 'Answer',
    subtitle: 'God in Control of Time',
    badge: 'Answer',
    pinnedScripture: JAMES_SCRIPTURE_REFERENCE,
    expectedAnswer: 'Because we are not in control of tomorrow. Only God knows the future.',
    imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 8,
    type: 'text',
    title: 'Question 4',
    subtitle: 'The Brevity of Life',
    badge: 'Question 4',
    pinnedScripture: JAMES_SCRIPTURE_REFERENCE,
    englishText: 'Why does the Bible compare our life to a vapor?',
    teluguText: 'మన జీవితాన్ని ఆవిరితో ఎందుకు పోల్చారు?',
  },
  {
    id: 9,
    type: 'text',
    title: 'Answer',
    subtitle: 'Eternal Perspective',
    badge: 'Answer',
    pinnedScripture: JAMES_SCRIPTURE_REFERENCE,
    expectedAnswer: 'Because life is temporary, short, and uncertain. We should not waste it living without God.',
    imageUrl: 'https://images.unsplash.com/photo-1487621167305-5d248087c724?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 10,
    type: 'text',
    title: 'Question 5',
    subtitle: 'Planning and God’s Sovereignty',
    badge: 'Question 5',
    pinnedScripture: JAMES_SCRIPTURE_REFERENCE,
    englishText: 'Does this verse mean that we should not make plans for our future?',
    teluguText: 'ఈ వచనం మన భవిష్యత్తు గురించి ప్రణాళికలు చేసుకోకూడదని చెబుతుందా?',
  },
  {
    id: 11,
    type: 'text',
    title: 'Answer',
    subtitle: 'Submitting Plans to God',
    badge: 'Answer',
    pinnedScripture: JAMES_SCRIPTURE_REFERENCE,
    expectedAnswer: "No. Planning is good. But we should plan humbly, pray, and submit our plans to God's will.",
    content: [
      'Proverbs 16:3:',
      '"Commit to the Lord whatever you do, and he will establish your plans."',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 12,
    type: 'text',
    title: 'Question 9',
    subtitle: 'Practical Wisdom',
    badge: 'Question 9',
    pinnedScripture: JAMES_SCRIPTURE_REFERENCE,
    englishText: 'Before making an important decision, what should we do?',
    teluguText: 'జీవితంలో ముఖ్యమైన నిర్ణయం తీసుకునే ముందు మనం ఏమి చేయాలి?',
  },
  {
    id: 13,
    type: 'bullet',
    title: 'Answer',
    subtitle: 'Steps for Godly Decision Making',
    badge: 'Answer',
    pinnedScripture: JAMES_SCRIPTURE_REFERENCE,
    content: [
      'Pray.',
      "Read God's Word.",
      'Seek godly counsel.',
      'Examine our motives.',
      'Submit the decision to God.',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 14,
    type: 'text',
    title: 'Personal Prayer & Commitment',
    subtitle: 'Submission to God’s Will',
    badge: 'Reflection',
    pinnedScripture: JAMES_SCRIPTURE_REFERENCE,
    englishText: '"Lord, I have plans for my future, but if Your will is different, I am willing to __________."',
    teluguText: '"ప్రభువా, నా భవిష్యత్తు గురించి నాకు ప్రణాళికలు ఉన్నాయి. కానీ నీ చిత్తము వేరుగా ఉంటే, దానికి విధేయత చూపడానికి నేను__________."',
    imageUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 15,
    type: 'image',
    title: "David's Life",
    subtitle: 'Anointed Leader Seeking God',
    badge: 'David’s Journey',
    pinnedScripture: JAMES_SCRIPTURE_REFERENCE,
    imageUrl: 'https://filesjlt.nyc3.cdn.digitaloceanspaces.com/bible-stories/story-posters/77b-David-Becomes-King-First-At-Hebron-Then-On-To-Zion.jpg',
  },
  {
    id: 16,
    type: 'image',
    title: 'Morning Prayer & Seeking God',
    subtitle: 'Psalm 5:3',
    badge: 'Psalm 5:3',
    content: [
      'In the morning, Lord, you hear my voice; in the morning I lay my requests before you and wait expectantly. Psalm 5:3',
      "David gave God his first moments of the day. Before facing the day's challenges, he sought the Lord.",
    ],
    imageUrl: 'https://christianitymalaysia.com/wp/wp-content/uploads/2022/12/Ek2eH5PXEAAmH0Q.jpg',
  },
  {
    id: 17,
    type: 'image',
    title: 'Question 1: Daily Focus',
    subtitle: 'Examining Morning Priorities',
    badge: 'Reflection',
    englishText: 'Who or what receives your first attention in the morning—God, your phone, social media, or something else?',
    teluguText: 'ఉదయమున నీవు మొదట ఎవరికి లేదా దేనికి ప్రాధాన్యత ఇస్తావు—దేవునికా, నీ ఫోన్కా, సోషల్ మీడియాకా, లేక వేరే దానికా?',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXOz0t9uesMsY4UD_xZcWkCDTKIwNDtwRlceuxjRnisoweoAuAQwJOzigG&s=10',
  },
  {
    id: 18,
    type: 'text',
    title: 'Unceasing Prayer',
    subtitle: 'Psalm 55:17',
    badge: 'Psalm 55:17',
    englishText: 'English (KJV):\n"Evening, and morning, and at noon, will I pray, and cry aloud: and he shall hear my voice."',
    teluguText: 'తెలుగు:\nసాయంకాలమున ఉదయమున మధ్యాహ్నమున నేను మొఱ్ఱపెట్టుచు ప్రార్థించెదను; ఆయన నా స్వరము వినును.',
    imageUrl: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 19,
    type: 'text',
    title: 'Question 2: Continuous Fellowship',
    subtitle: 'Everyday Relationship with God',
    badge: 'Reflection',
    englishText: 'Do you remember God only when you have problems, or do you talk to Him throughout your day?',
    teluguText: 'నీకు సమస్యలు వచ్చినప్పుడు మాత్రమే దేవునిని జ్ఞాపకం చేసుకుంటావా, లేక రోజంతా ఆయనతో మాట్లాడుతుంటావా?',
  },
  {
    id: 20,
    type: 'text',
    title: 'Night Meditation',
    subtitle: 'Psalm 63:6',
    badge: 'Psalm 63:6',
    englishText: 'On my bed I remember you; I think of you through the watches of the night. Psalm 63:6',
    teluguText: 'నా మంచముమీద నిన్ను జ్ఞాపకము చేసికొని రాత్రి జాములయందు నిన్ను ధ్యానించునప్పుడు Psalm 63:6',
  },
  {
    id: 21,
    type: 'image',
    title: 'Thoughts Turned Toward God',
    subtitle: 'Quiet Moments in the Night',
    badge: 'Meditation',
    content: [
      'Even when David was lying on his bed, when he had free time, and during the night, his thoughts turned toward God.',
    ],
    imageUrl: 'https://userscontent2.emaze.com/images/7c14e1be-90e3-412e-98e8-7cb6c5782abc/fae296a4-e3e4-4b7b-aa4d-73dcf4d516fc.jpg',
  },
  {
    id: 22,
    type: 'text',
    title: 'Question: Leisure Time',
    subtitle: 'Reflecting on Quiet Moments',
    badge: 'Question',
    englishText: 'When do we have leisure time?',
    content: ['When do we have leisure time?'],
  },
  {
    id: 23,
    type: 'bullet',
    title: 'Our Leisure Moments',
    subtitle: 'Redeeming Quiet Opportunities',
    badge: 'Daily Life',
    content: [
      'While travelling',
      'During breaks',
      'Before sleeping',
      'When we are alone',
      'When we have nothing to do',
      'David used moments of quietness to remember and meditate upon God.',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 24,
    type: 'text',
    title: 'Seeking God Before Battle',
    subtitle: '1 Samuel 23:1–4',
    badge: '1 Samuel 23:1–4',
    content: [
      'తరువాత ఫిలిష్తీయులు కెయీలామీద యుద్ధము చేసి కల్లములమీది ధాన్యమును దోచుకొనుచున్నారని దావీదునకు వినబడెను.',
      'When David was told, "Look, the Philistines are fighting against Keilah and are looting the threshing floors,"',
      'అంతట దావీదునేను వెళ్లి యీ ఫిలిష్తీయులను హతము చేయుదునా అని యెహోవా యొద్ద విచారణచేయగా యెహోవానీవు వెళ్లి ఫిలిష్తీ యులను హతముచేసి కెయీలాను రక్షించుమని దావీదునకు సెలవిచ్చెను.',
      'he inquired of the Lord, saying, "Shall I go and attack these Philistines?" The Lord answered him, "Go, attack the Philistines and save Keilah."',
      'దావీదుతో కూడియున్న జనులుమేము ఇచ్చట యూదా దేశములో ఉండినను మాకు భయముగా నున్నది; ఫిలిష్తీయుల సైన్యములకెదురుగా కెయీలాకు మేము వచ్చినయెడల మరింత భయము కలుగును గదా అని దావీదుతో అనగా',
      'But David\'s men said to him, "Here in Judah we are afraid. How much more, then, if we go to Keilah against the Philistine forces!"',
      'దావీదు మరల యెహోవాయొద్ద విచారణ చేసెనునీవు లేచి కెయీలాకు వెళ్లుము, ఫిలిష్తీయులను నీ చేతికి అప్పగించుదునని యెహోవా సెలవియ్యగా',
      'Once again David inquired of the Lord, and the Lord answered him, "Go down to Keilah, for I am going to give the Philistines into your hand."',
    ],
  },
  {
    id: 25,
    type: 'bullet',
    title: 'King David Timeline',
    subtitle: "A Life Governed by God's Direction",
    badge: 'Timeline',
    content: [
      'David was anointed by Samuel',
      'David defeated Goliath',
      'Saul became jealous of David (Because people praised David)',
      'David had to run away from Saul. He was hiding in caves, wilderness areas and mountains, trying to save his life.',
      "Even while hiding from Saul, David sought God's direction before making important decisions.",
      'Saul and his sons died in battle against the Philistines.',
      'David finally became king',
    ],
  },
  {
    id: 26,
    type: 'text',
    title: 'Priority in Difficult Times',
    subtitle: 'When Prayers Seem Delayed',
    badge: 'Reflection',
    englishText: 'Is God still your priority when your prayers are not answered immediately or when things are not going well?',
    teluguText: 'నీ ప్రార్థనలకు వెంటనే జవాబు రాకపోయినా, నీ జీవితంలో పరిస్థితులు బాగాలేకపోయినా దేవుడు నీ ప్రాధాన్యతగానే ఉంటాడా?',
  },
  {
    id: 27,
    type: 'text',
    title: 'David’s Praise in Troubles',
    subtitle: 'Continual Worship',
    badge: 'Praise',
    content: [
      'Psalm 34:1',
      'నేనెల్లప్పుడు యెహోవాను సన్నుతించెదను. నిత్యము ఆయన కీర్తి నా నోట నుండును.',
      'I will extol the Lord at all times; his praise will always be on my lips.',
      'Psalm 119:164',
      'నీ న్యాయవిధులనుబట్టి దినమునకు ఏడు మారులు నేను నిన్ను స్తుతించు చున్నాను.',
      'Seven times a day I praise you for your righteous laws.',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 28,
    type: 'text',
    title: 'Heart Evaluation',
    subtitle: 'What is Your Deepest Longing?',
    badge: 'Reflection',
    englishText: 'If God asked you, "What is the one thing you desire most in your life?" what would your answer be?',
    teluguText: 'దేవుడు నిన్ను "నీ జీవితంలో అన్నిటికంటే ఎక్కువగా కోరుకునే ఒక విషయం ఏమిటి?" అని అడిగితే, నీ సమాధానం ఏమిటి?',
  },
  {
    id: 29,
    type: 'text',
    title: 'What David Says',
    subtitle: 'Psalm 27:4',
    badge: 'Psalm 27:4',
    content: [
      'యెహోవాయొద్ద ఒక్క వరము అడిగితిని దానిని నేను వెదకుచున్నాను. యెహోవా ప్రసన్నతను చూచుటకును ఆయన ఆల యములో ధ్యానించుటకును నా జీవితకాలమంతయు నేను యెహోవా మందిర ములో నివసింప గోరుచున్నాను.',
      'One thing I ask from the Lord, this only do I seek: that I may dwell in the house of the Lord all the days of my life, to gaze on the beauty of the Lord and to seek him in his temple.',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 30,
    type: 'bullet',
    title: 'God’s Faithful Answer to David',
    subtitle: 'Seeking First God’s Kingdom',
    badge: 'Fulfillment',
    content: [
      'This is how David received all things in his life; God answered:',
      'Became King…',
      'Won Battles…',
      'Protected Kingdom…',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 31,
    type: 'image',
    title: 'Priority & Devotion',
    subtitle: 'Putting God First',
    badge: 'Visual Reflection',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzv6CxvhwonSz6omYkCQ4y-aGM50qac6DRSJupqFuUsJJTs4sAvJmxJMiE&s=10',
  },
  {
    id: 32,
    type: 'image',
    title: 'Living in God’s Will',
    subtitle: 'Established by God',
    badge: 'Conclusion',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSx3kWoKzaLIH3n4VEzVO5008gZIVpqfhfsKyNiqZ_iy8KGC_evVd-qROoO&s=10',
  },
];

export const AI_PRESENTATION_SLIDES: SlideContent[] = [
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
      'Healthcare: Automated medical image diagnosis, precision drug discovery, and predictive patient monitoring.',
      'Finance: Algorithmic trading, real-time fraud detection, and credit scoring risk models.',
      'Transportation: Autonomous navigation, dynamic traffic optimization, and fleet route efficiency.',
      'Creative & Technology: Natural language assistants, automated code synthesis, and generative media creation.',
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

export const PRESENTATION_DECKS: Record<string, { id: string; title: string; slides: SlideContent[] }> = {
  'priority-bible-study': {
    id: 'priority-bible-study',
    title: PRIORITY_BIBLE_STUDY_TITLE,
    slides: PRIORITY_BIBLE_STUDY_SLIDES,
  },
  'intro-ai': {
    id: 'intro-ai',
    title: AI_PRESENTATION_TITLE,
    slides: AI_PRESENTATION_SLIDES,
  },
};

export function getSlidesByTitle(title?: string): SlideContent[] {
  if (!title) return PRIORITY_BIBLE_STUDY_SLIDES;
  const lower = title.toLowerCase();
  if (lower.includes('ai') || lower.includes('artificial')) {
    return AI_PRESENTATION_SLIDES;
  }
  return PRIORITY_BIBLE_STUDY_SLIDES;
}

export const SAMPLE_SLIDES: SlideContent[] = PRIORITY_BIBLE_STUDY_SLIDES;
