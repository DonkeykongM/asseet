'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Upload, Camera, Send, Gem, Watch, Paintbrush, CircleCheck as CheckCircle, CircleAlert as AlertCircle } from 'lucide-react';

export function Hero() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const quickActions = [
    {
      icon: Camera,
      title: 'Ta foto för snabbvärdering',
      description: 'AI-analys av bilder ger omedelbart värderat resultat',
      color: 'bg-red-50 text-red-600',
      onClick: () => router.push('/appraise/new')
    },
    {
      icon: Gem,
      title: 'Skapa värderingsrapport',
      description: 'Professionella rapporter för försäkring och försäljning',
      color: 'bg-blue-50 text-blue-600',
      onClick: () => router.push('/appraise/new')
    },
    {
      icon: Paintbrush,
      title: 'Specialiserade verktyg',
      description: 'Anpassade verktyg för olika kategorier av föremål',
      color: 'bg-emerald-50 text-emerald-600',
      onClick: () => router.push('/appraise/new')
    }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() && !selectedFile) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const formData = new FormData();
      formData.append('description', inputValue);
      if (selectedFile) {
        formData.append('image', selectedFile);
      }
      formData.append('timestamp', new Date().toISOString());
      formData.append('source', 'hero_form');

      const response = await fetch('https://hook.eu2.make.com/8v3v9vn4f45lkxjp8t6102ng7k3nxygm', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setSubmitStatus('success');
        setInputValue('');
        setSelectedFile(null);
        // Reset success message after 3 seconds
        setTimeout(() => setSubmitStatus('idle'), 3000);
      } else {
        console.error('Submission failed with status:', response.status, response.statusText);
        setSubmitStatus('error');
        // Reset error message after 5 seconds
        setTimeout(() => setSubmitStatus('idle'), 5000);
      }
    } catch (error) {
      console.error('Network error during submission:', error);
      setSubmitStatus('error');
      // Reset error message after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50 pt-20 pb-16 sm:pt-24 sm:pb-20">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 h-64 w-64 rounded-full bg-blue-100/40 blur-3xl"></div>
        <div className="absolute bottom-20 left-20 h-48 w-48 rounded-full bg-cyan-100/40 blur-2xl"></div>
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Main Heading */}
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl mb-6">
            AI-driven värderingsplattform för
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {' '}samlare & investerare
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg text-gray-600 sm:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto">
            Få professionell värdering av smycken, konst, antikviteter och samlarobjekt på några minuter.
            Ladda upp bilder, beskriv ditt föremål och få en detaljerad värderingsrapport direkt i ditt konto.
          </p>

          {/* Input Box */}
          <form onSubmit={handleSubmit} className="mb-12 max-w-3xl mx-auto">
            <div className="relative bg-white rounded-2xl border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100">
              <div className="flex items-center p-4 sm:p-6">
                <div className="flex items-center space-x-3 mr-4">
                  <label className="p-2 text-gray-400 hover:text-blue-600 transition-colors cursor-pointer">
                    <Upload className="h-6 w-6" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <label className="p-2 text-gray-400 hover:text-blue-600 transition-colors cursor-pointer">
                    <Camera className="h-6 w-6" />
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <input
                  type="text"
                  placeholder="Beskriv ditt föremål eller ladda upp en bild..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-1 text-lg placeholder-gray-400 border-none outline-none bg-transparent"
                  disabled={isSubmitting}
                />
                <div className="ml-4 flex items-center space-x-2">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
                    <Watch className="h-6 w-6 text-white" />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting || (!inputValue.trim() && !selectedFile)}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-6 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </div>
              
              {/* File indicator */}
              {selectedFile && (
                <div className="px-6 pb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Camera className="h-4 w-4" />
                    <span>Bild vald: {selectedFile.name}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="px-6 pb-4">
                  <div className="flex items-center space-x-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>Tack! Vi analyserar ditt föremål och återkommer med värdering.</span>
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="px-6 pb-4">
                  <div className="flex items-center space-x-2 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>Ett fel uppstod vid skickning. Vänligen försök igen.</span>
                  </div>
                </div>
              )}
            </div>
          </form>

          {/* Quick Actions */}
          <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
            {quickActions.map((action, index) => (
              <Card
                key={index}
                className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-sm cursor-pointer"
                onClick={action.onClick}
              >
                <CardContent className="p-6">
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${action.color} mb-4`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {action.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-8 sm:justify-center">
            <div className="flex items-center space-x-2 text-gray-500">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Certifierade experter</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-500">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Resultat på 2-5 minuter</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-500">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">50,000+ föremål värderade</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}