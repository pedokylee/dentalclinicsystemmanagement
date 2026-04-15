import DentistLayout from '@/Layouts/DentistLayout'
import { Link, useForm } from '@inertiajs/react'
import { ImagePlus, Upload } from 'lucide-react'
import { useMemo, useState } from 'react'

const CONDITIONS = [
    { key: 'healthy', label: 'Healthy', color: 'bg-emerald-100 text-emerald-700' },
    { key: 'cavity', label: 'Cavity', color: 'bg-amber-100 text-amber-700' },
    { key: 'filled', label: 'Filled', color: 'bg-sky-100 text-sky-700' },
    { key: 'missing', label: 'Missing', color: 'bg-rose-100 text-rose-700' },
]

export default function TreatmentCreate({ patients, procedureOptions = [] }) {
    const defaultPatientId = useMemo(() => new URLSearchParams(window.location.search).get('patient_id') ?? '', [])
    const [selectedCondition, setSelectedCondition] = useState('healthy')
    const [selectedProcedures, setSelectedProcedures] = useState([])
    const [toothMap, setToothMap] = useState({})

    const { data, setData, post, processing, errors } = useForm({
        patient_id: defaultPatientId,
        visit_date: new Date().toISOString().split('T')[0],
        procedures: [],
        notes: '',
        prescription: '',
        tooth_data: {},
        xrays: [],
        procedure_photos: [],
    })

    const updateTooth = (toothNumber) => {
        const next = {
            ...toothMap,
            [toothNumber]: {
                condition: selectedCondition,
            },
        }
        setToothMap(next)
        setData('tooth_data', next)
    }

    const toggleProcedure = (procedure) => {
        const next = selectedProcedures.includes(procedure)
            ? selectedProcedures.filter((value) => value !== procedure)
            : [...selectedProcedures, procedure]

        setSelectedProcedures(next)
        setData('procedures', next)
    }

    const submit = (event) => {
        event.preventDefault()
        post('/dentist/treatment', { forceFormData: true })
    }

    const toothNumbers = Array.from({ length: 32 }, (_, index) => index + 1)

    return (
        <div className="dcms-page">
            <div className="dcms-page-header">
                <div>
                    <h1 className="dcms-page-title">Treatment Record Entry</h1>
                    <p className="dcms-page-subtitle">Capture an odontogram, add visit notes, upload evidence, and save prescriptions in one record.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={submit} disabled={processing} className="dcms-btn-primary">{processing ? 'Saving...' : 'Save Record'}</button>
                    <Link href="/dentist/patients" className="dcms-btn-secondary">Back to Patients</Link>
                </div>
            </div>

            <form onSubmit={submit} className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <section className="space-y-6">
                    <div className="dcms-card">
                        <div className="dcms-card-body grid gap-4 md:grid-cols-2">
                            <div className="md:col-span-2">
                                <label className="dcms-label">Patient</label>
                                <select className="dcms-select" value={data.patient_id} onChange={(event) => setData('patient_id', event.target.value)}>
                                    <option value="">Select patient</option>
                                    {patients.map((patient) => (
                                        <option key={patient.id} value={patient.id}>{patient.full_name}</option>
                                    ))}
                                </select>
                                {errors.patient_id && <p className="mt-1 text-sm text-red-500">{errors.patient_id}</p>}
                            </div>
                            <div>
                                <label className="dcms-label">Visit Date</label>
                                <input type="date" className="dcms-input" value={data.visit_date} onChange={(event) => setData('visit_date', event.target.value)} />
                            </div>
                        </div>
                    </div>

                    <div className="dcms-card">
                        <div className="dcms-card-body">
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl">Digital Odontogram</h2>
                                    <p className="text-sm text-[var(--dcms-text-soft)]">Select a condition, then click teeth to apply it.</p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {CONDITIONS.map((condition) => (
                                        <button
                                            key={condition.key}
                                            type="button"
                                            onClick={() => setSelectedCondition(condition.key)}
                                            className={`rounded-full px-3 py-2 text-xs font-semibold ${condition.color} ${selectedCondition === condition.key ? 'ring-2 ring-[var(--dcms-primary)] ring-offset-2' : ''}`}
                                        >
                                            {condition.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid gap-3 md:grid-cols-8">
                                {toothNumbers.map((tooth) => {
                                    const state = toothMap[tooth]?.condition ?? 'healthy'
                                    const palette = CONDITIONS.find((condition) => condition.key === state)
                                    return (
                                        <button
                                            key={tooth}
                                            type="button"
                                            onClick={() => updateTooth(tooth)}
                                            className={`rounded-2xl border border-[var(--dcms-border)] px-3 py-4 text-center text-sm font-semibold transition hover:border-[var(--dcms-primary)] ${palette?.color}`}
                                        >
                                            {tooth}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="dcms-card">
                        <div className="dcms-card-body space-y-5">
                            <div>
                                <label className="dcms-label">Procedure Tags</label>
                                <div className="flex flex-wrap gap-2">
                                    {procedureOptions.map((procedure) => (
                                        <button
                                            key={procedure}
                                            type="button"
                                            onClick={() => toggleProcedure(procedure)}
                                            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                                                selectedProcedures.includes(procedure)
                                                    ? 'bg-[var(--dcms-primary)] text-white'
                                                    : 'bg-[var(--dcms-surface)] text-[var(--dcms-text-soft)] hover:bg-[var(--dcms-surface-strong)]'
                                            }`}
                                        >
                                            {procedure.replace(/_/g, ' ')}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="dcms-label">Treatment Notes</label>
                                <textarea className="dcms-textarea" value={data.notes} onChange={(event) => setData('notes', event.target.value)} placeholder="Document observations, completed procedures, and follow-up instructions." />
                            </div>

                            <div>
                                <label className="dcms-label">Prescription</label>
                                <textarea className="dcms-textarea" value={data.prescription} onChange={(event) => setData('prescription', event.target.value)} placeholder="Medicine, dosage, and instructions." />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="space-y-6">
                    <div className="dcms-card">
                        <div className="dcms-card-body space-y-5">
                            <div>
                                <h2 className="text-xl">Attachment Uploads</h2>
                                <p className="text-sm text-[var(--dcms-text-soft)]">Attach x-rays and procedure photos to the treatment record.</p>
                            </div>

                            <label className="dcms-card-muted block cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="dcms-icon-badge h-10 w-10"><Upload className="h-4 w-4" /></div>
                                    <div>
                                        <p className="font-semibold">Upload X-Rays</p>
                                        <p className="text-sm text-[var(--dcms-text-soft)]">PNG, JPG, or PDF up to 5MB each.</p>
                                    </div>
                                </div>
                                <input type="file" multiple className="hidden" onChange={(event) => setData('xrays', Array.from(event.target.files || []))} />
                            </label>

                            <label className="dcms-card-muted block cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="dcms-icon-badge h-10 w-10"><ImagePlus className="h-4 w-4" /></div>
                                    <div>
                                        <p className="font-semibold">Upload Procedure Photos</p>
                                        <p className="text-sm text-[var(--dcms-text-soft)]">Store before-and-after or chairside images.</p>
                                    </div>
                                </div>
                                <input type="file" accept="image/*" multiple className="hidden" onChange={(event) => setData('procedure_photos', Array.from(event.target.files || []))} />
                            </label>

                            <div className="dcms-callout-gold">
                                <p className="font-semibold text-amber-900">Export after save</p>
                                <p className="mt-1 text-sm text-amber-800">PDF export becomes available from the patient profile once the record has been created.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </form>
        </div>
    )
}

TreatmentCreate.layout = (page) => <DentistLayout>{page}</DentistLayout>
