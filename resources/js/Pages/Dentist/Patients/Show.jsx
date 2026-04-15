import DentistLayout from '@/Layouts/DentistLayout'
import { Link } from '@inertiajs/react'
import { useState } from 'react'

const tabs = ['Dental History', 'X-Rays', 'Treatment Records', 'Prescriptions']

export default function PatientShow({ patient, treatmentHistory = [], appointments = [], xrays = [], prescriptions = [] }) {
    const [activeTab, setActiveTab] = useState('Dental History')

    return (
        <div className="dcms-page">
            <div className="flex items-center justify-between">
                <div>
                    <Link href="/dentist/patients" className="text-sm font-semibold text-[var(--dcms-primary)]">Back to Patients</Link>
                    <h1 className="mt-2 text-3xl">{patient.full_name}</h1>
                    <p className="text-sm text-[var(--dcms-text-soft)]">Age {patient.age} - {patient.gender ?? 'Not set'}</p>
                </div>
                <Link href={`/dentist/treatment/create?patient_id=${patient.id}`} className="dcms-btn-primary">Add Treatment</Link>
            </div>

            <section className="dcms-card">
                <div className="dcms-card-body">
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <div className="dcms-card-muted">
                            <p className="text-xs uppercase tracking-[0.18em] text-[var(--dcms-text-soft)]">Contact</p>
                            <p className="mt-2 font-semibold">{patient.phone || patient.contact_number || 'N/A'}</p>
                        </div>
                        <div className="dcms-card-muted">
                            <p className="text-xs uppercase tracking-[0.18em] text-[var(--dcms-text-soft)]">Email</p>
                            <p className="mt-2 font-semibold">{patient.email || 'N/A'}</p>
                        </div>
                        <div className="dcms-card-muted">
                            <p className="text-xs uppercase tracking-[0.18em] text-[var(--dcms-text-soft)]">Address</p>
                            <p className="mt-2 font-semibold">{patient.address || 'N/A'}</p>
                        </div>
                        <div className="dcms-card-muted">
                            <p className="text-xs uppercase tracking-[0.18em] text-[var(--dcms-text-soft)]">Medical Alerts</p>
                            <p className="mt-2 font-semibold text-amber-700">{patient.medical_alerts || 'None'}</p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`dcms-tab ${activeTab === tab ? 'dcms-tab-active' : 'dcms-tab-idle'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {activeTab === 'Dental History' && (
                <section className="dcms-card">
                    <div className="dcms-card-body">
                        <h2 className="mb-4 text-xl">Dental History</h2>
                        <div className="overflow-x-auto">
                            <table className="dcms-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Dentist</th>
                                        <th>Type</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments.map((appointment) => (
                                        <tr key={appointment.id}>
                                            <td>{appointment.appointment_date}</td>
                                            <td>{appointment.dentist?.user?.name ?? 'Assigned dentist'}</td>
                                            <td>{appointment.type}</td>
                                            <td><span className="dcms-chip-teal">{appointment.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            )}

            {activeTab === 'X-Rays' && (
                <section className="dcms-card">
                    <div className="dcms-card-body">
                        <h2 className="mb-4 text-xl">X-Rays</h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            {xrays.length > 0 ? xrays.map((file) => (
                                <a key={file.id} href={file.download_url} className="dcms-card-muted block font-semibold text-[var(--dcms-primary)]">
                                    {file.original_name}
                                </a>
                            )) : <p className="text-[var(--dcms-text-soft)]">No x-ray uploads yet.</p>}
                        </div>
                    </div>
                </section>
            )}

            {activeTab === 'Treatment Records' && (
                <section className="dcms-card">
                    <div className="dcms-card-body space-y-4">
                        {treatmentHistory.length > 0 ? treatmentHistory.map((record) => (
                            <div key={record.id} className="dcms-card-muted">
                                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                    <div>
                                        <p className="font-semibold">{record.visit_date}</p>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {(record.procedures || []).map((procedure) => (
                                                <span key={procedure} className="dcms-chip-teal">{procedure}</span>
                                            ))}
                                        </div>
                                        <p className="mt-3 text-sm text-[var(--dcms-text-soft)]">{record.notes || 'No notes recorded.'}</p>
                                    </div>
                                    <a href={route('dentist.treatment.export-pdf', record.id)} className="dcms-btn-secondary">Export PDF</a>
                                </div>
                            </div>
                        )) : <p className="text-[var(--dcms-text-soft)]">No treatment records yet.</p>}
                    </div>
                </section>
            )}

            {activeTab === 'Prescriptions' && (
                <section className="dcms-card">
                    <div className="dcms-card-body space-y-4">
                        {prescriptions.length > 0 ? prescriptions.map((record) => (
                            <div key={record.id} className="dcms-card-muted">
                                <p className="font-semibold">{record.visit_date}</p>
                                <p className="mt-2 whitespace-pre-wrap text-sm text-[var(--dcms-text-soft)]">{record.prescription}</p>
                            </div>
                        )) : <p className="text-[var(--dcms-text-soft)]">No prescriptions issued yet.</p>}
                    </div>
                </section>
            )}
        </div>
    )
}

PatientShow.layout = (page) => <DentistLayout>{page}</DentistLayout>
