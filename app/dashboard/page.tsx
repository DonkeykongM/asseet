'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/lib/auth/context';
import { supabase } from '@/lib/supabase/client';
import { getImageUrl } from '@/lib/supabase/storage';
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  TrendingUp,
  Calendar,
  CreditCard,
} from 'lucide-react';

type Appraisal = any;
type Profile = any;
type UsageData = any;

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [appraisals, setAppraisals] = useState<Appraisal[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [tier, setTier] = useState<any>(null);
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login?redirect=/dashboard');
      return;
    }

    if (user) {
      fetchDashboardData();
    }
  }, [user, authLoading, router]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      const [profileRes, appraisalsRes, usageRes, creditsRes] = await Promise.all([
        supabase.from('profiles').select('*, pricing_tiers(*)').eq('id', user.id).maybeSingle(),
        supabase
          .from('appraisals')
          .select('*, appraisal_images(storage_path, is_primary)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10),
        supabase
          .from('usage_tracking')
          .select('*')
          .eq('user_id', user.id)
          .gte('period_end', new Date().toISOString())
          .maybeSingle(),
        supabase
          .from('appraisal_credits')
          .select('credits_remaining')
          .eq('user_id', user.id)
          .gt('credits_remaining', 0),
      ]);

      if (profileRes.data) {
        setProfile(profileRes.data);
        setTier(profileRes.data.pricing_tiers);
      }

      if (appraisalsRes.data) {
        setAppraisals(appraisalsRes.data);
      }

      if (usageRes.data) {
        setUsage(usageRes.data);
      }

      if (creditsRes.data) {
        const totalCredits = creditsRes.data.reduce(
          (sum: number, item: any) => sum + item.credits_remaining,
          0
        );
        setCredits(totalCredits);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statusConfig: Record<string, { color: string; icon: any }> = {
    completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
    analyzing: { color: 'bg-blue-100 text-blue-800', icon: Clock },
    pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    failed: { color: 'bg-red-100 text-red-800', icon: AlertCircle },
  };

  const usagePercentage = usage
    ? Math.min((usage.appraisals_used / usage.appraisals_limit) * 100, 100)
    : 0;

  return (
    <div className="py-8 sm:py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {profile?.full_name || user?.email}</p>
            </div>
            <Link href="/appraise/new">
              <Button className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-600 to-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                New Appraisal
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
                <CreditCard className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tier?.display_name || 'Free'}</div>
                <p className="text-xs text-gray-600 mt-1">
                  {tier?.appraisals_per_month === -1
                    ? 'Unlimited appraisals'
                    : `${tier?.appraisals_per_month || 1} appraisals/month`}
                </p>
                <Link href="/pricing">
                  <Button variant="link" className="px-0 mt-2">
                    Upgrade plan
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Usage This Month</CardTitle>
                <TrendingUp className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {usage?.appraisals_used || 0}
                  {usage?.appraisals_limit !== -1 && ` / ${usage?.appraisals_limit || 0}`}
                </div>
                <Progress value={usagePercentage} className="mt-3" />
                <p className="text-xs text-gray-600 mt-2">
                  {usage?.appraisals_limit === -1
                    ? 'Unlimited usage'
                    : `${Math.max(
                        0,
                        (usage?.appraisals_limit || 0) - (usage?.appraisals_used || 0)
                      )} remaining`}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available Credits</CardTitle>
                <FileText className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{credits}</div>
                <p className="text-xs text-gray-600 mt-1">Extra appraisal credits</p>
                <Link href="/pricing#credits">
                  <Button variant="link" className="px-0 mt-2">
                    Buy more credits
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Appraisals</CardTitle>
              <CardDescription>Your latest valuation requests</CardDescription>
            </CardHeader>
            <CardContent>
              {appraisals.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No appraisals yet</h3>
                  <p className="text-gray-600 mb-4">Get started with your first appraisal</p>
                  <Link href="/appraise/new">
                    <Button className="bg-gradient-to-r from-blue-600 to-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Appraisal
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {appraisals.map((appraisal) => {
                    const StatusIcon = statusConfig[appraisal.status]?.icon || Clock;
                    const primaryImage = appraisal.appraisal_images?.find((img: any) => img.is_primary);

                    return (
                      <Link key={appraisal.id} href={`/appraise/${appraisal.id}`}>
                        <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer">
                          {primaryImage && (
                            <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                              <Image
                                src={getImageUrl(primaryImage.storage_path)}
                                alt="Appraisal"
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="capitalize">
                                {appraisal.category}
                              </Badge>
                              <Badge className={statusConfig[appraisal.status]?.color}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {appraisal.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-900 truncate">
                              {appraisal.item_identification || appraisal.item_description}
                            </p>
                            <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(appraisal.created_at).toLocaleDateString()}
                              </span>
                              {appraisal.estimated_value_low && (
                                <span className="font-medium text-gray-900">
                                  ${appraisal.estimated_value_low.toLocaleString()} - $
                                  {appraisal.estimated_value_high.toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
