// Royal blue color for primary actions
export const ROYAL_BLUE = "#2F67FA"
export const ROYAL_BLUE_LIGHT = "#4a7bff"
export const GRAY_PRIMARY = "#6B7280"
export const GRAY_SECONDARY = "#9CA3AF"

// Wallet types and currencies
export const WALLET_TYPES = ["NGN", "USDT", "USDC", "CNGN"] as const
export type WalletType = typeof WALLET_TYPES[number]

export const CURRENCY_SYMBOLS: Record<WalletType, string> = {
	NGN: "₦",
	USDT: "$",
	USDC: "$",
	CNGN: "₦"
}

export const CURRENCY_NAMES: Record<WalletType, string> = {
	NGN: "Nigerian Naira",
	USDT: "Tether",
	USDC: "USD Coin",
	CNGN: "Crypto Naira"
}
