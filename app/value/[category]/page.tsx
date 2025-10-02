import { categories } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, Clock, Shield, TrendingUp } from 'lucide-react';

interface Props {
  params: {
    category: string;
  };
}

export async function generateStaticParams() {
  return categories.map((category) => ({
    category: category.slug,
  }));
}

export default function CategoryPage({ params }: Props) {
  const category = categories.find(c => c.slug === params.category);
  
  if (!category) {
    notFound();
  }

  return (
    <div className="py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-16">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-6">
                {category.name} Valuation
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                {category.description}
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <Badge variant="secondary" className="text-sm">
                  {category.itemCount.toLocaleString()} items in database
                </Badge>
                <Badge variant="outline" className="text-sm">
                  Average value: {category.averageValue}
                </Badge>
              </div>
              <Link href="/appraise/new">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                  <Upload className="mr-2 h-5 w-5" />
                  Start Valuation
                </Button>
              </Link>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden">
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid gap-6 md:grid-cols-3 mb-16">
          <Card>
            <CardContent className="p-6">
              <Clock className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Quick Results
              </h3>
              <p className="text-gray-600 text-sm">
                Get preliminary valuations in minutes with our AI-powered analysis
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <Shield className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Expert Verified
              </h3>
              <p className="text-gray-600 text-sm">
                All valuations reviewed by certified professionals in the field
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <TrendingUp className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Market Insights
              </h3>
              <p className="text-gray-600 text-sm">
                Detailed analysis of market trends and investment potential
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Process */}
        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            How We Value {category.name}
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Photo Analysis</h3>
              <p className="text-sm text-gray-600">
                Our AI analyzes photos to identify key characteristics and condition
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Market Comparison</h3>
              <p className="text-sm text-gray-600">
                Compare against recent sales and market data for similar items
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Expert Review</h3>
              <p className="text-sm text-gray-600">
                Specialists validate findings and provide final valuation
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}