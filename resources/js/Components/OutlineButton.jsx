export default function OutlineButton({
    className = '',
    disabled,
    size = 'md',
    variant = 'primary',
    children,
    ...props
}) {
    const sizeClasses = {
        sm: 'px-4 py-1.5 text-sm',
        md: 'px-6 py-2.5 text-base',
        lg: 'px-8 py-3.5 text-lg'
    }

    const variantClasses = {
        primary: 'border-brand-primary text-brand-primary hover:bg-teal-50',
        danger: 'border-red-500 text-red-500 hover:bg-red-50',
        success: 'border-green-500 text-green-500 hover:bg-green-50',
        warning: 'border-amber-500 text-amber-500 hover:bg-amber-50'
    }

    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center rounded-button border-2 bg-white font-semibold transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary ${
                    disabled && 'opacity-50 cursor-not-allowed'
                } ${variantClasses[variant]} ${sizeClasses[size]} ${className}`
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
