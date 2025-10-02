'use client';

import { Brain, ShieldCheck, TrendingUp, FileText } from 'lucide-react';

const features = [
  {
    id: '1',
    title: 'AI-Powered Valuation',
    description: 'Advanced machine learning algorithms analyze market data and comparable sales for accurate valuations',
    icon: Brain,
    details: ['Real-time market analysis', 'Comparable sales data', 'Condition assessment', 'Trend predictions']
  },
  {
    id: '2',
    title: 'Expert Authentication',
    description: 'Certified appraisers and experts verify authenticity and condition of your items',
    icon: ShieldCheck,
    details: ['Professional network', 'Condition reports', 'Authenticity verification', 'Insurance documentation']
  },
  {
    id: '3',
    title: 'Market Insights',
    description: 'Comprehensive market trends and investment potential analysis for informed decisions',
    icon: TrendingUp,
    details: ['Price trend analysis', 'Demand indicators', 'Investment recommendations', 'Portfolio tracking']
  },
  {
    id: '4',
    title: 'Instant Reports',
    description: 'Professional valuation reports delivered within minutes, ready for any purpose',
    icon: FileText,
    details: ['Detailed PDF reports', 'Insurance docs', 'Resale recommendations', 'Historical data']
  }
];

export function Features() {
  return (
    <section className="py-24 sm:py-32 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-4">
            Why Choose Us
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Combining cutting-edge AI technology with expert knowledge to deliver accurate valuations
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.id} className="group">
                <div className="h-full bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-900 mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                  <ul className="space-y-2">
                    {feature.details.map((detail, index) => (
                      <li key={index} className="flex items-center text-xs text-gray-500">
                        <div className="mr-2 h-1 w-1 rounded-full bg-gray-400"></div>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
