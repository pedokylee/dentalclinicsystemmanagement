import PatientLayout from '@/Layouts/PatientLayout'

export default function HistoryIndex({ records }) {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-[#E2FAF7]">Treatment History</h1>

            <div className="space-y-4">
                {records.data.length === 0 ? (
                    <div className="text-center py-8 text-[#7ABFB9]">No treatment records available</div>
                ) : (
                    records.data.map((record) => (
                        <div key={record.id} className="bg-[#0E2C28] border border-[rgba(45,212,191,0.12)] p-6 rounded">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="font-bold text-[#E2FAF7]">{record.visit_date}</p>
                                    <p className="text-[#7ABFB9]">Dr. {record.dentist.user.name}</p>
                                </div>
                                <button className="px-4 py-2 bg-[#0D9488] text-white rounded hover:bg-[#14B8A6]">
                                    Download PDF
                                </button>
                            </div>
                            {record.procedures && (
                                <div className="mb-3">
                                    <p className="text-sm text-[#0D9488] mb-2">Procedures:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {record.procedures.map((proc, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-[#0D9488] bg-opacity-20 text-[#0D9488] rounded text-sm">
                                                {proc}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {record.notes && <p className="text-sm text-[#7ABFB9]">{record.notes}</p>}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

HistoryIndex.layout = (page) => <PatientLayout>{page}</PatientLayout>
