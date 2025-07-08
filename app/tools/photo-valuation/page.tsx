'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Upload, Camera, CheckCircle, AlertCircle, Info } from 'lucide-react';

type Step = 'upload' | 'analyzing' | 'results';

interface ValuationResult {
  valuation: number;
  confidence: number;
  message: string;
  explanations: string[];
  error?: string;
}

export default function PhotoValuation() {
  const [step, setStep] = useState<Step>('upload');
  const [progress, setProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [itemDescription, setItemDescription] = useState<string>('');
  const [results, setResults] = useState<ValuationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback((files: FileList | File[]) => {
    const newFilesArray = Array.from(files);
    const imageFiles = newFilesArray.filter(file => file.type.startsWith('image/'));

    setSelectedFiles(prev => {
      const updatedFiles = [...prev, ...imageFiles];
      return updatedFiles.slice(0, 5); // Keep only the first 5 images
    });

    const newPreviewUrls = imageFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => {
      const updatedUrls = [...prev, ...newPreviewUrls];
      // Revoke old URLs if we are exceeding 5 previews
      if (updatedUrls.length > 5) {
        const urlsToRevoke = updatedUrls.slice(0, updatedUrls.length - 5);
        urlsToRevoke.forEach(url => URL.revokeObjectURL(url));
      }
      return updatedUrls.slice(-5); // Keep only the last 5 URLs
    });
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  }, [handleFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileSelect(e.target.files);
      e.target.value = '';
    }
  }, [handleFileSelect]);

  const removeImage = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
      const urlToRemove = prev[index];
      URL.revokeObjectURL(urlToRemove);
      return prev.filter((_, i) => i !== index);
    });
  };

  const startAnalysis = async () => {
    if (selectedFiles.length === 0 && !itemDescription.trim()) {
      setError("Vänligen ladda upp minst en bild eller ge en beskrivning.");
      return;
    }
    setError(null);
    setIsLoading(true);
    setStep('analyzing');
    setProgress(0);

    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      currentProgress += 10;
      if (currentProgress <= 70) {
        setProgress(currentProgress);
      } else {
        clearInterval(progressInterval);
      }
    }, 150);

    try {
      const imageFileNames = selectedFiles.map(file => file.name); // Placeholder for actual upload

      const response = await fetch('/api/valuation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: itemDescription,
          images: imageFileNames,
        }),
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API-fel: ${response.status}`);
      }

      const data: ValuationResult = await response.json();
      setResults(data);
      setStep('results');
    } catch (err: any) {
      setError(err.message || 'Det gick inte att hämta värderingen.');
      setResults({
        valuation: 0,
        confidence: 0,
        message: "Ett fel uppstod.",
        explanations: [err.message || 'Det gick inte att hämta värderingen.'],
        error: err.message || 'Det gick inte att hämta värderingen.'
      });
      setStep('results');
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setStep('upload');
    setProgress(0);
    setSelectedFiles([]);
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setPreviewUrls([]);
    setItemDescription('');
    setResults(null);
    setIsLoading(false);
    setError(null);
  };

  return (
    <div className="py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              AI Värdering av Föremål
            </h1>
            <p className="text-lg text-gray-600">
              Beskriv ditt föremål och ladda upp foton för en AI-driven värderingsuppskattning.
            </p>
          </div>

          {step === 'upload' && (
            <Card>
              <CardContent className="p-8 space-y-6">
                <div>
                  <Label htmlFor="item-description" className="text-lg font-medium text-gray-900 mb-2 block">
                    Föremålsbeskrivning
                  </Label>
                  <Textarea
                    id="item-description"
                    value={itemDescription}
                    onChange={(e) => setItemDescription(e.target.value)}
                    placeholder="Beskriv ditt föremål i detalj. Inkludera material, ålder, skick, märke och eventuella unika egenskaper eller historik."
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label className="text-lg font-medium text-gray-900 mb-2 block">
                    Ladda upp foton (upp till 5)
                  </Label>
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors"
                    onDrop={handleDrop}
                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  >
                    {previewUrls.length > 0 ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {previewUrls.map((url, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={url}
                                alt={`Förhandsgranskning ${index + 1}`}
                                className="max-h-32 mx-auto rounded-lg object-contain"
                              />
                              <Button
                                variant="destructive"
                                size="sm"
                                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeImage(index)}
                              >
                                X
                              </Button>
                            </div>
                          ))}
                        </div>
                        {previewUrls.length < 5 && (
                           <label htmlFor="file-input-additional" className="mt-4 inline-block">
                            <Button variant="outline" asChild>
                              <span>
                                <Upload className="mr-2 h-4 w-4" />
                                Lägg till fler foton
                              </span>
                            </Button>
                          </label>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Camera className="h-16 w-16 text-gray-400 mx-auto" />
                        <div>
                          <p className="text-lg font-medium text-gray-900">
                            Släpp dina foton här
                          </p>
                          <p className="text-gray-600">
                            eller klicka för att bläddra bland filer
                          </p>
                        </div>
                        <label htmlFor="file-input">
                          <Button asChild>
                            <span>
                              <Upload className="mr-2 h-4 w-4" />
                              Välj foton
                            </span>
                          </Button>
                        </label>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileInput}
                      className="hidden"
                      id="file-input"
                    />
                     <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileInput}
                      className="hidden"
                      id="file-input-additional"
                    />
                  </div>
                  {selectedFiles.length > 0 && (
                    <p className="text-sm text-gray-600 mt-2">
                      {selectedFiles.length} bild(er) valda. Du kan lägga till upp till {5 - selectedFiles.length} till.
                    </p>
                  )}
                </div>

                {error && (
                  <div className="flex items-start space-x-2 p-3 bg-red-50 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                <Button onClick={startAnalysis} disabled={isLoading || (selectedFiles.length === 0 && !itemDescription.trim())} className="w-full">
                  {isLoading ? <LoadingSpinner className="mr-2" /> : null}
                  Få AI-värdering
                </Button>
                 <div className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg mt-4">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-700">
                        Ju mer information och bilder AI:n får, desto mer exakt blir värderingen. För bästa resultat, beskriv objektet noggrant och ladda upp tydliga bilder från olika vinklar.
                    </p>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 'analyzing' && (
            <Card>
              <CardContent className="p-8 text-center">
                <LoadingSpinner size="lg" className="mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Analyserar ditt föremål
                </h3>
                <p className="text-gray-600 mb-6">
                  Vår AI undersöker dina föremålsdetaljer och foton...
                </p>
                <Progress value={progress} className="mb-4" />
                <p className="text-sm text-gray-500">
                  {progress}% klart
                </p>
              </CardContent>
            </Card>
          )}

          {step === 'results' && results && (
            <div className="space-y-6">
              <Card>
                <CardContent className="p-8">
                  {results.error ? (
                    <div className="flex items-center mb-4">
                       <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
                       <h3 className="text-xl font-semibold text-red-700">
                         Värderingsfel
                       </h3>
                    </div>
                  ) : (
                    <div className="flex items-center mb-4">
                      <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                      <h3 className="text-xl font-semibold text-gray-900">
                        Värdering klar
                      </h3>
                    </div>
                  )}

                  {!results.error && (
                    <div className="grid gap-4 md:grid-cols-2 mb-6">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Uppskattat värde</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {results.valuation.toLocaleString('sv-SE', { style: 'currency', currency: 'SEK', minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Konfidensnivå</p>
                        <div className="flex items-center">
                          <Progress value={results.confidence} className="flex-1 mr-2" />
                          <span className="text-sm font-medium">{results.confidence}%</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className={`flex items-start space-x-2 p-4 ${results.error ? 'bg-red-50' : 'bg-blue-50'} rounded-lg mb-6`}>
                    <Info className={`h-5 w-5 ${results.error ? 'text-red-600' : 'text-blue-600'} mt-0.5 flex-shrink-0`} />
                    <div>
                      <p className={`text-sm font-medium ${results.error ? 'text-red-800' : 'text-blue-800'}`}>
                        {results.error ? "Detaljer:" : "Värderingsinsikter:"}
                      </p>
                      <p className={`text-sm ${results.error ? 'text-red-700' : 'text-blue-700'}`}>
                        {results.message}
                      </p>
                    </div>
                  </div>

                  {results.explanations && results.explanations.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-2">
                        {results.error ? "Feldetaljer:" : "Faktorer som beaktats:"}
                      </p>
                      <ul className="space-y-1">
                        {results.explanations.map((exp, index) => (
                          <li key={index} className="flex items-start text-sm text-gray-600">
                            <div className={`w-1.5 h-1.5 ${results.error ? 'bg-red-400' : 'bg-blue-400'} rounded-full mt-1.5 mr-2 flex-shrink-0`}></div>
                            {exp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button onClick={reset} variant="outline" className="flex-1">
                  Analysera ett annat föremål
                </Button>
                {/* <Button className="flex-1">
                  Få expertgranskning (Kommer snart)
                </Button> */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}