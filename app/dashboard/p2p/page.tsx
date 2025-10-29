"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Filter, ShieldCheck, MapPin, Clock } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { mockP2PAds, mockMerchants, getMerchant, P2PAd, P2POrder, PaymentMethod, CountryCode } from "@/lib/p2p-mock-data"
import { P2P_CURRENCY_COUNTRIES, P2PCurrency } from "@/lib/constants"
import { getMerchantAds } from "@/lib/p2p-storage"
import { TraderProfileModal } from "@/components/p2p/TraderProfileModal"
import { OrderModal } from "@/components/p2p/OrderModal"

export default function P2PMarketplacePage() {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy')
  
  // Currency selection
  const [selectedCrypto, setSelectedCrypto] = useState<string>('USDT')
  const [selectedFiat, setSelectedFiat] = useState<string>('NGN')
  
  // Filters
  const [filterPayment, setFilterPayment] = useState<string>('all')
  const [filterCountry, setFilterCountry] = useState<string>('all')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [minAmount, setMinAmount] = useState<string>('')
  const [sortBy, setSortBy] = useState<'price' | 'rating'>('price')

  // Modals
  const [selectedMerchant, setSelectedMerchant] = useState<string | null>(null)
  const [selectedAd, setSelectedAd] = useState<P2PAd | null>(null)
  const [showMerchantModal, setShowMerchantModal] = useState(false)
  const [showOrderModal, setShowOrderModal] = useState(false)

  // Filter and sort ads
  const filterAds = (ads: P2PAd[], type: 'buy' | 'sell') => {
    return ads
      .filter(ad => {
        // When user wants to "buy" crypto, they need merchants who are "selling" (type='sell')
        // When user wants to "sell" crypto, they need merchants who are "buying" (type='buy')
        const correctType = type === 'buy' ? 'sell' : 'buy'
        return ad.type === correctType
      })
      .filter(ad => ad.cryptoCurrency === selectedCrypto)
      .filter(ad => selectedFiat === 'all' || ad.fiatCurrency === selectedFiat)
      .filter(ad => filterPayment === 'all' || ad.paymentMethods.includes(filterPayment as PaymentMethod))
      .filter(ad => filterCountry === 'all' || ad.country === filterCountry)
      .filter(ad => {
        if (verifiedOnly) {
          const merchant = getMerchant(ad.merchantId)
          return merchant?.verifiedBadge === true
        }
        return true
      })
      .filter(ad => {
        if (minAmount && parseFloat(minAmount) > 0 && ad.minLimit > parseFloat(minAmount)) return false
        return true
      })
      .sort((a, b) => {
        if (sortBy === 'price') {
          return type === 'buy' ? a.price - b.price : b.price - a.price
        }
        const merchantA = getMerchant(a.merchantId)
        const merchantB = getMerchant(b.merchantId)
        return (merchantB?.rating || 0) - (merchantA?.rating || 0)
      })
  }

  const buyAds = filterAds(mockP2PAds, 'buy')
  const sellAds = filterAds(mockP2PAds, 'sell')

  // Load merchant ads from localStorage
  const [merchantAds, setMerchantAds] = useState<P2PAd[]>([])
  
  useEffect(() => {
    // Load ads immediately
    const stored = getMerchantAds()
    setMerchantAds(stored)
    console.log('📊 Loaded merchant ads:', stored)

    // Also check every 500ms in case new ads were added
    const interval = setInterval(() => {
      const updated = getMerchantAds()
      setMerchantAds(updated)
    }, 500)

    return () => clearInterval(interval)
  }, [])

  // Combine mock ads with merchant ads from localStorage
  const allAds = [...mockP2PAds, ...merchantAds]
  
  const filteredBuyAds = filterAds(allAds, 'buy')
  const filteredSellAds = filterAds(allAds, 'sell')

  const handleMerchantClick = (merchantId: string) => {
    setSelectedMerchant(merchantId)
    setShowMerchantModal(true)
  }

  const handleAdClick = (ad: P2PAd) => {
    setSelectedAd(ad)
    setShowOrderModal(true)
  }

  const handleOrderCreated = (order: P2POrder) => {
    const { saveOrder } = require('@/lib/p2p-storage')
    saveOrder(order)
  }

  // Get unique pairs and countries for filters
  const cryptoCurrencies = ['USDT', 'USDC', 'NGN', 'CNGN'] // Finstack supported currencies
  const fiatCurrencies = ['NGN', 'RMB', 'GHS']
  const uniqueCountries = Array.from(new Set(mockP2PAds.map(ad => ad.country)))
  const paymentMethods: PaymentMethod[] = ['Bank Transfer', 'MTN Mobile Money', 'Alipay', 'Custom Account']

  const renderAdRow = (ad: P2PAd, actionLabel: string, actionColor: string) => {
    let merchant = getMerchant(ad.merchantId)
    
    // Fallback: create a temporary merchant object if not found
    if (!merchant) {
      console.warn(`⚠️ Merchant not found: ${ad.merchantId}, using fallback`)
      // Use deterministic rating based on merchant ID hash to avoid hydration mismatch
      const hash = ad.merchantId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
      const rating = 95 + (hash % 5) // Consistent rating 95-99 based on merchantId
      const trades = (hash * 7) % 1000 // Consistent trades based on merchantId
      
      merchant = {
        id: ad.merchantId,
        name: ad.merchantId,
        businessName: `${ad.merchantId} Trading`,
        rating: rating,
        totalTrades: trades,
        completionRate: 98,
        responseTime: '2 mins',
        verifiedBadge: true,
        activeAds: 1,
        country: ad.country || 'GLOBAL',
        joinedDate: '2024-01-15',
        languages: ['English']
      }
    }

    return (
      <div 
        key={ad.id} 
        className="grid md:grid-cols-7 gap-4 md:gap-6 p-4 border border-gray-200 rounded-lg hover:border-blue-400 transition-colors hover:shadow-md cursor-pointer"
        onClick={() => handleAdClick(ad)}
      >
        <div className="space-y-1">
          <p className="text-xs text-gray-600 mb-1 md:hidden">Merchant</p>
          <button 
            onClick={(e) => {
              e.stopPropagation()
              handleMerchantClick(merchant.id)
            }}
            className="font-medium text-foreground hover:text-blue-600 text-left flex items-center gap-1"
          >
            {merchant.name}
            {merchant.verifiedBadge && (
              <ShieldCheck className="w-4 h-4 text-blue-600" />
            )}
          </button>
          <p className="text-xs text-gray-600">{merchant.totalTrades} trades</p>
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <MapPin className="w-3 h-3" />
            {merchant.country}
          </div>
        </div>
        
        <div className="space-y-1">
          <p className="text-xs text-gray-600 mb-1 md:hidden">Price</p>
          <p className="text-lg font-semibold text-foreground">{ad.price.toLocaleString()} {ad.fiatCurrency}</p>
          <p className="text-xs text-gray-600">{ad.cryptoCurrency}/{ad.fiatCurrency}</p>
        </div>
        
        <div className="space-y-1">
          <p className="text-xs text-gray-600 mb-1 md:hidden">Available</p>
          <p className="text-sm text-foreground">{ad.available.toLocaleString()} {ad.cryptoCurrency}</p>
        </div>
        
        <div className="space-y-1">
          <p className="text-xs text-gray-600 mb-1 md:hidden">Limits</p>
          <p className="text-sm text-foreground">{ad.minLimit.toLocaleString()} - {ad.maxLimit.toLocaleString()}</p>
          <p className="text-xs text-gray-600">{ad.fiatCurrency}</p>
        </div>
        
        <div className="space-y-1">
          <p className="text-xs text-gray-600 mb-1 md:hidden">Payment</p>
          <div className="flex flex-wrap gap-1">
            {ad.paymentMethods.map((method) => (
              <span key={method} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                {method}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Clock className="w-3 h-3" />
            {ad.paymentWindow} mins
          </div>
        </div>
        
        <div className="space-y-1">
          <p className="text-xs text-gray-600 mb-1 md:hidden">Rating</p>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{merchant.rating}%</span>
          </div>
          <p className="text-xs text-gray-600">{merchant.completionRate}% completion</p>
        </div>
        
        <div>
          <Button 
            onClick={(e) => {
              e.stopPropagation()
              handleAdClick(ad)
            }}
            className={cn("w-full", actionColor)}
          >
            {actionLabel}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground">P2P Marketplace</h1>
          <p className="text-gray-600">Trade crypto with verified merchants</p>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
          <div>
            <p className="text-sm font-medium text-blue-900">Escrow Protected</p>
            <p className="text-xs text-blue-700">All trades secured by Finstack</p>
          </div>
        </div>
      </div>

      {/* Buy/Sell Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'buy' | 'sell')} className="space-y-0">
        <TabsList className="grid w-full max-w-[200px] grid-cols-2 h-12">
          <TabsTrigger value="buy" className="text-base font-medium">
            Buy
          </TabsTrigger>
          <TabsTrigger value="sell" className="text-base font-medium">
            Sell
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Crypto Currency Horizontal Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 overflow-x-auto pb-2 scrollbar-hide">
        {cryptoCurrencies.map((crypto) => (
          <button
            key={crypto}
            onClick={() => setSelectedCrypto(crypto)}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap",
              selectedCrypto === crypto
                ? "bg-blue-600 text-white font-semibold"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            )}
          >
            {crypto}
          </button>
        ))}
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-3 pb-2">
        {/* Fiat Currency Selector */}
        <Select value={selectedFiat} onValueChange={setSelectedFiat}>
          <SelectTrigger className="w-[180px] h-[42px]">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
                {selectedFiat === 'all' ? '🌍' : selectedFiat === 'NGN' ? '₦' : selectedFiat === 'RMB' ? '¥' : selectedFiat === 'GHS' ? '₵' : '?'}
              </div>
              <SelectValue placeholder="Select currency" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
                  🌍
                </div>
                <span>All Currencies</span>
              </div>
            </SelectItem>
            {fiatCurrencies.map((currency) => (
              <SelectItem key={currency} value={currency}>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
                    {currency === 'NGN' ? '₦' : currency === 'RMB' ? '¥' : '₵'}
                  </div>
                  <span>{currency}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* All payment methods */}
        <Select value={filterPayment} onValueChange={setFilterPayment}>
          <SelectTrigger className="w-[220px] h-[42px]">
            <SelectValue placeholder="All payment methods" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All payment methods</SelectItem>
            {paymentMethods.map(method => (
              <SelectItem key={method} value={method}>{method}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* More Filters Button */}
        <Button variant="outline" size="icon" className="h-[42px] w-[42px]">
          <Filter className="w-4 h-4" />
        </Button>

        <div className="ml-auto flex items-center gap-2">
          <Label htmlFor="verified-toggle" className="text-sm text-gray-600 cursor-pointer whitespace-nowrap">
            Verified Only
          </Label>
          <Switch
            id="verified-toggle"
            checked={verifiedOnly}
            onCheckedChange={setVerifiedOnly}
          />
        </div>
      </div>

      {/* Merchant Listings */}
      <Card className="shadow-lg border-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              {activeTab === 'buy' ? 'Buy' : 'Sell'} {selectedCrypto}
            </h3>
            <span className="text-sm text-gray-600">
              {activeTab === 'buy' ? filteredBuyAds.length : filteredSellAds.length} {(activeTab === 'buy' ? filteredBuyAds.length : filteredSellAds.length) === 1 ? 'offer' : 'offers'} available
            </span>
          </div>
          
          <div className="space-y-4">
            {/* Header for desktop */}
            <div className="hidden md:grid md:grid-cols-7 gap-6 p-4 bg-gray-50 rounded-lg font-medium text-sm text-gray-700">
              <div>Merchant</div>
              <div>Price</div>
              <div>Available</div>
              <div>Limits</div>
              <div>Payment</div>
              <div>Rating</div>
              <div>Action</div>
            </div>
            
            {activeTab === 'buy' && filteredBuyAds.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-2">No merchants match your filters</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedCrypto('USDT')
                    setSelectedFiat('NGN')
                    setFilterPayment('all')
                    setFilterCountry('all')
                    setMinAmount('')
                    setVerifiedOnly(false)
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}

            {activeTab === 'buy' && filteredBuyAds.map(ad => renderAdRow(ad, 'Buy', 'bg-green-600 hover:bg-green-700 text-white'))}
            
            {activeTab === 'sell' && filteredSellAds.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-2">No merchants match your filters</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedCrypto('USDT')
                    setSelectedFiat('NGN')
                    setFilterPayment('all')
                    setFilterCountry('all')
                    setMinAmount('')
                    setVerifiedOnly(false)
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}

            {activeTab === 'sell' && filteredSellAds.map(ad => renderAdRow(ad, 'Sell', 'bg-blue-600 hover:bg-blue-700 text-white'))}
          </div>
        </div>
      </Card>

      {/* Modals */}
      {selectedMerchant && (
        <TraderProfileModal
          trader={mockMerchants[selectedMerchant]}
          ads={mockP2PAds.filter(ad => ad.merchantId === selectedMerchant)}
          open={showMerchantModal}
          onClose={() => {
            setShowMerchantModal(false)
            setSelectedMerchant(null)
          }}
          onSelectAd={handleAdClick}
        />
      )}

      {selectedAd && (
        <OrderModal
          ad={selectedAd}
          trader={getMerchant(selectedAd.merchantId)!}
          open={showOrderModal}
          onClose={() => {
            setShowOrderModal(false)
            setSelectedAd(null)
          }}
          onOrderCreated={handleOrderCreated}
        />
      )}
    </div>
  )
}
