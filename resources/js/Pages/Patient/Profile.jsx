import PatientLayout from '@/Layouts/PatientLayout'
import { useForm, usePage } from '@inertiajs/react'
import { useState } from 'react'

export default function PatientProfile({ user, patient, pendingRequests }) {
    const [showPassword, setShowPassword] = useState(false)
    const [activeTab, setActiveTab] = useState('info')
    const { data, setData, patch, post, processing, errors } = useForm({
        first_name: patient?.first_name || '',
        last_name: patient?.last_name || '',
        email: patient?.email || '',
        phone: patient?.phone || '',
        date_of_birth: patient?.date_of_birth || '',
        gender: patient?.gender || '',
        address: patient?.address || '',
        medical_alerts: patient?.medical_alerts || '',
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    })
    const { props } = usePage()

    const handleQuickUpdate = () => {
        patch('/patient/profile', {
            onSuccess: () => alert('Profile updated successfully')
        })
    }

    const handleRequestChange = (field) => {
        post('/patient/profile/request-change', {
            field: field,
            value: data[field],
        }, {
            onSuccess: () => alert('Change request submitted. Waiting for clinic approval.')
        })
    }

    const handlePasswordUpdate = () => {
        patch('/patient/profile/password', {
            onSuccess: () => {
                setData({ ...data, current_password: '', new_password: '', new_password_confirmation: '' })
                alert('Password updated successfully')
            }
        })
    }

    const fieldRequiresApproval = (field) => {
        return ['email', 'phone', 'medical_alerts'].includes(field)
    }

    const getPendingRequestStatus = (field) => {
        return pendingRequests?.find(r => JSON.parse(r.requested_changes)[field])?.status || null
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-[#E2FAF7]">My Profile</h1>

            {props.flash?.success && (
                <div className="bg-green-900 border border-green-700 text-green-100 px-4 py-3 rounded">
                    {props.flash.success}
                </div>
            )}

            {props.flash?.error && (
                <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded">
                    {props.flash.error}
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-2 border-b border-[rgba(45,212,191,0.12)]">
                {['info', 'security', 'requests'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 font-semibold transition-colors ${
                            activeTab === tab
                                ? 'border-b-2 border-[#0D9488] text-[#0D9488]'
                                : 'text-[#7ABFB9] hover:text-[#2DD4BF]'
                        }`}
                    >
                        {tab === 'info' ? 'Personal Info' : tab === 'security' ? 'Security' : 'Change Requests'}
                    </button>
                ))}
            </div>

            {/* Personal Information Tab */}
            {activeTab === 'info' && (
                <div className="space-y-4">
                    <div className="bg-[#0E2C28] border border-[rgba(45,212,191,0.12)] p-6 rounded-lg">
                        <h2 className="text-lg font-bold text-[#0D9488] mb-4">Basic Information</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[#7ABFB9] mb-2">First Name</label>
                                <input
                                    type="text"
                                    value={data.first_name}
                                    onChange={(e) => setData('first_name', e.target.value)}
                                    className="w-full px-4 py-2 bg-[#0F2724] border border-[rgba(45,212,191,0.12)] rounded text-[#E2FAF7]"
                                />
                                {errors.first_name && <p className="text-red-400 text-sm mt-1">{errors.first_name}</p>}
                            </div>

                            <div>
                                <label className="block text-[#7ABFB9] mb-2">Last Name</label>
                                <input
                                    type="text"
                                    value={data.last_name}
                                    onChange={(e) => setData('last_name', e.target.value)}
                                    className="w-full px-4 py-2 bg-[#0F2724] border border-[rgba(45,212,191,0.12)] rounded text-[#E2FAF7]"
                                />
                                {errors.last_name && <p className="text-red-400 text-sm mt-1">{errors.last_name}</p>}
                            </div>

                            <div>
                                <label className="block text-[#7ABFB9] mb-2">Date of Birth</label>
                                <input
                                    type="date"
                                    value={data.date_of_birth}
                                    onChange={(e) => setData('date_of_birth', e.target.value)}
                                    className="w-full px-4 py-2 bg-[#0F2724] border border-[rgba(45,212,191,0.12)] rounded text-[#E2FAF7]"
                                />
                            </div>

                            <div>
                                <label className="block text-[#7ABFB9] mb-2">Gender</label>
                                <select
                                    value={data.gender}
                                    onChange={(e) => setData('gender', e.target.value)}
                                    className="w-full px-4 py-2 bg-[#0F2724] border border-[rgba(45,212,191,0.12)] rounded text-[#E2FAF7]"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>

                        <button
                            onClick={handleQuickUpdate}
                            disabled={processing}
                            className="mt-4 px-6 py-2 bg-[#0D9488] text-white rounded hover:bg-[#14B8A6] transition-colors disabled:opacity-50"
                        >
                            {processing ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>

                    <div className="bg-[#0E2C28] border border-[rgba(45,212,191,0.12)] p-6 rounded-lg">
                        <h2 className="text-lg font-bold text-[#0D9488] mb-4">Contact & Medical (Requires Clinic Approval)</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[#7ABFB9] mb-2">Email Address *</label>
                                <div className="flex gap-2">
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="flex-1 px-4 py-2 bg-[#0F2724] border border-[rgba(45,212,191,0.12)] rounded text-[#E2FAF7]"
                                    />
                                    <button
                                        onClick={() => handleRequestChange('email')}
                                        disabled={processing}
                                        className="px-4 py-2 bg-[#F59E0B] text-white rounded hover:bg-opacity-80 disabled:opacity-50 text-sm"
                                    >
                                        Request Change
                                    </button>
                                </div>
                                {getPendingRequestStatus('email') && (
                                    <p className="text-yellow-400 text-sm mt-1">Pending approval</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-[#7ABFB9] mb-2">Phone Number *</label>
                                <div className="flex gap-2">
                                    <input
                                        type="tel"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className="flex-1 px-4 py-2 bg-[#0F2724] border border-[rgba(45,212,191,0.12)] rounded text-[#E2FAF7]"
                                    />
                                    <button
                                        onClick={() => handleRequestChange('phone')}
                                        disabled={processing}
                                        className="px-4 py-2 bg-[#F59E0B] text-white rounded hover:bg-opacity-80 disabled:opacity-50 text-sm"
                                    >
                                        Request Change
                                    </button>
                                </div>
                                {getPendingRequestStatus('phone') && (
                                    <p className="text-yellow-400 text-sm mt-1">Pending approval</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-[#7ABFB9] mb-2">Address</label>
                                <input
                                    type="text"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    className="w-full px-4 py-2 bg-[#0F2724] border border-[rgba(45,212,191,0.12)] rounded text-[#E2FAF7]"
                                />
                            </div>

                            <div>
                                <label className="block text-[#7ABFB9] mb-2">Medical Alerts *</label>
                                <div className="flex gap-2">
                                    <textarea
                                        value={data.medical_alerts}
                                        onChange={(e) => setData('medical_alerts', e.target.value)}
                                        className="flex-1 px-4 py-2 bg-[#0F2724] border border-[rgba(45,212,191,0.12)] rounded text-[#E2FAF7]"
                                        rows="3"
                                        placeholder="Any allergies, medications, or medical conditions"
                                    />
                                    <button
                                        onClick={() => handleRequestChange('medical_alerts')}
                                        disabled={processing}
                                        className="px-4 py-2 bg-[#F59E0B] text-white rounded hover:bg-opacity-80 disabled:opacity-50 text-sm"
                                    >
                                        Request Change
                                    </button>
                                </div>
                                {getPendingRequestStatus('medical_alerts') && (
                                    <p className="text-yellow-400 text-sm mt-1">Pending approval</p>
                                )}
                            </div>

                            <p className="text-[#7ABFB9] text-sm">* Changes to these fields require clinic staff approval. Please visit the clinic or contact us if you need to update these immediately.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
                <div className="bg-[#0E2C28] border border-[rgba(45,212,191,0.12)] p-6 rounded-lg max-w-md">
                    <h2 className="text-lg font-bold text-[#0D9488] mb-4">Change Password</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[#7ABFB9] mb-2">Current Password</label>
                            <input
                                type="password"
                                value={data.current_password}
                                onChange={(e) => setData('current_password', e.target.value)}
                                className="w-full px-4 py-2 bg-[#0F2724] border border-[rgba(45,212,191,0.12)] rounded text-[#E2FAF7]"
                            />
                            {errors.current_password && <p className="text-red-400 text-sm mt-1">{errors.current_password}</p>}
                        </div>

                        <div>
                            <label className="block text-[#7ABFB9] mb-2">New Password</label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={data.new_password}
                                onChange={(e) => setData('new_password', e.target.value)}
                                className="w-full px-4 py-2 bg-[#0F2724] border border-[rgba(45,212,191,0.12)] rounded text-[#E2FAF7]"
                            />
                            {errors.new_password && <p className="text-red-400 text-sm mt-1">{errors.new_password}</p>}
                        </div>

                        <div>
                            <label className="block text-[#7ABFB9] mb-2">Confirm New Password</label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={data.new_password_confirmation}
                                onChange={(e) => setData('new_password_confirmation', e.target.value)}
                                className="w-full px-4 py-2 bg-[#0F2724] border border-[rgba(45,212,191,0.12)] rounded text-[#E2FAF7]"
                            />
                        </div>

                        <label className="flex items-center gap-2 text-[#7ABFB9]">
                            <input
                                type="checkbox"
                                checked={showPassword}
                                onChange={(e) => setShowPassword(e.target.checked)}
                                className="rounded"
                            />
                            Show password
                        </label>

                        <button
                            onClick={handlePasswordUpdate}
                            disabled={processing}
                            className="w-full px-4 py-2 bg-[#F59E0B] text-white rounded hover:bg-opacity-80 transition-colors disabled:opacity-50"
                        >
                            {processing ? 'Updating...' : 'Update Password'}
                        </button>
                    </div>
                </div>
            )}

            {/* Change Requests Tab */}
            {activeTab === 'requests' && (
                <div className="bg-[#0E2C28] border border-[rgba(45,212,191,0.12)] p-6 rounded-lg">
                    <h2 className="text-lg font-bold text-[#0D9488] mb-4">Pending Change Requests</h2>
                    {pendingRequests && pendingRequests.length > 0 ? (
                        <div className="space-y-3">
                            {pendingRequests.map((request) => (
                                <div key={request.id} className="bg-[#0F2724] p-4 rounded border border-[rgba(45,212,191,0.12)]">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-[#E2FAF7] font-semibold">Field changes requested</p>
                                            <p className="text-[#7ABFB9] text-sm mt-1">
                                                Requested: {new Date(request.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded text-sm font-semibold ${
                                            request.status === 'pending' ? 'bg-yellow-900 text-yellow-100' :
                                            request.status === 'approved' ? 'bg-green-900 text-green-100' :
                                            'bg-red-900 text-red-100'
                                        }`}>
                                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                        </span>
                                    </div>
                                    {request.status === 'rejected' && request.rejection_reason && (
                                        <p className="text-red-400 text-sm mt-2">Reason: {request.rejection_reason}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-[#7ABFB9]">No pending requests. All your changes have been processed.</p>
                    )}
                </div>
            )}
        </div>
    )
}

PatientProfile.layout = (page) => <PatientLayout>{page}</PatientLayout>
