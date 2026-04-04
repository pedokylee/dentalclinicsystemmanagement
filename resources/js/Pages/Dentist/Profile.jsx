import { usePage } from '@inertiajs/react'
import DentistLayout from '@/Layouts/DentistLayout'
import { useForm } from '@inertiajs/react'
import { useState } from 'react'

export default function DentistProfile({ user, dentist }) {
    const [showPassword, setShowPassword] = useState(false)
    const { data, setData, patch, processing, errors } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        specialization: dentist?.specialization || '',
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    })

    const handleProfileUpdate = () => {
        patch('/dentist/profile', {
            onSuccess: () => alert('Profile updated successfully')
        })
    }

    const handlePasswordUpdate = () => {
        patch('/dentist/profile/password', {
            onSuccess: () => {
                setData({ ...data, current_password: '', new_password: '', new_password_confirmation: '' })
                alert('Password updated successfully')
            }
        })
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-[#E2FAF7]">Profile Settings</h1>

            {/* Professional Information */}
            <div className="bg-[#0E2C28] border border-[rgba(45,212,191,0.12)] p-6 rounded-lg">
                <h2 className="text-xl font-bold text-[#0D9488] mb-4">Professional Information</h2>
                <div className="space-y-4 max-w-md">
                    <div>
                        <label className="block text-[#7ABFB9] mb-2">Full Name</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full px-4 py-2 bg-[#0F2724] border border-[rgba(45,212,191,0.12)] rounded text-[#E2FAF7]"
                        />
                        {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-[#7ABFB9] mb-2">Email Address</label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="w-full px-4 py-2 bg-[#0F2724] border border-[rgba(45,212,191,0.12)] rounded text-[#E2FAF7]"
                        />
                        {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-[#7ABFB9] mb-2">Specialization</label>
                        <input
                            type="text"
                            value={data.specialization}
                            onChange={(e) => setData('specialization', e.target.value)}
                            className="w-full px-4 py-2 bg-[#0F2724] border border-[rgba(45,212,191,0.12)] rounded text-[#E2FAF7]"
                            placeholder="e.g., General Dentistry, Orthodontics"
                        />
                    </div>

                    <button
                        onClick={handleProfileUpdate}
                        disabled={processing}
                        className="w-full px-4 py-2 bg-[#0D9488] text-white rounded hover:bg-[#14B8A6] transition-colors disabled:opacity-50"
                    >
                        {processing ? 'Saving...' : 'Update Profile'}
                    </button>
                </div>
            </div>

            {/* Change Password */}
            <div className="bg-[#0E2C28] border border-[rgba(45,212,191,0.12)] p-6 rounded-lg">
                <h2 className="text-xl font-bold text-[#0D9488] mb-4">Change Password</h2>
                <div className="space-y-4 max-w-md">
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
        </div>
    )
}

DentistProfile.layout = (page) => <DentistLayout>{page}</DentistLayout>
