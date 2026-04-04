import DentistLayout from '@/Layouts/DentistLayout'
import { Link } from '@inertiajs/react'

export default function PatientShow({ patient, treatmentHistory }) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dentist/patients" className="text-[#0D9488] hover:text-[#14B8A6]">
                    ← Back to Patients
                </Link>
            </div>

            <div className="bg-[#0E2C28] border border-[rgba(45,212,191,0.12)] rounded-lg p-6">
                <h1 className="text-3xl font-bold text-[#E2FAF7] mb-4">{patient.full_name}</h1>
                
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <p className="text-[#7ABFB9] text-sm">Date of Birth</p>
                        <p className="text-[#E2FAF7] font-semibold">{patient.date_of_birth}</p>
                    </div>
                    <div>
                        <p className="text-[#7ABFB9] text-sm">Gender</p>
                        <p className="text-[#E2FAF7] font-semibold capitalize">{patient.gender}</p>
                    </div>
                    <div>
                        <p className="text-[#7ABFB9] text-sm">Contact</p>
                        <p className="text-[#E2FAF7] font-semibold">{patient.phone}</p>
                    </div>
                    <div>
                        <p className="text-[#7ABFB9] text-sm">Email</p>
                        <p className="text-[#E2FAF7] font-semibold">{patient.email}</p>
                    </div>
                    <div className="col-span-2">
                        <p className="text-[#7ABFB9] text-sm">Address</p>
                        <p className="text-[#E2FAF7] font-semibold">{patient.address}</p>
                    </div>
                    {patient.medical_alerts && (
                        <div className="col-span-2">
                            <p className="text-[#7ABFB9] text-sm">Medical Alerts</p>
                            <p className="text-red-400 font-semibold bg-red-900 bg-opacity-20 p-3 rounded">
                                ⚠️ {patient.medical_alerts}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-[#0E2C28] border border-[rgba(45,212,191,0.12)] rounded-lg p-6">
                <h2 className="text-2xl font-bold text-[#E2FAF7] mb-4">Treatment History</h2>
                
                {treatmentHistory && treatmentHistory.length > 0 ? (
                    <div className="space-y-4">
                        {treatmentHistory.map((record) => (
                            <div key={record.id} className="bg-[#0F2724] border border-[rgba(45,212,191,0.12)] rounded p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <p className="text-[#0D9488] font-semibold">{record.visit_date}</p>
                                    <span className="text-xs text-[#7ABFB9]">ID: {record.id}</span>
                                </div>
                                <p className="text-[#E2FAF7]">
                                    <strong>Procedures:</strong> {Array.isArray(record.procedures) ? record.procedures.join(', ') : record.procedures}
                                </p>
                                {record.prescription && (
                                    <p className="text-[#E2FAF7] text-sm mt-2">
                                        <strong>Prescription:</strong> {record.prescription}
                                    </p>
                                )}
                                {record.notes && (
                                    <p className="text-[#7ABFB9] text-sm mt-2">
                                        <strong>Notes:</strong> {record.notes}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-[#7ABFB9]">No treatment records found for this patient.</p>
                )}
            </div>
        </div>
    )
}

PatientShow.layout = (page) => <DentistLayout>{page}</DentistLayout>
