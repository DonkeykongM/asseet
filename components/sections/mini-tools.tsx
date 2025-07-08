'use client';

import { miniTools } from '@/lib/data';
import Link from 'next/link';
import { Camera, BarChart, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const iconMap = {
  camera: Camera,
  'bar-chart': BarChart,
  search: Search
};

export function MiniTools() {
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Quick Valuation Tools
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Get instant insights with our specialized mini-tools
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {miniTools.map((tool) => {
            const Icon = iconMap[tool.icon as keyof typeof iconMap];
            return (
              <Card key={tool.id} className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 mb-4">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {tool.name}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      {tool.estimatedTime}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm mb-6">
                    {tool.description}
                  </p>
                  <Link href={`/tools/${tool.slug}`} className="block">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                      Try Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}