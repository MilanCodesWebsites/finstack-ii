"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Stepper } from "@/components/dashboard/stepper"
import { Copy, Check, ArrowLeft, Wallet, CreditCard, Sparkles, Loader2 } from "lucide-react"
import { convertCurrency } from "@/lib/mock-api"

const steps = [
  { number: 1, title: "Select Wallet" },
  { number: 2, title: "Select Network" },
  { number: 3, title: "Deposit Details" },
]

type ChainType = "TRC20" | "ERC20" | "BSC"

export default function DepositPage() {
  const [currentStep, setCurrentStep] = useState(1)
 const [selectedWallet, setSelectedWallet] = useState<"NGN" | "USDT" | "USDC" | "CNGN" | null>(null)
  const [selectedChain, setSelectedChain] = useState<ChainType | null>(null)
  const [copiedAddress, setCopiedAddress] = useState(false)
  const [copiedAccount, setCopiedAccount] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [acknowledged, setAcknowledged] = useState(false)

  const handleContinue = () => {
    if (!selectedWallet) return
    if (selectedWallet === "NGN") {
      setCurrentStep(3) // Skip chain selection for NGN
   } else if (selectedWallet === "USDT" || selectedWallet === "USDC" || selectedWallet === "CNGN") {
      setCurrentStep(2) // Go to chain selection for crypto
    }
  }

  const handleChainContinue = () => {
    if (!selectedChain) return
    setCurrentStep(3)
  }

  // Chain-specific wallet addresses per token (mock)
  const walletAddresses: Record<Exclude<typeof selectedWallet, null | "NGN">, Record<ChainType, string>> = {
    USDT: {
      TRC20: "TN3W4H6rK5oEKMQmHyFa5qfnHgWtEHtR8r",
      ERC20: "0x742d35Cc6634C0532925a3b8D400E29Fd2e2134f",
      BSC: "0x1234567890abcdef1234567890abcdef12345678"
    },
    USDC: {
      TRC20: "TF17BgPaZYbz8oxbjhriubPDsA7ArKoLX3",
      ERC20: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      BSC: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d"
    },
    CNGN: {
      TRC20: "TSu5CngnTronAddressMock1234567890",
      ERC20: "0xCngnEthMockAddress1234567890abcdef12345678",
      BSC: "0xCngnBscMockAddressabcdef1234567890abcdef12"
    }
  }

  const chainInfo: Record<ChainType, { name: string; description: string; minDeposit: string; icon: string }> = {
    TRC20: {
      name: "TRC20 (Tron)",
      description: "Tron network - Lowest fees",
      minDeposit: "10",
      icon: "https://otiktpyazqotihijbwhm.supabase.co/storage/v1/object/public/images/bafb177a-43b9-4844-84a6-35b50af92dac-tron.png"
    },
    ERC20: {
      name: "ERC20 (Ethereum)",
      description: "Ethereum network - Most secure",
      minDeposit: "10",
      icon: "https://otiktpyazqotihijbwhm.supabase.co/storage/v1/object/public/images/585842f7-a274-45fc-9c42-3ae9af5566bc-eth.png"
    },
    BSC: {
      name: "BSC (Binance Smart Chain)",
      description: "Binance Smart Chain - Fast & cheap",
      minDeposit: "10",
      icon: "https://otiktpyazqotihijbwhm.supabase.co/storage/v1/object/public/images/478cc3b3-729c-430c-96a5-f21093f47d64-bnb.png"
    }
  }

  // Fixed deposit addresses
  const ngnAccountNumber = "123456789"

  // Reset chain when wallet changes
  useEffect(() => {
    setSelectedChain(null)
  }, [selectedWallet])

  const copyToClipboard = async (text: string, type: 'address' | 'account') => {
    try {
      await navigator.clipboard.writeText(text)
      if (type === 'address') {
        setCopiedAddress(true)
        setTimeout(() => setCopiedAddress(false), 2000)
      } else {
        setCopiedAccount(true)
        setTimeout(() => setCopiedAccount(false), 2000)
      }
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground">Deposit Funds</h1>
          <p className="text-gray-600">Add money to your wallet</p>
        </div>
      </div>

      <Stepper steps={steps} currentStep={currentStep} />

      <Card className="max-w-2xl mx-auto p-6 shadow-lg border-gray-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Step 1: Select Wallet */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Select Wallet</h2>
              <p className="text-gray-600">Choose the wallet you want to deposit funds into</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedWallet("NGN")}
                className={`p-6 border-2 rounded-lg transition-all duration-200 text-left group ${
                  selectedWallet === "NGN" 
                    ? "border-[#2F67FA] bg-[#2F67FA]/5" 
                    : "border-gray-200 hover:border-[#2F67FA] hover:bg-[#2F67FA]/5"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                    selectedWallet === "NGN"
                      ? "bg-[#2F67FA] text-white"
                      : "bg-[#2F67FA]/10 group-hover:bg-[#2F67FA] text-[#2F67FA] group-hover:text-white"
                  }`}>
                    <img 
                      src="https://otiktpyazqotihijbwhm.supabase.co/storage/v1/object/public/images/f0f01069-7e35-4291-8664-af625c9c9623-nigeria-logo.png" 
                      alt="Naira" 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">NGN Wallet</h3>
                <p className="text-sm text-gray-600">Deposit Nigerian Naira</p>
              </button>

              <button
                onClick={() => setSelectedWallet("USDT")}
                className={`p-6 border-2 rounded-lg transition-all duration-200 text-left group ${
                  selectedWallet === "USDT" 
                    ? "border-[#2F67FA] bg-[#2F67FA]/5" 
                    : "border-gray-200 hover:border-[#2F67FA] hover:bg-[#2F67FA]/5"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                    selectedWallet === "USDT"
                      ? "bg-[#2F67FA] text-white"
                      : "bg-[#2F67FA]/10 group-hover:bg-[#2F67FA] text-[#2F67FA] group-hover:text-white"
                  }`}>
                    <img 
                      src="https://otiktpyazqotihijbwhm.supabase.co/storage/v1/object/public/images/ef95eebe-7923-4b32-87a6-d755b8caba30-usdt%20logo.png" 
                      alt="USDT" 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">USDT Wallet</h3>
                <p className="text-sm text-gray-600">Deposit Tether (USDT)</p>
              </button>

               <button
                 onClick={() => setSelectedWallet("USDC")}
                 className={`p-6 border-2 rounded-lg transition-all duration-200 text-left group ${
                   selectedWallet === "USDC" 
                     ? "border-[#2F67FA] bg-[#2F67FA]/5" 
                     : "border-gray-200 hover:border-[#2F67FA] hover:bg-[#2F67FA]/5"
                 }`}
               >
                 <div className="flex items-center justify-between mb-4">
                   <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                     selectedWallet === "USDC"
                       ? "bg-[#2F67FA] text-white"
                       : "bg-[#2F67FA]/10 group-hover:bg-[#2F67FA] text-[#2F67FA] group-hover:text-white"
                   }`}>
                     <span className="text-2xl font-bold">$</span>
                   </div>
                 </div>
                 <h3 className="text-lg font-semibold text-foreground mb-1">USDC Wallet</h3>
                 <p className="text-sm text-gray-600">Deposit USD Coin</p>
               </button>

               <button
                 onClick={() => setSelectedWallet("CNGN")}
                 className={`p-6 border-2 rounded-lg transition-all duration-200 text-left group ${
                   selectedWallet === "CNGN" 
                     ? "border-[#2F67FA] bg-[#2F67FA]/5" 
                     : "border-gray-200 hover:border-[#2F67FA] hover:bg-[#2F67FA]/5"
                 }`}
               >
                 <div className="flex items-center justify-between mb-4">
                   <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                     selectedWallet === "CNGN"
                       ? "bg-[#2F67FA] text-white"
                       : "bg-[#2F67FA]/10 group-hover:bg-[#2F67FA] text-[#2F67FA] group-hover:text-white"
                   }`}>
                     <span className="text-2xl font-bold">₦</span>
                   </div>
                 </div>
                 <h3 className="text-lg font-semibold text-foreground mb-1">CNGN Wallet</h3>
                 <p className="text-sm text-gray-600">Deposit Crypto Naira</p>
               </button>
            </div>

            {selectedWallet && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <Button
                  onClick={handleContinue}
                  className="w-full bg-[#2F67FA] hover:bg-[#2F67FA]/90 text-white"
                >
                  Continue
                </Button>
              </div>
            )}
            
            {/* Back button for step 1 */}
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </div>
        )}

        {/* Step 2: Select Chain (only for USDT) */}
         {currentStep === 2 && (selectedWallet === "USDT" || selectedWallet === "USDC" || selectedWallet === "CNGN") && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Select Network</h2>
               <p className="text-gray-600">Choose the blockchain network for your {selectedWallet} deposit</p>
            </div>

            <div className="grid gap-4">
              {(Object.keys(chainInfo) as ChainType[]).map((chain) => {
                const info = chainInfo[chain]
                return (
                  <button
                    key={chain}
                    onClick={() => setSelectedChain(chain)}
                    className={`p-4 border-2 rounded-lg transition-all duration-200 text-left group ${
                      selectedChain === chain 
                        ? "border-[#2F67FA] bg-[#2F67FA]/5" 
                        : "border-gray-200 hover:border-[#2F67FA] hover:bg-[#2F67FA]/5"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden transition-colors ${
                          selectedChain === chain
                            ? "bg-[#2F67FA] border-2 border-[#2F67FA]"
                            : "bg-white border-2 border-gray-200 group-hover:border-[#2F67FA]"
                        }`}>
                          <img 
                            src={info.icon} 
                            alt={chain} 
                            className="w-8 h-8 object-cover rounded-full"
                          />
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-foreground">{info.name}</h3>
                          <p className="text-sm text-gray-600">{info.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Min. deposit</p>
                        <p className="text-sm font-medium text-foreground">{info.minDeposit}</p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {selectedChain && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <Button
                  onClick={handleChainContinue}
                  className="w-full bg-[#2F67FA] hover:bg-[#2F67FA]/90 text-white"
                >
                  Continue
                </Button>
              </div>
            )}
            
            {/* Back button for step 2 */}
            <Button
              onClick={() => setCurrentStep(1)}
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </div>
        )}

        {/* Step 3: Deposit Details */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#2F67FA]/10 flex items-center justify-center mx-auto mb-4">
                {selectedWallet === "NGN" ? (
                  <CreditCard className="w-8 h-8 text-[#2F67FA]" />
                ) : (
                  <Wallet className="w-8 h-8 text-[#2F67FA]" />
                )}
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                  {selectedWallet === "NGN" ? "Bank Account Details" : `${selectedWallet} Wallet Address`}
              </h2>
              <p className="text-gray-600">
                {selectedWallet === "NGN" 
                  ? "Transfer funds to this 9PSB account number"
                  : `Send ${selectedWallet} to this wallet address (${selectedChain} Network)`
                }
              </p>
            </div>

            <div className="space-y-4">
              {selectedWallet === "NGN" ? (
                <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Bank Name</Label>
                      <p className="text-lg font-semibold text-foreground">9PSB (9Pay Service Bank)</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Account Number</Label>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 mt-1">
                        <span className="text-lg font-mono font-semibold text-foreground">{ngnAccountNumber}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(ngnAccountNumber, 'account')}
                          className="text-[#2F67FA] hover:bg-[#2F67FA]/10"
                        >
                          {copiedAccount ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Account Name</Label>
                      <p className="text-lg font-semibold text-foreground">John Doe</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Network</Label>
                      <p className="text-lg font-semibold text-foreground">{chainInfo[selectedChain!].name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Wallet Address</Label>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 mt-1">
                        <span className="text-sm font-mono font-semibold text-foreground break-all">{selectedWallet && selectedChain ? walletAddresses[selectedWallet as Exclude<typeof selectedWallet, null | "NGN">][selectedChain] : ''}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => { if (selectedWallet && selectedChain) copyToClipboard(walletAddresses[selectedWallet as Exclude<typeof selectedWallet, null | "NGN">][selectedChain], 'address') }}
                          className="text-[#2F67FA] hover:bg-[#2F67FA]/10 ml-2 flex-shrink-0"
                        >
                          {copiedAddress ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                      {/* QR code toggle */}
                      {selectedWallet && selectedChain && (
                        <div className="mt-3">
                          <Button variant="outline" size="sm" onClick={() => setShowQR(!showQR)}>
                            {showQR ? 'Hide QR Code' : 'Show QR Code'}
                          </Button>
                          {showQR && (
                            <div className="mt-3 p-3 bg-white border rounded-md inline-block">
                              <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(walletAddresses[selectedWallet as Exclude<typeof selectedWallet, null | 'NGN'>][selectedChain])}`}
                                alt="Deposit address QR"
                                className="w-[180px] h-[180px]"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-yellow-800 mb-1">Important Notes</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      {selectedWallet === "NGN" ? (
                        <>
                          <li>• <strong>Please deposit from an account that has the same name on your Finstack account. No third-party deposits.</strong></li>
                          <li>• Only send NGN from Nigerian bank accounts</li>
                          <li>• Include your user ID in the transfer description</li>
                          <li>• Deposits are processed within 5-10 minutes</li>
                        </>
                      ) : (
                        <>
                          <li>• Only send {selectedWallet} on {selectedChain} network</li>
                          <li>• Do not send other cryptocurrencies to this address</li>
                          <li>• Minimum deposit: {chainInfo[selectedChain!].minDeposit} {selectedWallet}</li>
                          <li>• Network fees apply as per blockchain standards</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              {selectedWallet !== 'NGN' && (
                <label className="flex items-center gap-2 text-xs text-gray-600 -mt-1">
                  <input type="checkbox" checked={acknowledged} onChange={e => setAcknowledged(e.target.checked)} />
                  I will only send {selectedWallet} on {selectedChain} network.
                </label>
              )}
              <Button
                onClick={() => {
                  if (selectedWallet === "NGN") {
                    setCurrentStep(1)
                  } else {
                    setCurrentStep(2)
                  }
                }}
                variant="outline"
                className="flex-1 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <Button asChild disabled={selectedWallet !== 'NGN' && !acknowledged} className="flex-1 bg-[#2F67FA] hover:bg-[#2F67FA]/90 text-white disabled:opacity-50 disabled:cursor-not-allowed">
                <a href="/dashboard">Go to Dashboard</a>
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
