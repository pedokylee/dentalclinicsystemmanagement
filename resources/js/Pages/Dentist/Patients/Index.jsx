import DentistLayout from '@/Layouts/DentistLayout'
import { Link } from '@inertiajs/react'

export default function PatientsIndex({ patients }) {
    return (
        <div className="dcms-page">
            <div className="dcms-page-header">
                <div>
                    <h1 className="dcms-page-title">My Patients</h1>
                    <p className="dcms-page-subtitle">Only patients assigned to your care are visible here.</p>
                </div>
                <div className="flex gap-3">
                    <a href={route('dentist.patients.export-pdf')} className="dcms-btn-gold">Export PDF</a>
                    <a href={route('dentist.patients.export-excel')} className="dcms-btn-secondary">Export Excel</a>
                </div>
            </div>

            <section className="dcms-card">
                <div className="overflow-x-auto">
                    <table className="dcms-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Age</th>
                                <th>Last Visit</th>
                                <th>Medical Alerts</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patients.data.map((patient) => (
                                <tr key={patient.id}>
                                    <td className="font-semibold">{patient.full_name}</td>
                                    <td>{patient.age}</td>
                                    <td>{patient.updated_at ? new Date(patient.updated_at).toLocaleDateString() : 'N/A'}</td>
                                    <td>
                                        {patient.medical_alerts ? <span className="dcms-chip-gold">{patient.medical_alerts}</span> : <span className="dcms-chip-slate">None</span>}
                                    </td>
                                    <td>
                                        <div className="flex gap-3">
                                            <Link href={`/dentist/patients/${patient.id}`} className="text-sm font-semibold text-[var(--dcms-primary)]">View Profile</Link>
                                            <Link href={`/dentist/treatment/create?patient_id=${patient.id}`} className="text-sm font-semibold text-[var(--dcms-gold)] italic">Add Treatment</Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    )
}

PatientsIndex.layout = (page) => <DentistLayout>{page}</DentistLayout>
