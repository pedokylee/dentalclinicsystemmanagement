import PatientLayout from '@/Layouts/PatientLayout'
import { useForm } from '@inertiajs/react'
import { useMemo, useState } from 'react'

const preferenceRows = [
    ['in_app_notifications', 'In-app notifications'],
    ['email_notifications', 'Email notifications'],
    ['appointment_updates', 'Appointment updates'],
    ['reminder_notifications', 'Reminder notifications'],
]

const uiRows = [
    ['compact_tables', 'Compact tables'],
    ['show_timestamps_24h', '24-hour timestamps'],
]

export default function PatientProfile({ patient, pendingRequests, settings }) {
    const [activeTab, setActiveTab] = useState('profile')
    const { data, setData, patch, post, processing, errors } = useForm({
        first_name: patient?.first_name ?? '',
        last_name: patient?.last_name ?? '',
        date_of_birth: patient?.date_of_birth ?? '',
        gender: patient?.gender ?? '',
        address: patient?.address ?? '',
        email: patient?.email ?? '',
        phone: patient?.phone ?? '',
        medical_alerts: patient?.medical_alerts ?? '',
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    })
    const preferencesForm = useForm({
        notification_preferences: settings?.notification_preferences ?? {},
        ui_preferences: settings?.ui_preferences ?? {},
    })

    const pendingByField = useMemo(() => {
        const map = {}
        for (const request of pendingRequests ?? []) {
            const fields = JSON.parse(request.requested_changes || '{}')
            Object.keys(fields).forEach((field) => {
                map[field] = request.status
            })
        }
        return map
    }, [pendingRequests])

    return (
        <div className="dcms-page">
            <div>
                <h1 className="dcms-page-title">My Profile</h1>
                <p className="dcms-page-subtitle">Update your personal information directly and submit clinic approval requests for sensitive fields.</p>
            </div>

            <div className="flex flex-wrap gap-2">
                {[
                    ['profile', 'Profile'],
                    ['security', 'Security'],
                    ['preferences', 'Preferences'],
                    ['requests', 'Requests'],
                ].map(([key, label]) => (
                    <button key={key} className={`dcms-tab ${activeTab === key ? 'dcms-tab-active' : 'dcms-tab-idle'}`} onClick={() => setActiveTab(key)}>
                        {label}
                    </button>
                ))}
            </div>

            {activeTab === 'profile' && (
                <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
                    <section className="dcms-card">
                        <div className="dcms-card-body text-center">
                            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-[var(--dcms-deep-teal)] text-3xl font-bold text-white">
                                {patient.first_name?.[0]}{patient.last_name?.[0]}
                            </div>
                            <h2 className="mt-4 text-2xl">{patient.full_name}</h2>
                            <p className="mt-2 text-sm text-[var(--dcms-text-soft)]">Patient Portal Access</p>
                            <div className="mt-6 flex flex-wrap justify-center gap-2">
                                {(patient.medical_alerts ? [patient.medical_alerts] : ['No medical alerts']).map((alert) => (
                                    <span key={alert} className="dcms-chip-gold">{alert}</span>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="dcms-card">
                        <div className="dcms-card-body grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="dcms-label">First Name</label>
                                <input className="dcms-input" value={data.first_name} onChange={(event) => setData('first_name', event.target.value)} />
                                {errors.first_name && <p className="mt-1 text-sm text-red-500">{errors.first_name}</p>}
                            </div>
                            <div>
                                <label className="dcms-label">Last Name</label>
                                <input className="dcms-input" value={data.last_name} onChange={(event) => setData('last_name', event.target.value)} />
                                {errors.last_name && <p className="mt-1 text-sm text-red-500">{errors.last_name}</p>}
                            </div>
                            <div>
                                <label className="dcms-label">Date of Birth</label>
                                <input type="date" className="dcms-input" value={data.date_of_birth} onChange={(event) => setData('date_of_birth', event.target.value)} />
                            </div>
                            <div>
                                <label className="dcms-label">Gender</label>
                                <select className="dcms-select" value={data.gender} onChange={(event) => setData('gender', event.target.value)}>
                                    <option value="">Select gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="dcms-label">Address</label>
                                <textarea className="dcms-textarea" value={data.address} onChange={(event) => setData('address', event.target.value)} />
                            </div>
                            <div className="md:col-span-2 flex justify-end">
                                <button className="dcms-btn-primary" onClick={() => patch('/patient/profile')}>Save Profile</button>
                            </div>
                        </div>
                    </section>

                    <section className="dcms-card xl:col-span-2">
                        <div className="dcms-card-body grid gap-4 md:grid-cols-3">
                            {[
                                ['email', 'Email'],
                                ['phone', 'Contact Number'],
                                ['medical_alerts', 'Medical Alerts'],
                            ].map(([field, label]) => (
                                <div key={field} className="dcms-card-muted">
                                    <label className="dcms-label">{label}</label>
                                    {field === 'medical_alerts' ? (
                                        <textarea className="dcms-textarea !min-h-[96px]" value={data[field]} onChange={(event) => setData(field, event.target.value)} />
                                    ) : (
                                        <input className="dcms-input" value={data[field]} onChange={(event) => setData(field, event.target.value)} />
                                    )}
                                    <div className="mt-3 flex items-center justify-between gap-3">
                                        <span className="text-xs text-[var(--dcms-text-soft)]">{pendingByField[field] ? 'Pending approval' : 'Clinic approval required'}</span>
                                        <button className="dcms-btn-secondary !px-3 !py-2" onClick={() => post('/patient/profile/request-change', { field, value: data[field] })}>
                                            Request Change
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            )}

            {activeTab === 'security' && (
                <section className="dcms-card max-w-2xl">
                    <div className="dcms-card-body grid gap-4">
                        <div>
                            <label className="dcms-label">Current Password</label>
                            <input type="password" className="dcms-input" value={data.current_password} onChange={(event) => setData('current_password', event.target.value)} />
                        </div>
                        <div>
                            <label className="dcms-label">New Password</label>
                            <input type="password" className="dcms-input" value={data.new_password} onChange={(event) => setData('new_password', event.target.value)} />
                        </div>
                        <div>
                            <label className="dcms-label">Confirm New Password</label>
                            <input type="password" className="dcms-input" value={data.new_password_confirmation} onChange={(event) => setData('new_password_confirmation', event.target.value)} />
                        </div>
                        <div className="flex justify-end">
                            <button className="dcms-btn-primary" onClick={() => patch('/patient/profile/password')} disabled={processing}>
                                {processing ? 'Updating...' : 'Update Password'}
                            </button>
                        </div>
                    </div>
                </section>
            )}

            {activeTab === 'preferences' && (
                <section className="dcms-card">
                    <div className="dcms-card-body grid gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                            <h2 className="text-xl">Notification Preferences</h2>
                            {preferenceRows.map(([field, label]) => (
                                <label key={field} className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--dcms-border)] px-4 py-3">
                                    <span className="text-sm font-medium text-[var(--dcms-text)]">{label}</span>
                                    <input
                                        type="checkbox"
                                        checked={preferencesForm.data.notification_preferences[field]}
                                        onChange={(event) =>
                                            preferencesForm.setData('notification_preferences', {
                                                ...preferencesForm.data.notification_preferences,
                                                [field]: event.target.checked,
                                            })
                                        }
                                        className="h-4 w-4 accent-[var(--dcms-primary)]"
                                    />
                                </label>
                            ))}
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-xl">Display Preferences</h2>
                            {uiRows.map(([field, label]) => (
                                <label key={field} className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--dcms-border)] px-4 py-3">
                                    <span className="text-sm font-medium text-[var(--dcms-text)]">{label}</span>
                                    <input
                                        type="checkbox"
                                        checked={preferencesForm.data.ui_preferences[field]}
                                        onChange={(event) =>
                                            preferencesForm.setData('ui_preferences', {
                                                ...preferencesForm.data.ui_preferences,
                                                [field]: event.target.checked,
                                            })
                                        }
                                        className="h-4 w-4 accent-[var(--dcms-primary)]"
                                    />
                                </label>
                            ))}
                        </div>

                        <div className="md:col-span-2 flex justify-end">
                            <button
                                className="dcms-btn-primary"
                                onClick={() => preferencesForm.patch('/patient/profile/preferences', { preserveScroll: true })}
                                disabled={preferencesForm.processing}
                            >
                                {preferencesForm.processing ? 'Saving...' : 'Save Preferences'}
                            </button>
                        </div>
                    </div>
                </section>
            )}

            {activeTab === 'requests' && (
                <div className="space-y-4">
                    {pendingRequests.length > 0 ? pendingRequests.map((request) => (
                        <section key={request.id} className="dcms-card">
                            <div className="dcms-card-body flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <p className="font-semibold">Submitted {new Date(request.created_at).toLocaleString()}</p>
                                    <p className="mt-1 text-sm text-[var(--dcms-text-soft)]">{request.requested_changes}</p>
                                </div>
                                <span className={request.status === 'approved' ? 'dcms-chip-teal' : request.status === 'rejected' ? 'dcms-chip-red' : 'dcms-chip-gold'}>
                                    {request.status}
                                </span>
                            </div>
                        </section>
                    )) : (
                        <section className="dcms-card">
                            <div className="dcms-card-body text-center text-[var(--dcms-text-soft)]">No pending approval requests.</div>
                        </section>
                    )}
                </div>
            )}
        </div>
    )
}

PatientProfile.layout = (page) => <PatientLayout>{page}</PatientLayout>
