import DentistLayout from '@/Layouts/DentistLayout'

export default function PatientsIndex({ patients }) {
    const handleExportPdf = () => {
        window.location.href = route('dentist.patients.export-pdf')
    }

    const handleExportExcel = () => {
        window.location.href = route('dentist.patients.export-excel')
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-[#E2FAF7]">My Patients</h1>
                <div className="flex gap-2">
                    <button 
                        onClick={handleExportPdf}
                        className="px-4 py-2 bg-[#0D9488] text-white rounded hover:bg-[#14B8A6] transition-colors text-sm"
                    >
                        Export PDF
                    </button>
                    <button 
                        onClick={handleExportExcel}
                        className="px-4 py-2 bg-[#F59E0B] text-white rounded hover:bg-opacity-80 transition-colors text-sm"
                    >
                        Export Excel
                    </button>
                </div>
            </div>

            <div className="bg-[#0E2C28] border border-[rgba(45,212,191,0.12)] rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-[#0F2724] border-b border-[rgba(45,212,191,0.12)]">
                        <tr>
                            <th className="px-6 py-3 text-left text-[#0D9488]">Name</th>
                            <th className="px-6 py-3 text-left text-[#0D9488]">Age</th>
                            <th className="px-6 py-3 text-left text-[#0D9488]">Contact</th>
                            <th className="px-6 py-3 text-left text-[#0D9488]">Medical Alerts</th>
                            <th className="px-6 py-3 text-left text-[#0D9488]">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.data.map((patient) => (
                            <tr key={patient.id} className="border-b hover:bg-[#0F2724] text-[#E2FAF7]">
                                <td className="px-6 py-3">{patient.full_name}</td>
                                <td className="px-6 py-3">{patient.age}</td>
                                <td className="px-6 py-3">{patient.contact_number}</td>
                                <td className="px-6 py-3">
                                    {patient.medical_alerts && (
                                        <span className="px-3 py-1 bg-red-600 text-white rounded text-xs">
                                            {patient.medical_alerts}
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-3">
                                    <a href={`/dentist/patients/${patient.id}`} className="text-[#0D9488] hover:text-[#14B8A6]">
                                        View
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

PatientsIndex.layout = (page) => <DentistLayout>{page}</DentistLayout>
