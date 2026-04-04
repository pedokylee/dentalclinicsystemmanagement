import { useForm } from '@inertiajs/react'
import { Link } from '@inertiajs/react'

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    })

    const submit = (e) => {
        e.preventDefault()
        post('/login')
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#061A18]">
            <div className="w-full max-w-md">
                <div className="bg-[#0E2C28] border border-[rgba(45,212,191,0.12)] rounded-lg p-8">
                    <h2 className="text-2xl font-bold text-center text-[#0D9488] mb-8">Login to DCMS</h2>

                    <form onSubmit={submit} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-[#7ABFB9] mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full px-4 py-2 bg-[#0F2724] border border-[rgba(45,212,191,0.12)] rounded text-[#E2FAF7] focus:outline-none focus:border-[#0D9488] transition-colors"
                                placeholder="you@example.com"
                                required
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-[#7ABFB9] mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full px-4 py-2 bg-[#0F2724] border border-[rgba(45,212,191,0.12)] rounded text-[#E2FAF7] focus:outline-none focus:border-[#0D9488] transition-colors"
                                placeholder="••••••••"
                                required
                            />
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="w-4 h-4 rounded"
                            />
                            <label htmlFor="remember" className="ml-2 text-sm text-[#7ABFB9]">
                                Remember me
                            </label>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-2 bg-[#0D9488] text-white rounded font-medium hover:bg-[#14B8A6] transition-colors disabled:opacity-50"
                        >
                            {processing ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-[#7ABFB9] text-sm">
                        <p>Don't have an account? <Link href="/" className="text-[#0D9488] hover:underline font-medium">Go to home</Link></p>
                    </div>
                </div>
            </div>
        </div>
    )
}
