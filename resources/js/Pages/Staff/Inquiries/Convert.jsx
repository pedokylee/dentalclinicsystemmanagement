import FormField from '@/Components/FormField'
import PrimaryButton from '@/Components/PrimaryButton'
import SecondaryButton from '@/Components/SecondaryButton'
import StaffLayout from '@/Layouts/StaffLayout'
import { Link, useForm } from '@inertiajs/react'
import { AlertCircleIcon, CheckCircle2, KeyRoundIcon, MailIcon, UserIcon } from 'lucide-react'

export default function Convert({ inquiry, defaults, matchedPatient, hasPortalAccount }) {
    const { data, setData, post, processing, errors } = useForm({
        first_name: defaults.first_name ?? '',
        last_name: defaults.last_name ?? '',
        email: defaults.email ?? '',
        date_of_birth: defaults.date_of_birth ?? '',
        gender: defaults.gender ?? '',
        contact_number: defaults.contact_number ?? '',
        street_address: defaults.street_address ?? '',
        city: defaults.city ?? '',
        state: defaults.state ?? '',
        zip_code: defaults.zip_code ?? '',
        medical_alerts: defaults.medical_alerts ?? '',
        emergency_contact_name: defaults.emergency_contact_name ?? '',
        emergency_contact_phone: defaults.emergency_contact_phone ?? '',
        temporary_password: '',
        temporary_password_confirmation: '',
    })

    const submit = (event) => {
        event.preventDefault()
        post(`/staff/inquiries/${inquiry.id}/convert`)
    }

    return (
        <div className="dcms-page">
            <div className="dcms-page-header">
                <div>
                    <h1 className="dcms-page-title">Convert Inquiry to Patient</h1>
                    <p className="dcms-page-subtitle">Review the submitted details, complete the intake information, and create the official patient record.</p>
                </div>
                <Link href="/staff/inquiries" className="dcms-btn-secondary">Back to Inquiries</Link>
            </div>

            <div className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
                <section className="dcms-card">
                    <div className="dcms-card-body space-y-5">
                        <div className="flex items-center gap-3">
                            <div className="dcms-icon-badge h-10 w-10"><MailIcon className="h-4 w-4" /></div>
                            <div>
                                <h2 className="text-xl">Inquiry Summary</h2>
                                <p className="text-sm text-[var(--dcms-text-soft)]">Submitted from the landing page.</p>
                            </div>
                        </div>

                        <div className="space-y-4 text-sm">
                            <div>
                                <p className="text-[var(--dcms-text-soft)]">Full name</p>
                                <p className="font-semibold text-[var(--dcms-text)]">{inquiry.full_name}</p>
                            </div>
                            <div>
                                <p className="text-[var(--dcms-text-soft)]">Email</p>
                                <p className="font-semibold text-[var(--dcms-text)]">{inquiry.email}</p>
                            </div>
                            <div>
                                <p className="text-[var(--dcms-text-soft)]">Phone</p>
                                <p className="font-semibold text-[var(--dcms-text)]">{inquiry.phone}</p>
                            </div>
                            <div>
                                <p className="text-[var(--dcms-text-soft)]">Preferred date</p>
                                <p className="font-semibold text-[var(--dcms-text)]">{inquiry.preferred_date ? new Date(inquiry.preferred_date).toLocaleDateString() : 'No preferred date given'}</p>
                            </div>
                            <div>
                                <p className="text-[var(--dcms-text-soft)]">Appointment type</p>
                                <p className="font-semibold text-[var(--dcms-text)]">{inquiry.appointment_type || 'General inquiry'}</p>
                            </div>
                            <div>
                                <p className="text-[var(--dcms-text-soft)]">Concern</p>
                                <p className="font-semibold text-[var(--dcms-text)]">{inquiry.concern || 'No additional concern provided.'}</p>
                            </div>
                        </div>

                        {matchedPatient ? (
                            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-900">
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
                                    <p>An existing patient profile is already linked to this inquiry email. Saving this form will update that patient record instead of creating a duplicate.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900">
                                <div className="flex items-start gap-3">
                                    <AlertCircleIcon className="mt-0.5 h-5 w-5 text-amber-600" />
                                    <p>A new patient portal account will be created when you convert this inquiry.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="flex">
                        <div className="w-1 bg-gradient-to-b from-brand-primary to-cyan-400"></div>
                        <div className="flex-1 p-8">
                            <form onSubmit={submit} className="space-y-8">
                                <div>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 bg-cyan-100 rounded-lg">
                                            <UserIcon className="w-5 h-5 text-brand-primary" />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900">Patient Intake Details</h2>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6 mb-6">
                                        <FormField label="First Name" value={data.first_name} onChange={(event) => setData('first_name', event.target.value)} error={errors.first_name} required />
                                        <FormField label="Last Name" value={data.last_name} onChange={(event) => setData('last_name', event.target.value)} error={errors.last_name} required />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6 mb-6">
                                        <FormField label="Date of Birth" type="date" value={data.date_of_birth} onChange={(event) => setData('date_of_birth', event.target.value)} error={errors.date_of_birth} required />
                                        <FormField label="Gender" as="select" value={data.gender} onChange={(event) => setData('gender', event.target.value)} error={errors.gender} required>
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </FormField>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <FormField label="Phone Number" value={data.contact_number} onChange={(event) => setData('contact_number', event.target.value)} error={errors.contact_number} required />
                                        <FormField label="Email Address" type="email" value={data.email} onChange={(event) => setData('email', event.target.value)} error={errors.email} required />
                                    </div>
                                </div>

                                <div>
                                    <div className="mb-6 pt-6 border-t border-gray-200">
                                        <h2 className="text-xl font-bold text-gray-900">Address Details</h2>
                                    </div>
                                    <div className="mb-6">
                                        <FormField label="Street Address" value={data.street_address} onChange={(event) => setData('street_address', event.target.value)} error={errors.street_address} />
                                    </div>
                                    <div className="grid grid-cols-3 gap-6">
                                        <FormField label="City" value={data.city} onChange={(event) => setData('city', event.target.value)} error={errors.city} />
                                        <FormField label="State" value={data.state} onChange={(event) => setData('state', event.target.value)} error={errors.state} />
                                        <FormField label="Zip Code" value={data.zip_code} onChange={(event) => setData('zip_code', event.target.value)} error={errors.zip_code} />
                                    </div>
                                </div>

                                <div>
                                    <div className="mb-6 pt-6 border-t border-gray-200">
                                        <h2 className="text-xl font-bold text-gray-900">Medical & Emergency Info</h2>
                                    </div>
                                    <div className="mb-6">
                                        <FormField label="Medical Alerts / Allergies" as="textarea" value={data.medical_alerts} onChange={(event) => setData('medical_alerts', event.target.value)} error={errors.medical_alerts} rows={4} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <FormField label="Emergency Contact Name" value={data.emergency_contact_name} onChange={(event) => setData('emergency_contact_name', event.target.value)} error={errors.emergency_contact_name} />
                                        <FormField label="Emergency Contact Phone" value={data.emergency_contact_phone} onChange={(event) => setData('emergency_contact_phone', event.target.value)} error={errors.emergency_contact_phone} />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center gap-3 mb-6 pt-6 border-t border-gray-200">
                                        <div className="p-2 bg-cyan-100 rounded-lg">
                                            <KeyRoundIcon className="w-5 h-5 text-brand-primary" />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900">Portal Access</h2>
                                    </div>

                                    <p className="mb-4 text-sm text-gray-600">
                                        {hasPortalAccount
                                            ? 'This patient already has a portal account. Leave these fields blank to keep the current password, or enter a new temporary password to reset it.'
                                            : 'Set the first temporary password for this patient portal account so the patient can log in after conversion.'}
                                    </p>

                                    <div className="grid grid-cols-2 gap-6">
                                        <FormField
                                            label={hasPortalAccount ? 'New Temporary Password' : 'Temporary Password'}
                                            type="password"
                                            value={data.temporary_password}
                                            onChange={(event) => setData('temporary_password', event.target.value)}
                                            error={errors.temporary_password}
                                            required={!hasPortalAccount}
                                        />
                                        <FormField
                                            label="Confirm Temporary Password"
                                            type="password"
                                            value={data.temporary_password_confirmation}
                                            onChange={(event) => setData('temporary_password_confirmation', event.target.value)}
                                            error={errors.temporary_password_confirmation}
                                            required={!hasPortalAccount}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-8 border-t border-gray-200">
                                    <PrimaryButton disabled={processing}>
                                        {processing ? 'Converting...' : 'Convert to Patient'}
                                    </PrimaryButton>
                                    <Link href="/staff/inquiries" className="inline-block">
                                        <SecondaryButton type="button">Cancel</SecondaryButton>
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

Convert.layout = (page) => <StaffLayout>{page}</StaffLayout>
