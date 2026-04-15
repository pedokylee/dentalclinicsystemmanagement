import PatientLayout from '@/Layouts/PatientLayout'

export default function HistoryIndex({ records }) {
    return (
        <div className="dcms-page">
            <div>
                <h1 className="dcms-page-title">My Treatment History</h1>
                <p className="dcms-page-subtitle">Review your full visit timeline and download a PDF record for each completed treatment.</p>
            </div>

            <div className="space-y-4">
                {records.data.length > 0 ? records.data.map((record) => (
                    <section key={record.id} className="dcms-card">
                        <div className="dcms-card-body">
                            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                <div>
                                    <p className="text-lg font-semibold">{record.visit_date}</p>
                                    <p className="mt-1 text-sm text-[var(--dcms-text-soft)]">Dr. {record.dentist.user.name}</p>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {(record.procedures || []).map((procedure) => (
                                            <span key={procedure} className="dcms-chip-teal">{procedure}</span>
                                        ))}
                                    </div>
                                    <p className="mt-3 text-sm text-[var(--dcms-text-soft)]">{record.notes || 'No notes were added for this visit.'}</p>
                                </div>
                                <a href={`/patient/history/${record.id}/download`} className="dcms-btn-secondary">Download PDF</a>
                            </div>
                        </div>
                    </section>
                )) : (
                    <section className="dcms-card">
                        <div className="dcms-card-body text-center text-[var(--dcms-text-soft)]">No treatment history is available yet.</div>
                    </section>
                )}
            </div>
        </div>
    )
}

HistoryIndex.layout = (page) => <PatientLayout>{page}</PatientLayout>
