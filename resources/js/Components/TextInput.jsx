import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, error = false, disabled = false, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    const baseStyles = 'w-full px-4 py-2.5 border rounded-button text-gray-900 placeholder-gray-400 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1'
    const normalStyles = 'border-gray-300 focus:ring-brand-primary focus:border-transparent'
    const errorStyles = error ? 'border-red-500 focus:ring-red-500' : ''
    const disabledStyles = disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'

    return (
        <input
            {...props}
            type={type}
            disabled={disabled}
            className={
                `${baseStyles} ${disabledStyles} ${error ? errorStyles : normalStyles} ${className}`
            }
            ref={localRef}
        />
    );
});
