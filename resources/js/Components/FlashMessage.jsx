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
                    className={`fixed top-4 right-4 px-6 py-3 rounded-lg text-white shadow-lg animate-pulse ${
                        msg.type === 'success' ? 'bg-[#0D9488]' : 'bg-red-500'
                    }`}
                >
                    {msg.text}
                </div>
            ))}
        </>
    )
}
