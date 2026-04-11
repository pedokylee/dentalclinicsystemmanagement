import { Link } from '@inertiajs/react'
import { CheckCircleIcon, CalendarIcon, UserIcon, PhoneIcon, MailIcon, ArrowRightIcon } from 'lucide-react'

export default function BookingConfirmation({ appointment, patient }) {
    const appointmentDate = new Date(appointment.appointment_date)
    const formattedDate = appointmentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })

    return (
        <div className="min-h-screen bg-[#061A18] flex flex-col">
            {/* Navigation */}
            <nav className="bg-[#061A18]/95 backdrop-blur border-b border-[rgba(45,212,191,0.1)]">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#0D9488] flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                        </div>
                        <span className="text-2xl font-bold text-[#0D9488]">SmileCare DCMS</span>
                    </Link>
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="max-w-2xl w-full space-y-8">
                    {/* Success Message */}
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <div className="absolute inset-0 bg-[#0D9488] rounded-full blur-2xl opacity-30"></div>
                                <div className="relative bg-[#0D9488] rounded-full p-6">
                                    <CheckCircleIcon className="text-white" size={48} />
                                </div>
                            </div>
                        </div>
                        <h1 className="text-4xl font-bold text-[#E2FAF7] mb-3">Appointment Confirmed!</h1>
                        <p className="text-[#7ABFB9] text-lg">We've received your booking request and sent a confirmation to your email.</p>
                    </div>

                    {/* Appointment Details Card */}
                    <div className="bg-gradient-to-br from-[#0E2C28] to-[#0F2724] border border-[rgba(45,212,191,0.12)] rounded-2xl p-8 space-y-6">
                        <h2 className="text-2xl font-bold text-[#E2FAF7]">Appointment Details</h2>

                        {/* Booking Number */}
                        <div className="bg-[#061A18] rounded-lg p-4 border border-[#0D9488]/20">
                            <p className="text-sm text-[#7ABFB9] mb-1">Confirmation Number</p>
                            <p className="text-xl font-mono font-bold text-[#0D9488]">APT-{String(appointment.id).padStart(6, '0')}</p>
                        </div>

                        {/* Details Grid */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Date & Time */}
                            <div className="flex gap-4">
                                <CalendarIcon className="text-[#0D9488] flex-shrink-0" size={24} />
                                <div>
                                    <p className="text-sm text-[#7ABFB9] mb-1">Date & Time</p>
                                    <p className="text-[#E2FAF7] font-medium">{formattedDate}</p>
                                    <p className="text-[#0D9488] font-bold text-lg">{appointment.appointment_time}</p>
                                </div>
                            </div>

                            {/* Patient Name */}
                            <div className="flex gap-4">
                                <UserIcon className="text-[#0D9488] flex-shrink-0" size={24} />
                                <div>
                                    <p className="text-sm text-[#7ABFB9] mb-1">Patient</p>
                                    <p className="text-[#E2FAF7] font-medium">{patient.first_name} {patient.last_name}</p>
                                </div>
                            </div>

                            {/* Contact Email */}
                            <div className="flex gap-4">
                                <MailIcon className="text-[#0D9488] flex-shrink-0" size={24} />
                                <div>
                                    <p className="text-sm text-[#7ABFB9] mb-1">Email</p>
                                    <p className="text-[#E2FAF7] font-medium break-all">{patient.email}</p>
                                </div>
                            </div>

                            {/* Contact Phone */}
                            <div className="flex gap-4">
                                <PhoneIcon className="text-[#0D9488] flex-shrink-0" size={24} />
                                <div>
                                    <p className="text-sm text-[#7ABFB9] mb-1">Phone</p>
                                    <p className="text-[#E2FAF7] font-medium">{patient.phone}</p>
                                </div>
                            </div>
                        </div>

                        {/* Appointment Type */}
                        <div className="bg-[#061A18] rounded-lg p-4 border border-[#0D9488]/20">
                            <p className="text-sm text-[#7ABFB9] mb-1">Service Type</p>
                            <p className="text-[#E2FAF7] font-medium capitalize">{appointment.type.replace('_', ' ')}</p>
                        </div>

                        {/* Important Info */}
                        <div className="bg-[#0D9488]/10 border border-[#0D9488]/30 rounded-lg p-4">
                            <p className="text-sm text-[#E2FAF7] font-medium mb-3">Please Remember:</p>
                            <ul className="space-y-2 text-sm text-[#7ABFB9]">
                                <li className="flex gap-3 items-start">
                                    <svg className="w-5 h-5 text-[#0D9488] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                    </svg>
                                    <span>Arrive 10-15 minutes early to complete check-in</span>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <svg className="w-5 h-5 text-[#0D9488] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                    </svg>
                                    <span>Bring your insurance card if applicable</span>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <svg className="w-5 h-5 text-[#0D9488] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                    </svg>
                                    <span>Bring a valid ID</span>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <svg className="w-5 h-5 text-[#0D9488] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                    </svg>
                                    <span>Call us at (555) 123-4567 if you need to reschedule</span>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <svg className="w-5 h-5 text-[#0D9488] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                    </svg>
                                    <span>Cancellations must be made 24 hours in advance</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-gradient-to-br from-[#0E2C28] to-[#0F2724] border border-[rgba(45,212,191,0.12)] rounded-2xl p-8">
                        <h3 className="text-xl font-bold text-[#E2FAF7] mb-4">What's Next?</h3>
                        <ol className="space-y-4">
                            <li className="flex gap-4">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0D9488] text-white font-bold flex-shrink-0">1</div>
                                <div>
                                    <p className="font-medium text-[#E2FAF7]">Confirmation Email Sent</p>
                                    <p className="text-sm text-[#7ABFB9]">Check your email for appointment details and a reminder 24 hours before</p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0D9488] text-white font-bold flex-shrink-0">2</div>
                                <div>
                                    <p className="font-medium text-[#E2FAF7]">Prepare for Your Visit</p>
                                    <p className="text-sm text-[#7ABFB9]">Bring required documents and arrive a bit early to complete any paperwork</p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0D9488] text-white font-bold flex-shrink-0">3</div>
                                <div>
                                    <p className="font-medium text-[#E2FAF7]">Smile Brightly!</p>
                                    <p className="text-sm text-[#7ABFB9]">Let our expert team take care of your dental health</p>
                                </div>
                            </li>
                        </ol>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            href="/"
                            className="flex-1 py-3 px-6 bg-[#0D9488] text-white rounded-lg hover:bg-[#0A7A70] transition-all font-medium text-center flex items-center justify-center gap-2"
                        >
                            Back to Home
                            <ArrowRightIcon size={20} />
                        </Link>
                        <a
                            href="mailto:contact@smilecare.com"
                            className="flex-1 py-3 px-6 border border-[#0D9488] text-[#0D9488] rounded-lg hover:bg-[#0D9488]/10 transition-all font-medium text-center"
                        >
                            Contact Support
                        </a>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-[rgba(45,212,191,0.1)] bg-[#0E2C28]/50 py-8 mt-12">
                <div className="max-w-7xl mx-auto px-6 text-center text-[#7ABFB9] text-sm">
                    <p>&copy; 2024 SmileCare DCMS. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}
