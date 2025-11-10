"use client"

import type React from "react"
import { useState } from "react"

interface CreateWalletModalProps {
  onClose: () => void
  onCreate: (name: string) => void
}

export const CreateWalletModal: React.FC<CreateWalletModalProps> = ({ onClose, onCreate }) => {
  const [name, setName] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onCreate(name)
      setName("")
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Create New Wallet</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Wallet Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., My Trading Wallet"
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
            >
              Create
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
