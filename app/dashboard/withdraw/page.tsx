"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Stepper } from "@/components/dashboard/stepper"
import { OTPInput } from "@/components/dashboard/otp-input"
import { AddAccountDialog } from "@/components/dashboard/add-account-dialog"
import { AddWalletDialog } from "@/components/dashboard/add-wallet-dialog"
import { ArrowLeft, Sparkles, Plus } from "lucide-react"
import { convertCurrency } from "@/lib/mock-api"

const steps = [
  { number: 1, title: "Select Wallet" },
  { number: 2, title: "Destination" },
  { number: 3, title: "Enter Amount" },
  { number: 4, title: "Verify OTP" },
  { number: 5, title: "Complete" },
]

const savedAccounts = [
  { id: 1, name: "My GTBank Account", accountNumber: "0123456789", bank: "GTBank" },
  { id: 2, name: "Business Account", accountNumber: "9876543210", bank: "Access Bank" },
]

const savedWallets = [
  { id: 1, name: "Binance Wallet", address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb", network: "TRC20" },
  { id: 2, name: "Trust Wallet", address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063", network: "ERC20" },
]

export default function WithdrawPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedWallet, setSelectedWallet] = useState<"NGN" | "USDT" | null>(null)
  const [amount, setAmount] = useState("")
  const [selectedDestination, setSelectedDestination] = useState<number | null>(null)

  const handleAccountAdded = (account: { bankName: string; accountNumber: string; accountName: string }) => {
    // Add the new account to the saved accounts list
    const newAccount = {
      id: savedAccounts.length + 1,
      name: account.accountName,
      accountNumber: account.accountNumber,
      bank: account.bankName,
    }
    savedAccounts.push(newAccount)
  }

  const handleWalletAdded = (wallet: { name: string; address: string; network: string }) => {
    // Add the new wallet to the saved wallets list
    const newWallet = {
      id: savedWallets.length + 1,
      name: wallet.name,
      address: wallet.address,
      network: wallet.network,
    }
    savedWallets.push(newWallet)
  }

  const fee = selectedWallet === "NGN" ? 50 : 1
  const totalAmount = amount ? Number.parseFloat(amount) + fee : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground">Withdraw Funds</h1>
          <p className="text-gray-600">Transfer money from your wallet</p>
        </div>
      </div>

      <Stepper steps={steps} currentStep={currentStep} />

      <Card className="max-w-2xl mx-auto p-6 shadow-lg border-gray-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Step 1: Select Wallet */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Select Wallet</h2>
              <p className="text-gray-600">Choose which wallet you want to withdraw from</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => {
                  setSelectedWallet("NGN")
                  setCurrentStep(2)
                }}
                className="p-6 border-2 border-gray-200 rounded-lg hover:border-[#2F67FA] hover:bg-[#2F67FA]/5 transition-all duration-200 text-left group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#2F67FA]/10 flex items-center justify-center group-hover:bg-[#2F67FA] transition-colors">
                    <span className="text-xl font-bold text-[#2F67FA] group-hover:text-white">₦</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">NGN Wallet</h3>
                <p className="text-sm text-gray-600 mb-2">Withdraw Nigerian Naira</p>
                <p className="text-lg font-semibold text-foreground">₦250,000.00</p>
              </button>

              <button
                onClick={() => {
                  setSelectedWallet("USDT")
                  setCurrentStep(2)
                }}
                className="p-6 border-2 border-gray-200 rounded-lg hover:border-[#2F67FA] hover:bg-[#2F67FA]/5 transition-all duration-200 text-left group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#2F67FA]/10 flex items-center justify-center group-hover:bg-[#2F67FA] transition-colors">
                    <span className="text-xl font-bold text-[#2F67FA] group-hover:text-white">$</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">USDT Wallet</h3>
                <p className="text-sm text-gray-600 mb-2">Withdraw Tether (USDT)</p>
                <p className="text-lg font-semibold text-foreground">$1,500.00</p>
              </button>
            </div>
            
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

        {/* Step 2: Select Destination */}
        {currentStep === 2 && selectedWallet && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Select Destination</h2>
              <p className="text-gray-600">
                {selectedWallet === "NGN" ? "Choose a bank account" : "Choose a wallet address"}
              </p>
            </div>

            <div className="space-y-3">
              {(selectedWallet === "NGN" ? savedAccounts : savedWallets).map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedDestination(item.id)
                    setCurrentStep(3)
                  }}
                  className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-[#2F67FA] hover:bg-[#2F67FA]/5 transition-all duration-200 text-left"
                >
                  <p className="font-semibold text-foreground mb-1">{item.name}</p>
                  <p className="text-sm text-gray-600 font-mono">
                    {"accountNumber" in item ? `${item.accountNumber} • ${item.bank}` : item.address}
                  </p>
                </button>
              ))}

              {selectedWallet === "NGN" ? (
                <AddAccountDialog onAccountAdded={handleAccountAdded}>
                  <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#2F67FA] hover:bg-[#2F67FA]/5 transition-all duration-200 flex items-center justify-center gap-2 text-gray-600 hover:text-[#2F67FA]">
                    <Plus className="w-5 h-5" />
                    <span className="font-medium">Add New Bank Account</span>
                  </button>
                </AddAccountDialog>
              ) : (
                <AddWalletDialog onWalletAdded={handleWalletAdded}>
                  <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#2F67FA] hover:bg-[#2F67FA]/5 transition-all duration-200 flex items-center justify-center gap-2 text-gray-600 hover:text-[#2F67FA]">
                    <Plus className="w-5 h-5" />
                    <span className="font-medium">Add New Wallet</span>
                  </button>
                </AddWalletDialog>
              )}
            </div>
            
            {/* Add back button for step 2 */}
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

        {/* Step 3: Enter Amount */}
        {currentStep === 3 && selectedWallet && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Enter Amount</h2>
              <p className="text-gray-600">How much do you want to withdraw?</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="amount">Amount ({selectedWallet})</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-lg"
                />
              </div>

              {amount && (
                <div className="space-y-3">
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Amount</span>
                      <span className="font-medium text-foreground">
                        {selectedWallet === "NGN" ? "₦" : "$"}
                        {Number.parseFloat(amount).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Transaction Fee</span>
                      <span className="font-medium text-foreground">
                        {selectedWallet === "NGN" ? "₦" : "$"}
                        {fee.toFixed(2)}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-gray-200 flex justify-between">
                      <span className="font-semibold text-foreground">Total</span>
                      <span className="font-semibold text-foreground">
                        {selectedWallet === "NGN" ? "₦" : "$"}
                        {totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">You will receive</p>
                    <p className="text-lg font-semibold text-foreground">
                      {selectedWallet === "NGN"
                        ? `$${convertCurrency(Number.parseFloat(amount), "NGN", "USD").toFixed(2)}`
                        : `₦${convertCurrency(Number.parseFloat(amount), "USDT", "NGN").toFixed(2)}`}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setCurrentStep(2)}
                variant="outline"
                className="flex-1 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <Button
                onClick={() => setCurrentStep(4)}
                disabled={!amount || Number.parseFloat(amount) <= 0}
                className="flex-1 bg-[#2F67FA] hover:bg-[#2F67FA]/90 text-white"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Verify OTP */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-foreground mb-2">Verify OTP</h2>
              <p className="text-gray-600">Enter the 6-digit code sent to your email</p>
            </div>

            <div className="flex justify-center">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5, 6].map((index) => (
                  <Input
                    key={index}
                    className="w-12 h-12 text-center text-lg font-semibold"
                    maxLength={1}
                    onChange={(e) => {
                      if (e.target.value && index < 6) {
                        const nextInput = document.querySelector(`input[data-index="${index + 1}"]`) as HTMLInputElement
                        nextInput?.focus()
                      }
                    }}
                    data-index={index}
                  />
                ))}
              </div>
            </div>

            <div className="text-center">
              <button className="text-sm text-[#2F67FA] hover:text-[#2F67FA]/80 font-medium">Resend Code</button>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setCurrentStep(3)}
                variant="outline"
                className="flex-1 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <Button
                onClick={() => setCurrentStep(5)}
                className="flex-1 bg-[#2F67FA] hover:bg-[#2F67FA]/90 text-white"
              >
                Verify & Complete
              </Button>
            </div>
          </div>
        )}

        {/* Step 5: Success */}
        {currentStep === 5 && (
          <div className="space-y-6 text-center py-8">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto animate-in zoom-in duration-500">
              <Sparkles className="w-10 h-10 text-green-600" />
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">Withdrawal Successful!</h2>
              <p className="text-gray-600">
                Your withdrawal of {selectedWallet === "NGN" ? "₦" : "$"}
                {amount} is being processed.
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Transaction Reference</p>
              <p className="text-sm font-mono font-medium text-foreground">TXN-{Date.now()}</p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => window.history.back()}
                variant="outline"
                className="flex-1 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <Button asChild className="flex-1 bg-[#2F67FA] hover:bg-[#2F67FA]/90 text-white">
                <a href="/dashboard">Go to Dashboard</a>
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}