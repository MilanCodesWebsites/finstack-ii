"use client"

import { useState } from "react"
import { Camera, Bell, CreditCard, User, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AddAccountDialog } from "@/components/dashboard/add-account-dialog"
import { KYCForm } from "@/components/dashboard/KYCForm"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: true,
    deposits: true,
    withdrawals: true,
    trades: true,
    marketing: false,
  })
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, bank: "GTBank", accountNumber: "0123456789", accountName: "John Doe", primary: true },
    { id: 2, bank: "Access Bank", accountNumber: "9876543210", accountName: "John Doe", primary: false },
  ])
  const [showAddPayment, setShowAddPayment] = useState(false)

  const handleAddPayment = (account: { bankName: string; accountNumber: string; accountName: string }) => {
    const newMethod = {
      id: paymentMethods.length + 1,
      bank: account.bankName,
      accountNumber: account.accountNumber,
      accountName: account.accountName,
      primary: paymentMethods.length === 0,
    }
    setPaymentMethods([...paymentMethods, newMethod])
    setShowAddPayment(false)
  }

  const handleRemovePayment = (id: number) => {
    setPaymentMethods(paymentMethods.filter((method) => method.id !== id))
  }

  const handleSetPrimary = (id: number) => {
    setPaymentMethods(
      paymentMethods.map((method) => ({
        ...method,
        primary: method.id === id,
      })),
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 md:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-1 md:mb-2">Settings</h1>
          <p className="text-sm md:text-base text-gray-600">Manage your account settings and preferences</p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 md:space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-auto gap-1 md:gap-2 bg-transparent p-0">
            <TabsTrigger
              value="profile"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white border border-gray-200 data-[state=active]:border-blue-600 text-xs md:text-sm px-2 py-2 md:px-4 md:py-2.5"
            >
              <User className="h-3 w-3 md:h-4 md:w-4 md:mr-2" />
              <span className="hidden md:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger
              value="kyc"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white border border-gray-200 data-[state=active]:border-blue-600 text-xs md:text-sm px-2 py-2 md:px-4 md:py-2.5"
            >
              <Upload className="h-3 w-3 md:h-4 md:w-4 md:mr-2" />
              <span className="hidden md:inline">KYC</span>
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white border border-gray-200 data-[state=active]:border-blue-600 text-xs md:text-sm px-2 py-2 md:px-4 md:py-2.5"
            >
              <Bell className="h-3 w-3 md:h-4 md:w-4 md:mr-2" />
              <span className="hidden md:inline">Alerts</span>
            </TabsTrigger>
            <TabsTrigger
              value="payment"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white border border-gray-200 data-[state=active]:border-blue-600 text-xs md:text-sm px-2 py-2 md:px-4 md:py-2.5"
            >
              <CreditCard className="h-3 w-3 md:h-4 md:w-4 md:mr-2" />
              <span className="hidden md:inline">Payment</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4 md:space-y-6">
            <Card className="p-4 md:p-6 border-gray-200 shadow-sm">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6">Profile Information</h2>

              {/* Profile Photo */}
              <div className="mb-4 md:mb-6">
                <Label className="text-xs md:text-sm font-medium text-gray-700 mb-2 block">Profile Photo</Label>
                <div className="flex items-center gap-3 md:gap-4">
                  <Avatar className="h-16 w-16 md:h-20 md:w-20">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-lg md:text-xl">JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-200 mb-2 bg-transparent text-xs md:text-sm"
                    >
                      <Camera className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                      Change Photo
                    </Button>
                    <p className="text-xs text-gray-500">JPG, PNG or GIF. Max 2MB.</p>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <Label
                    htmlFor="firstName"
                    className="text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2 block"
                  >
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    defaultValue="John"
                    className="border-gray-200 text-sm md:text-base h-9 md:h-10"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="lastName"
                    className="text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2 block"
                  >
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    defaultValue="Doe"
                    className="border-gray-200 text-sm md:text-base h-9 md:h-10"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2 block">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="john.doe@example.com"
                    disabled
                    className="border-gray-200 text-sm md:text-base h-9 md:h-10 bg-gray-50 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
                <div>
                  <Label htmlFor="phone" className="text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2 block">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    defaultValue="+234 801 234 5678"
                    className="border-gray-200 text-sm md:text-base h-9 md:h-10"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label
                    htmlFor="address"
                    className="text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2 block"
                  >
                    Address
                  </Label>
                  <Input
                    id="address"
                    defaultValue="123 Main Street, Lagos"
                    className="border-gray-200 text-sm md:text-base h-9 md:h-10"
                  />
                </div>
              </div>

              <div className="mt-4 md:mt-6 flex justify-end">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm h-9 md:h-10">
                  Save Changes
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* KYC Tab */}
          <TabsContent value="kyc" className="space-y-4 md:space-y-6">
            <div className="mb-4">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-1">KYC Verification</h2>
              <p className="text-xs md:text-sm text-gray-600">Complete all steps to verify your identity and unlock full platform features</p>
            </div>
            <KYCForm />
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-4 md:space-y-6">
            <Card className="p-4 md:p-6 border-gray-200 shadow-sm">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6">Notification Preferences</h2>

              {/* Channels */}
              <div className="mb-6 md:mb-8">
                <h3 className="text-xs md:text-sm font-medium text-gray-900 mb-3 md:mb-4">Notification Channels</h3>
                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 text-xs md:text-sm">Email Notifications</p>
                      <p className="text-xs md:text-sm text-gray-600">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 text-xs md:text-sm">SMS Notifications</p>
                      <p className="text-xs md:text-sm text-gray-600">Receive notifications via SMS</p>
                    </div>
                    <Switch
                      checked={notifications.sms}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 text-xs md:text-sm">Push Notifications</p>
                      <p className="text-xs md:text-sm text-gray-600">Receive push notifications on your device</p>
                    </div>
                    <Switch
                      checked={notifications.push}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                    />
                  </div>
                </div>
              </div>

              {/* Activity Types */}
              <div>
                <h3 className="text-xs md:text-sm font-medium text-gray-900 mb-3 md:mb-4">Activity Notifications</h3>
                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 text-xs md:text-sm">Deposits</p>
                      <p className="text-xs md:text-sm text-gray-600">Get notified when deposits are received</p>
                    </div>
                    <Switch
                      checked={notifications.deposits}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, deposits: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 text-xs md:text-sm">Withdrawals</p>
                      <p className="text-xs md:text-sm text-gray-600">Get notified about withdrawal status</p>
                    </div>
                    <Switch
                      checked={notifications.withdrawals}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, withdrawals: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 text-xs md:text-sm">P2P Trades</p>
                      <p className="text-xs md:text-sm text-gray-600">Get notified about P2P trade updates</p>
                    </div>
                    <Switch
                      checked={notifications.trades}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, trades: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 text-xs md:text-sm">Marketing & Updates</p>
                      <p className="text-xs md:text-sm text-gray-600">Receive news and promotional offers</p>
                    </div>
                    <Switch
                      checked={notifications.marketing}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, marketing: checked })}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 md:mt-6 flex justify-end">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm h-9 md:h-10">
                  Save Preferences
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Payment Methods Tab */}
          <TabsContent value="payment" className="space-y-4 md:space-y-6">
            <Card className="p-4 md:p-6 border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">Payment Methods</h2>
                <AddAccountDialog onAccountAdded={handleAddPayment}>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm h-9 md:h-10">
                    Add Bank Account
                  </Button>
                </AddAccountDialog>
              </div>

              <div className="space-y-3 md:space-y-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className="p-3 md:p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="h-10 w-10 md:h-12 md:w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <CreditCard className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-xs md:text-sm">{method.bank}</p>
                          <p className="text-xs md:text-sm text-gray-600">{method.accountNumber}</p>
                          <p className="text-xs md:text-sm text-gray-600">{method.accountName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {method.primary ? (
                          <span className="px-1.5 md:px-2 py-0.5 md:py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                            Primary
                          </span>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSetPrimary(method.id)}
                            className="text-xs h-7 md:h-8"
                          >
                            Set Primary
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemovePayment(method.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                        >
                          <X className="h-3 w-3 md:h-4 md:w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}