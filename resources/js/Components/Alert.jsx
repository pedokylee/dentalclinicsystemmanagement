import { AlertCircle, AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react'

const alertStyles = {
    success: {
        bg: 'bg-green-50',
        border: 'border-l-4 border-green-500',
        text: 'text-green-800',
        titleClass: 'text-green-900 font-semibold'
    },
    error: {
        bg: 'bg-red-50',
        border: 'border-l-4 border-red-500',
        text: 'text-red-800',
        titleClass: 'text-red-900 font-semibold'
    },
    warning: {
        bg: 'bg-amber-50',
        border: 'border-l-4 border-amber-500',
        text: 'text-amber-800',
        titleClass: 'text-amber-900 font-semibold'
    },
    info: {
        bg: 'bg-blue-50',
        border: 'border-l-4 border-blue-500',
        text: 'text-blue-800',
        titleClass: 'text-blue-900 font-semibold'
    }
}

const iconMap = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    info: <AlertCircle className="w-5 h-5 text-blue-500" />
}

export default function Alert({
    type = 'info',
    title,
    children,
    dismissible = false,
    onDismiss,
    className = ''
}) {
    const style = alertStyles[type] || alertStyles.info
    const icon = iconMap[type]

    return (
        <div className={`${style.bg} ${style.border} p-4 rounded-lg flex gap-3 ${className}`}>
            <div className="flex-shrink-0 flex items-start pt-0.5">
                {icon}
            </div>
            <div className="flex-1">
                {title && (
                    <h4 className={`${style.titleClass} mb-1`}>{title}</h4>
                )}
                <p className={`${style.text} text-sm`}>
                    {children}
                </p>
            </div>
            {dismissible && (
                <button
                    onClick={onDismiss}
                    className={`flex-shrink-0 ml-2 ${style.text} hover:opacity-75 transition-opacity`}
                >
                    <XCircle className="w-5 h-5" />
                </button>
            )}
        </div>
    )
}
