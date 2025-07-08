'use client';

import { processSteps } from '@/lib/data';
import { Upload, Cpu, UserCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const iconMap = {
  upload: Upload,
  cpu: Cpu,
  'user-check': UserCheck
};

export function ProcessSteps() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Get professional valuations in three simple steps
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {processSteps.map((step, index) => {
            const Icon = iconMap[step.icon as keyof typeof iconMap];
            return (
              <Card key={step.id} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  {/* Step Number */}
                  <div className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 mb-6">
                    <Icon className="h-6 w-6 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {step.description}
                  </p>

                  {/* Details */}
                  <ul className="space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center text-sm text-gray-500">
                        <div className="mr-2 h-1.5 w-1.5 rounded-full bg-blue-400"></div>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>

                {/* Connecting Line */}
                {index < processSteps.length - 1 && (
                  <div className="absolute top-1/2 -right-4 hidden h-0.5 w-8 bg-gradient-to-r from-blue-200 to-blue-300 md:block"></div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}