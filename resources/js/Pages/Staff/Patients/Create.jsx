import { useForm } from '@inertiajs/react';
import StaffLayout from '@/Layouts/StaffLayout';
import { Link } from '@inertiajs/react';
import { UserIcon, MapPinIcon, AlertCircleIcon, PhoneIcon } from 'lucide-react';
import PrimaryButton from '@/Components/PrimaryButton'
import SecondaryButton from '@/Components/SecondaryButton'
import FormField from '@/Components/FormField'

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
                        <div className="w-1 bg-gradient-to-b from-brand-primary to-cyan-400"></div>
                        
                        <div className="flex-1 p-8">
                            <form onSubmit={submit} className="space-y-8">
                                {/* Personal Information Section */}
                                <div>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 bg-cyan-100 rounded-lg">
                                            <UserIcon className="w-5 h-5 text-brand-primary" />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6 mb-6">
                                        <FormField
                                            label="First Name"
                                            placeholder="e.g. John"
                                            value={data.first_name}
                                            onChange={(e) => setData('first_name', e.target.value)}
                                            error={errors.first_name}
                                            required
                                        />
                                        <FormField
                                            label="Last Name"
                                            placeholder="e.g. Doe"
                                            value={data.last_name}
                                            onChange={(e) => setData('last_name', e.target.value)}
                                            error={errors.last_name}
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6 mb-6">
                                        <FormField
                                            label="Date of Birth"
                                            type="date"
                                            value={data.date_of_birth}
                                            onChange={(e) => setData('date_of_birth', e.target.value)}
                                            error={errors.date_of_birth}
                                            required
                                        />
                                        <FormField
                                            label="Gender"
                                            as="select"
                                            value={data.gender}
                                            onChange={(e) => setData('gender', e.target.value)}
                                            error={errors.gender}
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </FormField>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <FormField
                                            label="Phone Number"
                                            type="tel"
                                            placeholder="(555) 123-4567"
                                            value={data.contact_number}
                                            onChange={(e) => setData('contact_number', e.target.value)}
                                            error={errors.contact_number}
                                            required
                                        />
                                        <FormField
                                            label="Email Address"
                                            type="email"
                                            placeholder="john.doe@example.com"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            error={errors.email}
                                        />
                                    </div>
                                </div>

                                {/* Address Details Section */}
                                <div>
                                    <div className="flex items-center gap-3 mb-6 pt-6 border-t border-gray-200">
                                        <div className="p-2 bg-cyan-100 rounded-lg">
                                            <MapPinIcon className="w-5 h-5 text-brand-primary" />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900">Address Details</h2>
                                    </div>

                                    <div className="mb-6">
                                        <FormField
                                            label="Street Address"
                                            placeholder="123 Main St, Apt 4B"
                                            value={data.street_address}
                                            onChange={(e) => setData('street_address', e.target.value)}
                                            error={errors.street_address}
                                        />
                                    </div>

                                    <div className="grid grid-cols-3 gap-6">
                                        <FormField
                                            label="City"
                                            placeholder="City"
                                            value={data.city}
                                            onChange={(e) => setData('city', e.target.value)}
                                            error={errors.city}
                                        />
                                        <FormField
                                            label="State"
                                            placeholder="State"
                                            value={data.state}
                                            onChange={(e) => setData('state', e.target.value)}
                                            error={errors.state}
                                        />
                                        <FormField
                                            label="Zip Code"
                                            placeholder="Zip"
                                            value={data.zip_code}
                                            onChange={(e) => setData('zip_code', e.target.value)}
                                            error={errors.zip_code}
                                        />
                                    </div>
                                </div>

                                {/* Medical & Emergency Info Section */}
                                <div>
                                    <div className="flex items-center gap-3 mb-6 pt-6 border-t border-gray-200">
                                        <div className="p-2 bg-cyan-100 rounded-lg">
                                            <AlertCircleIcon className="w-5 h-5 text-brand-primary" />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900">Medical & Emergency Info</h2>
                                    </div>

                                    <div className="mb-6">
                                        <FormField
                                            label="Medical Alerts / Allergies"
                                            as="textarea"
                                            placeholder="List any known allergies, chronic conditions, or medical alerts..."
                                            value={data.medical_alerts}
                                            onChange={(e) => setData('medical_alerts', e.target.value)}
                                            error={errors.medical_alerts}
                                            rows={4}
                                        />
                                        <p className="text-xs text-gray-500 mt-2">Separate multiple alerts with commas.</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <FormField
                                            label="Emergency Contact Name"
                                            placeholder="Jane Doe"
                                            value={data.emergency_contact_name}
                                            onChange={(e) => setData('emergency_contact_name', e.target.value)}
                                            error={errors.emergency_contact_name}
                                        />
                                        <FormField
                                            label="Emergency Contact Phone"
                                            type="tel"
                                            placeholder="(555) 987-6543"
                                            value={data.emergency_contact_phone}
                                            onChange={(e) => setData('emergency_contact_phone', e.target.value)}
                                            error={errors.emergency_contact_phone}
                                        />
                                    </div>
                                </div>

                                {/* Form Actions */}
                                <div className="flex gap-4 pt-8 border-t border-gray-200">
                                    <PrimaryButton disabled={processing}>
                                        <PhoneIcon className="w-5 h-5" />
                                        {processing ? 'Registering...' : 'Save Patient'}
                                    </PrimaryButton>
                                    <Link href="/staff/dashboard" className="inline-block">
                                        <SecondaryButton type="button">
                                            Cancel
                                        </SecondaryButton>
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
