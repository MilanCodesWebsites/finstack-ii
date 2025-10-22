import { WelcomeBadge } from "@/components/dashboard/welcome-badge"
import { WalletBalanceCard } from "@/components/dashboard/wallet-balance-card"
import { CurrencyConverter } from "@/components/dashboard/currency-converter"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { MoneyQuote } from "@/components/dashboard/money-quote"
import { DidYouKnow } from "@/components/dashboard/did-you-know"
import { getUser, getWallets, getTransactions } from "@/lib/mock-api"

export default async function DashboardPage() {
  const user = await getUser()
  const wallets = await getWallets()
  const recentTransactions = await getTransactions(undefined, 5)

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Welcome Section */}
      <div className="animate-in fade-in slide-in-from-top-4 duration-500">
        <WelcomeBadge firstName={user.firstName} isKYCVerified={user.isKYCVerified} />
      </div>

      {/* Wallet Balance Card */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
        <WalletBalanceCard wallets={wallets} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
        <div className="space-y-3 md:space-y-4">
          <CurrencyConverter />
        </div>
        <div className="grid grid-rows-2 gap-3 md:gap-4 h-full">
          <MoneyQuote />
          <DidYouKnow />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
        <QuickActions />
      </div>

      {/* Recent Activity */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400">
        <RecentActivity transactions={recentTransactions} />
      </div>
    </div>
  )
}
