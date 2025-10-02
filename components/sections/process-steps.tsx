'use client';

import { Upload, Cpu, UserCheck } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: 'Upload & Describe',
    description: 'Take clear photos from multiple angles and provide item details',
    icon: Upload,
    details: ['High-quality images', 'Detailed description', 'Condition notes', 'History & provenance']
  },
  {
    id: 2,
    title: 'AI Analysis',
    description: 'Our advanced AI analyzes your item against market data',
    icon: Cpu,
    details: ['Image recognition', 'Market comparables', 'Trend analysis', 'Value estimation']
  },
  {
    id: 3,
    title: 'Get Results',
    description: 'Receive a comprehensive appraisal report in your account',
    icon: UserCheck,
    details: ['Instant results', 'Expert validation', 'PDF reports', 'Insurance docs']
  }
];

export function ProcessSteps() {
  return (
    <section className="py-24 sm:py-32 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get professional valuations in three simple steps
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-900">
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <span className="text-5xl font-bold text-gray-100">
                      {step.id}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {step.description}
                  </p>

                  <ul className="space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center text-sm text-gray-500">
                        <div className="mr-2 h-1.5 w-1.5 rounded-full bg-gray-400"></div>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>

                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gray-200"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
