'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Progress } from '@/components/ui/progress';
import {
  ShieldCheck,
  ShieldAlert,
  Camera,
  FileText,
  CheckCircle,
  AlertTriangle,
  Info,
  Upload
} from 'lucide-react';

type Step = 'input' | 'analyzing' | 'results';

interface AuthenticationResult {
  isAuthentic: boolean;
  confidenceScore: number;
  category: string;
  findings: Array<{
    type: 'positive' | 'negative' | 'warning';
    title: string;
    description: string;
  }>;
  recommendations: string[];
  needsExpertReview: boolean;
}

export default function AuthenticationCheck() {
  const [step, setStep] = useState<Step>('input');
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState({
    itemName: '',
    category: '',
    serialNumber: '',
    description: '',
    purchaseLocation: '',
  });
  const [images, setImages] = useState<File[]>([]);
  const [results, setResults] = useState<AuthenticationResult | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setStep('analyzing');
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 5, 90));
    }, 300);

    setTimeout(() => {
      clearInterval(progressInterval);
      setProgress(100);

      const mockResults: AuthenticationResult = {
        isAuthentic: true,
        confidenceScore: 87,
        category: formData.category,
        findings: [
          {
            type: 'positive',
            title: 'Serial Number Verified',
            description: 'Serial number matches manufacturer records and format is correct for the production year.',
          },
          {
            type: 'positive',
            title: 'Material Analysis',
            description: 'Materials and construction quality are consistent with authentic items.',
          },
          {
            type: 'warning',
            title: 'Minor Wear Patterns',
            description: 'Some wear patterns differ slightly from typical aging. This could be due to storage conditions.',
          },
          {
            type: 'positive',
            title: 'Marking & Stamps',
            description: 'All markings, stamps, and engravings appear genuine and properly positioned.',
          },
        ],
        recommendations: [
          'Consider obtaining a certificate of authenticity from an authorized dealer',
          'Document all markings and serial numbers for insurance purposes',
          'Store in proper conditions to maintain value',
          'Get periodic re-evaluations as market values change',
        ],
        needsExpertReview: false,
      };

      setResults(mockResults);
      setStep('results');
    }, 3000);
  };

  const reset = () => {
    setStep('input');
    setProgress(0);
    setFormData({
      itemName: '',
      category: '',
      serialNumber: '',
      description: '',
      purchaseLocation: '',
    });
    setImages([]);
    setResults(null);
  };

  return (
    <div className="py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Authentication Check
            </h1>
            <p className="text-lg text-gray-600">
              Verify authenticity using our expert network and advanced analysis tools
            </p>
          </div>

          {step === 'input' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Item Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="itemName">Item Name</Label>
                      <Input
                        id="itemName"
                        placeholder="e.g., Rolex Submariner"
                        value={formData.itemName}
                        onChange={(e) => setFormData(prev => ({ ...prev, itemName: e.target.value }))}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vintage-watches">Vintage Watches</SelectItem>
                          <SelectItem value="fine-art">Fine Art</SelectItem>
                          <SelectItem value="jewelry-gems">Jewelry & Gems</SelectItem>
                          <SelectItem value="collectible-coins">Collectible Coins</SelectItem>
                          <SelectItem value="sports-memorabilia">Sports Memorabilia</SelectItem>
                          <SelectItem value="vintage-instruments">Vintage Instruments</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="serialNumber">Serial Number (if applicable)</Label>
                    <Input
                      id="serialNumber"
                      placeholder="Enter serial number or identifying marks"
                      value={formData.serialNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, serialNumber: e.target.value }))}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description & Details</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe any unique features, markings, or concerns about authenticity..."
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="mt-2 min-h-24"
                    />
                  </div>

                  <div>
                    <Label htmlFor="purchaseLocation">Purchase Location/Source</Label>
                    <Input
                      id="purchaseLocation"
                      placeholder="e.g., Authorized dealer, auction house, private seller"
                      value={formData.purchaseLocation}
                      onChange={(e) => setFormData(prev => ({ ...prev, purchaseLocation: e.target.value }))}
                      className="mt-2"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upload Images</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Upload clear photos of serial numbers, markings, and any areas of concern
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                      <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload">
                        <Button asChild variant="outline">
                          <span>
                            <Upload className="mr-2 h-4 w-4" />
                            Choose Images
                          </span>
                        </Button>
                      </label>
                      <p className="text-sm text-gray-500 mt-2">
                        Upload multiple angles and close-up shots
                      </p>
                    </div>

                    {images.length > 0 && (
                      <div className="grid grid-cols-3 gap-4">
                        {images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={handleSubmit}
                disabled={!formData.itemName || !formData.category || images.length === 0}
                className="w-full"
                size="lg"
              >
                <ShieldCheck className="mr-2 h-5 w-5" />
                Start Authentication Check
              </Button>
            </div>
          )}

          {step === 'analyzing' && (
            <Card>
              <CardContent className="p-8 text-center">
                <LoadingSpinner size="lg" className="mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Analyzing Authenticity
                </h3>
                <p className="text-gray-600 mb-6">
                  Checking serial numbers, analyzing materials, comparing with known fakes...
                </p>
                <Progress value={progress} className="mb-4" />
                <p className="text-sm text-gray-500">{progress}% complete</p>
              </CardContent>
            </Card>
          )}

          {step === 'results' && results && (
            <div className="space-y-6">
              <Card className={results.isAuthentic ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    {results.isAuthentic ? (
                      <ShieldCheck className="h-12 w-12 text-green-600" />
                    ) : (
                      <ShieldAlert className="h-12 w-12 text-red-600" />
                    )}
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900">
                        {results.isAuthentic ? 'Likely Authentic' : 'Authenticity Concerns'}
                      </h3>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-sm text-gray-600">Confidence Score:</span>
                        <div className="flex-1 max-w-xs">
                          <Progress value={results.confidenceScore} className="h-2" />
                        </div>
                        <span className="font-semibold">{results.confidenceScore}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Analysis Findings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {results.findings.map((finding, index) => (
                      <div
                        key={index}
                        className={`flex items-start gap-3 p-4 rounded-lg ${
                          finding.type === 'positive'
                            ? 'bg-green-50 border border-green-200'
                            : finding.type === 'negative'
                            ? 'bg-red-50 border border-red-200'
                            : 'bg-yellow-50 border border-yellow-200'
                        }`}
                      >
                        {finding.type === 'positive' ? (
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        ) : finding.type === 'negative' ? (
                          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                        ) : (
                          <Info className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                        )}
                        <div>
                          <h4 className="font-semibold text-gray-900">{finding.title}</h4>
                          <p className="text-sm text-gray-700 mt-1">{finding.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {results.needsExpertReview && (
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-2">Expert Review Recommended</h4>
                        <p className="text-sm text-blue-800">
                          While our analysis shows positive indicators, we recommend getting a professional expert review
                          for high-value items to ensure complete authenticity verification.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {results.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button onClick={reset} variant="outline" className="flex-1">
                  Check Another Item
                </Button>
                <Button className="flex-1">
                  Request Expert Verification
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
