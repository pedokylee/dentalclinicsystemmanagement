import { useForm, usePage } from '@inertiajs/react'
import { useState, useEffect } from 'react'
import { Link } from '@inertiajs/react'
import { CalendarIcon, ClockIcon, UserIcon, MailIcon, PhoneIcon, AlertCircleIcon, CheckCircleIcon } from 'lucide-react'

export default function BookPublic({ dentists, timeSlots, availableDays }) {
    const { data, setData, post, errors, processing } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        appointment_date: '',
        appointment_time: '',
        dentist_id: '',
        type: 'checkup',
        notes: '',
    })

    const [conflict, setConflict] = useState(null)
    const [availableSlots, setAvailableSlots] = useState(timeSlots || [])

    useEffect(() => {
        // Fetch available time slots when date or dentist changes
        if (data.appointment_date && data.dentist_id) {
            fetch(`/appointments/available-times?date=${data.appointment_date}&dentist_id=${data.dentist_id}`)
                .then(res => res.json())
                .then(result => {
                    setAvailableSlots(result.available_times || timeSlots)
                })
                .catch(err => console.error('Error fetching times:', err))
        }
    }, [data.appointment_date, data.dentist_id, timeSlots])

    function handleTimeSelect(time) {
        setData('appointment_time', time)
        // Check for conflicts (mock)
        setConflict(null)
    }

    function submit(e) {
        e.preventDefault()
        post('/appointments/store-public', {
            onSuccess: () => {
                // Redirect to confirmation page
            },
        })
    }

    return (
        <div className="min-h-screen bg-[#061A18]">
            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-[#061A18]/95 backdrop-blur border-b border-[rgba(45,212,191,0.1)]">
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

            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="mb-8">
                            <h1 className="text-4xl font-bold text-[#E2FAF7] mb-2">Book Your Appointment</h1>
                            <p className="text-[#7ABFB9]">Fill out the form below to schedule your visit with our dental team</p>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            {/* Personal Information */}
                            <div className="bg-[#0E2C28] border border-[rgba(45,212,191,0.12)] rounded-2xl p-8">
                                <h2 className="text-xl font-bold text-[#E2FAF7] mb-6 flex items-center gap-3">
                                    <UserIcon className="text-[#0D9488]" size={24} />
                                    Personal Information
                                </h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#7ABFB9] mb-2">First Name *</label>
                                        <input
                                            type="text"
                                            value={data.first_name}
                                            onChange={(e) => setData('first_name', e.target.value)}
                                            className={`w-full px-4 py-2 bg-[#061A18] border rounded-lg text-[#E2FAF7] placeholder-[#7ABFB9]/50 focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488] outline-none transition-all ${
                                                errors.first_name ? 'border-red-500' : 'border-[rgba(45,212,191,0.2)]'
                                            }`}
                                            placeholder="First name"
                                        />
                                        {errors.first_name && <p className="mt-1 text-sm text-red-400">{errors.first_name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#7ABFB9] mb-2">Last Name *</label>
                                        <input
                                            type="text"
                                            value={data.last_name}
                                            onChange={(e) => setData('last_name', e.target.value)}
                                            className={`w-full px-4 py-2 bg-[#061A18] border rounded-lg text-[#E2FAF7] placeholder-[#7ABFB9]/50 focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488] outline-none transition-all ${
                                                errors.last_name ? 'border-red-500' : 'border-[rgba(45,212,191,0.2)]'
                                            }`}
                                            placeholder="Last name"
                                        />
                                        {errors.last_name && <p className="mt-1 text-sm text-red-400">{errors.last_name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#7ABFB9] mb-2">Email *</label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className={`w-full px-4 py-2 bg-[#061A18] border rounded-lg text-[#E2FAF7] placeholder-[#7ABFB9]/50 focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488] outline-none transition-all ${
                                                errors.email ? 'border-red-500' : 'border-[rgba(45,212,191,0.2)]'
                                            }`}
                                            placeholder="your@email.com"
                                        />
                                        {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#7ABFB9] mb-2">Phone *</label>
                                        <input
                                            type="tel"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            className={`w-full px-4 py-2 bg-[#061A18] border rounded-lg text-[#E2FAF7] placeholder-[#7ABFB9]/50 focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488] outline-none transition-all ${
                                                errors.phone ? 'border-red-500' : 'border-[rgba(45,212,191,0.2)]'
                                            }`}
                                            placeholder="(555) 123-4567"
                                        />
                                        {errors.phone && <p className="mt-1 text-sm text-red-400">{errors.phone}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Appointment Details */}
                            <div className="bg-[#0E2C28] border border-[rgba(45,212,191,0.12)] rounded-2xl p-8">
                                <h2 className="text-xl font-bold text-[#E2FAF7] mb-6 flex items-center gap-3">
                                    <CalendarIcon className="text-[#0D9488]" size={24} />
                                    Appointment Details
                                </h2>
                                <div className="space-y-4">
                                    {/* Appointment Type */}
                                    <div>
                                        <label className="block text-sm font-medium text-[#7ABFB9] mb-2">Appointment Type *</label>
                                        <select
                                            value={data.type}
                                            onChange={(e) => setData('type', e.target.value)}
                                            className="w-full px-4 py-2 bg-[#061A18] border border-[rgba(45,212,191,0.2)] rounded-lg text-[#E2FAF7] focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488] outline-none transition-all"
                                        >
                                            <option value="checkup">Regular Checkup</option>
                                            <option value="cleaning">Cleaning</option>
                                            <option value="filling">Filling</option>
                                            <option value="extraction">Extraction</option>
                                            <option value="root_canal">Root Canal</option>
                                            <option value="crown">Crown</option>
                                            <option value="whitening">Whitening</option>
                                        </select>
                                    </div>

                                    {/* Dentist Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-[#7ABFB9] mb-3">Select Dentist *</label>
                                        <div className="grid md:grid-cols-2 gap-3">
                                            {dentists.map((dentist) => (
                                                <button
                                                    key={dentist.id}
                                                    type="button"
                                                    onClick={() => setData('dentist_id', dentist.id)}
                                                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                                                        data.dentist_id === dentist.id
                                                            ? 'border-[#0D9488] bg-[#0D9488]/10'
                                                            : 'border-[rgba(45,212,191,0.2)] hover:border-[#0D9488]/50'
                                                    }`}
                                                >
                                                    <div className="font-medium text-[#E2FAF7]">{dentist.user.name}</div>
                                                    <div className="text-sm text-[#7ABFB9]">{dentist.specialization}</div>
                                                </button>
                                            ))}
                                        </div>
                                        {errors.dentist_id && <p className="mt-1 text-sm text-red-400">{errors.dentist_id}</p>}
                                    </div>

                                    {/* Date & Time */}
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[#7ABFB9] mb-2">Date *</label>
                                            <input
                                                type="date"
                                                value={data.appointment_date}
                                                onChange={(e) => setData('appointment_date', e.target.value)}
                                                className={`w-full px-4 py-2 bg-[#061A18] border rounded-lg text-[#E2FAF7] focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488] outline-none transition-all ${
                                                    errors.appointment_date ? 'border-red-500' : 'border-[rgba(45,212,191,0.2)]'
                                                }`}
                                            />
                                            {errors.appointment_date && <p className="mt-1 text-sm text-red-400">{errors.appointment_date}</p>}
                                        </div>
                                    </div>

                                    {/* Time Slots */}
                                    <div>
                                        <label className="block text-sm font-medium text-[#7ABFB9] mb-3">Select Time *</label>
                                        <div className="grid grid-cols-4 gap-2">
                                            {availableSlots.map((slot) => (
                                                <button
                                                    key={slot}
                                                    type="button"
                                                    onClick={() => handleTimeSelect(slot)}
                                                    className={`py-2 px-3 rounded-lg border-2 transition-all text-sm font-medium ${
                                                        data.appointment_time === slot
                                                            ? 'border-[#0D9488] bg-[#0D9488] text-white'
                                                            : 'border-[rgba(45,212,191,0.2)] text-[#7ABFB9] hover:border-[#0D9488]/50'
                                                    }`}
                                                >
                                                    {slot}
                                                </button>
                                            ))}
                                        </div>
                                        {errors.appointment_time && <p className="mt-1 text-sm text-red-400">{errors.appointment_time}</p>}
                                    </div>

                                    {/* Conflict Warning */}
                                    {conflict && (
                                        <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg flex items-start gap-3">
                                            <AlertCircleIcon className="text-red-400 mt-0.5" size={20} />
                                            <p className="text-red-400">
                                                <strong>Slot Unavailable:</strong> This time is already booked. Please select another time.
                                            </p>
                                        </div>
                                    )}

                                    {/* Notes */}
                                    <div>
                                        <label className="block text-sm font-medium text-[#7ABFB9] mb-2">Additional Notes</label>
                                        <textarea
                                            value={data.notes}
                                            onChange={(e) => setData('notes', e.target.value)}
                                            rows="4"
                                            className="w-full px-4 py-2 bg-[#061A18] border border-[rgba(45,212,191,0.2)] rounded-lg text-[#E2FAF7] placeholder-[#7ABFB9]/50 focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488] outline-none transition-all resize-none"
                                            placeholder="Any specific concerns or questions for your visit..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3 bg-[#0D9488] text-white rounded-lg hover:bg-[#0A7A70] disabled:bg-gray-600 transition-all font-bold flex items-center justify-center gap-2"
                            >
                                <CheckCircleIcon size={20} />
                                {processing ? 'Booking...' : 'Book Appointment'}
                            </button>

                            <p className="text-center text-[#7ABFB9] text-sm">
                                We'll send a confirmation email with your appointment details
                            </p>
                        </form>
                    </div>

                    {/* Sidebar - Info */}
                    <div className="space-y-6">
                        {/* Info Card */}
                        <div className="bg-gradient-to-br from-[#0E2C28] to-[#0F2724] border border-[rgba(45,212,191,0.12)] rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-[#E2FAF7] mb-4">Important Information</h3>
                            <ul className="space-y-3 text-sm text-[#7ABFB9]">
                                <li className="flex gap-2">
                                    <span className="text-[#0D9488] font-bold">•</span>
                                    <span>Please arrive 10-15 minutes early for your appointment</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-[#0D9488] font-bold">•</span>
                                    <span>Bring your insurance card if applicable</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-[#0D9488] font-bold">•</span>
                                    <span>Notify us of any special needs or accommodations</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-[#0D9488] font-bold">•</span>
                                    <span>Cancellation must be made 24 hours before appointment</span>
                                </li>
                            </ul>
                        </div>

                        {/* Contact Card */}
                        <div className="bg-gradient-to-br from-[#0E2C28] to-[#0F2724] border border-[rgba(45,212,191,0.12)] rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-[#E2FAF7] mb-4">Contact Us</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-[#7ABFB9]">
                                    <PhoneIcon className="text-[#0D9488]" size={20} />
                                    <div>
                                        <p className="text-sm opacity-75">Phone</p>
                                        <p className="font-medium text-[#E2FAF7]">(555) 123-4567</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-[#7ABFB9]">
                                    <MailIcon className="text-[#0D9488]" size={20} />
                                    <div>
                                        <p className="text-sm opacity-75">Email</p>
                                        <p className="font-medium text-[#E2FAF7]">contact@smilecare.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Hours Card */}
                        <div className="bg-gradient-to-br from-[#0E2C28] to-[#0F2724] border border-[rgba(45,212,191,0.12)] rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-[#E2FAF7] mb-4">Office Hours</h3>
                            <div className="space-y-2 text-sm text-[#7ABFB9]">
                                <div className="flex justify-between">
                                    <span>Monday - Friday</span>
                                    <span className="text-[#E2FAF7]">9:00 AM - 6:00 PM</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Saturday</span>
                                    <span className="text-[#E2FAF7]">9:00 AM - 2:00 PM</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Sunday</span>
                                    <span className="text-red-400">Closed</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
