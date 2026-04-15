import TextInput from './TextInput'
import InputLabel from './InputLabel'
import InputError from './InputError'

export default function FormField({
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    error,
    required = false,
    disabled = false,
    className = '',
    rows,
    children,
    as = 'input'
}) {
    return (
        <div>
            {label && (
                <InputLabel>
                    {label} {required && <span className="text-red-500">*</span>}
                </InputLabel>
            )}
            
            {as === 'textarea' && (
                <textarea
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    rows={rows || 4}
                    className={`w-full px-4 py-2.5 border border-gray-300 rounded-button text-gray-900 placeholder-gray-400 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-brand-primary focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`}
                />
            )}
            
            {as === 'select' && (
                <select
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    className={`w-full px-4 py-2.5 border border-gray-300 rounded-button text-gray-900 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-brand-primary focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`}
                >
                    {children}
                </select>
            )}
            
            {as === 'input' && (
                <TextInput
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    error={!!error}
                    className={className}
                />
            )}
            
            {error && <InputError message={error} />}
        </div>
    )
}
