import { useEffect, useMemo, useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
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

export default function Edit({ appointment, dentists, timeSlots, existingAppointments = [] }) {
    const { data, setData, put, errors, processing } = useForm({
        appointment_date: appointment.appointment_date,
        appointment_time: appointment.appointment_time,
        type: appointment.type,
        notes: appointment.notes || '',
    });

    const [conflict, setConflict] = useState(null);
    const selectedDentist = useMemo(
        () => dentists.find((dentist) => String(dentist.id) === String(appointment.dentist_id)),
        [appointment.dentist_id, dentists]
    );

    const unavailableTimeSlots = useMemo(() => {
        if (!data.appointment_date || !selectedDentist) {
            return new Set();
        }

        if (selectedDentist?.user?.active === false) {
            return new Set(timeSlots);
        }

        if (!isDentistWorkingOnDate(selectedDentist, data.appointment_date)) {
            return new Set(timeSlots);
        }

        return new Set(
            existingAppointments
                .filter((existingAppointment) =>
                    String(existingAppointment.dentist_id) === String(appointment.dentist_id) &&
                    existingAppointment.appointment_date === data.appointment_date
                )
                .map((existingAppointment) => existingAppointment.appointment_time)
        );
    }, [appointment.dentist_id, data.appointment_date, existingAppointments, selectedDentist, timeSlots]);

    useEffect(() => {
        if (!selectedDentist) {
            setConflict(null);
            return;
        }

        if (selectedDentist?.user?.active === false) {
            setConflict('This dentist is currently unavailable for booking.');
            return;
        }

        if (!isDentistWorkingOnDate(selectedDentist, data.appointment_date)) {
            setConflict('This dentist is not scheduled on the selected date.');
            return;
        }

        if (data.appointment_time && unavailableTimeSlots.has(data.appointment_time)) {
            setConflict('This dentist already has an appointment at that time.');
            return;
        }

        setConflict(null);
    }, [data.appointment_date, data.appointment_time, selectedDentist, unavailableTimeSlots]);

    function submit(event) {
        event.preventDefault();
        put(`/staff/appointments/${appointment.id}`);
    }

    const canSubmit =
        !processing &&
        !conflict &&
        data.appointment_date &&
        data.appointment_time &&
        !unavailableTimeSlots.has(data.appointment_time);

    return (
        <StaffLayout>
            <div className="max-w-3xl mx-auto py-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--dcms-text)]">Reschedule Appointment</h1>
                        <p className="mt-2 text-[var(--dcms-text-soft)]">Move the visit to a dentist-approved date and open time slot.</p>
                    </div>
                    <Link href="/staff/appointments" className="dcms-btn-secondary">
                        Back to Appointments
                    </Link>
                </div>

                <div className="dcms-card">
                    <div className="dcms-card-body">
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="dcms-card-muted">
                                    <p className="text-xs uppercase tracking-wide text-[var(--dcms-text-soft)]">Patient</p>
                                    <p className="mt-2 text-lg font-semibold text-[var(--dcms-text)]">
                                        {appointment.patient.first_name} {appointment.patient.last_name}
                                    </p>
                                </div>
                                <div className="dcms-card-muted">
                                    <p className="text-xs uppercase tracking-wide text-[var(--dcms-text-soft)]">Dentist</p>
                                    <p className="mt-2 text-lg font-semibold text-[var(--dcms-text)]">
                                        {appointment.dentist.user.name}
                                    </p>
                                    <p className="mt-1 text-sm text-[var(--dcms-text-soft)]">
                                        {selectedDentist?.specialization || 'General Dentistry'}
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="dcms-label">Appointment Date</label>
                                    <input
                                        type="date"
                                        value={data.appointment_date}
                                        onChange={(event) => setData('appointment_date', event.target.value)}
                                        className="dcms-input"
                                    />
                                    {errors.appointment_date && <p className="mt-1 text-sm text-red-500">{errors.appointment_date}</p>}
                                </div>
                                <div>
                                    <label className="dcms-label">Appointment Type</label>
                                    <select
                                        value={data.type}
                                        onChange={(event) => setData('type', event.target.value)}
                                        className="dcms-select"
                                    >
                                        <option value="checkup">Regular Checkup</option>
                                        <option value="cleaning">Cleaning</option>
                                        <option value="filling">Filling</option>
                                        <option value="extraction">Extraction</option>
                                        <option value="root_canal">Root Canal</option>
                                        <option value="crown">Crown</option>
                                        <option value="other">Other</option>
                                    </select>
                                    {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="dcms-label">Available Time Slots</label>
                                <div className="grid grid-cols-3 gap-2 md:grid-cols-4">
                                    {timeSlots.map((slot) => {
                                        const isUnavailable = unavailableTimeSlots.has(slot);

                                        return (
                                            <button
                                                key={slot}
                                                type="button"
                                                disabled={isUnavailable}
                                                onClick={() => {
                                                    if (isUnavailable) {
                                                        return;
                                                    }

                                                    setData('appointment_time', slot);
                                                }}
                                                className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                                                    data.appointment_time === slot && !isUnavailable
                                                        ? 'border-[var(--dcms-primary)] bg-[var(--dcms-primary)] text-white'
                                                        : isUnavailable
                                                            ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400'
                                                            : 'border-slate-200 bg-white text-[var(--dcms-text)] hover:border-[var(--dcms-primary)]'
                                                }`}
                                            >
                                                {slot}
                                            </button>
                                        );
                                    })}
                                </div>
                                {errors.appointment_time && <p className="mt-1 text-sm text-red-500">{errors.appointment_time}</p>}
                            </div>

                            {conflict && (
                                <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                                    <strong>Warning:</strong> {conflict}
                                </div>
                            )}

                            <div>
                                <label className="dcms-label">Notes</label>
                                <textarea
                                    value={data.notes}
                                    onChange={(event) => setData('notes', event.target.value)}
                                    rows="4"
                                    className="dcms-input min-h-[120px]"
                                    placeholder="Any special notes or requests"
                                />
                                {errors.notes && <p className="mt-1 text-sm text-red-500">{errors.notes}</p>}
                            </div>

                            <div className="dcms-card-muted">
                                <p className="text-xs uppercase tracking-wide text-[var(--dcms-text-soft)]">Current Status</p>
                                <p className="mt-2 text-lg font-semibold capitalize text-[var(--dcms-text)]">{appointment.status}</p>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button type="submit" disabled={!canSubmit} className="dcms-btn-primary">
                                    {processing ? 'Updating...' : 'Update Appointment'}
                                </button>
                                <Link href="/staff/appointments" className="dcms-btn-secondary">
                                    Cancel
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </StaffLayout>
    );
}
