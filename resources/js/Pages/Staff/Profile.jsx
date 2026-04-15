import StaffLayout from '@/Layouts/StaffLayout';
import { useForm } from '@inertiajs/react';

const preferenceRows = [
    ['in_app_notifications', 'In-app notifications'],
    ['email_notifications', 'Email notifications'],
    ['appointment_updates', 'Appointment updates'],
    ['reminder_notifications', 'Reminder notifications'],
];

const uiRows = [
    ['compact_tables', 'Compact tables'],
    ['show_timestamps_24h', '24-hour timestamps'],
];

export default function StaffProfile({ user, settings }) {
    const accountForm = useForm({
        name: user?.name ?? '',
        email: user?.email ?? '',
    });

    const passwordForm = useForm({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });

    const preferencesForm = useForm({
        notification_preferences: settings?.notification_preferences ?? {},
        ui_preferences: settings?.ui_preferences ?? {},
    });

    return (
        <div className="dcms-page">
            <div className="dcms-page-header">
                <div>
                    <h1 className="dcms-page-title">User Settings</h1>
                    <p className="dcms-page-subtitle">Manage your staff account details, password, and front-desk preferences.</p>
                </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
                <section className="dcms-card">
                    <div className="dcms-card-body text-center">
                        <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-[var(--dcms-deep-teal)] text-3xl font-bold text-white">
                            {user?.name?.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <h2 className="mt-4 text-2xl">{user.name}</h2>
                        <p className="mt-2 text-sm text-[var(--dcms-text-soft)]">{user.email}</p>
                        <span className="mt-6 inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-amber-700">
                            Staff
                        </span>
                    </div>
                </section>

                <section className="dcms-card">
                    <div className="dcms-card-body grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="dcms-label">Full Name</label>
                            <input className="dcms-input" value={accountForm.data.name} onChange={(event) => accountForm.setData('name', event.target.value)} />
                            {accountForm.errors.name && <p className="mt-1 text-sm text-red-500">{accountForm.errors.name}</p>}
                        </div>
                        <div>
                            <label className="dcms-label">Email Address</label>
                            <input className="dcms-input" type="email" value={accountForm.data.email} onChange={(event) => accountForm.setData('email', event.target.value)} />
                            {accountForm.errors.email && <p className="mt-1 text-sm text-red-500">{accountForm.errors.email}</p>}
                        </div>
                        <div className="md:col-span-2 flex justify-end">
                            <button
                                className="dcms-btn-primary"
                                onClick={() => accountForm.patch('/staff/profile', { preserveScroll: true })}
                                disabled={accountForm.processing}
                            >
                                {accountForm.processing ? 'Saving...' : 'Save Account'}
                            </button>
                        </div>
                    </div>
                </section>

                <section className="dcms-card">
                    <div className="dcms-card-body grid gap-4">
                        <div>
                            <label className="dcms-label">Current Password</label>
                            <input type="password" className="dcms-input" value={passwordForm.data.current_password} onChange={(event) => passwordForm.setData('current_password', event.target.value)} />
                            {passwordForm.errors.current_password && <p className="mt-1 text-sm text-red-500">{passwordForm.errors.current_password}</p>}
                        </div>
                        <div>
                            <label className="dcms-label">New Password</label>
                            <input type="password" className="dcms-input" value={passwordForm.data.new_password} onChange={(event) => passwordForm.setData('new_password', event.target.value)} />
                            {passwordForm.errors.new_password && <p className="mt-1 text-sm text-red-500">{passwordForm.errors.new_password}</p>}
                        </div>
                        <div>
                            <label className="dcms-label">Confirm New Password</label>
                            <input type="password" className="dcms-input" value={passwordForm.data.new_password_confirmation} onChange={(event) => passwordForm.setData('new_password_confirmation', event.target.value)} />
                        </div>
                        <div className="flex justify-end">
                            <button
                                className="dcms-btn-secondary"
                                onClick={() =>
                                    passwordForm.patch('/staff/profile/password', {
                                        preserveScroll: true,
                                        onSuccess: () => passwordForm.reset(),
                                    })
                                }
                                disabled={passwordForm.processing}
                            >
                                {passwordForm.processing ? 'Updating...' : 'Update Password'}
                            </button>
                        </div>
                    </div>
                </section>

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
                                onClick={() => preferencesForm.patch('/staff/profile/preferences', { preserveScroll: true })}
                                disabled={preferencesForm.processing}
                            >
                                {preferencesForm.processing ? 'Saving...' : 'Save Preferences'}
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

StaffProfile.layout = (page) => <StaffLayout>{page}</StaffLayout>;
