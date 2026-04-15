export default function SecondaryButton({
    type = 'button',
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
            type={type}
            className={
                `inline-flex items-center justify-center rounded-button border-2 border-gray-300 bg-white text-gray-700 font-semibold shadow-sm transition duration-150 ease-in-out hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 active:bg-gray-100 ${
                    disabled && 'opacity-50 cursor-not-allowed'
                } ${sizeClasses[size]} ${className}`
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
