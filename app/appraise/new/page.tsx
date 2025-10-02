'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUpload } from '@/components/appraisal/image-upload';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { categories } from '@/lib/data';
import { supabase } from '@/lib/supabase/client';
import { uploadAppraisalImage } from '@/lib/supabase/storage';

export default function NewAppraisal() {
  const router = useRouter();
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!category || !description || images.length === 0) {
      setError('Please provide category, description, and at least one image');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: appraisalData, error: appraisalError } = await supabase
        .from('appraisals')
        .insert({
          category,
          item_description: description,
          status: 'pending',
        })
        .select()
        .single();

      if (appraisalError || !appraisalData) {
        throw new Error('Failed to create appraisal record');
      }

      const appraisalId = appraisalData.id;

      const imageUploads = images.map(async (file, index) => {
        const { path, error: uploadError } = await uploadAppraisalImage(
          file,
          appraisalId,
          index
        );

        if (uploadError) {
          throw uploadError;
        }

        const { error: dbError } = await supabase.from('appraisal_images').insert({
          appraisal_id: appraisalId,
          storage_path: path,
          file_name: file.name,
          file_size: file.size,
          mime_type: file.type,
          display_order: index,
          is_primary: index === 0,
        });

        if (dbError) {
          throw dbError;
        }

        return path;
      });

      await Promise.all(imageUploads);

      const imageBase64Array = await Promise.all(
        images.map(
          (file) =>
            new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.readAsDataURL(file);
            })
        )
      );

      const { data: updateData, error: updateError } = await supabase
        .from('appraisals')
        .update({ status: 'analyzing' })
        .eq('id', appraisalId)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      const aiResponse = await fetch('/api/appraise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: imageBase64Array,
          description,
          category,
        }),
      });

      if (!aiResponse.ok) {
        throw new Error('AI analysis failed');
      }

      const aiResult = await aiResponse.json();
      const { data: aiData } = aiResult;

      const { error: finalError } = await supabase
        .from('appraisals')
        .update({
          status: 'completed',
          ai_analysis: aiData,
          estimated_value_low: aiData.estimatedValueLow,
          estimated_value_high: aiData.estimatedValueHigh,
          currency: aiData.currency,
          confidence_score: aiData.confidenceScore,
          item_identification: aiData.itemIdentification,
          condition_assessment: aiData.conditionAssessment,
          market_context: aiData.marketContext,
          valuation_methodology: aiData.valuationMethodology,
          recommendations: aiData.recommendations,
          requires_expert_review: aiData.requiresExpertReview,
          completed_at: new Date().toISOString(),
        })
        .eq('id', appraisalId);

      if (finalError) {
        throw finalError;
      }

      await supabase.from('valuation_history').insert({
        appraisal_id: appraisalId,
        analysis_type: 'ai_initial',
        analysis_data: aiData,
        performed_by: 'claude-3-5-sonnet-20241022',
        notes: 'Initial AI-powered valuation',
      });

      router.push(`/appraise/${appraisalId}`);
    } catch (err) {
      console.error('Appraisal error:', err);
      setError(err instanceof Error ? err.message : 'Failed to process appraisal');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              New Appraisal Request
            </h1>
            <p className="text-lg text-gray-600">
              Provide details and photos of your item for professional AI-powered valuation
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-6">
                <div>
                  <Label htmlFor="category" className="text-base font-semibold mb-2 block">
                    Item Category *
                  </Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.slug}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description" className="text-base font-semibold mb-2 block">
                    Item Description *
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide detailed information about your item including brand, materials, age, condition, any markings or signatures, provenance, and purchase history if known..."
                    rows={8}
                    className="resize-none"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    More details help us provide a more accurate valuation
                  </p>
                </div>
              </CardContent>
            </Card>

            <ImageUpload onImagesChange={setImages} maxImages={5} />

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !category || !description || images.length === 0}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700"
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Processing...
                  </>
                ) : (
                  'Submit for Appraisal'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
