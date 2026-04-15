export default function SuccessButton({
    className = '',
    disabled,
    size = 'md',
    children,
    ...props
}) {
    const sizeClasses = {
        sm: 'px-4 py-1.5 text-sm',
        md: 'px-6 py-2.5 text-base',
        lg: 'px-8 py-3.5 text-lg'
    }

    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center rounded-button border border-transparent bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 active:bg-green-800 ${
                    disabled && 'opacity-50 cursor-not-allowed'
                } ${sizeClasses[size]} ${className}`
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
