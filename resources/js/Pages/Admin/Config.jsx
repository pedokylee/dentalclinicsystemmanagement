import AdminLayout from '@/Layouts/AdminLayout'
import { useState } from 'react'

const IconBuildingClinic = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
)

const IconBell = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0018 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
)

const IconLock = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
)

const IconSave = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
    </svg>
)

export default function Config() {
    const [clinicData, setClinicData] = useState({
        clinicName: 'SmileCare Dental Clinic',
        phone: '+1 (555) 123-4567',
        email: 'contact@smilecare.com',
        address: '123 Health Avenue, Medical District, NY 10001',
        operatingHours: 'Mon-Fri: 9:00 AM - 6:00 PM, Sat: 9:00 AM - 2:00 PM'
    })

    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        appointmentConfirmations: true,
        dailySummaryReport: false
    })

    const [permissions, setPermissions] = useState({
        dentist: { viewPatients: true, editPatients: true, bookAppts: false, viewReports: false, exportData: false, manageUsers: false, systemConfig: false },
        staff: { viewPatients: true, editPatients: true, bookAppts: true, viewReports: true, exportData: false, manageUsers: false, systemConfig: false },
        patient: { viewPatients: false, editPatients: false, bookAppts: false, viewReports: false, exportData: false, manageUsers: false, systemConfig: false }
    })

    const [notification, setNotification] = useState(null)

    const handleClinicChange = (field, value) => {
        setClinicData(prev => ({ ...prev, [field]: value }))
    }

    const handleNotificationChange = (field) => {
        setNotifications(prev => ({ ...prev, [field]: !prev[field] }))
    }

    const handlePermissionChange = (role, permission) => {
        setPermissions(prev => ({
            ...prev,
            [role]: { ...prev[role], [permission]: !prev[role][permission] }
        }))
    }

    const handleSaveChanges = () => {
        setNotification({ type: 'success', message: 'Configuration saved successfully!' })
        setTimeout(() => setNotification(null), 3000)
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">System Configuration</h1>
                    <p className="text-gray-600">Dental Clinic Management System</p>
                </div>
                <button onClick={handleSaveChanges} className="flex items-center gap-2 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium">
                    <IconSave /> Save Changes
                </button>
            </div>

            {/* Notification Toast */}
            {notification && (
                <div className={`p-4 rounded-lg ${notification.type === 'success' ? 'bg-teal-50 border border-teal-200 text-teal-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
                    <div className="flex justify-between items-center">
                        <span>{notification.message}</span>
                        <button onClick={() => setNotification(null)} className="text-lg">×</button>
                    </div>
                </div>
            )}

            {/* Clinic Information & Notification Settings Grid */}
            <div className="grid grid-cols-2 gap-6">
                {/* Clinic Information Card */}
                <div className="bg-white rounded-lg border-l-4 border-teal-500 shadow-lg p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center text-teal-600">
                            <IconBuildingClinic />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Clinic Information</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Clinic Name</label>
                            <input type="text" value={clinicData.clinicName} onChange={(e) => handleClinicChange('clinicName', e.target.value)} placeholder="Enter clinic name" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder:text-gray-400 text-gray-900" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                                <input type="tel" value={clinicData.phone} onChange={(e) => handleClinicChange('phone', e.target.value)} placeholder="+1 (555) 123-4567" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder:text-gray-400 text-gray-900" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                <input type="email" value={clinicData.email} onChange={(e) => handleClinicChange('email', e.target.value)} placeholder="contact@smilecare.com" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder:text-gray-400 text-gray-900" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Physical Address</label>
                            <textarea value={clinicData.address} onChange={(e) => handleClinicChange('address', e.target.value)} placeholder="123 Health Avenue, Medical District, NY 10001" rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder:text-gray-400 text-gray-900" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Operating Hours</label>
                            <input type="text" value={clinicData.operatingHours} onChange={(e) => handleClinicChange('operatingHours', e.target.value)} placeholder="Mon-Fri: 9:00 AM - 6:00 PM, Sat: 9:00 AM - 2:00 PM" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder:text-gray-400 text-gray-900" />
                        </div>
                    </div>
                </div>

                {/* Notification Settings Card */}
                <div className="bg-white rounded-lg border-l-4 border-teal-500 shadow-lg p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center text-teal-600">
                            <IconBell />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Notification Settings</h2>
                    </div>

                    <div className="space-y-5">
                        {['emailNotifications', 'appointmentConfirmations', 'dailySummaryReport'].map((setting, idx) => {
                            const labels = {
                                emailNotifications: { title: 'Email Notifications', desc: 'Send system alerts and reports via email' },
                                appointmentConfirmations: { title: 'Appointment Confirmations', desc: 'Require patient confirmation for bookings' },
                                dailySummaryReport: { title: 'Daily Summary Report', desc: 'Email daily summary to administrators' }
                            }
                            return (
                                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-semibold text-gray-900">{labels[setting].title}</p>
                                        <p className="text-sm text-gray-600">{labels[setting].desc}</p>
                                    </div>
                                    <button onClick={() => handleNotificationChange(setting)} className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${notifications[setting] ? 'bg-teal-600' : 'bg-gray-300'}`}>
                                        <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${notifications[setting] ? 'translate-x-7' : 'translate-x-1'}`} />
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Role Permissions Matrix */}
            <div className="bg-white rounded-lg border-l-4 border-teal-500 shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center text-teal-600">
                        <IconLock />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Role Permissions Matrix</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b-2 border-gray-200">
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Role</th>
                                <th className="px-4 py-3 text-center font-semibold text-gray-700">View Patients</th>
                                <th className="px-4 py-3 text-center font-semibold text-gray-700">Edit Patients</th>
                                <th className="px-4 py-3 text-center font-semibold text-gray-700">Book Appts</th>
                                <th className="px-4 py-3 text-center font-semibold text-gray-700">View Reports</th>
                                <th className="px-4 py-3 text-center font-semibold text-gray-700">Export Data</th>
                                <th className="px-4 py-3 text-center font-semibold text-gray-700">Manage Users</th>
                                <th className="px-4 py-3 text-center font-semibold text-gray-700">System Config</th>
                            </tr>
                        </thead>
                        <tbody>
                            {['dentist', 'staff', 'patient'].map((role) => (
                                <tr key={role} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 font-semibold text-gray-900 capitalize">{role}</td>
                                    {['viewPatients', 'editPatients', 'bookAppts', 'viewReports', 'exportData', 'manageUsers', 'systemConfig'].map((permission) => (
                                        <td key={permission} className="px-4 py-3 text-center">
                                            <input type="checkbox" checked={permissions[role][permission]} onChange={() => handlePermissionChange(role, permission)} className="h-5 w-5 accent-teal-600 cursor-pointer" />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

Config.layout = (page) => <AdminLayout>{page}</AdminLayout>
