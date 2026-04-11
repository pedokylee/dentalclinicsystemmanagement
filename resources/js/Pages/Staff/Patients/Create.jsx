import { useForm } from '@inertiajs/react';
import StaffLayout from '@/Layouts/StaffLayout';
import { Link } from '@inertiajs/react';
import { UserIcon, MapPinIcon, AlertCircleIcon, PhoneIcon } from 'lucide-react';

export default function Create() {
    const { data, setData, post, errors, processing } = useForm({
        first_name: '',
        last_name: '',
        date_of_birth: '',
        gender: '',
        contact_number: '',
        email: '',
        street_address: '',
        city: '',
        state: '',
        zip_code: '',
        medical_alerts: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
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
            <div className="max-w-4xl mx-auto py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Register New Patient</h1>
                    <p className="text-gray-600">Create a new patient profile in the system</p>
                </div>

                {/* Main Form Container */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Left Border Accent */}
                    <div className="flex">
                        <div className="w-1 bg-gradient-to-b from-[#0D9488] to-cyan-400"></div>
                        
                        <div className="flex-1 p-8">
                            <form onSubmit={submit} className="space-y-8">
                                {/* Personal Information Section */}
                                <div>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 bg-cyan-100 rounded-lg">
                                            <UserIcon className="w-5 h-5 text-[#0D9488]" />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6 mb-6">
                                        {/* First Name */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                First Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={data.first_name}
                                                onChange={(e) => setData('first_name', e.target.value)}
                                                placeholder="e.g. John"
                                                className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition ${
                                                    errors.first_name ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            />
                                            {errors.first_name && <p className="mt-1 text-sm text-red-500">{errors.first_name}</p>}
                                        </div>

                                        {/* Last Name */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Last Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={data.last_name}
                                                onChange={(e) => setData('last_name', e.target.value)}
                                                placeholder="e.g. Doe"
                                                className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition ${
                                                    errors.last_name ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            />
                                            {errors.last_name && <p className="mt-1 text-sm text-red-500">{errors.last_name}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        {/* Date of Birth */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Date of Birth *
                                            </label>
                                            <input
                                                type="date"
                                                value={data.date_of_birth}
                                                onChange={(e) => setData('date_of_birth', e.target.value)}
                                                className={`w-full px-4 py-3 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition ${
                                                    errors.date_of_birth ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            />
                                            {errors.date_of_birth && <p className="mt-1 text-sm text-red-500">{errors.date_of_birth}</p>}
                                        </div>

                                        {/* Gender */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Gender
                                            </label>
                                            <select
                                                value={data.gender}
                                                onChange={(e) => setData('gender', e.target.value)}
                                                className={`w-full px-4 py-3 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition ${
                                                    errors.gender ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                            {errors.gender && <p className="mt-1 text-sm text-red-500">{errors.gender}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6 mt-6">
                                        {/* Phone Number */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Phone Number *
                                            </label>
                                            <input
                                                type="tel"
                                                value={data.contact_number}
                                                onChange={(e) => setData('contact_number', e.target.value)}
                                                placeholder="(555) 123-4567"
                                                className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition ${
                                                    errors.contact_number ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            />
                                            {errors.contact_number && <p className="mt-1 text-sm text-red-500">{errors.contact_number}</p>}
                                        </div>

                                        {/* Email Address */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                placeholder="john.doe@example.com"
                                                className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition ${
                                                    errors.email ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            />
                                            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Address Details Section */}
                                <div>
                                    <div className="flex items-center gap-3 mb-6 pt-6 border-t border-gray-200">
                                        <div className="p-2 bg-cyan-100 rounded-lg">
                                            <MapPinIcon className="w-5 h-5 text-[#0D9488]" />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900">Address Details</h2>
                                    </div>

                                    {/* Street Address */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Street Address
                                        </label>
                                        <input
                                            type="text"
                                            value={data.street_address}
                                            onChange={(e) => setData('street_address', e.target.value)}
                                            placeholder="123 Main St, Apt 4B"
                                            className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition ${
                                                errors.street_address ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                        {errors.street_address && <p className="mt-1 text-sm text-red-500">{errors.street_address}</p>}
                                    </div>

                                    <div className="grid grid-cols-3 gap-6">
                                        {/* City */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                City
                                            </label>
                                            <input
                                                type="text"
                                                value={data.city}
                                                onChange={(e) => setData('city', e.target.value)}
                                                placeholder="City"
                                                className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition ${
                                                    errors.city ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            />
                                            {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
                                        </div>

                                        {/* State */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                State
                                            </label>
                                            <input
                                                type="text"
                                                value={data.state}
                                                onChange={(e) => setData('state', e.target.value)}
                                                placeholder="State"
                                                className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition ${
                                                    errors.state ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            />
                                            {errors.state && <p className="mt-1 text-sm text-red-500">{errors.state}</p>}
                                        </div>

                                        {/* Zip Code */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Zip Code
                                            </label>
                                            <input
                                                type="text"
                                                value={data.zip_code}
                                                onChange={(e) => setData('zip_code', e.target.value)}
                                                placeholder="Zip"
                                                className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition ${
                                                    errors.zip_code ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            />
                                            {errors.zip_code && <p className="mt-1 text-sm text-red-500">{errors.zip_code}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Medical & Emergency Info Section */}
                                <div>
                                    <div className="flex items-center gap-3 mb-6 pt-6 border-t border-gray-200">
                                        <div className="p-2 bg-cyan-100 rounded-lg">
                                            <AlertCircleIcon className="w-5 h-5 text-[#0D9488]" />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900">Medical & Emergency Info</h2>
                                    </div>

                                    {/* Medical Alerts */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Medical Alerts / Allergies
                                        </label>
                                        <textarea
                                            value={data.medical_alerts}
                                            onChange={(e) => setData('medical_alerts', e.target.value)}
                                            rows="4"
                                            placeholder="List any known allergies, chronic conditions, or medical alerts..."
                                            className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition ${
                                                errors.medical_alerts ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                        <p className="text-xs text-gray-500 mt-2">Separate multiple alerts with commas.</p>
                                        {errors.medical_alerts && <p className="mt-1 text-sm text-red-500">{errors.medical_alerts}</p>}
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        {/* Emergency Contact Name */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Emergency Contact Name
                                            </label>
                                            <input
                                                type="text"
                                                value={data.emergency_contact_name}
                                                onChange={(e) => setData('emergency_contact_name', e.target.value)}
                                                placeholder="Jane Doe"
                                                className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition ${
                                                    errors.emergency_contact_name ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            />
                                            {errors.emergency_contact_name && <p className="mt-1 text-sm text-red-500">{errors.emergency_contact_name}</p>}
                                        </div>

                                        {/* Emergency Contact Phone */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Emergency Contact Phone
                                            </label>
                                            <input
                                                type="tel"
                                                value={data.emergency_contact_phone}
                                                onChange={(e) => setData('emergency_contact_phone', e.target.value)}
                                                placeholder="(555) 987-6543"
                                                className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition ${
                                                    errors.emergency_contact_phone ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            />
                                            {errors.emergency_contact_phone && <p className="mt-1 text-sm text-red-500">{errors.emergency_contact_phone}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Form Actions */}
                                <div className="flex gap-4 pt-8 border-t border-gray-200">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex items-center gap-2 px-8 py-3 bg-[#0D9488] hover:bg-[#0A7A70] disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors"
                                    >
                                        <PhoneIcon className="w-5 h-5" />
                                        {processing ? 'Registering...' : 'Save Patient'}
                                    </button>
                                    <Link
                                        href="/staff/dashboard"
                                        className="px-8 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </StaffLayout>
    );
}
