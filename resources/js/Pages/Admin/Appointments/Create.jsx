import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link } from '@inertiajs/react';
import { CheckCircleIcon } from 'lucide-react';

export default function Create({ patients, dentists, timeSlots }) {
    const { data, setData, post, errors, processing } = useForm({
        patient_id: '',
        dentist_id: '',
        appointment_date: '',
        appointment_time: '',
        type: 'checkup',
        notes: '',
    });

    const [selectedPatient, setSelectedPatient] = useState(null);
    const [selectedDentist, setSelectedDentist] = useState(null);
    const [conflict, setConflict] = useState(null);

    function checkConflict(dateTime, dentistId) {
        // Simple conflict check - could be enhanced with API call
        setConflict(null);
    }

    function handleDateTimeChange(date, time) {
        setData('appointment_date', date);
        setData('appointment_time', time);
        checkConflict(`${date} ${time}`, data.dentist_id);
    }

    function handlePatientChange(patientId) {
        const patient = patients.find(p => p.id === patientId);
        setSelectedPatient(patient);
        setData('patient_id', patientId);
    }

    function handleDentistChange(dentistId) {
        const dentist = dentists.find(d => d.id === dentistId);
        setSelectedDentist(dentist);
        setData('dentist_id', dentistId);
        checkConflict(`${data.appointment_date} ${data.appointment_time}`, dentistId);
    }

    function submit(e) {
        e.preventDefault();
        post('/admin/appointments', {
            onFinish: () => {
                // Form will be reset on successful redirect
            },
        });
    }

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Book Appointment</h1>
                    <p className="text-gray-600">Schedule a new visit for any patient</p>
                </div>

                <form onSubmit={submit}>
                    <div className="grid grid-cols-3 gap-8">
                        {/* Left Column - Patient & Details Selection */}
                        <div className="col-span-2 space-y-6">
                            {/* 1. Select Patient */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">1. Select Patient</h2>
                                
                                {/* Patient Search */}
                                <div className="relative mb-4">
                                    <input
                                        type="text"
                                        placeholder="Search patient..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                                        onChange={(e) => {
                                            // This is a client-side filter placeholder
                                        }}
                                    />
                                </div>

                                {/* Patient List */}
                                <div className="space-y-2 max-h-96 overflow-y-auto">
                                    {patients && patients.length > 0 ? (
                                        patients.map(patient => (
                                            <button
                                                key={patient.id}
                                                type="button"
                                                onClick={() => handlePatientChange(patient.id)}
                                                className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                                                    data.patient_id === patient.id
                                                        ? 'border-teal-500 bg-teal-50'
                                                        : 'border-gray-200 hover:border-teal-300'
                                                }`}
                                            >
                                                <div className="font-semibold text-gray-900">
                                                    {patient.first_name} {patient.last_name}
                                                </div>
                                            </button>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-center py-4">No patients found</p>
                                    )}
                                </div>
                                {errors.patient_id && <p className="mt-2 text-sm text-red-500">{errors.patient_id}</p>}
                            </div>

                            {/* 2. Select Dentist */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">2. Select Dentist</h2>
                                <div className="space-y-2">
                                    {dentists && dentists.length > 0 ? (
                                        dentists.map(dentist => (
                                            <button
                                                key={dentist.id}
                                                type="button"
                                                onClick={() => handleDentistChange(dentist.id)}
                                                className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                                                    data.dentist_id === dentist.id
                                                        ? 'border-teal-500 bg-teal-50'
                                                        : 'border-gray-200 hover:border-teal-300'
                                                }`}
                                            >
                                                <div className="font-semibold text-gray-900">{dentist.user.name}</div>
                                            </button>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-center py-4">No dentists available</p>
                                    )}
                                </div>
                                {errors.dentist_id && <p className="mt-2 text-sm text-red-500">{errors.dentist_id}</p>}
                            </div>

                            {/* 3. Appointment Details */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">3. Appointment Details</h2>
                                
                                {/* Type */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                                    <select
                                        value={data.type}
                                        onChange={(e) => setData('type', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                                    >
                                        <option value="checkup">Check-up</option>
                                        <option value="cleaning">Cleaning</option>
                                        <option value="extraction">Extraction</option>
                                        <option value="filling">Filling</option>
                                        <option value="root_canal">Root Canal</option>
                                        <option value="follow_up">Follow-up</option>
                                        <option value="other">Other</option>
                                    </select>
                                    {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type}</p>}
                                </div>

                                {/* Date & Time */}
                                <div className="grid md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                                        <input
                                            type="date"
                                            value={data.appointment_date}
                                            onChange={(e) => handleDateTimeChange(e.target.value, data.appointment_time)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                                        />
                                        {errors.appointment_date && <p className="mt-1 text-sm text-red-500">{errors.appointment_date}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                                        <select
                                            value={data.appointment_time}
                                            onChange={(e) => handleDateTimeChange(data.appointment_date, e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                                        >
                                            <option value="">Select a time</option>
                                            {timeSlots && timeSlots.length > 0 ? (
                                                timeSlots.map(time => (
                                                    <option key={time} value={time}>
                                                        {time}
                                                    </option>
                                                ))
                                            ) : (
                                                <option disabled>No times available</option>
                                            )}
                                        </select>
                                        {errors.appointment_time && <p className="mt-1 text-sm text-red-500">{errors.appointment_time}</p>}
                                    </div>
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                                    <textarea
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        rows="4"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-none"
                                        placeholder="Any additional information..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Summary & Confirm */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
                                <h3 className="text-lg font-bold text-gray-900 mb-6">Summary</h3>
                                
                                <div className="space-y-4 mb-6">
                                    {/* Patient Summary */}
                                    <div className="border-b pb-4">
                                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Patient</p>
                                        {selectedPatient ? (
                                            <p className="text-base font-semibold text-gray-900">
                                                {selectedPatient.first_name} {selectedPatient.last_name}
                                            </p>
                                        ) : (
                                            <p className="text-gray-400">Not selected</p>
                                        )}
                                    </div>

                                    {/* Dentist Summary */}
                                    <div className="border-b pb-4">
                                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Dentist</p>
                                        {selectedDentist ? (
                                            <p className="text-base font-semibold text-gray-900">
                                                {selectedDentist.user.name}
                                            </p>
                                        ) : (
                                            <p className="text-gray-400">Not selected</p>
                                        )}
                                    </div>

                                    {/* Date Summary */}
                                    <div className="border-b pb-4">
                                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Date & Time</p>
                                        {data.appointment_date && data.appointment_time ? (
                                            <p className="text-base font-semibold text-gray-900">
                                                {new Date(data.appointment_date).toLocaleDateString()} at {data.appointment_time}
                                            </p>
                                        ) : (
                                            <p className="text-gray-400">Not set</p>
                                        )}
                                    </div>

                                    {/* Type Summary */}
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Type</p>
                                        <p className="text-base font-semibold text-gray-900 capitalize">{data.type}</p>
                                    </div>
                                </div>

                                {conflict && (
                                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-sm text-red-700">⚠️ {conflict}</p>
                                    </div>
                                )}

                                {/* Confirm Button */}
                                <button
                                    type="submit"
                                    disabled={processing || !data.patient_id || !data.dentist_id || !data.appointment_date || !data.appointment_time}
                                    className="w-full bg-teal-500 hover:bg-teal-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <CheckCircleIcon className="w-5 h-5" />
                                    {processing ? 'Booking...' : 'Confirm Booking'}
                                </button>

                                <Link
                                    href="/admin/dashboard"
                                    className="w-full mt-2 px-4 py-3 text-center border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </Link>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
