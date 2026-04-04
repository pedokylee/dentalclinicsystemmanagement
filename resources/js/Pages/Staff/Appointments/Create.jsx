import { useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import StaffLayout from '@/Layouts/StaffLayout';
import { Link } from '@inertiajs/react';

export default function Create({ patients, dentists, timeSlots }) {
    const { data, setData, post, errors, processing } = useForm({
        patient_id: '',
        dentist_id: '',
        appointment_date: '',
        appointment_time: '',
        type: 'checkup',
        notes: '',
    });

    const [conflict, setConflict] = useState(null);

    function checkConflict(dateTime, dentistId) {
        // For now, this is a placeholder. Real conflict checking is done server-side.
        // In a full implementation, you'd fetch existing appointments via AJAX
        setConflict(null);
    }

    function handleDateTimeChange(date, time) {
        if (date && time && data.dentist_id) {
            checkConflict(`${date}T${time}`, data.dentist_id);
        }
    }

    function submit(e) {
        e.preventDefault();
        post('/staff/appointments', {
            onFinish: () => {
                // Form will be reset on successful redirect
            },
        });
    }

    return (
        <StaffLayout>
            <div className="max-w-2xl mx-auto py-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-[#E2FAF7]">Book New Appointment</h1>
                    <Link href="/staff/appointments" className="px-4 py-2 bg-[#0D9488] rounded-lg text-[#E2FAF7] hover:bg-[#0A7A70]">
                        Back to Appointments
                    </Link>
                </div>

                <div className="bg-[#0F2724] rounded-lg border border-[#1d6361] p-6">
                    <form onSubmit={submit} className="space-y-6">
                        {/* Patient Selection */}
                        <div>
                            <label className="block text-sm font-medium text-[#E2FAF7] mb-2">
                                Patient *
                            </label>
                            <select
                                value={data.patient_id}
                                onChange={(e) => setData('patient_id', e.target.value)}
                                className={`w-full px-4 py-2 bg-[#0E2C28] border rounded-lg text-[#E2FAF7] focus:outline-none focus:border-[#0D9488] ${
                                    errors.patient_id ? 'border-red-500' : 'border-[#1d6361]'
                                }`}
                            >
                                <option value="" className="bg-[#0E2C28]">Select patient</option>
                                {patients.map((patient) => (
                                    <option key={patient.id} value={patient.id} className="bg-[#0E2C28]">
                                        {patient.first_name} {patient.last_name}
                                    </option>
                                ))}
                            </select>
                            {errors.patient_id && <p className="mt-1 text-sm text-red-400">{errors.patient_id}</p>}
                        </div>

                        {/* Dentist Selection */}
                        <div>
                            <label className="block text-sm font-medium text-[#E2FAF7] mb-2">
                                Dentist *
                            </label>
                            <select
                                value={data.dentist_id}
                                onChange={(e) => {
                                    setData('dentist_id', e.target.value);
                                    handleDateTimeChange(data.appointment_date, data.appointment_time);
                                }}
                                className={`w-full px-4 py-2 bg-[#0E2C28] border rounded-lg text-[#E2FAF7] focus:outline-none focus:border-[#0D9488] ${
                                    errors.dentist_id ? 'border-red-500' : 'border-[#1d6361]'
                                }`}
                            >
                                <option value="" className="bg-[#0E2C28]">Select dentist</option>
                                {dentists.map((dentist) => (
                                    <option key={dentist.id} value={dentist.id} className="bg-[#0E2C28]">
                                        {dentist.user.name}
                                    </option>
                                ))}
                            </select>
                            {errors.dentist_id && <p className="mt-1 text-sm text-red-400">{errors.dentist_id}</p>}
                        </div>

                        {/* Date & Time */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-[#E2FAF7] mb-2">
                                    Appointment Date *
                                </label>
                                <input
                                    type="date"
                                    value={data.appointment_date}
                                    onChange={(e) => {
                                        setData('appointment_date', e.target.value);
                                        handleDateTimeChange(e.target.value, data.appointment_time);
                                    }}
                                    className={`w-full px-4 py-2 bg-[#0E2C28] border rounded-lg text-[#E2FAF7] focus:outline-none focus:border-[#0D9488] ${
                                        errors.appointment_date ? 'border-red-500' : 'border-[#1d6361]'
                                    }`}
                                />
                                {errors.appointment_date && <p className="mt-1 text-sm text-red-400">{errors.appointment_date}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#E2FAF7] mb-2">
                                    Appointment Time *
                                </label>
                                <select
                                    value={data.appointment_time}
                                    onChange={(e) => {
                                        setData('appointment_time', e.target.value);
                                        handleDateTimeChange(data.appointment_date, e.target.value);
                                    }}
                                    className={`w-full px-4 py-2 bg-[#0E2C28] border rounded-lg text-[#E2FAF7] focus:outline-none focus:border-[#0D9488] ${
                                        errors.appointment_time ? 'border-red-500' : 'border-[#1d6361]'
                                    }`}
                                >
                                    <option value="" className="bg-[#0E2C28]">Select time</option>
                                    {timeSlots.map((slot) => (
                                        <option key={slot} value={slot} className="bg-[#0E2C28]">
                                            {slot}
                                        </option>
                                    ))}
                                </select>
                                {errors.appointment_time && <p className="mt-1 text-sm text-red-400">{errors.appointment_time}</p>}
                            </div>
                        </div>

                        {/* Conflict Warning */}
                        {conflict && (
                            <div className="bg-yellow-900 border border-yellow-700 rounded p-4">
                                <p className="text-yellow-200">
                                    <strong>⚠️ Warning:</strong> This dentist already has an appointment at the selected date and time.
                                </p>
                            </div>
                        )}

                        {/* Appointment Type */}
                        <div>
                            <label className="block text-sm font-medium text-[#E2FAF7] mb-2">
                                Appointment Type *
                            </label>
                            <select
                                value={data.type}
                                onChange={(e) => setData('type', e.target.value)}
                                className={`w-full px-4 py-2 bg-[#0E2C28] border rounded-lg text-[#E2FAF7] focus:outline-none focus:border-[#0D9488] ${
                                    errors.type ? 'border-red-500' : 'border-[#1d6361]'
                                }`}
                            >
                                <option value="checkup" className="bg-[#0E2C28]">Regular Checkup</option>
                                <option value="cleaning" className="bg-[#0E2C28]">Cleaning</option>
                                <option value="filling" className="bg-[#0E2C28]">Filling</option>
                                <option value="extraction" className="bg-[#0E2C28]">Extraction</option>
                                <option value="root_canal" className="bg-[#0E2C28]">Root Canal</option>
                                <option value="crown" className="bg-[#0E2C28]">Crown</option>
                                <option value="other" className="bg-[#0E2C28]">Other</option>
                            </select>
                            {errors.type && <p className="mt-1 text-sm text-red-400">{errors.type}</p>}
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="block text-sm font-medium text-[#E2FAF7] mb-2">
                                Notes
                            </label>
                            <textarea
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                rows="3"
                                className={`w-full px-4 py-2 bg-[#0E2C28] border rounded-lg text-[#E2FAF7] placeholder-[#7ABFB9] focus:outline-none focus:border-[#0D9488] ${
                                    errors.notes ? 'border-red-500' : 'border-[#1d6361]'
                                }`}
                                placeholder="Any special notes or requests"
                            />
                            {errors.notes && <p className="mt-1 text-sm text-red-400">{errors.notes}</p>}
                        </div>

                        {/* Form Actions */}
                        <div className="flex gap-4 pt-6 border-t border-[#1d6361]">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 bg-[#0D9488] hover:bg-[#0A7A70] disabled:bg-gray-600 text-[#E2FAF7] rounded-lg font-medium transition-colors"
                            >
                                {processing ? 'Booking...' : 'Book Appointment'}
                            </button>
                            <Link
                                href="/staff/appointments"
                                className="px-6 py-2 bg-[#0E2C28] border border-[#1d6361] text-[#7ABFB9] rounded-lg font-medium hover:border-[#0D9488] transition-colors"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </StaffLayout>
    );
}
