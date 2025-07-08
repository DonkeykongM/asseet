'use client';

import { features } from '@/lib/data';
import { Brain, ShieldCheck, TrendingUp, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const iconMap = {
  brain: Brain,
  'shield-check': ShieldCheck,
  'trending-up': TrendingUp,
  'file-text': FileText
};

export function Features() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Why Choose AssetAlyze
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Combining cutting-edge technology with expert knowledge to deliver 
            the most accurate valuations in the industry.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = iconMap[feature.icon as keyof typeof iconMap];
            return (
              <Card key={feature.id} className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-blue-100 to-blue-200 mb-4">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {feature.description}
                  </p>
                  <ul className="space-y-1">
                    {feature.details.map((detail, index) => (
                      <li key={index} className="flex items-center text-xs text-gray-500">
                        <div className="mr-2 h-1 w-1 rounded-full bg-blue-400"></div>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}