"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRightLeft, Info, Star, Filter, TrendingUp } from "lucide-react"
import { CurrencySelector } from "@/components/p2p/CurrencySelector"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { convertCurrency } from "@/lib/mock-api"
import { cn } from "@/lib/utils"
import { mockP2PAds, mockTraders, getTrader, getAdsByTrader, P2PAd, P2POrder, PaymentMethod } from "@/lib/p2p-mock-data"
import { TraderProfileModal } from "@/components/p2p/TraderProfileModal"
import { OrderModal } from "@/components/p2p/OrderModal"

const traders = [
  {
    id: 1,
    name: "John Doe",
    rating: 4.8,
    trades: 234,
    price: 1650,
    currency: "NGN",
    min: 10000,
    max: 500000,
    paymentMethods: ["Bank Transfer", "Mobile Money"],
  },
  {
    id: 2,
    name: "Sarah Chen",
    rating: 4.9,
    trades: 456,
    price: 1645,
    currency: "NGN",
    min: 20000,
    max: 1000000,
    paymentMethods: ["Bank Transfer"],
  },
  {
    id: 3,
    name: "Mike Johnson",
    rating: 4.7,
    trades: 189,
    price: 1655,
    currency: "NGN",
    min: 5000,
    max: 300000,
    paymentMethods: ["Bank Transfer", "Mobile Money", "Cash"],
  },
]

const currencies = [
  { 
    value: "NGN", 
    label: "Nigerian Naira", 
    symbol: "₦", 
    logo: "https://otiktpyazqotihijbwhm.supabase.co/storage/v1/object/public/images/f0f01069-7e35-4291-8664-af625c9c9623-nigeria-logo.png"
  },
  { 
    value: "RMB", 
    label: "Chinese Yuan", 
    symbol: "¥", 
    logo: "https://otiktpyazqotihijbwhm.supabase.co/storage/v1/object/public/images/a0e173f8-1f7d-4317-bead-1182d677213c-rmb.png"
  },
  { 
    value: "USDT", 
    label: "Tether", 
    symbol: "$", 
    logo: "https://otiktpyazqotihijbwhm.supabase.co/storage/v1/object/public/images/ef95eebe-7923-4b32-87a6-d755b8caba30-usdt%20logo.png"
  },
]

