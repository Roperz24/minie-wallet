"use client"

import type React from "react"
import { useState } from "react"
import { useMutation } from "@apollo/client"
import { GraphQL_MUTATIONS } from "@/services/api"
import type { Wallet } from "@/types/api"

interface SendTransactionModalProps {
  wallet: Wallet
  onClose: () => void
  onSuccess: () => void
}

export const SendTransactionModal: React.FC<SendTransactionModalProps> = ({ wallet, onClose, onSuccess }) => {
  const [toAddress, setToAddress] = useState("")
  const [amount, setAmount] = useState("")
  const [metadata, setMetadata] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const [sendTransaction] = useMutation(GraphQL_MUTATIONS.SEND_TRANSACTION)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await sendTransaction({
        variables: {
          walletId: wallet.id,
          toAddress,
          amount,
          metadata: metadata || null,
        },
      })
      onSuccess()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const isInvalidAddress = toAddress && !toAddress.match(/^0x[a-fA-F0-9]{40}$/)
  const isInvalidAmount = amount && (isNaN(Number(amount)) || Number(amount) <= 0)
  const isValid = toAddress && amount && !isInvalidAddress && !isInvalidAmount

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Send Transaction</h2>
        <p className="text-sm text-slate-600 mb-6">
          From: {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
        </p>

        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Recipient Address</label>
            <input
              type="text"
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              placeholder="0x..."
              required
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                isInvalidAddress ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:ring-blue-500"
              }`}
            />
            {isInvalidAddress && <p className="text-red-600 text-xs mt-1">Invalid Ethereum address</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Amount (ETH)</label>
            <input
              type="number"
              step="0.001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              required
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                isInvalidAmount ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:ring-blue-500"
              }`}
            />
            {isInvalidAmount && <p className="text-red-600 text-xs mt-1">Amount must be greater than 0</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Metadata (Optional)</label>
            <textarea
              value={metadata}
              onChange={(e) => setMetadata(e.target.value)}
              placeholder="Add notes about this transaction"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!isValid || isLoading}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? "Sending..." : "Send"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-300 text-slate-900 py-2 rounded-lg font-semibold hover:bg-slate-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
