import { useEffect, useState } from 'react'
import { usePage } from '@inertiajs/react'

export default function FlashMessage() {
    const { flash } = usePage().props
    const [messages, setMessages] = useState([])

    useEffect(() => {
        if (flash?.success) {
            setMessages([{ type: 'success', text: flash.success }])
            const timer = setTimeout(() => setMessages([]), 3000)
            return () => clearTimeout(timer)
        }
        if (flash?.error) {
            setMessages([{ type: 'error', text: flash.error }])
            const timer = setTimeout(() => setMessages([]), 3000)
            return () => clearTimeout(timer)
        }
    }, [flash])

    return (
        <>
            {messages.map((msg, idx) => (
                <div
                    key={idx}
                    className={`fixed right-6 top-6 z-[80] rounded-2xl px-5 py-4 text-sm font-semibold text-white shadow-2xl ${
                        msg.type === 'success' ? 'bg-[var(--dcms-primary)]' : 'bg-red-500'
                    }`}
                >
                    {msg.text}
                </div>
            ))}
        </>
    )
}
