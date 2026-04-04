import { useForm } from '@inertiajs/react';
import StaffLayout from '@/Layouts/StaffLayout';
import { Link } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, errors, processing } = useForm({
        first_name: '',
        last_name: '',
        date_of_birth: '',
        gender: '',
        contact_number: '',
        address: '',
        medical_alerts: '',
        emergency_contact: '',
    });

    function submit(e) {
        e.preventDefault();
        post('/staff/patients', {
            onFinish: () => {
                // Form will be reset on successful redirect
            },
        });
    }

    return (
        <StaffLayout>
            <div className="max-w-2xl mx-auto py-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-[#E2FAF7]">Register New Patient</h1>
                    <Link href="/staff/appointments" className="px-4 py-2 bg-[#0D9488] rounded-lg text-[#E2FAF7] hover:bg-[#0A7A70]">
                        Back to Appointments
                    </Link>
                </div>

                <div className="bg-[#0F2724] rounded-lg border border-[#1d6361] p-6">
                    <form onSubmit={submit} className="space-y-6">
                        {/* First Name & Last Name */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-[#E2FAF7] mb-2">
                                    First Name *
                                </label>
                                <input
                                    type="text"
                                    value={data.first_name}
                                    onChange={(e) => setData('first_name', e.target.value)}
                                    className={`w-full px-4 py-2 bg-[#0E2C28] border rounded-lg text-[#E2FAF7] placeholder-[#7ABFB9] focus:outline-none focus:border-[#0D9488] ${
                                        errors.first_name ? 'border-red-500' : 'border-[#1d6361]'
                                    }`}
                                    placeholder="First name"
                                />
                                {errors.first_name && <p className="mt-1 text-sm text-red-400">{errors.first_name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#E2FAF7] mb-2">
                                    Last Name *
                                </label>
                                <input
                                    type="text"
                                    value={data.last_name}
                                    onChange={(e) => setData('last_name', e.target.value)}
                                    className={`w-full px-4 py-2 bg-[#0E2C28] border rounded-lg text-[#E2FAF7] placeholder-[#7ABFB9] focus:outline-none focus:border-[#0D9488] ${
                                        errors.last_name ? 'border-red-500' : 'border-[#1d6361]'
                                    }`}
                                    placeholder="Last name"
                                />
                                {errors.last_name && <p className="mt-1 text-sm text-red-400">{errors.last_name}</p>}
                            </div>
                        </div>

                        {/* Date of Birth & Gender */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-[#E2FAF7] mb-2">
                                    Date of Birth *
                                </label>
                                <input
                                    type="date"
                                    value={data.date_of_birth}
                                    onChange={(e) => setData('date_of_birth', e.target.value)}
                                    className={`w-full px-4 py-2 bg-[#0E2C28] border rounded-lg text-[#E2FAF7] focus:outline-none focus:border-[#0D9488] ${
                                        errors.date_of_birth ? 'border-red-500' : 'border-[#1d6361]'
                                    }`}
                                />
                                {errors.date_of_birth && <p className="mt-1 text-sm text-red-400">{errors.date_of_birth}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#E2FAF7] mb-2">
                                    Gender *
                                </label>
                                <select
                                    value={data.gender}
                                    onChange={(e) => setData('gender', e.target.value)}
                                    className={`w-full px-4 py-2 bg-[#0E2C28] border rounded-lg text-[#E2FAF7] focus:outline-none focus:border-[#0D9488] ${
                                        errors.gender ? 'border-red-500' : 'border-[#1d6361]'
                                    }`}
                                >
                                    <option value="" className="bg-[#0E2C28]">Select gender</option>
                                    <option value="male" className="bg-[#0E2C28]">Male</option>
                                    <option value="female" className="bg-[#0E2C28]">Female</option>
                                    <option value="other" className="bg-[#0E2C28]">Other</option>
                                </select>
                                {errors.gender && <p className="mt-1 text-sm text-red-400">{errors.gender}</p>}
                            </div>
                        </div>

                        {/* Contact Number */}
                        <div>
                            <label className="block text-sm font-medium text-[#E2FAF7] mb-2">
                                Contact Number
                            </label>
                            <input
                                type="tel"
                                value={data.contact_number}
                                onChange={(e) => setData('contact_number', e.target.value)}
                                className={`w-full px-4 py-2 bg-[#0E2C28] border rounded-lg text-[#E2FAF7] placeholder-[#7ABFB9] focus:outline-none focus:border-[#0D9488] ${
                                    errors.contact_number ? 'border-red-500' : 'border-[#1d6361]'
                                }`}
                                placeholder="+63 9XX XXX XXXX"
                            />
                            {errors.contact_number && <p className="mt-1 text-sm text-red-400">{errors.contact_number}</p>}
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-sm font-medium text-[#E2FAF7] mb-2">
                                Address
                            </label>
                            <textarea
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                rows="3"
                                className={`w-full px-4 py-2 bg-[#0E2C28] border rounded-lg text-[#E2FAF7] placeholder-[#7ABFB9] focus:outline-none focus:border-[#0D9488] ${
                                    errors.address ? 'border-red-500' : 'border-[#1d6361]'
                                }`}
                                placeholder="Street address and city"
                            />
                            {errors.address && <p className="mt-1 text-sm text-red-400">{errors.address}</p>}
                        </div>

                        {/* Medical Alerts */}
                        <div>
                            <label className="block text-sm font-medium text-[#E2FAF7] mb-2">
                                Medical Alerts
                            </label>
                            <textarea
                                value={data.medical_alerts}
                                onChange={(e) => setData('medical_alerts', e.target.value)}
                                rows="2"
                                className={`w-full px-4 py-2 bg-[#0E2C28] border rounded-lg text-[#E2FAF7] placeholder-[#7ABFB9] focus:outline-none focus:border-[#0D9488] ${
                                    errors.medical_alerts ? 'border-red-500' : 'border-[#1d6361]'
                                }`}
                                placeholder="e.g. Allergies, conditions, medications"
                            />
                            {errors.medical_alerts && <p className="mt-1 text-sm text-red-400">{errors.medical_alerts}</p>}
                        </div>

                        {/* Emergency Contact */}
                        <div>
                            <label className="block text-sm font-medium text-[#E2FAF7] mb-2">
                                Emergency Contact
                            </label>
                            <input
                                type="text"
                                value={data.emergency_contact}
                                onChange={(e) => setData('emergency_contact', e.target.value)}
                                className={`w-full px-4 py-2 bg-[#0E2C28] border rounded-lg text-[#E2FAF7] placeholder-[#7ABFB9] focus:outline-none focus:border-[#0D9488] ${
                                    errors.emergency_contact ? 'border-red-500' : 'border-[#1d6361]'
                                }`}
                                placeholder="Name and phone number"
                            />
                            {errors.emergency_contact && <p className="mt-1 text-sm text-red-400">{errors.emergency_contact}</p>}
                        </div>

                        {/* Form Actions */}
                        <div className="flex gap-4 pt-6 border-t border-[#1d6361]">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 bg-[#0D9488] hover:bg-[#0A7A70] disabled:bg-gray-600 text-[#E2FAF7] rounded-lg font-medium transition-colors"
                            >
                                {processing ? 'Registering...' : 'Register Patient'}
                            </button>
                            <Link
                                href="/staff/appointments"
                                className="px-6 py-2 bg-[#0E2C28] border border-[#1d6361] text-[#7ABFB9] rounded-lg font-medium hover:border-[#0D9488] transition-colors"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </StaffLayout>
    );
}