export default function P2PPage() {
  const searchParams = useSearchParams()
  const preselectedCurrency = searchParams.get('currency')
  const preselectedAction = searchParams.get('action')
  
  const [fromCurrency, setFromCurrency] = useState("NGN")
  const [toCurrency, setToCurrency] = useState("USDT")
  const [amount, setAmount] = useState("1000")
  const [liveRates, setLiveRates] = useState<{ [key: string]: number }>({})
  const [loadingRates, setLoadingRates] = useState(true)
  const [activeTab, setActiveTab] = useState(preselectedAction === 'buy' || preselectedAction === 'sell' ? preselectedAction : 'buy')
  
  // P2P Trading State
  const [selectedTrader, setSelectedTrader] = useState<string | null>(null)
  const [selectedAd, setSelectedAd] = useState<P2PAd | null>(null)
  const [showTraderModal, setShowTraderModal] = useState(false)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [filterPair, setFilterPair] = useState<string>('all')
  const [filterPayment, setFilterPayment] = useState<string>('all')
   const [minPrice, setMinPrice] = useState<string>('')
   const [maxPrice, setMaxPrice] = useState<string>('')
  const [sortBy, setSortBy] = useState<'price' | 'rating'>('price')

  // Handle preselected currency filter
  useEffect(() => {
    if (preselectedCurrency === 'NGN') {
      // Auto-filter to USDT/NGN pair
      setFilterPair('USDT/NGN')
    }
  }, [preselectedCurrency])

  // Fetch live exchange rates
  useEffect(() => {
    const fetchLiveRates = async () => {
      try {
        setLoadingRates(true)
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD')
        if (!response.ok) throw new Error('Failed to fetch rates')
        
        const data = await response.json()
        
        // Convert to our currency format
        const rates = {
          'NGN-USDT': 1 / data.rates.NGN, // NGN to USD (USDT)
          'USDT-NGN': data.rates.NGN, // USD (USDT) to NGN
          'RMB-USDT': 1 / data.rates.CNY, // CNY to USD
          'USDT-RMB': data.rates.CNY, // USD to CNY
          'NGN-RMB': data.rates.CNY / data.rates.NGN, // NGN to CNY
          'RMB-NGN': data.rates.NGN / data.rates.CNY, // CNY to NGN
        }
        
        setLiveRates(rates)
      } catch (error) {
        console.error('Failed to fetch live rates:', error)
        // Fallback to mock rates if API fails
        setLiveRates({
          'NGN-USDT': 0.0006,
          'USDT-NGN': 1650,
          'RMB-USDT': 0.14,
          'USDT-RMB': 7.2,
          'NGN-RMB': 0.0043,
          'RMB-NGN': 230,
        })
      } finally {
        setLoadingRates(false)
      }
    }

    fetchLiveRates()
    // Refresh rates every 30 seconds
    const interval = setInterval(fetchLiveRates, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const convertedAmount = amount ? convertCurrencyWithLiveRates(Number.parseFloat(amount), fromCurrency, toCurrency, liveRates) : 0

  function convertCurrencyWithLiveRates(amount: number, from: string, to: string, rates: { [key: string]: number }): number {
    if (from === to) return amount
    
    const rateKey = `${from}-${to}`
    const rate = rates[rateKey]
    
    if (rate) {
      return amount * rate
    }
    
    // Fallback to mock conversion if rate not found
    return convertCurrency(amount, from, to)
  }

  const handleSwap = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  const getBalance = (currency: string) => {
    return "-- " + currency
  }

  const getRate = () => {
    if (loadingRates) return "Loading..."
    const rate = convertedAmount / (Number.parseFloat(amount) || 1)
    return `1 ${fromCurrency} ≈ ${rate.toFixed(6)} ${toCurrency}`
  }

  const getUSDEquivalent = () => {
    if (loadingRates) return "Loading..."
    const usdAmount = convertCurrencyWithLiveRates(Number.parseFloat(amount) || 0, fromCurrency, "USDT", liveRates)
    return `≈ ${usdAmount.toFixed(6)} USDT`
  }

  // P2P Filtering and Sorting
  const filterAds = (ads: P2PAd[], type: 'buy' | 'sell') => {
    return ads
      .filter(ad => ad.type === type)
      .filter(ad => filterPair === 'all' || `${ad.cryptoCurrency}/${ad.fiatCurrency}` === filterPair)
      .filter(ad => filterPayment === 'all' || ad.paymentMethods.includes(filterPayment as PaymentMethod))
       .filter(ad => {
         // Price range filter
         if (minPrice && parseFloat(minPrice) > 0 && ad.price < parseFloat(minPrice)) return false;
         if (maxPrice && parseFloat(maxPrice) > 0 && ad.price > parseFloat(maxPrice)) return false;
         return true;
       })
      .sort((a, b) => {
        if (sortBy === 'price') {
          return type === 'buy' ? a.price - b.price : b.price - a.price;
        }
        const traderA = getTrader(a.traderId);
        const traderB = getTrader(b.traderId);
        return (traderB?.rating || 0) - (traderA?.rating || 0);
      });
  };

  const buyAds = filterAds(mockP2PAds, 'sell'); // Users buy from sellers
  const sellAds = filterAds(mockP2PAds, 'buy'); // Users sell to buyers

  const handleTraderClick = (traderId: string) => {
    setSelectedTrader(traderId);
    setShowTraderModal(true);
  };

  const handleAdClick = (ad: P2PAd) => {
    setSelectedAd(ad);
    setShowOrderModal(true);
  };

  const handleOrderCreated = (order: P2POrder) => {
    // Save to localStorage
    const stored = localStorage.getItem('p2p-orders');
    const orders: P2POrder[] = stored ? JSON.parse(stored) : [];
    orders.push(order);
    localStorage.setItem('p2p-orders', JSON.stringify(orders));
  };

  const uniquePairs = Array.from(new Set(mockP2PAds.map(ad => `${ad.cryptoCurrency}/${ad.fiatCurrency}`)));
   const paymentMethods: PaymentMethod[] = ['Bank Transfer', 'Mobile Money', 'Alipay', 'Custom Account'];

  const renderAdRow = (ad: P2PAd, actionLabel: string, actionColor: string) => {
    const trader = getTrader(ad.traderId);
    if (!trader) return null;

    return (
      <div key={ad.id} className="grid md:grid-cols-6 gap-4 md:gap-6 p-4 border border-gray-200 rounded-lg hover:border-blue-400 transition-colors hover:shadow-md">
        <div className="space-y-1">
          <p className="text-xs text-gray-600 mb-1 md:hidden">Trader</p>
          <button 
            onClick={() => handleTraderClick(trader.id)}
            className="font-medium text-foreground hover:text-blue-600 text-left"
          >
            {trader.name}
          </button>
          <p className="text-xs text-gray-600">{trader.totalTrades} trades</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-gray-600 mb-1 md:hidden">Price</p>
          <p className="text-lg font-semibold text-foreground">{ad.price} {ad.fiatCurrency}</p>
          <p className="text-xs text-gray-600">{ad.cryptoCurrency}/{ad.fiatCurrency}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-gray-600 mb-1 md:hidden">Available</p>
          <p className="text-sm text-foreground">{ad.available} {ad.cryptoCurrency}</p>
          <p className="text-xs text-gray-600">{ad.minLimit}-{ad.maxLimit} {ad.fiatCurrency}</p>
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
        </div>
        <div className="space-y-1">
          <p className="text-xs text-gray-600 mb-1 md:hidden">Rating</p>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{trader.rating}%</span>
          </div>
        </div>
        <div>
          <Button 
            onClick={() => handleAdClick(ad)}
            className={cn("w-full", actionColor)}
          >
            {actionLabel}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground">P2P Trading</h1>
          <p className="text-gray-600">Trade directly with other users</p>
        </div>
        
        {/* Quick Action: Buy NGN */}
        {!preselectedCurrency && (
          <Button
            onClick={() => {
              setFilterPair('USDT/NGN')
              setActiveTab('buy')
            }}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-5 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
          >
            <TrendingUp className="w-5 h-5" />
            Buy NGN on P2P
          </Button>
        )}
      </div>

      {/* Redesigned currency selector */}
      <CurrencySelector
        initialBase={preselectedCurrency === 'NGN' ? 'NGN' : 'NGN'}
        initialQuote={'USDT'}
        primaryOptions={[...new Set(mockP2PAds.map(a => a.fiatCurrency).concat(['NGN','CNGN']))]}
        quoteOptions={[...new Set(mockP2PAds.map(a => a.cryptoCurrency).concat(['USDT','USDC']))]}
        onSelect={(base, quote) => {
          // Map to our pair format crypto/fiat
          const pair = `${quote}/${base}`; // quote is crypto, base is fiat
          if (pair === 'USDT/NGN' || pair === 'USDC/NGN' || uniquePairs.includes(pair)) {
            setFilterPair(pair);
            setActiveTab('buy');
          } else {
            // fallback: set to All and keep active tab
            setFilterPair('all');
          }
        }}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="buy">Buy</TabsTrigger>
          <TabsTrigger value="sell">Sell</TabsTrigger>
          <TabsTrigger value="swap">Swap</TabsTrigger>
        </TabsList>

        <TabsContent value="buy" className="space-y-6 mt-6">
          {/* Filters */}
          <Card className="p-4">
             <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium">Filters:</span>
              </div>
              <Select value={filterPair} onValueChange={setFilterPair}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Pairs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Pairs</SelectItem>
                  {uniquePairs.map(pair => (
                    <SelectItem key={pair} value={pair}>{pair}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterPayment} onValueChange={setFilterPayment}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Payment Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  {paymentMethods.map(method => (
                    <SelectItem key={method} value={method}>{method}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
               <div className="flex items-center gap-2">
                 <Input
                   type="number"
                   placeholder="Min price"
                   value={minPrice}
                   onChange={(e) => setMinPrice(e.target.value)}
                   className="w-[120px] h-10"
                 />
                 <span className="text-gray-400">-</span>
                 <Input
                   type="number"
                   placeholder="Max price"
                   value={maxPrice}
                   onChange={(e) => setMaxPrice(e.target.value)}
                   className="w-[120px] h-10"
                 />
               </div>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price">Best Price</SelectItem>
                  <SelectItem value="rating">Top Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          <Card className="shadow-lg border-gray-200">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Buy Crypto</h3>
              <div className="space-y-4">
                {/* Header for desktop */}
                <div className="hidden md:grid md:grid-cols-6 gap-6 p-4 bg-gray-50 rounded-lg font-medium text-sm text-gray-700">
                  <div>Trader</div>
                  <div>Price</div>
                  <div>Available/Limits</div>
                  <div>Payment Methods</div>
                  <div>Rating</div>
                  <div>Action</div>
                </div>
                
                {buyAds.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No ads match your filters</p>
                ) : (
                  buyAds.map(ad => renderAdRow(ad, 'Buy', 'bg-green-600 hover:bg-green-700 text-white'))
                )}
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="sell" className="space-y-6 mt-6">
          {/* Filters */}
          <Card className="p-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium">Filters:</span>
              </div>
              <Select value={filterPair} onValueChange={setFilterPair}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Pairs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Pairs</SelectItem>
                  {uniquePairs.map(pair => (
                    <SelectItem key={pair} value={pair}>{pair}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterPayment} onValueChange={setFilterPayment}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Payment Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  {paymentMethods.map(method => (
                    <SelectItem key={method} value={method}>{method}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
               <div className="flex items-center gap-2">
                 <Input
                   type="number"
                   placeholder="Min price"
                   value={minPrice}
                   onChange={(e) => setMinPrice(e.target.value)}
                   className="w-[120px] h-10"
                 />
                 <span className="text-gray-400">-</span>
                 <Input
                   type="number"
                   placeholder="Max price"
                   value={maxPrice}
                   onChange={(e) => setMaxPrice(e.target.value)}
                   className="w-[120px] h-10"
                 />
               </div>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price">Best Price</SelectItem>
                  <SelectItem value="rating">Top Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          <Card className="shadow-lg border-gray-200">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Sell Crypto</h3>
              <div className="space-y-4">
                {/* Header for desktop */}
                <div className="hidden md:grid md:grid-cols-6 gap-6 p-4 bg-gray-50 rounded-lg font-medium text-sm text-gray-700">
                  <div>Trader</div>
                  <div>Price</div>
                  <div>Available/Limits</div>
                  <div>Payment Methods</div>
                  <div>Rating</div>
                  <div>Action</div>
                </div>
                
                {sellAds.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No ads match your filters</p>
                ) : (
                  sellAds.map(ad => renderAdRow(ad, 'Sell', 'bg-red-600 hover:bg-red-700 text-white'))
                )}
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="swap" className="space-y-6 mt-6">
          <Card className="max-w-md mx-auto shadow-lg border-0 bg-white">
            <div className="p-6">
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Currency Converter</h3>
                  <p className="text-gray-600">Real-time exchange rates</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">From</span>
                    <span className="text-sm text-gray-500">Balance: {getBalance(fromCurrency)}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border">
                    <div className="flex-1">
                      <Input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="bg-transparent border-0 text-gray-900 text-xl font-semibold placeholder:text-gray-400 focus-visible:ring-0 p-0 h-auto"
                        placeholder="0"
                      />
                      <div className="text-sm text-gray-500 mt-1">
                        {getUSDEquivalent()}
                      </div>
                    </div>
                    
                    <Select value={fromCurrency} onValueChange={setFromCurrency}>
                      <SelectTrigger className="w-auto bg-white border-gray-300 text-gray-900 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-2">
                          <img 
                            src={currencies.find(c => c.value === fromCurrency)?.logo} 
                            alt={fromCurrency}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span className="font-medium">{fromCurrency}</span>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency.value} value={currency.value}>
                            <div className="flex items-center gap-2">
                              <img 
                                src={currency.logo} 
                                alt={currency.value}
                                className="w-5 h-5 rounded-full object-cover"
                              />
                              <span>{currency.value}</span>
                              <span className="text-gray-500 text-xs">- {currency.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={handleSwap}
                    className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 transition-all duration-200 flex items-center justify-center group"
                  >
                    <ArrowRightLeft className="w-4 h-4 text-white transition-transform duration-200 group-hover:rotate-180" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">To</span>
                    <span className="text-sm text-gray-500">Balance: {getBalance(toCurrency)}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border">
                    <div className="flex-1">
                      <div className="text-xl font-semibold text-gray-900">
                        {convertedAmount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 6,
                        })}
                      </div>
                    </div>
                    
                    <Select value={toCurrency} onValueChange={setToCurrency}>
                      <SelectTrigger className="w-auto bg-white border-gray-300 text-gray-900 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-2">
                          <img 
                            src={currencies.find(c => c.value === toCurrency)?.logo} 
                            alt={toCurrency}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span className="font-medium">{toCurrency}</span>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency.value} value={currency.value}>
                            <div className="flex items-center gap-2">
                              <img 
                                src={currency.logo} 
                                alt={currency.value}
                                className="w-5 h-5 rounded-full object-cover"
                              />
                              <span>{currency.value}</span>
                              <span className="text-gray-500 text-xs">- {currency.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Info className="w-4 h-4" />
                  <span>Rate</span>
                  <div className="ml-auto flex items-center gap-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      loadingRates ? "bg-yellow-500 animate-pulse" : "bg-green-500"
                    )} />
                    <span className="font-medium">{getRate()}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1 text-right">
                  {loadingRates ? "Updating rates..." : "Live rates • Updates every 30s"}
                </p>
              </div>

              <div className="mt-6">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg">
                  Convert Now
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      {selectedTrader && (
        <TraderProfileModal
          trader={mockTraders[selectedTrader]}
          ads={getAdsByTrader(selectedTrader)}
          open={showTraderModal}
          onClose={() => {
            setShowTraderModal(false);
            setSelectedTrader(null);
          }}
          onSelectAd={handleAdClick}
        />
      )}

      {selectedAd && (
        <OrderModal
          ad={selectedAd}
          trader={getTrader(selectedAd.traderId)!}
          open={showOrderModal}
          onClose={() => {
            setShowOrderModal(false);
            setSelectedAd(null);
          }}
          onOrderCreated={handleOrderCreated}
        />
      )}
    </div>
  )
}