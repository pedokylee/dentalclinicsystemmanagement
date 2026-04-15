import { router, useForm } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from '@inertiajs/react';
import { CalendarIcon, UserIcon, MailIcon, PhoneIcon, AlertCircleIcon, CheckCircleIcon } from 'lucide-react';

function isDentistWorkingOnDate(dentist, date) {
    if (!date) {
        return true;
    }

    const scheduleDays = dentist?.schedule_days;

    if (!Array.isArray(scheduleDays) || scheduleDays.length === 0) {
        return true;
    }

    const dayName = new Date(`${date}T00:00:00`).toLocaleDateString('en-US', { weekday: 'long' });

    return scheduleDays.includes(dayName);
}

export default function BookPublic({ dentists, timeSlots, availableDays, existingAppointments = [] }) {
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
    });

    const [conflict, setConflict] = useState(null);
    const [availableSlots, setAvailableSlots] = useState(timeSlots || []);
    const [availabilityMessage, setAvailabilityMessage] = useState(null);

    const dentistAvailability = useMemo(() => {
        return Object.fromEntries(
            dentists.map((dentist) => {
                if (dentist?.user?.active === false) {
                    return [String(dentist.id), { available: false, reason: 'Currently inactive' }];
                }

                if (!isDentistWorkingOnDate(dentist, data.appointment_date)) {
                    return [String(dentist.id), { available: false, reason: 'Not scheduled on this day' }];
                }

                if (data.appointment_date && data.appointment_time) {
                    const hasConflict = existingAppointments.some((appointment) =>
                        String(appointment.dentist_id) === String(dentist.id) &&
                        appointment.appointment_date === data.appointment_date &&
                        appointment.appointment_time === data.appointment_time
                    );

                    if (hasConflict) {
                        return [String(dentist.id), { available: false, reason: 'Already booked for this slot' }];
                    }
                }

                return [String(dentist.id), { available: true, reason: null }];
            })
        );
    }, [data.appointment_date, data.appointment_time, dentists, existingAppointments]);

    useEffect(() => {
        if (!data.appointment_date || !data.dentist_id) {
            setAvailableSlots(timeSlots || []);
            setAvailabilityMessage(null);
            return;
        }

        let active = true;

        window.axios
            .get('/appointments/available-times', {
                params: {
                    date: data.appointment_date,
                    dentist_id: data.dentist_id,
                },
            })
            .then(({ data: result }) => {
                if (active) {
                    setAvailableSlots(result?.available_times ?? []);
                    setAvailabilityMessage(result?.unavailable_reason ?? null);
                }
            })
            .catch((error) => {
                if (error?.response?.status === 401) {
                    router.visit('/login');
                    return;
                }

                if (active) {
                    setAvailableSlots(timeSlots || []);
                    setAvailabilityMessage(null);
                }
            });

        return () => {
            active = false;
        };
    }, [data.appointment_date, data.dentist_id, timeSlots]);

    useEffect(() => {
        if (!data.appointment_time) {
            return;
        }

        if (!availableSlots.includes(data.appointment_time)) {
            setData('appointment_time', '');
            setConflict('Please choose another time for this dentist.');
            return;
        }

        setConflict(null);
    }, [availableSlots, data.appointment_time, setData]);

    function handleTimeSelect(time) {
        if (!availableSlots.includes(time)) {
            return;
        }

        setData('appointment_time', time);
        setConflict(null);
    }

    function submit(event) {
        event.preventDefault();
        post('/appointments/store-public');
    }

    const canSubmit =
        !processing &&
        data.first_name &&
        data.last_name &&
        data.email &&
        data.phone &&
        data.appointment_date &&
        data.appointment_time &&
        data.dentist_id &&
        !availabilityMessage &&
        availableSlots.includes(data.appointment_time);

    return (
        <div className="min-h-screen bg-[#061A18]">
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
                    <div className="lg:col-span-2 space-y-6">
                        <div className="mb-8">
                            <h1 className="text-4xl font-bold text-[#E2FAF7] mb-2">Book Your Appointment</h1>
                            <p className="text-[#7ABFB9]">Fill out the form below to schedule your visit with our dental team</p>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
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
                                            onChange={(event) => setData('first_name', event.target.value)}
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
                                            onChange={(event) => setData('last_name', event.target.value)}
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
                                            onChange={(event) => setData('email', event.target.value)}
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
                                            onChange={(event) => setData('phone', event.target.value)}
                                            className={`w-full px-4 py-2 bg-[#061A18] border rounded-lg text-[#E2FAF7] placeholder-[#7ABFB9]/50 focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488] outline-none transition-all ${
                                                errors.phone ? 'border-red-500' : 'border-[rgba(45,212,191,0.2)]'
                                            }`}
                                            placeholder="(555) 123-4567"
                                        />
                                        {errors.phone && <p className="mt-1 text-sm text-red-400">{errors.phone}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#0E2C28] border border-[rgba(45,212,191,0.12)] rounded-2xl p-8">
                                <h2 className="text-xl font-bold text-[#E2FAF7] mb-6 flex items-center gap-3">
                                    <CalendarIcon className="text-[#0D9488]" size={24} />
                                    Appointment Details
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#7ABFB9] mb-2">Appointment Type *</label>
                                        <select
                                            value={data.type}
                                            onChange={(event) => setData('type', event.target.value)}
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

                                    <div>
                                        <label className="block text-sm font-medium text-[#7ABFB9] mb-3">Select Dentist *</label>
                                        <div className="grid md:grid-cols-2 gap-3">
                                            {dentists.map((dentist) => {
                                                const availability = dentistAvailability[String(dentist.id)] ?? { available: true, reason: null };
                                                const isSelected = String(data.dentist_id) === String(dentist.id);

                                                return (
                                                    <button
                                                        key={dentist.id}
                                                        type="button"
                                                        onClick={() => {
                                                            if (!availability.available) {
                                                                return;
                                                            }

                                                            setData('dentist_id', dentist.id);
                                                        }}
                                                        disabled={!availability.available}
                                                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                                                            isSelected
                                                                ? availability.available
                                                                    ? 'border-[#0D9488] bg-[#0D9488]/10'
                                                                    : 'border-[#F59E0B]/60 bg-[#F59E0B]/10 text-[#7ABFB9]'
                                                                : availability.available
                                                                    ? 'border-[rgba(45,212,191,0.2)] hover:border-[#0D9488]/50'
                                                                    : 'cursor-not-allowed border-[rgba(255,255,255,0.08)] bg-white/5 text-[#7ABFB9]/60 opacity-70'
                                                        }`}
                                                    >
                                                        <div className="font-medium text-[#E2FAF7]">{dentist.user.name}</div>
                                                        <div className="text-sm text-[#7ABFB9]">{dentist.specialization || 'General Dentistry'}</div>
                                                        {!availability.available && (
                                                            <div className="mt-2 text-xs font-semibold text-[#99F6E4]/70">{availability.reason}</div>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        {errors.dentist_id && <p className="mt-1 text-sm text-red-400">{errors.dentist_id}</p>}
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[#7ABFB9] mb-2">Date *</label>
                                            <input
                                                type="date"
                                                value={data.appointment_date}
                                                onChange={(event) => setData('appointment_date', event.target.value)}
                                                min={availableDays?.[0]}
                                                max={availableDays?.[availableDays.length - 1]}
                                                className={`w-full px-4 py-2 bg-[#061A18] border rounded-lg text-[#E2FAF7] focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488] outline-none transition-all ${
                                                    errors.appointment_date ? 'border-red-500' : 'border-[rgba(45,212,191,0.2)]'
                                                }`}
                                            />
                                            {errors.appointment_date && <p className="mt-1 text-sm text-red-400">{errors.appointment_date}</p>}
                                        </div>
                                    </div>

                                    {availabilityMessage && (
                                        <div className="p-4 bg-[#F59E0B]/10 border border-[#F59E0B]/40 rounded-lg flex items-start gap-3">
                                            <AlertCircleIcon className="text-[#F59E0B] mt-0.5" size={20} />
                                            <p className="text-[#FDE68A]">
                                                <strong>Dentist unavailable:</strong> {availabilityMessage}
                                            </p>
                                        </div>
                                    )}

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

                                    {conflict && (
                                        <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg flex items-start gap-3">
                                            <AlertCircleIcon className="text-red-400 mt-0.5" size={20} />
                                            <p className="text-red-400">
                                                <strong>Slot unavailable:</strong> {conflict}
                                            </p>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium text-[#7ABFB9] mb-2">Additional Notes</label>
                                        <textarea
                                            value={data.notes}
                                            onChange={(event) => setData('notes', event.target.value)}
                                            rows="4"
                                            className="w-full px-4 py-2 bg-[#061A18] border border-[rgba(45,212,191,0.2)] rounded-lg text-[#E2FAF7] placeholder-[#7ABFB9]/50 focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488] outline-none transition-all resize-none"
                                            placeholder="Any specific concerns or questions for your visit..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={!canSubmit}
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

                    <div className="space-y-6">
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
    );
}
