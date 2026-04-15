import { useForm } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { CheckCircleIcon } from 'lucide-react';
import StaffLayout from '@/Layouts/StaffLayout';

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

export default function Create({ patients, dentists, timeSlots, existingAppointments = [] }) {
    const { data, setData, post, errors, processing } = useForm({
        patient_id: '',
        dentist_id: '',
        appointment_date: '',
        appointment_time: '',
        type: 'checkup',
        notes: '',
        send_email_confirmation: true,
    });

    const [selectedPatient, setSelectedPatient] = useState(null);
    const [selectedDentist, setSelectedDentist] = useState(null);
    const [conflict, setConflict] = useState(null);
    const [patientSearch, setPatientSearch] = useState('');

    const filteredPatients = useMemo(() => {
        const search = patientSearch.trim().toLowerCase();

        if (!search) {
            return patients;
        }

        return patients.filter((patient) => {
            const haystack = [
                patient.first_name,
                patient.last_name,
                patient.full_name,
                patient.email,
                patient.contact_number,
                patient.phone,
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();

            return haystack.includes(search);
        });
    }, [patientSearch, patients]);

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

    const unavailableTimeSlots = useMemo(() => {
        if (!data.appointment_date || !data.dentist_id) {
            return new Set();
        }

        const dentist = dentists.find((item) => String(item.id) === String(data.dentist_id));

        if (!dentist) {
            return new Set();
        }

        if (!isDentistWorkingOnDate(dentist, data.appointment_date)) {
            return new Set(timeSlots);
        }

        return new Set(
            existingAppointments
                .filter((appointment) =>
                    String(appointment.dentist_id) === String(data.dentist_id) &&
                    appointment.appointment_date === data.appointment_date
                )
                .map((appointment) => appointment.appointment_time)
        );
    }, [data.appointment_date, data.dentist_id, dentists, existingAppointments, timeSlots]);

    useEffect(() => {
        if (!data.appointment_time) {
            return;
        }

        if (unavailableTimeSlots.has(data.appointment_time)) {
            setData('appointment_time', '');
        }
    }, [data.appointment_time, setData, unavailableTimeSlots]);

    useEffect(() => {
        if (!data.dentist_id) {
            setConflict(null);
            return;
        }

        const availability = dentistAvailability[String(data.dentist_id)];
        setConflict(availability?.available ? null : availability?.reason ?? null);
    }, [data.appointment_date, data.appointment_time, data.dentist_id, dentistAvailability]);

    function handlePatientChange(patientId) {
        setData('patient_id', patientId);
        const patient = patients.find((item) => item.id == patientId);
        setSelectedPatient(patient);
        setPatientSearch('');
    }

    function handleDentistChange(dentistId) {
        const availability = dentistAvailability[String(dentistId)];

        if (!availability?.available) {
            return;
        }

        setData('dentist_id', dentistId);
        const dentist = dentists.find((item) => item.id == dentistId);
        setSelectedDentist(dentist);
        setConflict(null);
    }

    function submit(event) {
        event.preventDefault();
        post('/staff/appointments');
    }

    const canSubmit =
        !processing &&
        !conflict &&
        data.patient_id &&
        data.dentist_id &&
        data.appointment_date &&
        data.appointment_time &&
        !unavailableTimeSlots.has(data.appointment_time);

    return (
        <StaffLayout>
            <div className="max-w-7xl mx-auto py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Book Appointment</h1>
                    <p className="text-gray-600">Schedule a new visit for a patient</p>
                </div>

                <form onSubmit={submit}>
                    <div className="grid grid-cols-3 gap-8">
                        <div className="col-span-2 space-y-6">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">1. Select Patient</h2>

                                <div className="relative mb-4">
                                    <input
                                        type="text"
                                        placeholder="Search patient..."
                                        value={patientSearch}
                                        onChange={(event) => setPatientSearch(event.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent"
                                    />
                                </div>

                                {selectedPatient && (
                                    <div className="bg-white border-2 border-[#0D9488] rounded-lg p-4 mb-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-3">
                                                <div className="w-12 h-12 bg-[#0D9488] text-white rounded-full flex items-center justify-center font-bold text-lg">
                                                    {selectedPatient.first_name[0]}
                                                    {selectedPatient.last_name[0]}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">
                                                        {selectedPatient.first_name} {selectedPatient.last_name}
                                                    </p>
                                                    <p className="text-sm text-gray-600">DOB: {selectedPatient.date_of_birth}</p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedPatient(null);
                                                    setData('patient_id', '');
                                                }}
                                                className="text-[#0D9488] hover:text-[#0A7A70] font-medium text-sm"
                                            >
                                                Change
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {!selectedPatient && (
                                    <div className="space-y-2 max-h-64 overflow-y-auto">
                                        {filteredPatients.map((patient) => (
                                            <button
                                                key={patient.id}
                                                type="button"
                                                onClick={() => handlePatientChange(patient.id)}
                                                className="w-full p-4 border border-gray-200 rounded-lg hover:border-[#0D9488] hover:bg-gray-50 transition text-left"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="w-10 h-10 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                                                        {patient.first_name[0]}
                                                        {patient.last_name[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">
                                                            {patient.first_name} {patient.last_name}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {[patient.email, patient.contact_number || patient.phone].filter(Boolean).join(' • ') || `DOB: ${patient.date_of_birth}`}
                                                        </p>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}

                                        {filteredPatients.length === 0 && (
                                            <div className="rounded-lg border border-dashed border-gray-300 px-4 py-6 text-center text-sm text-gray-500">
                                                No patients matched your search.
                                            </div>
                                        )}
                                    </div>
                                )}
                                {errors.patient_id && <p className="mt-2 text-sm text-red-500">{errors.patient_id}</p>}
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">2. Appointment Details</h2>

                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Appointment Type
                                    </label>
                                    <select
                                        value={data.type}
                                        onChange={(event) => setData('type', event.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent"
                                    >
                                        <option value="checkup">General Check-up</option>
                                        <option value="cleaning">Cleaning</option>
                                        <option value="filling">Filling</option>
                                        <option value="extraction">Extraction</option>
                                        <option value="root_canal">Root Canal</option>
                                        <option value="crown">Crown</option>
                                        <option value="other">Other</option>
                                    </select>
                                    {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-4">
                                        Select Dentist
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {dentists.map((dentist) => {
                                            const availability = dentistAvailability[String(dentist.id)] ?? { available: true, reason: null };
                                            const isSelected = data.dentist_id == dentist.id;

                                            return (
                                                <button
                                                    key={dentist.id}
                                                    type="button"
                                                    onClick={() => handleDentistChange(dentist.id)}
                                                    disabled={!availability.available}
                                                    className={`p-4 rounded-lg border-2 transition text-left ${
                                                        isSelected
                                                            ? availability.available
                                                                ? 'border-[#0D9488] bg-[#F0FDFB]'
                                                                : 'border-amber-300 bg-amber-50 text-gray-500'
                                                            : availability.available
                                                                ? 'border-gray-200 hover:border-[#0D9488]'
                                                                : 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 opacity-70'
                                                    }`}
                                                >
                                                    <p className="font-bold text-gray-900 text-sm">{dentist.user.name}</p>
                                                    <p className="text-xs text-gray-600 mt-1">{dentist.specialization || 'General Dentistry'}</p>
                                                    {!availability.available && (
                                                        <p className="mt-2 text-xs font-semibold text-gray-500">{availability.reason}</p>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {errors.dentist_id && <p className="mt-2 text-sm text-red-500">{errors.dentist_id}</p>}
                                </div>

                                <div className="mt-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Notes / Reason for Visit
                                    </label>
                                    <textarea
                                        value={data.notes}
                                        onChange={(event) => setData('notes', event.target.value)}
                                        rows="4"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent"
                                        placeholder="Any specific symptoms or requests..."
                                    />
                                    {errors.notes && <p className="mt-1 text-sm text-red-500">{errors.notes}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">3. Date & Time</h2>

                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Select Date
                                    </label>
                                    <input
                                        type="date"
                                        value={data.appointment_date}
                                        onChange={(event) => {
                                            setData('appointment_date', event.target.value);
                                        }}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent"
                                    />
                                    {errors.appointment_date && <p className="mt-1 text-sm text-red-500">{errors.appointment_date}</p>}
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <label className="text-sm font-semibold text-gray-700">
                                            Available Slots
                                        </label>
                                        {selectedDentist && (
                                            <span className="text-xs text-gray-500">{selectedDentist.user.name}</span>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        {timeSlots.map((slot) => {
                                            const isUnavailable = unavailableTimeSlots.has(slot);

                                            return (
                                                <button
                                                    key={slot}
                                                    type="button"
                                                    onClick={() => {
                                                        if (isUnavailable) {
                                                            return;
                                                        }

                                                        setData('appointment_time', slot);
                                                        setConflict(null);
                                                    }}
                                                    disabled={isUnavailable}
                                                    className={`py-2 px-2 rounded-lg border-2 text-sm font-medium transition ${
                                                        data.appointment_time === slot && !isUnavailable
                                                            ? 'border-[#0D9488] bg-[#0D9488] text-white shadow-md'
                                                            : isUnavailable
                                                                ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'
                                                                : 'border-gray-200 text-gray-600 hover:border-[#0D9488]'
                                                    }`}
                                                >
                                                    {slot}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {errors.appointment_time && <p className="mt-2 text-sm text-red-500">{errors.appointment_time}</p>}
                                </div>

                                {conflict && (
                                    <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                        <p className="text-sm text-yellow-800">
                                            <strong>Warning:</strong> {conflict}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Summary</h2>

                                <div className="space-y-3 text-sm mb-6 pb-4 border-b border-gray-200">
                                    {selectedPatient && (
                                        <div className="flex items-center gap-2">
                                            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                                            </svg>
                                            <span className="font-semibold text-gray-900">
                                                {selectedPatient.first_name} {selectedPatient.last_name}
                                            </span>
                                        </div>
                                    )}

                                    {selectedDentist && (
                                        <div className="flex items-center gap-2">
                                            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                                            </svg>
                                            <span className="font-semibold text-gray-900">{selectedDentist.user.name}</span>
                                        </div>
                                    )}

                                    {data.appointment_date && (
                                        <div className="flex items-center gap-2">
                                            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v2H4a2 2 0 00-2 2v2h16V7a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v2H7V3a1 1 0 00-1-1zm0 5a2 2 0 002 2h8a2 2 0 002-2H6z" clipRule="evenodd" />
                                            </svg>
                                            <span className="font-semibold text-gray-900">{data.appointment_date}</span>
                                        </div>
                                    )}

                                    {data.appointment_time && (
                                        <div className="flex items-center gap-2">
                                            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00-.447.894l1.895 1.895a1 1 0 001.414-1.414l-1.342-1.342V6z" clipRule="evenodd" />
                                            </svg>
                                            <span className="font-semibold text-gray-900">{data.appointment_time}</span>
                                        </div>
                                    )}
                                </div>

                                <label className="flex items-center gap-2 mb-6 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.send_email_confirmation}
                                        onChange={(event) => setData('send_email_confirmation', event.target.checked)}
                                        className="w-4 h-4 accent-[#0D9488] rounded"
                                    />
                                    <span className="text-sm text-gray-700">Send email confirmation</span>
                                </label>

                                <button
                                    type="submit"
                                    disabled={!canSubmit}
                                    className="w-full bg-[#0D9488] hover:bg-[#0A7A70] disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <CheckCircleIcon className="w-5 h-5" />
                                    {processing ? 'Booking...' : 'Confirm Booking'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </StaffLayout>
    );
}
