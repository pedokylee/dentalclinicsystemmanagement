import AdminLayout from '@/Layouts/AdminLayout'
import { useForm } from '@inertiajs/react'
import { Building2, Bell, ShieldCheck, Save } from 'lucide-react'

const permissionColumns = ['viewPatients', 'editPatients', 'bookAppts', 'viewReports', 'exportData', 'manageUsers', 'systemConfig']

const permissionLabels = {
    viewPatients: 'View Patients',
    editPatients: 'Edit Patients',
    bookAppts: 'Book Appointments',
    viewReports: 'View Reports',
    exportData: 'Export Data',
    manageUsers: 'Manage Users',
    systemConfig: 'System Config',
}

export default function Config({ settings }) {
    const { data, setData, post, processing } = useForm({
        clinic: settings?.clinic ?? {},
        notifications: settings?.notifications ?? {},
        permissions: settings?.permissions ?? {},
    })

    const save = () => {
        post('/admin/config')
    }

    return (
        <div className="dcms-page">
            <div className="dcms-page-header">
                <div>
                    <h1 className="dcms-page-title">System Configuration</h1>
                    <p className="dcms-page-subtitle">Persist clinic information, notification preferences, and role permissions.</p>
                </div>
                <button onClick={save} disabled={processing} className="dcms-btn-primary">
                    <Save className="h-4 w-4" />
                    {processing ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                <section className="dcms-card">
                    <div className="dcms-card-body space-y-5">
                        <div className="flex items-center gap-3">
                            <div className="dcms-icon-badge">
                                <Building2 className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-xl">Clinic Information</h2>
                                <p className="text-sm text-[var(--dcms-text-soft)]">Displayed across the clinic portal and operational workflows.</p>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="md:col-span-2">
                                <label className="dcms-label">Clinic Name</label>
                                <input className="dcms-input" value={data.clinic.name ?? ''} onChange={(event) => setData('clinic', { ...data.clinic, name: event.target.value })} />
                            </div>
                            <div>
                                <label className="dcms-label">Phone</label>
                                <input className="dcms-input" value={data.clinic.phone ?? ''} onChange={(event) => setData('clinic', { ...data.clinic, phone: event.target.value })} />
                            </div>
                            <div>
                                <label className="dcms-label">Email</label>
                                <input className="dcms-input" value={data.clinic.email ?? ''} onChange={(event) => setData('clinic', { ...data.clinic, email: event.target.value })} />
                            </div>
                            <div className="md:col-span-2">
                                <label className="dcms-label">Address</label>
                                <textarea className="dcms-textarea" value={data.clinic.address ?? ''} onChange={(event) => setData('clinic', { ...data.clinic, address: event.target.value })} />
                            </div>
                            <div className="md:col-span-2">
                                <label className="dcms-label">Operating Hours</label>
                                <input className="dcms-input" value={data.clinic.operatingHours ?? ''} onChange={(event) => setData('clinic', { ...data.clinic, operatingHours: event.target.value })} />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="dcms-card">
                    <div className="dcms-card-body space-y-5">
                        <div className="flex items-center gap-3">
                            <div className="dcms-icon-badge">
                                <Bell className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-xl">Notification Settings</h2>
                                <p className="text-sm text-[var(--dcms-text-soft)]">Manage how email and in-app notifications behave across the clinic.</p>
                            </div>
                        </div>

                        {[
                            ['emailNotifications', 'Email Notifications', 'Send operational updates and reminders through email.'],
                            ['appointmentConfirmations', 'Appointment Confirmations', 'Notify patients and dentists when bookings are created or updated.'],
                            ['dailySummaryReport', 'Daily Summary Report', 'Send end-of-day summary emails to clinic administrators.'],
                        ].map(([key, title, copy]) => (
                            <div key={key} className="dcms-card-muted flex items-center justify-between gap-4">
                                <div>
                                    <p className="font-semibold text-[var(--dcms-text)]">{title}</p>
                                    <p className="mt-1 text-sm text-[var(--dcms-text-soft)]">{copy}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setData('notifications', { ...data.notifications, [key]: !data.notifications[key] })}
                                    className={`relative h-8 w-14 rounded-full transition ${data.notifications[key] ? 'bg-[var(--dcms-primary)]' : 'bg-slate-300'}`}
                                >
                                    <span className={`absolute top-1 h-6 w-6 rounded-full bg-white transition ${data.notifications[key] ? 'left-7' : 'left-1'}`} />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <section className="dcms-card">
                <div className="dcms-card-body">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="dcms-icon-badge">
                            <ShieldCheck className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-xl">Role Permissions Matrix</h2>
                            <p className="text-sm text-[var(--dcms-text-soft)]">Reference and maintain role capabilities in one place.</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="dcms-table">
                            <thead>
                                <tr>
                                    <th>Role</th>
                                    {permissionColumns.map((column) => (
                                        <th key={column}>{permissionLabels[column]}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(data.permissions).map(([role, permissions]) => (
                                    <tr key={role}>
                                        <td className="font-semibold capitalize">{role}</td>
                                        {permissionColumns.map((column) => (
                                            <td key={column}>
                                                <input
                                                    type="checkbox"
                                                    checked={Boolean(permissions[column])}
                                                    onChange={() =>
                                                        setData('permissions', {
                                                            ...data.permissions,
                                                            [role]: {
                                                                ...permissions,
                                                                [column]: !permissions[column],
                                                            },
                                                        })
                                                    }
                                                    className="rounded border-[var(--dcms-border)] text-[var(--dcms-primary)] focus:ring-[var(--dcms-primary)]"
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    )
}

Config.layout = (page) => <AdminLayout>{page}</AdminLayout>
