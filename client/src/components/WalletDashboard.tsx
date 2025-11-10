"use client"

import type React from "react"
import { useState } from "react"
import { useQuery, useMutation } from "@apollo/client"
import { GraphQL_QUERIES, GraphQL_MUTATIONS } from "@/services/api"
import type { Wallet } from "@/types/api"
import { WalletCard } from "./WalletCard"
import { CreateWalletModal } from "./CreateWalletModal"
import { SendTransactionModal } from "./SendTransactionModal"

export const WalletDashboard: React.FC = () => {
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showTransactionModal, setShowTransactionModal] = useState(false)

  const { data, loading, error, refetch } = useQuery(GraphQL_QUERIES.GET_WALLETS)
  const [createWallet] = useMutation(GraphQL_MUTATIONS.CREATE_WALLET, {
    onCompleted: () => {
      refetch()
      setShowCreateModal(false)
    },
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-slate-600">Loading wallets...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-600">Error loading wallets: {error.message}</div>
      </div>
    )
  }

  const wallets = data?.wallets || []

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900">My Wallets</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700"
          >
            Create Wallet
          </button>
        </div>

        {wallets.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-600 mb-4">No wallets created yet</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Create Your First Wallet
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wallets.map((wallet: Wallet) => (
              <WalletCard
                key={wallet.id}
                wallet={wallet}
                onClick={() => {
                  setSelectedWallet(wallet)
                  setShowTransactionModal(true)
                }}
              />
            ))}
          </div>
        )}

        {showCreateModal && (
          <CreateWalletModal
            onClose={() => setShowCreateModal(false)}
            onCreate={(name) => {
              createWallet({ variables: { name } })
            }}
          />
        )}

        {showTransactionModal && selectedWallet && (
          <SendTransactionModal
            wallet={selectedWallet}
            onClose={() => {
              setShowTransactionModal(false)
              setSelectedWallet(null)
            }}
            onSuccess={() => {
              refetch()
              setShowTransactionModal(false)
              setSelectedWallet(null)
            }}
          />
        )}
      </div>
    </div>
  )
}
