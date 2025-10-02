'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Camera,
  BarChart,
  Search,
  TrendingUp,
  Calculator,
  FileText,
  Shield,
  Clock,
  Star,
  Sparkles,
  ArrowRight,
  Zap
} from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  slug: string;
  category: 'quick' | 'advanced' | 'research' | 'planning';
  estimatedTime: string;
  featured?: boolean;
  badge?: string;
}

const iconMap = {
  camera: Camera,
  'bar-chart': BarChart,
  search: Search,
  'trending-up': TrendingUp,
  calculator: Calculator,
  'file-text': FileText,
  shield: Shield,
  clock: Clock,
  star: Star,
};

const allTools: Tool[] = [
  {
    id: '1',
    name: 'Quick Photo Valuation',
    description: 'Upload a photo for instant AI-powered valuation estimate',
    icon: 'camera',
    slug: 'photo-valuation',
    category: 'quick',
    estimatedTime: '2 min',
    featured: true,
    badge: 'Most Popular'
  },
  {
    id: '2',
    name: 'Price Comparison',
    description: 'Compare your item against recent sales and market data',
    icon: 'bar-chart',
    slug: 'price-comparison',
    category: 'research',
    estimatedTime: '3 min',
    featured: true
  },
  {
    id: '3',
    name: 'Authentication Check',
    description: 'Verify authenticity using our expert network',
    icon: 'shield',
    slug: 'authentication-check',
    category: 'advanced',
    estimatedTime: '5 min',
    featured: true
  },
  {
    id: '4',
    name: 'Market Trend Analyzer',
    description: 'View price history and demand forecasts for any category',
    icon: 'trending-up',
    slug: 'market-trends',
    category: 'research',
    estimatedTime: '4 min',
    badge: 'Coming Soon'
  },
  {
    id: '5',
    name: 'Condition Assessment',
    description: 'Get a detailed condition rating with guided questions',
    icon: 'star',
    slug: 'condition-assessment',
    category: 'quick',
    estimatedTime: '5 min',
    badge: 'Coming Soon'
  },
  {
    id: '6',
    name: 'ROI Calculator',
    description: 'Calculate investment returns and projected values',
    icon: 'calculator',
    slug: 'roi-calculator',
    category: 'planning',
    estimatedTime: '3 min',
    badge: 'Coming Soon'
  },
  {
    id: '7',
    name: 'Insurance Documentation',
    description: 'Generate official appraisal certificates for insurance',
    icon: 'file-text',
    slug: 'insurance-docs',
    category: 'advanced',
    estimatedTime: '10 min',
    badge: 'Coming Soon'
  },
  {
    id: '8',
    name: 'Selling Timeline Planner',
    description: 'Get a customized roadmap from appraisal to sale',
    icon: 'clock',
    slug: 'selling-timeline',
    category: 'planning',
    estimatedTime: '6 min',
    badge: 'Coming Soon'
  },
];

export default function ToolsHub() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const featuredTools = allTools.filter(tool => tool.featured);

  const filteredTools = allTools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const ToolCard = ({ tool }: { tool: Tool }) => {
    const Icon = iconMap[tool.icon as keyof typeof iconMap];
    const isComingSoon = tool.badge === 'Coming Soon';

    return (
      <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
        {tool.badge && (
          <div className="absolute top-3 right-3 z-10">
            <Badge variant={isComingSoon ? "secondary" : "default"} className="text-xs">
              {tool.badge}
            </Badge>
          </div>
        )}
        <CardContent className="p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 mb-4 group-hover:scale-110 transition-transform">
            <Icon className="h-6 w-6 text-white" />
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {tool.name}
          </h3>

          <p className="text-sm text-gray-600 mb-4 min-h-[40px]">
            {tool.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              {tool.estimatedTime}
            </div>

            {isComingSoon ? (
              <Button variant="ghost" size="sm" disabled>
                Coming Soon
              </Button>
            ) : (
              <Link href={`/tools/${tool.slug}`}>
                <Button size="sm" className="group-hover:bg-blue-600">
                  Try Now
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-blue-600 mr-2" />
            <h1 className="text-4xl font-bold text-gray-900">
              Valuation Tools
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional-grade tools to help you research, analyze, and manage your collectibles
          </p>
        </div>

        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {featuredTools.length > 0 && searchQuery === '' && selectedCategory === 'all' && (
          <div className="mb-16">
            <div className="flex items-center mb-6">
              <Zap className="h-6 w-6 text-yellow-500 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Featured Tools</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </div>
        )}

        <div>
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-5 mb-8">
              <TabsTrigger value="all">All Tools</TabsTrigger>
              <TabsTrigger value="quick">Quick</TabsTrigger>
              <TabsTrigger value="research">Research</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
              <TabsTrigger value="planning">Planning</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedCategory} className="mt-0">
              {filteredTools.length === 0 ? (
                <Card className="p-12 text-center">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No tools found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your search or category filter
                  </p>
                </Card>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredTools.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <Card className="mt-16 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Need Help Choosing a Tool?
            </h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Not sure which tool is right for you? Start with Quick Photo Valuation for an instant estimate,
              or explore Price Comparison to understand current market values.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/tools/photo-valuation">
                <Button size="lg">
                  <Camera className="mr-2 h-5 w-5" />
                  Start with Photo Valuation
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline">
                  Contact an Expert
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
