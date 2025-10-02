'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function Hero() {
  const router = useRouter();

  return (
    <section className="relative overflow-hidden bg-white pt-20 pb-32 sm:pt-28 sm:pb-40">
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl mb-6 leading-tight">
            Get your valuations
            <br />
            <span className="text-gray-900">
              with just a picture
            </span>
          </h1>

          <p className="text-xl text-gray-600 sm:text-2xl mb-12 max-w-2xl mx-auto font-light">
            AI-powered appraisals for jewelry, art, antiques, and collectibles in minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button
              onClick={() => router.push('/appraise/new')}
              size="lg"
              className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-6 text-lg rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Start Free Appraisal
            </Button>
            <Button
              onClick={() => router.push('/dashboard')}
              size="lg"
              variant="outline"
              className="border-2 border-gray-200 hover:border-gray-300 px-8 py-6 text-lg rounded-xl font-semibold transition-all"
            >
              View Dashboard
            </Button>
          </div>

          <div className="flex flex-col items-center space-y-3">
            <div className="flex items-center space-x-2 text-gray-600">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 border-2 border-white"></div>
              </div>
              <span className="text-sm font-medium">50,000+ items appraised</span>
            </div>
            <div className="flex items-center space-x-1 text-yellow-400">
              <span className="text-2xl">★★★★★</span>
              <span className="text-sm text-gray-600 ml-2">4.9/5 rating from users</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
