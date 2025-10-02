'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Upload, Camera, CheckCircle, AlertCircle } from 'lucide-react';

type Step = 'upload' | 'analyzing' | 'results';

interface ValuationResult {
  estimatedValue: string;
  confidence: number;
  category: string;
  condition: string;
  recommendations: string[];
}

export default function PhotoValuation() {
  const [step, setStep] = useState<Step>('upload');
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [results, setResults] = useState<ValuationResult | null>(null);

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const startAnalysis = async () => {
    if (!selectedFile) return;

    setStep('analyzing');
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 5, 90));
    }, 300);

    try {
      const reader = new FileReader();
      const imageBase64 = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(selectedFile);
      });

      const response = await fetch('/api/appraise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: [imageBase64],
          description: 'Quick photo valuation',
          category: 'general',
        }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const result = await response.json();
      const aiData = result.data;

      clearInterval(progressInterval);
      setProgress(100);

      setTimeout(() => {
        setStep('results');
        setResults({
          estimatedValue: `$${aiData.estimatedValueLow.toLocaleString()} - $${aiData.estimatedValueHigh.toLocaleString()}`,
          confidence: aiData.confidenceScore,
          category: aiData.itemIdentification,
          condition: aiData.conditionRating,
          recommendations: aiData.recommendations,
        });
      }, 500);
    } catch (error) {
      clearInterval(progressInterval);
      console.error('Analysis error:', error);
      alert('Failed to analyze image. Please try again.');
      reset();
    }
  };

  const reset = () => {
    setStep('upload');
    setProgress(0);
    setSelectedFile(null);
    setPreviewUrl(null);
    setResults(null);
  };

  return (
    <div className="py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Quick Photo Valuation
            </h1>
            <p className="text-lg text-gray-600">
              Upload a photo of your item for an instant AI-powered valuation estimate
            </p>
          </div>

          {step === 'upload' && (
            <Card>
              <CardContent className="p-8">
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors"
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                >
                  {previewUrl ? (
                    <div className="space-y-4">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-h-64 mx-auto rounded-lg"
                      />
                      <p className="text-sm text-gray-600">
                        {selectedFile?.name}
                      </p>
                      <div className="flex gap-2 justify-center">
                        <Button onClick={startAnalysis}>
                          Analyze Photo
                        </Button>
                        <Button variant="outline" onClick={reset}>
                          Choose Different Photo
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Camera className="h-16 w-16 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-lg font-medium text-gray-900">
                          Drop your photo here
                        </p>
                        <p className="text-gray-600">
                          or click to browse files
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileInput}
                        className="hidden"
                        id="file-input"
                      />
                      <label htmlFor="file-input">
                        <Button asChild>
                          <span>
                            <Upload className="mr-2 h-4 w-4" />
                            Choose Photo
                          </span>
                        </Button>
                      </label>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {step === 'analyzing' && (
            <Card>
              <CardContent className="p-8 text-center">
                <LoadingSpinner size="lg" className="mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Analyzing Your Item
                </h3>
                <p className="text-gray-600 mb-6">
                  Our AI is examining your photo and comparing it to our database
                </p>
                <Progress value={progress} className="mb-4" />
                <p className="text-sm text-gray-500">
                  {progress}% complete
                </p>
              </CardContent>
            </Card>
          )}

          {step === 'results' && results && (
            <div className="space-y-6">
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                    <h3 className="text-xl font-semibold text-gray-900">
                      Valuation Complete
                    </h3>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2 mb-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Estimated Value</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {results.estimatedValue}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Confidence Level</p>
                      <div className="flex items-center">
                        <Progress value={results.confidence} className="flex-1 mr-2" />
                        <span className="text-sm font-medium">{results.confidence}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 mb-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Category</p>
                      <Badge variant="secondary">{results.category}</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Condition</p>
                      <Badge variant="outline">{results.condition}</Badge>
                    </div>
                  </div>

                  {results.confidence < 70 && (
                    <div className="flex items-start space-x-2 p-4 bg-yellow-50 rounded-lg mb-6">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-yellow-800">
                          Lower Confidence Score
                        </p>
                        <p className="text-sm text-yellow-700">
                          Consider uploading additional photos or getting an expert review for more accurate results.
                        </p>
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-2">
                      Recommendations
                    </p>
                    <ul className="space-y-1">
                      {results.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button onClick={reset} variant="outline" className="flex-1">
                  Analyze Another Item
                </Button>
                <Button className="flex-1">
                  Get Expert Review
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}