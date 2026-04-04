import { useState } from 'react'

export default function ConfirmModal({ title, message, onConfirm, onCancel, isLoading }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#0E2C28] rounded-lg p-6 max-w-sm border border-[rgba(45,212,191,0.12)]">
                <h2 className="text-xl font-bold text-[#E2FAF7] mb-4">{title}</h2>
                <p className="text-[#7ABFB9] mb-6">{message}</p>
                <div className="flex gap-4">
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 rounded border border-[#0D9488] text-[#0D9488] hover:bg-[#0D9488] hover:text-white transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                        {isLoading ? 'Confirming...' : 'Confirm'}
                    </button>
                </div>
            </div>
        </div>
    )
}
