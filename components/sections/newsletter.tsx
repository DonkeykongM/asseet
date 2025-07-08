'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, CheckCircle } from 'lucide-react';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    setIsSubscribed(true);
    setEmail('');
  };

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-r from-blue-600 to-blue-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Mail className="mx-auto h-12 w-12 text-white mb-4" />
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Stay Updated
          </h2>
          <p className="mt-4 text-lg text-blue-100">
            Get the latest market insights and valuation tips delivered to your inbox
          </p>
        </div>

        <div className="mt-8 max-w-md mx-auto">
          {isSubscribed ? (
            <div className="flex items-center justify-center space-x-2 text-white">
              <CheckCircle className="h-5 w-5" />
              <span>Thank you for subscribing!</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                required
              />
              <Button type="submit" className="bg-white text-blue-600 hover:bg-gray-100">
                Subscribe
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}