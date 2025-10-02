'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Separator } from '@/components/ui/separator';
import { CircleCheck as CheckCircle, CircleAlert as AlertCircle, DollarSign, TrendingUp, Shield, FileText, Calendar, Tag, ChevronLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { getImageUrl } from '@/lib/supabase/storage';

type Appraisal = any;
type AppraisalImage = any;

export default function AppraisalResults() {
  const params = useParams();
  const router = useRouter();
  const appraisalId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [appraisal, setAppraisal] = useState<Appraisal | null>(null);
  const [images, setImages] = useState<AppraisalImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAppraisal() {
      try {
        const { data: appraisalData, error: appraisalError } = await supabase
          .from('appraisals')
          .select('*')
          .eq('id', appraisalId)
          .maybeSingle();

        if (appraisalError) throw appraisalError;
        if (!appraisalData) {
          setError('Appraisal not found');
          setLoading(false);
          return;
        }

        setAppraisal(appraisalData);

        const { data: imagesData, error: imagesError } = await supabase
          .from('appraisal_images')
          .select('*')
          .eq('appraisal_id', appraisalId)
          .order('display_order');

        if (imagesError) throw imagesError;
        setImages(imagesData || []);
      } catch (err) {
        console.error('Error fetching appraisal:', err);
        setError(err instanceof Error ? err.message : 'Failed to load appraisal');
      } finally {
        setLoading(false);
      }
    }

    fetchAppraisal();
  }, [appraisalId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Loading appraisal...</p>
        </div>
      </div>
    );
  }

  if (error || !appraisal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Error Loading Appraisal</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => router.push('/')}>Return Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const aiData = appraisal.ai_analysis as any;
  const isCompleted = appraisal.status === 'completed';

  return (
    <div className="py-16 sm:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      Appraisal Results
                    </h1>
                    <div className="flex items-center gap-3">
                      {isCompleted ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          {appraisal.status}
                        </Badge>
                      )}
                      <span className="text-sm text-gray-500">
                        <Calendar className="h-4 w-4 inline mr-1" />
                        {new Date(appraisal.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    {images.map((img, index) => (
                      <div
                        key={img.id}
                        className="aspect-square rounded-lg overflow-hidden bg-gray-100 relative"
                      >
                        <Image
                          src={getImageUrl(img.storage_path)}
                          alt={`Item photo ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        {img.is_primary && (
                          <Badge className="absolute top-2 left-2 text-xs">
                            Primary
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Category</h3>
                    <Badge variant="outline">
                      <Tag className="h-3 w-3 mr-1" />
                      {appraisal.category}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                    <p className="text-gray-700">{appraisal.item_description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {isCompleted && appraisal.item_identification && (
              <>
                <Card>
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <DollarSign className="h-6 w-6 text-blue-600 mr-2" />
                      <h2 className="text-2xl font-bold text-gray-900">Valuation</h2>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">
                          Item Identification
                        </h3>
                        <p className="text-xl font-semibold text-gray-900">
                          {appraisal.item_identification}
                        </p>
                      </div>

                      <Separator />

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-2">
                            Estimated Value Range
                          </h3>
                          <p className="text-3xl font-bold text-gray-900">
                            ${appraisal.estimated_value_low?.toLocaleString()} - $
                            {appraisal.estimated_value_high?.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {appraisal.currency} ({aiData?.marketType || 'General Market'})
                          </p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-2">
                            Confidence Level
                          </h3>
                          <div className="flex items-center gap-3">
                            <Progress
                              value={appraisal.confidence_score || 0}
                              className="flex-1"
                            />
                            <span className="text-2xl font-bold text-gray-900">
                              {appraisal.confidence_score}%
                            </span>
                          </div>
                          {appraisal.requires_expert_review && (
                            <div className="mt-2 flex items-start gap-2 p-3 bg-yellow-50 rounded-lg">
                              <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-yellow-800">
                                Expert review recommended for higher confidence
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <Shield className="h-6 w-6 text-blue-600 mr-2" />
                      <h2 className="text-2xl font-bold text-gray-900">
                        Condition Assessment
                      </h2>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Badge variant="secondary" className="mb-3">
                          {aiData?.conditionRating || 'Not Rated'}
                        </Badge>
                        <p className="text-gray-700">
                          {appraisal.condition_assessment}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <FileText className="h-6 w-6 text-blue-600 mr-2" />
                      <h2 className="text-2xl font-bold text-gray-900">
                        Valuation Details
                      </h2>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">
                          Methodology
                        </h3>
                        <p className="text-gray-700">
                          {appraisal.valuation_methodology}
                        </p>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">
                          Market Context
                        </h3>
                        <p className="text-gray-700">{appraisal.market_context}</p>
                      </div>

                      {aiData?.limitations && (
                        <>
                          <Separator />
                          <div className="p-4 bg-blue-50 rounded-lg">
                            <h3 className="text-sm font-semibold text-gray-900 mb-2">
                              Assessment Limitations
                            </h3>
                            <p className="text-sm text-gray-700">{aiData.limitations}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {appraisal.recommendations && appraisal.recommendations.length > 0 && (
                  <Card>
                    <CardContent className="p-8">
                      <div className="flex items-center mb-6">
                        <TrendingUp className="h-6 w-6 text-blue-600 mr-2" />
                        <h2 className="text-2xl font-bold text-gray-900">
                          Recommendations
                        </h2>
                      </div>

                      <ul className="space-y-3">
                        {appraisal.recommendations.map((rec: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <p className="text-gray-700">{rec}</p>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => router.push('/appraise/new')}
                    className="flex-1"
                  >
                    New Appraisal
                  </Button>
                  {appraisal.requires_expert_review && (
                    <Button className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700">
                      Request Expert Review
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
