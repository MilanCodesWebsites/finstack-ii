'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { mockP2PAds, P2PAd } from '@/lib/p2p-mock-data';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MyAdsPage() {
  const router = useRouter();
  // Filter for "current user's" ads (in a real app, filter by actual user ID)
  const [myAds, setMyAds] = useState<(P2PAd & { active: boolean })[]>(
    mockP2PAds.slice(0, 3).map(ad => ({ ...ad, active: true }))
  );

  const toggleAd = (id: string) => {
    setMyAds(prev => prev.map(ad => 
      ad.id === id ? { ...ad, active: !ad.active } : ad
    ));
  };

  const deleteAd = (id: string) => {
    if (confirm('Are you sure you want to delete this ad?')) {
      setMyAds(prev => prev.filter(ad => ad.id !== id));
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-2">My Ads</h1>
          <p className="text-sm text-gray-600">Manage your P2P trading advertisements. Only merchants can post ads.</p>
        </div>
      </div>

      {myAds.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-500 mb-4">No ads available</p>
          <p className="text-xs text-gray-400 mb-4">Only merchant accounts can post P2P ads. Visit the merchant dashboard to become a merchant.</p>
          <Button 
            onClick={() => router.push('/dashboard/merchant')}
            variant="outline"
          >
            Go to Merchant Dashboard
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {myAds.map(ad => (
            <Card key={ad.id} className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge className={cn(
                      'text-xs',
                      ad.type === 'buy' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    )}>
                      {ad.type.toUpperCase()}
                    </Badge>
                    <span className="font-semibold text-lg">
                      {ad.cryptoCurrency}/{ad.fiatCurrency}
                    </span>
                    <Switch 
                      checked={ad.active}
                      onCheckedChange={() => toggleAd(ad.id)}
                    />
                    <span className="text-xs text-gray-600">
                      {ad.active ? 'Active' : 'Paused'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Price</p>
                      <p className="font-medium">{ad.price} {ad.fiatCurrency}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Available</p>
                      <p className="font-medium">{ad.available} {ad.cryptoCurrency}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Limits</p>
                      <p className="font-medium">{ad.minLimit}-{ad.maxLimit}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Time Window</p>
                      <p className="font-medium">{ad.paymentWindow} mins</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="text-xs text-gray-600 mb-1">Payment Methods:</p>
                    <div className="flex flex-wrap gap-2">
                      {ad.paymentMethods.map(method => (
                        <span key={method} className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                          {method}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex md:flex-col gap-2">
                  <Button variant="outline" size="sm" className="flex-1 md:flex-none">
                    <Edit className="w-4 h-4 md:mr-2" />
                    <span className="hidden md:inline">Edit</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 md:flex-none">
                    <Eye className="w-4 h-4 md:mr-2" />
                    <span className="hidden md:inline">Stats</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 md:flex-none text-red-600 hover:bg-red-50"
                    onClick={() => deleteAd(ad.id)}
                  >
                    <Trash2 className="w-4 h-4 md:mr-2" />
                    <span className="hidden md:inline">Delete</span>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
