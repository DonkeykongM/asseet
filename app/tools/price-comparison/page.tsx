'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Search, TrendingUp, TrendingDown, DollarSign, Calendar, Info } from 'lucide-react';

interface MarketData {
  date: string;
  price: number;
  sales: number;
}

interface ComparisonResult {
  itemName: string;
  category: string;
  averagePrice: number;
  priceRange: { low: number; high: number };
  recentSales: number;
  marketTrend: 'up' | 'down' | 'stable';
  trendPercentage: number;
  historicalData: MarketData[];
  similarItems: Array<{
    name: string;
    price: number;
    date: string;
    condition: string;
  }>;
}

export default function PriceComparison() {
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ComparisonResult | null>(null);

  const handleSearch = async () => {
    if (!itemName || !category) return;

    setIsLoading(true);

    setTimeout(() => {
      const mockData: ComparisonResult = {
        itemName,
        category,
        averagePrice: 3250,
        priceRange: { low: 2100, high: 4800 },
        recentSales: 23,
        marketTrend: 'up',
        trendPercentage: 12.5,
        historicalData: [
          { date: '2024-07', price: 2800, sales: 18 },
          { date: '2024-08', price: 2950, sales: 21 },
          { date: '2024-09', price: 3100, sales: 19 },
          { date: '2024-10', price: 3250, sales: 23 },
        ],
        similarItems: [
          { name: 'Similar Item 1', price: 3100, date: '2024-10-15', condition: 'Excellent' },
          { name: 'Similar Item 2', price: 3400, date: '2024-10-10', condition: 'Very Good' },
          { name: 'Similar Item 3', price: 2950, date: '2024-10-05', condition: 'Good' },
          { name: 'Similar Item 4', price: 3650, date: '2024-09-28', condition: 'Mint' },
        ],
      };

      setResults(mockData);
      setIsLoading(false);
    }, 1500);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Price Comparison Tool
            </h1>
            <p className="text-lg text-gray-600">
              Compare your item against recent sales and market data to understand its current value
            </p>
          </div>

          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <Label htmlFor="itemName">Item Name or Description</Label>
                  <Input
                    id="itemName"
                    placeholder="e.g., Rolex Submariner 16610"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vintage-watches">Vintage Watches</SelectItem>
                      <SelectItem value="fine-art">Fine Art</SelectItem>
                      <SelectItem value="antique-furniture">Antique Furniture</SelectItem>
                      <SelectItem value="jewelry-gems">Jewelry & Gems</SelectItem>
                      <SelectItem value="collectible-coins">Collectible Coins</SelectItem>
                      <SelectItem value="sports-memorabilia">Sports Memorabilia</SelectItem>
                      <SelectItem value="vintage-instruments">Vintage Instruments</SelectItem>
                      <SelectItem value="classic-cars">Classic Cars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={handleSearch}
                disabled={!itemName || !category || isLoading}
                className="w-full mt-6"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Analyzing Market Data...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Compare Prices
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {results && (
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Average Price</span>
                      <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">
                      {formatCurrency(results.averagePrice)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Range: {formatCurrency(results.priceRange.low)} - {formatCurrency(results.priceRange.high)}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Market Trend</span>
                      {results.marketTrend === 'up' ? (
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-bold text-gray-900">
                        {results.trendPercentage > 0 ? '+' : ''}{results.trendPercentage}%
                      </p>
                      <Badge variant={results.marketTrend === 'up' ? 'default' : 'secondary'}>
                        {results.marketTrend === 'up' ? 'Rising' : 'Falling'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Last 90 days</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Recent Sales</span>
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">
                      {results.recentSales}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Last 30 days</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Price History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={results.historicalData}>
                        <defs>
                          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip
                          formatter={(value: number) => formatCurrency(value)}
                          labelStyle={{ color: '#000' }}
                        />
                        <Area
                          type="monotone"
                          dataKey="price"
                          stroke="#3b82f6"
                          fillOpacity={1}
                          fill="url(#colorPrice)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Similar Items Recently Sold</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {results.similarItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <div className="flex gap-4 mt-1">
                            <span className="text-sm text-gray-500">
                              {new Date(item.date).toLocaleDateString()}
                            </span>
                            <Badge variant="outline">{item.condition}</Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            {formatCurrency(item.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-2">Market Insights</h4>
                      <ul className="space-y-2 text-sm text-blue-800">
                        <li>• Current market shows strong demand with {results.recentSales} sales in the last month</li>
                        <li>• Prices have increased by {results.trendPercentage}% over the past quarter</li>
                        <li>• Best time to sell: Market conditions are favorable for sellers</li>
                        <li>• Consider professional authentication to maximize value</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button onClick={() => setResults(null)} variant="outline" className="flex-1">
                  New Search
                </Button>
                <Button className="flex-1">
                  Get Professional Appraisal
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
