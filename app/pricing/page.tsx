'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Check } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth/context';

type PricingTier = {
  id: string;
  name: string;
  display_name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  appraisals_per_month: number;
  features: string[];
  sort_order: number;
};

export default function PricingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [tiers, setTiers] = useState<PricingTier[]>([]);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    fetchPricingTiers();
  }, []);

  const fetchPricingTiers = async () => {
    try {
      const { data, error } = await supabase
        .from('pricing_tiers')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (error) throw error;
      if (data) setTiers(data);
    } catch (error) {
      console.error('Error fetching pricing tiers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (tier: PricingTier) => {
    if (!user) {
      router.push(`/auth/signup?redirect=/pricing`);
      return;
    }

    if (tier.name === 'enterprise') {
      router.push('/contact?subject=Enterprise%20Plan');
      return;
    }

    router.push(`/checkout?tier=${tier.id}&cycle=${billingCycle}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="py-16 sm:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the perfect plan for your appraisal needs. Upgrade, downgrade, or cancel anytime.
          </p>

          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant={billingCycle === 'monthly' ? 'default' : 'outline'}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly
            </Button>
            <Button
              variant={billingCycle === 'yearly' ? 'default' : 'outline'}
              onClick={() => setBillingCycle('yearly')}
            >
              Yearly
              <Badge className="ml-2 bg-green-100 text-green-800">Save 17%</Badge>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {tiers.map((tier) => {
            const price = billingCycle === 'monthly' ? tier.price_monthly : tier.price_yearly;
            const isEnterprise = tier.name === 'enterprise';
            const isPremium = tier.name === 'premium';

            return (
              <Card
                key={tier.id}
                className={`relative ${
                  isPremium ? 'border-blue-500 shadow-lg scale-105' : ''
                }`}
              >
                {isPremium && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader>
                  <CardTitle className="text-2xl">{tier.display_name}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="mb-6">
                    {isEnterprise ? (
                      <div className="text-3xl font-bold">Custom</div>
                    ) : (
                      <>
                        <div className="flex items-baseline">
                          <span className="text-4xl font-bold">${price.toFixed(0)}</span>
                          <span className="text-gray-600 ml-2">
                            /{billingCycle === 'monthly' ? 'month' : 'year'}
                          </span>
                        </div>
                        {billingCycle === 'yearly' && price > 0 && (
                          <p className="text-sm text-gray-600 mt-1">
                            ${(price / 12).toFixed(2)}/month billed annually
                          </p>
                        )}
                      </>
                    )}
                  </div>

                  <ul className="space-y-3">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button
                    className={`w-full ${
                      isPremium
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700'
                        : ''
                    }`}
                    variant={isPremium ? 'default' : 'outline'}
                    onClick={() => handleSelectPlan(tier)}
                  >
                    {isEnterprise ? 'Contact Sales' : 'Get Started'}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <div id="credits" className="mt-16 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Need More Flexibility?</CardTitle>
              <CardDescription>Purchase appraisal credits for one-time use</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="text-2xl font-bold mb-2">5 Credits</div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">$49</div>
                  <div className="text-sm text-gray-600 mb-4">$9.80 per appraisal</div>
                  <Button variant="outline" className="w-full" disabled>
                    Coming Soon
                  </Button>
                </div>

                <div className="border border-blue-500 rounded-lg p-4 relative">
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-100 text-blue-800">
                    Best Value
                  </Badge>
                  <div className="text-2xl font-bold mb-2">10 Credits</div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">$89</div>
                  <div className="text-sm text-gray-600 mb-4">$8.90 per appraisal</div>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700" disabled>
                    Coming Soon
                  </Button>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="text-2xl font-bold mb-2">25 Credits</div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">$199</div>
                  <div className="text-sm text-gray-600 mb-4">$7.96 per appraisal</div>
                  <Button variant="outline" className="w-full" disabled>
                    Coming Soon
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-500 text-center">
                Credits never expire and can be used in addition to your monthly subscription limit
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
