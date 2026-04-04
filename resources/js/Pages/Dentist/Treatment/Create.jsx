import DentistLayout from '@/Layouts/DentistLayout'
import { useForm, Link } from '@inertiajs/react'
import { useState } from 'react'

export default function TreatmentCreate({ patients }) {
    const { data, setData, post, processing, errors } = useForm({
        patient_id: '',
        visit_date: new Date().toISOString().split('T')[0],
        procedures: [],
        prescription: '',
        notes: '',
        tooth_data: '',
    })

    const [selectedProcedures, setSelectedProcedures] = useState([])

    const procedureOptions = [
        'Extraction',
        'Filling',
        'Root Canal',
        'Crown',
        'Cleaning',
        'Whitening',
        'Scaling',
        'Polishing',
    ]

    const handleProcedureChange = (procedure) => {
        const updated = selectedProcedures.includes(procedure)
            ? selectedProcedures.filter(p => p !== procedure)
            : [...selectedProcedures, procedure]
        setSelectedProcedures(updated)
        setData('procedures', updated)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        post('/dentist/treatment', {
            onSuccess: () => {
                alert('Treatment record created successfully!')
            }
        })
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <h1 className="text-3xl font-bold text-[#E2FAF7]">Create Treatment Record</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-[#0E2C28] border border-[rgba(45,212,191,0.12)] rounded-lg p-6 space-y-6">
                {/* Patient Selection */}
                <div>
                    <label className="block text-[#7ABFB9] text-sm font-semibold mb-2">
                        Patient *
                    </label>
                    <select
                        value={data.patient_id}
                        onChange={(e) => setData('patient_id', e.target.value)}
                        className="w-full bg-[#0F2724] border border-[rgba(45,212,191,0.12)] rounded px-4 py-2 text-[#E2FAF7] focus:outline-none focus:border-[#0D9488]"
                        required
                    >
                        <option value="">Select a patient...</option>
                        {patients.map((patient) => (
                            <option key={patient.id} value={patient.id}>
                                {patient.full_name}
                            </option>
                        ))}
                    </select>
                    {errors.patient_id && <p className="text-red-400 text-sm mt-1">{errors.patient_id}</p>}
                </div>

                {/* Visit Date */}
                <div>
                    <label className="block text-[#7ABFB9] text-sm font-semibold mb-2">
                        Visit Date *
                    </label>
                    <input
                        type="date"
                        value={data.visit_date}
                        onChange={(e) => setData('visit_date', e.target.value)}
                        className="w-full bg-[#0F2724] border border-[rgba(45,212,191,0.12)] rounded px-4 py-2 text-[#E2FAF7] focus:outline-none focus:border-[#0D9488]"
                        required
                    />
                    {errors.visit_date && <p className="text-red-400 text-sm mt-1">{errors.visit_date}</p>}
                </div>

                {/* Procedures */}
                <div>
                    <label className="block text-[#7ABFB9] text-sm font-semibold mb-3">
                        Procedures *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {procedureOptions.map((procedure) => (
                            <label key={procedure} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedProcedures.includes(procedure)}
                                    onChange={() => handleProcedureChange(procedure)}
                                    className="w-4 h-4 rounded text-[#0D9488]"
                                />
                                <span className="text-[#E2FAF7]">{procedure}</span>
                            </label>
                        ))}
                    </div>
                    {errors.procedures && <p className="text-red-400 text-sm mt-1">{errors.procedures}</p>}
                </div>

                {/* Prescription */}
                <div>
                    <label className="block text-[#7ABFB9] text-sm font-semibold mb-2">
                        Prescription
                    </label>
                    <textarea
                        value={data.prescription}
                        onChange={(e) => setData('prescription', e.target.value)}
                        placeholder="Enter prescription details..."
                        className="w-full bg-[#0F2724] border border-[rgba(45,212,191,0.12)] rounded px-4 py-2 text-[#E2FAF7] focus:outline-none focus:border-[#0D9488] h-24"
                    />
                    {errors.prescription && <p className="text-red-400 text-sm mt-1">{errors.prescription}</p>}
                </div>

                {/* Notes */}
                <div>
                    <label className="block text-[#7ABFB9] text-sm font-semibold mb-2">
                        Notes
                    </label>
                    <textarea
                        value={data.notes}
                        onChange={(e) => setData('notes', e.target.value)}
                        placeholder="Enter treatment notes..."
                        className="w-full bg-[#0F2724] border border-[rgba(45,212,191,0.12)] rounded px-4 py-2 text-[#E2FAF7] focus:outline-none focus:border-[#0D9488] h-24"
                    />
                    {errors.notes && <p className="text-red-400 text-sm mt-1">{errors.notes}</p>}
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-6 py-2 bg-[#0D9488] text-white rounded hover:bg-[#0A7A73] disabled:opacity-50"
                    >
                        {processing ? 'Saving...' : 'Save Treatment Record'}
                    </button>
                    <Link
                        href="/dentist/patients"
                        className="px-6 py-2 bg-[#0F2724] text-[#7ABFB9] rounded hover:bg-[#0E2C28] inline-block"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    )
}

TreatmentCreate.layout = (page) => <DentistLayout>{page}</DentistLayout>
