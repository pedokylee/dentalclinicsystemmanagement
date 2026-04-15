import { Link, useForm } from '@inertiajs/react'
import { ArrowLeft, LockKeyhole, Mail, Stethoscope, UserPlus2 } from 'lucide-react'

export default function Login({ canResetPassword }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    })

    const submit = (event) => {
        event.preventDefault()
        post('/login')
    }

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.18),_transparent_30%),linear-gradient(180deg,#061A18_0%,#08211f_100%)] px-4 py-10">
            <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
                <div className="grid w-full max-w-5xl gap-10 lg:grid-cols-[1.15fr_0.85fr]">
                    <div className="hidden rounded-[32px] border border-white/10 bg-white/5 p-10 text-white shadow-2xl backdrop-blur lg:flex lg:flex-col lg:justify-between">
                        <div>
                            <div className="flex items-center gap-3">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--dcms-primary)]">
                                    <Stethoscope className="h-7 w-7" />
                                </div>
                                <div>
                                    <p className="text-3xl font-bold">DCMS Portal</p>
                                    <p className="text-sm uppercase tracking-[0.2em] text-[var(--dcms-light)]">Dental Clinic Management System</p>
                                </div>
                            </div>

                            <div className="mt-14 space-y-6">
                                <h1 className="text-5xl leading-tight text-white">One secure login for every clinic role.</h1>
                                <p className="max-w-xl text-lg leading-8 text-[#cdeeed]">
                                    Access patient care, appointments, reports, and clinic operations from one connected dashboard built for administrators, dentists, staff, and patients.
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            {[
                                ['Admin', 'System-wide reports and controls'],
                                ['Dentist', 'Treatment records and schedules'],
                                ['Staff', 'Registration, reminders, and check-in'],
                            ].map(([title, copy]) => (
                                <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                    <p className="font-bold text-white">{title}</p>
                                    <p className="mt-2 text-sm text-[#b8ddda]">{copy}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="dcms-card mx-auto w-full max-w-xl overflow-hidden border-0 shadow-[0_28px_80px_rgba(0,0,0,0.22)]">
                        <div className="border-b border-[var(--dcms-border)] bg-[var(--dcms-surface)] px-8 py-6 text-center">
                            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--dcms-primary)]">Welcome Back</p>
                            <h2 className="mt-2 text-3xl">Sign in to DCMS</h2>
                            <p className="mt-2 text-sm text-[var(--dcms-text-soft)]">Your role will be detected automatically after login.</p>
                        </div>

                        <div className="p-8">
                            <form onSubmit={submit} className="space-y-5">
                                <div>
                                    <label className="dcms-label">Email</label>
                                    <div className="relative">
                                        <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--dcms-primary)]" />
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(event) => setData('email', event.target.value)}
                                            className="dcms-input pl-12"
                                            placeholder="you@example.com"
                                            required
                                        />
                                    </div>
                                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className="dcms-label">Password</label>
                                    <div className="relative">
                                        <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--dcms-primary)]" />
                                        <input
                                            type="password"
                                            value={data.password}
                                            onChange={(event) => setData('password', event.target.value)}
                                            className="dcms-input pl-12"
                                            placeholder="Enter your password"
                                            required
                                        />
                                    </div>
                                    {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                                </div>

                                <div className="flex items-center justify-between gap-4">
                                    <label className="flex items-center gap-2 text-sm text-[var(--dcms-text-soft)]">
                                        <input
                                            type="checkbox"
                                            checked={data.remember}
                                            onChange={(event) => setData('remember', event.target.checked)}
                                            className="rounded border-[var(--dcms-border)] text-[var(--dcms-primary)] focus:ring-[var(--dcms-primary)]"
                                        />
                                        Remember me
                                    </label>
                                    {canResetPassword && (
                                        <Link href="/forgot-password" className="text-sm font-semibold text-[var(--dcms-gold)] italic hover:underline">
                                            Forgot password?
                                        </Link>
                                    )}
                                </div>

                                <button type="submit" disabled={processing} className="dcms-btn-primary w-full justify-center py-3 text-base">
                                    {processing ? 'Signing In...' : 'Login'}
                                </button>
                            </form>

                            <div className="mt-6 space-y-3 border-t border-[var(--dcms-border)] pt-6">
                                <Link href="/" className="dcms-btn-secondary w-full justify-center">
                                    <ArrowLeft className="h-4 w-4" />
                                    Back to Landing Page
                                </Link>
                                <a href="/#new-patient-intake" className="dcms-btn-gold flex w-full items-center justify-center gap-2">
                                    <UserPlus2 className="h-4 w-4" />
                                    New Patient Registration
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
