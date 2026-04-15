import { Link, useForm, usePage } from '@inertiajs/react'
import { CalendarIcon, ClipboardListIcon, ShieldCheckIcon, StarIcon, CheckCircleIcon, ArrowRightIcon, MapPinIcon, PhoneIcon, MailIcon, UserPlus2Icon, BadgeAlertIcon } from 'lucide-react'
import PrimaryButton from '@/Components/PrimaryButton'
import OutlineButton from '@/Components/OutlineButton'

export default function Home() {
    const { flash } = usePage().props
    const { data, setData, post, processing, errors, reset } = useForm({
        full_name: '',
        email: '',
        phone: '',
        preferred_date: '',
        appointment_type: 'General Checkup',
        concern: '',
    })

    const submitInquiry = (event) => {
        event.preventDefault()
        post('/inquiries', {
            preserveScroll: true,
            onSuccess: () => reset(),
        })
    }

    return (
        <div className="min-h-screen bg-brand-bg-dark">
            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-brand-bg-dark/95 backdrop-blur border-b border-brand-border-light">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                        </div>
                        <span className="text-2xl font-bold text-brand-primary">SmileCare DCMS</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/login" className="text-brand-text-light hover:text-brand-primary transition-colors font-medium">
                            Sign In
                        </Link>
                        <Link href="/appointments/book" className="inline-block">
                            <PrimaryButton size="md">Book Appointment</PrimaryButton>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative overflow-hidden py-20">
                <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/10 to-transparent pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <h1 className="text-6xl font-bold text-[#E2FAF7] leading-tight">
                                    Your Smile,<br /><span className="text-[#0D9488]">Our Priority</span>
                                </h1>
                                <p className="text-xl text-[#7ABFB9]">
                                    Welcome to SmileCare Dental Clinic. We provide comprehensive dental care with modern technology and a compassionate team dedicated to your oral health.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-4">
                                <Link href="/appointments/book" className="inline-block">
                                    <PrimaryButton size="lg">
                                        <CalendarIcon size={20} />
                                        Book Now
                                    </PrimaryButton>
                                </Link>
                                <OutlineButton>
                                    Learn More
                                </OutlineButton>
                            </div>
                            <p className="text-sm text-[#99F6E4]">
                                New patient? Use the intake form below and our staff will verify your details before finalizing your visit.
                            </p>
                            <div className="flex items-center gap-6 pt-4">
                                <div className="flex items-center gap-2">
                                    <StarIcon size={20} className="text-brand-accent-warning" fill="currentColor" />
                                    <span className="text-brand-text-light"><strong>4.9/5</strong> Rating</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircleIcon size={20} className="text-[#0D9488]" />
                                    <span className="text-[#E2FAF7]"><strong>1,200+</strong> Patients</span>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#0D9488]/20 to-[#F59E0B]/20 rounded-2xl blur-3xl" />
                            <div className="relative bg-gradient-to-br from-[#0E2C28] to-[#0F2724] rounded-2xl p-1 border border-[rgba(45,212,191,0.2)]">
                                <div className="bg-[#061A18] rounded-xl aspect-square flex items-center justify-center">
                                    <div className="text-center space-y-4">
                                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#0D9488] to-[#14B8A6] mx-auto flex items-center justify-center">
                                            <CalendarIcon size={48} className="text-white" />
                                        </div>
                                        <h3 className="text-[#E2FAF7] text-lg font-bold">Schedule Your Visit</h3>
                                        <p className="text-[#7ABFB9] text-sm">Available 24/7 for your convenience</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="new-patient-intake" className="py-20 border-y border-[rgba(45,212,191,0.12)] bg-[linear-gradient(180deg,rgba(11,94,87,0.18),rgba(6,26,24,0.45))]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid gap-8 xl:grid-cols-[0.85fr_1.15fr]">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(45,212,191,0.25)] bg-[rgba(13,148,136,0.12)] px-4 py-2 text-sm font-semibold text-[#99F6E4]">
                                <UserPlus2Icon size={18} />
                                New Patient Intake
                            </div>
                            <div>
                                <h2 className="text-4xl font-bold text-[#E2FAF7] mb-4">First time with SmileCare?</h2>
                                <p className="text-lg text-[#7ABFB9] leading-8">
                                    Send us your details from the landing page and our clinic staff will review your information, verify your contact details, and help secure the right appointment slot for you.
                                </p>
                            </div>

                            <div className="space-y-4">
                                {[
                                    'Share your basic details and preferred visit date.',
                                    'Staff receives a notification immediately inside the clinic portal.',
                                    'Your details are reviewed before the appointment is finalized.',
                                ].map((item) => (
                                    <div key={item} className="flex items-start gap-3 rounded-2xl border border-[rgba(45,212,191,0.12)] bg-[#0E2C28] px-5 py-4">
                                        <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-[#0D9488] text-white">
                                            <CheckCircleIcon size={18} />
                                        </div>
                                        <p className="text-[#CFEFED]">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-[28px] border border-[rgba(45,212,191,0.16)] bg-[#0A2320] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.28)]">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.22em] text-[#2DD4BF]">Landing Page Form</p>
                                    <h3 className="mt-2 text-3xl font-bold text-[#E2FAF7]">Request Verification</h3>
                                    <p className="mt-2 text-sm leading-6 text-[#7ABFB9]">
                                        This form is for new patients who are not yet registered in the clinic system.
                                    </p>
                                </div>
                                <Link href="/login" className="text-sm font-semibold text-[#F59E0B] italic hover:underline">
                                    Already registered? Sign in
                                </Link>
                            </div>

                            {flash?.success && (
                                <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-4 text-sm text-[#DDFCF5]">
                                    <CheckCircleIcon className="mt-0.5 h-5 w-5 text-emerald-300" />
                                    <p>{flash.success}</p>
                                </div>
                            )}

                            {flash?.error && (
                                <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-4 text-sm text-[#FFE5E5]">
                                    <BadgeAlertIcon className="mt-0.5 h-5 w-5 text-red-300" />
                                    <p>{flash.error}</p>
                                </div>
                            )}

                            <form onSubmit={submitInquiry} className="mt-6 space-y-5">
                                <div className="grid gap-5 md:grid-cols-2">
                                    <div className="md:col-span-2">
                                        <label className="mb-2 block text-sm font-medium text-[#CFEFED]">Full Name</label>
                                        <input
                                            type="text"
                                            value={data.full_name}
                                            onChange={(event) => setData('full_name', event.target.value)}
                                            className="w-full rounded-2xl border border-[rgba(45,212,191,0.16)] bg-[#061A18] px-4 py-3 text-[#E2FAF7] outline-none transition focus:border-[#2DD4BF] focus:ring-2 focus:ring-[#0D9488]/35"
                                            placeholder="Enter your complete name"
                                        />
                                        {errors.full_name && <p className="mt-2 text-sm text-red-300">{errors.full_name}</p>}
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-[#CFEFED]">Email Address</label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(event) => setData('email', event.target.value)}
                                            className="w-full rounded-2xl border border-[rgba(45,212,191,0.16)] bg-[#061A18] px-4 py-3 text-[#E2FAF7] outline-none transition focus:border-[#2DD4BF] focus:ring-2 focus:ring-[#0D9488]/35"
                                            placeholder="you@example.com"
                                        />
                                        {errors.email && <p className="mt-2 text-sm text-red-300">{errors.email}</p>}
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-[#CFEFED]">Phone Number</label>
                                        <input
                                            type="tel"
                                            value={data.phone}
                                            onChange={(event) => setData('phone', event.target.value)}
                                            className="w-full rounded-2xl border border-[rgba(45,212,191,0.16)] bg-[#061A18] px-4 py-3 text-[#E2FAF7] outline-none transition focus:border-[#2DD4BF] focus:ring-2 focus:ring-[#0D9488]/35"
                                            placeholder="09xx xxx xxxx"
                                        />
                                        {errors.phone && <p className="mt-2 text-sm text-red-300">{errors.phone}</p>}
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-[#CFEFED]">Preferred Date</label>
                                        <input
                                            type="date"
                                            value={data.preferred_date}
                                            onChange={(event) => setData('preferred_date', event.target.value)}
                                            className="w-full rounded-2xl border border-[rgba(45,212,191,0.16)] bg-[#061A18] px-4 py-3 text-[#E2FAF7] outline-none transition focus:border-[#2DD4BF] focus:ring-2 focus:ring-[#0D9488]/35"
                                        />
                                        {errors.preferred_date && <p className="mt-2 text-sm text-red-300">{errors.preferred_date}</p>}
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-[#CFEFED]">Appointment Type</label>
                                        <select
                                            value={data.appointment_type}
                                            onChange={(event) => setData('appointment_type', event.target.value)}
                                            className="w-full rounded-2xl border border-[rgba(45,212,191,0.16)] bg-[#061A18] px-4 py-3 text-[#E2FAF7] outline-none transition focus:border-[#2DD4BF] focus:ring-2 focus:ring-[#0D9488]/35"
                                        >
                                            {['General Checkup', 'Cleaning', 'Consultation', 'Tooth Pain', 'Emergency Concern', 'Cosmetic Dentistry'].map((option) => (
                                                <option key={option} value={option}>{option}</option>
                                            ))}
                                        </select>
                                        {errors.appointment_type && <p className="mt-2 text-sm text-red-300">{errors.appointment_type}</p>}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="mb-2 block text-sm font-medium text-[#CFEFED]">Notes or Concern</label>
                                        <textarea
                                            rows="4"
                                            value={data.concern}
                                            onChange={(event) => setData('concern', event.target.value)}
                                            className="w-full rounded-2xl border border-[rgba(45,212,191,0.16)] bg-[#061A18] px-4 py-3 text-[#E2FAF7] outline-none transition focus:border-[#2DD4BF] focus:ring-2 focus:ring-[#0D9488]/35"
                                            placeholder="Tell us a little about the concern so our staff can prepare properly."
                                        />
                                        {errors.concern && <p className="mt-2 text-sm text-red-300">{errors.concern}</p>}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4 border-t border-[rgba(45,212,191,0.12)] pt-5 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-start gap-3 rounded-2xl bg-[rgba(245,158,11,0.12)] px-4 py-3 text-sm text-[#FDE7B4]">
                                        <BadgeAlertIcon className="mt-0.5 h-5 w-5 text-[#F59E0B]" />
                                        <p>Staff will verify your details first before treating this as a confirmed clinic booking.</p>
                                    </div>
                                    <PrimaryButton type="submit" size="lg" disabled={processing} className="min-w-[220px]">
                                        {processing ? 'Sending Request...' : 'Send to Clinic Staff'}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gradient-to-b from-transparent to-[#0E2C28]/30">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-[#E2FAF7] mb-4">Why Choose SmileCare?</h2>
                        <p className="text-[#7ABFB9] text-lg max-w-2xl mx-auto">
                            Experience dental care that combines expertise, technology, and patient comfort
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="group relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#0D9488]/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative bg-[#0E2C28] border border-[rgba(45,212,191,0.12)] group-hover:border-[#0D9488]/30 p-8 rounded-2xl transition-all">
                                <div className="w-12 h-12 bg-[#0D9488]/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#0D9488]/40 transition-colors">
                                    <ClipboardListIcon className="text-[#0D9488]" size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-[#E2FAF7] mb-2">Comprehensive Care</h3>
                                <p className="text-[#7ABFB9]">From routine cleanings to advanced treatments, we handle all your dental needs with expertise.</p>
                            </div>
                        </div>

                        <div className="group relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#0D9488]/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative bg-[#0E2C28] border border-[rgba(45,212,191,0.12)] group-hover:border-[#0D9488]/30 p-8 rounded-2xl transition-all">
                                <div className="w-12 h-12 bg-[#0D9488]/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#0D9488]/40 transition-colors">
                                    <CalendarIcon className="text-[#0D9488]" size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-[#E2FAF7] mb-2">Easy Scheduling</h3>
                                <p className="text-[#7ABFB9]">Book appointments online anytime, anywhere. Flexible scheduling to fit your busy lifestyle.</p>
                            </div>
                        </div>

                        <div className="group relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#0D9488]/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative bg-[#0E2C28] border border-[rgba(45,212,191,0.12)] group-hover:border-[#0D9488]/30 p-8 rounded-2xl transition-all">
                                <div className="w-12 h-12 bg-[#0D9488]/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#0D9488]/40 transition-colors">
                                    <ShieldCheckIcon className="text-[#0D9488]" size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-[#E2FAF7] mb-2">Secure & Private</h3>
                                <p className="text-[#7ABFB9]">Your data is protected with enterprise-grade security. We prioritize your privacy and confidentiality.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-[#E2FAF7] mb-4">Our Services</h2>
                        <p className="text-[#7ABFB9] text-lg">Comprehensive dental solutions for the whole family</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {['General Checkup', 'Professional Cleaning', 'Teeth Whitening', 'Root Canal', 'Dental Implants', 'Orthodontics', 'Cosmetic Dentistry', 'Emergency Care'].map((service, i) => (
                            <div key={i} className="bg-gradient-to-br from-[#0E2C28] to-[#0F2724] border border-[rgba(45,212,191,0.12)] rounded-xl p-6 hover:border-[#0D9488]/30 transition-all hover:shadow-lg hover:shadow-[#0D9488]/10">
                                <div className="w-10 h-10 rounded-lg bg-[#0D9488]/20 flex items-center justify-center mb-4">
                                    <CheckCircleIcon className="text-[#0D9488]" size={20} />
                                </div>
                                <h3 className="text-[#E2FAF7] font-bold">{service}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-[#0D9488]/20 to-[#F59E0B]/10 border-y border-[#0D9488]/20">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold text-[#E2FAF7] mb-4">Ready for Your Best Smile?</h2>
                    <p className="text-[#7ABFB9] text-lg mb-8">Book your appointment today and experience premium dental care</p>
                    <Link
                        href="/appointments/book"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-[#0D9488] text-white rounded-lg hover:bg-[#0A7A70] transition-all hover:shadow-lg hover:shadow-[#0D9488]/20 font-bold text-lg"
                    >
                        <CalendarIcon size={24} />
                        Schedule Now
                        <ArrowRightIcon size={20} />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#071F1D] border-t border-[rgba(45,212,191,0.1)] py-16">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 mb-12">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-full bg-[#0D9488] flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                            </div>
                            <span className="text-[#0D9488] font-bold">SmileCare</span>
                        </div>
                        <p className="text-[#7ABFB9] text-sm">Your trusted dental care partner</p>
                    </div>
                    <div>
                        <h4 className="text-[#E2FAF7] font-bold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-[#7ABFB9] hover:text-[#0D9488] transition-colors text-sm">About Us</a></li>
                            <li><a href="#" className="text-[#7ABFB9] hover:text-[#0D9488] transition-colors text-sm">Services</a></li>
                            <li><Link href="/appointments/book" className="text-[#7ABFB9] hover:text-[#0D9488] transition-colors text-sm">Book Appointment</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-[#E2FAF7] font-bold mb-4">Contact Info</h4>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2 text-[#7ABFB9] text-sm">
                                <PhoneIcon size={16} className="text-[#0D9488]" />
                                (555) 123-4567
                            </li>
                            <li className="flex items-center gap-2 text-[#7ABFB9] text-sm">
                                <MailIcon size={16} className="text-[#0D9488]" />
                                contact@smilecare.com
                            </li>
                            <li className="flex items-center gap-2 text-[#7ABFB9] text-sm">
                                <MapPinIcon size={16} className="text-[#0D9488]" />
                                123 Health Ave, City
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-[#E2FAF7] font-bold mb-4">Hours</h4>
                        <ul className="space-y-2 text-[#7ABFB9] text-sm">
                            <li>Mon-Fri: 9:00 AM - 6:00 PM</li>
                            <li>Sat: 9:00 AM - 2:00 PM</li>
                            <li>Sun: Closed</li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-[#0D9488]/20 pt-8 text-center text-[#7ABFB9] text-sm">
                    <p>&copy; 2026 SmileCare Dental Clinic. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}
