"use client"

import type React from "react"
import type { Wallet } from "@/types/api"

interface WalletCardProps {
  wallet: Wallet
  onClick?: () => void
}

export const WalletCard: React.FC<WalletCardProps> = ({ wallet, onClick }) => {
  const shortAddress = `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`

  return (
    <div
      onClick={onClick}
      className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-slate-200"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{wallet.name}</h3>
          <p className="text-sm text-slate-600 font-mono">{shortAddress}</p>
        </div>
        <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full">{wallet.network}</span>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-slate-600 text-sm">Balance</span>
          <span className="font-semibold text-slate-900">{wallet.balance} ETH</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600 text-sm">Transactions</span>
          <span className="text-slate-900">{wallet.transactions?.length || 0}</span>
        </div>
      </div>
    </div>
  )
}
