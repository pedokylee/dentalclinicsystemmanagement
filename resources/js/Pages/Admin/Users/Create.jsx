import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, errors, processing } = useForm({
        name: '',
        email: '',
        password: '',
        role: 'staff',
    });

    function submit(e) {
        e.preventDefault();
        post('/admin/users', {
            onFinish: () => {
                // Form will be reset on successful redirect
            },
        });
    }

    return (
        <AdminLayout>
            <div className="max-w-2xl mx-auto py-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-[#E2FAF7]">Create New User</h1>
                    <Link href="/admin/users" className="px-4 py-2 bg-[#0D9488] rounded-lg text-[#E2FAF7] hover:bg-[#0A7A70]">
                        Back to Users
                    </Link>
                </div>

                <div className="bg-[#0F2724] rounded-lg border border-[#1d6361] p-6">
                    <form onSubmit={submit} className="space-y-6">
                        {/* Name Field */}
                        <div>
                            <label className="block text-sm font-medium text-[#E2FAF7] mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className={`w-full px-4 py-2 bg-[#0E2C28] border rounded-lg text-[#E2FAF7] placeholder-[#7ABFB9] focus:outline-none focus:border-[#0D9488] ${
                                    errors.name ? 'border-red-500' : 'border-[#1d6361]'
                                }`}
                                placeholder="Enter full name"
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
                        </div>

                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-[#E2FAF7] mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className={`w-full px-4 py-2 bg-[#0E2C28] border rounded-lg text-[#E2FAF7] placeholder-[#7ABFB9] focus:outline-none focus:border-[#0D9488] ${
                                    errors.email ? 'border-red-500' : 'border-[#1d6361]'
                                }`}
                                placeholder="Enter email address"
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-[#E2FAF7] mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className={`w-full px-4 py-2 bg-[#0E2C28] border rounded-lg text-[#E2FAF7] placeholder-[#7ABFB9] focus:outline-none focus:border-[#0D9488] ${
                                    errors.password ? 'border-red-500' : 'border-[#1d6361]'
                                }`}
                                placeholder="Enter password (min 8 characters)"
                            />
                            {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
                        </div>

                        {/* Role Select */}
                        <div>
                            <label className="block text-sm font-medium text-[#E2FAF7] mb-2">
                                Role
                            </label>
                            <select
                                value={data.role}
                                onChange={(e) => setData('role', e.target.value)}
                                className={`w-full px-4 py-2 bg-[#0E2C28] border rounded-lg text-[#E2FAF7] focus:outline-none focus:border-[#0D9488] ${
                                    errors.role ? 'border-red-500' : 'border-[#1d6361]'
                                }`}
                            >
                                <option value="admin" className="bg-[#0E2C28]">Administrator</option>
                                <option value="dentist" className="bg-[#0E2C28]">Dentist</option>
                                <option value="staff" className="bg-[#0E2C28]">Staff Member</option>
                                <option value="patient" className="bg-[#0E2C28]">Patient</option>
                            </select>
                            {errors.role && <p className="mt-1 text-sm text-red-400">{errors.role}</p>}
                        </div>

                        {/* Form Actions */}
                        <div className="flex gap-4 pt-6 border-t border-[#1d6361]">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 bg-[#0D9488] hover:bg-[#0A7A70] disabled:bg-gray-600 text-[#E2FAF7] rounded-lg font-medium transition-colors"
                            >
                                {processing ? 'Creating...' : 'Create User'}
                            </button>
                            <Link
                                href="/admin/users"
                                className="px-6 py-2 bg-[#0E2C28] border border-[#1d6361] text-[#7ABFB9] rounded-lg font-medium hover:border-[#0D9488] transition-colors"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
