import { Category, Feature, MiniTool, FAQ, ProcessStep } from '@/types';

export const categories: Category[] = [
  {
    id: '1',
    name: 'Vintage Watches',
    description: 'Luxury timepieces and vintage watches from renowned brands',
    image: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=600',
    slug: 'vintage-watches',
    itemCount: 12500,
    averageValue: '$3,200'
  },
  {
    id: '2',
    name: 'Fine Art',
    description: 'Paintings, sculptures, and contemporary art pieces',
    image: 'https://images.pexels.com/photos/1070527/pexels-photo-1070527.jpeg?auto=compress&cs=tinysrgb&w=600',
    slug: 'fine-art',
    itemCount: 8900,
    averageValue: '$8,500'
  },
  {
    id: '3',
    name: 'Antique Furniture',
    description: 'Period furniture and decorative arts from various eras',
    image: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=600',
    slug: 'antique-furniture',
    itemCount: 6700,
    averageValue: '$2,800'
  },
  {
    id: '4',
    name: 'Jewelry & Gems',
    description: 'Fine jewelry, precious stones, and vintage accessories',
    image: 'https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=600',
    slug: 'jewelry-gems',
    itemCount: 15200,
    averageValue: '$4,100'
  },
  {
    id: '5',
    name: 'Collectible Coins',
    description: 'Rare coins, currency, and numismatic collectibles',
    image: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=600',
    slug: 'collectible-coins',
    itemCount: 9800,
    averageValue: '$650'
  },
  {
    id: '6',
    name: 'Sports Memorabilia',
    description: 'Autographed items, trading cards, and sports collectibles',
    image: 'https://images.pexels.com/photos/1618200/pexels-photo-1618200.jpeg?auto=compress&cs=tinysrgb&w=600',
    slug: 'sports-memorabilia',
    itemCount: 11400,
    averageValue: '$890'
  },
  {
    id: '7',
    name: 'Vintage Instruments',
    description: 'Musical instruments from guitars to pianos and beyond',
    image: 'https://images.pexels.com/photos/1049764/pexels-photo-1049764.jpeg?auto=compress&cs=tinysrgb&w=600',
    slug: 'vintage-instruments',
    itemCount: 4300,
    averageValue: '$1,900'
  },
  {
    id: '8',
    name: 'Classic Cars',
    description: 'Vintage automobiles and automotive collectibles',
    image: 'https://images.pexels.com/photos/38637/car-audi-auto-automotive-38637.jpeg?auto=compress&cs=tinysrgb&w=600',
    slug: 'classic-cars',
    itemCount: 2800,
    averageValue: '$28,500'
  }
];

export const features: Feature[] = [
  {
    id: '1',
    title: 'AI-Powered Valuation',
    description: 'Advanced machine learning algorithms analyze market data and comparable sales',
    icon: 'brain',
    details: [
      'Real-time market analysis',
      'Comparable sales data',
      'Condition assessment',
      'Trend prediction'
    ]
  },
  {
    id: '2',
    title: 'Expert Authentication',
    description: 'Certified appraisers and experts verify authenticity and condition',
    icon: 'shield-check',
    details: [
      'Certified professional network',
      'Detailed condition reports',
      'Authenticity verification',
      'Insurance documentation'
    ]
  },
  {
    id: '3',
    title: 'Market Insights',
    description: 'Comprehensive market trends and investment potential analysis',
    icon: 'trending-up',
    details: [
      'Price trend analysis',
      'Market demand indicators',
      'Investment recommendations',
      'Portfolio tracking'
    ]
  },
  {
    id: '4',
    title: 'Instant Reports',
    description: 'Professional valuation reports delivered within minutes',
    icon: 'file-text',
    details: [
      'Detailed PDF reports',
      'Insurance documentation',
      'Resale recommendations',
      'Historical data'
    ]
  }
];

export const miniTools: MiniTool[] = [
  {
    id: '1',
    name: 'Quick Photo Valuation',
    description: 'Upload a photo for instant AI-powered valuation estimate',
    icon: 'camera',
    slug: 'photo-valuation',
    estimatedTime: '2 minutes'
  },
  {
    id: '2',
    name: 'Price Comparison',
    description: 'Compare your item against recent sales and market data',
    icon: 'bar-chart',
    slug: 'price-comparison',
    estimatedTime: '3 minutes'
  },
  {
    id: '3',
    name: 'Authentication Check',
    description: 'Verify authenticity using our expert network',
    icon: 'search',
    slug: 'authentication-check',
    estimatedTime: '5 minutes'
  }
];

export const processSteps: ProcessStep[] = [
  {
    id: '1',
    title: 'Upload & Describe',
    description: 'Take photos and provide details about your collectible',
    icon: 'upload',
    details: [
      'High-quality photos from multiple angles',
      'Detailed item description',
      'Condition assessment',
      'Provenance information'
    ]
  },
  {
    id: '2',
    title: 'AI Analysis',
    description: 'Advanced algorithms analyze your item against market data',
    icon: 'cpu',
    details: [
      'Image recognition and analysis',
      'Comparable sales matching',
      'Market trend evaluation',
      'Condition scoring'
    ]
  },
  {
    id: '3',
    title: 'Expert Review',
    description: 'Certified professionals validate and refine the valuation',
    icon: 'user-check',
    details: [
      'Professional authentication',
      'Market expertise validation',
      'Final valuation report',
      'Insurance documentation'
    ]
  }
];

export const faqs: FAQ[] = [
  {
    id: '1',
    question: 'How accurate are your valuations?',
    answer: 'Our AI-powered system combined with expert validation provides accuracy rates of 95%+ for most collectible categories. We continuously update our algorithms with real-time market data and sales information.',
    category: 'accuracy'
  },
  {
    id: '2',
    question: 'What types of items can you value?',
    answer: 'We specialize in collectibles, antiques, fine art, jewelry, watches, coins, sports memorabilia, musical instruments, and classic cars. Our platform covers over 50 subcategories with expert knowledge.',
    category: 'coverage'
  },
  {
    id: '3',
    question: 'How long does the valuation process take?',
    answer: 'Basic AI valuations are instant, while expert-verified reports typically take 2-24 hours. Rush services are available for urgent needs, with most reports delivered within 2 hours.',
    category: 'timing'
  },
  {
    id: '4',
    question: 'Can I use these valuations for insurance?',
    answer: 'Yes, our certified appraisal reports are accepted by major insurance companies. We provide detailed documentation that meets industry standards for insurance and legal purposes.',
    category: 'insurance'
  },
  {
    id: '5',
    question: 'What if I disagree with the valuation?',
    answer: 'We offer a satisfaction guarantee with free re-evaluation if you provide additional information or documentation. Our expert review process ensures fair and accurate assessments.',
    category: 'guarantee'
  },
  {
    id: '6',
    question: 'How do you protect my privacy?',
    answer: 'We use enterprise-grade encryption and never share your personal information or item details with third parties. All data is securely stored and processed in compliance with privacy regulations.',
    category: 'privacy'
  }
];