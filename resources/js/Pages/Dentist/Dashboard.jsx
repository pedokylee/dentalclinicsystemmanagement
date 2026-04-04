import DentistLayout from '@/Layouts/DentistLayout'
import StatCard from '@/Components/StatCard'

export default function Dashboard({ todaySchedule, pendingNotes, myPatientsCount }) {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-[#E2FAF7]">Dentist Dashboard</h1>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard label="My Patients" value={myPatientsCount} icon="👥" />
                <StatCard label="Today's Appointments" value={todaySchedule.length} icon="📅" />
                <StatCard label="Pending Treatment Notes" value={pendingNotes} color="gold" icon="📝" />
            </div>

            {/* Today's Schedule */}
            <div className="bg-[#0E2C28] border border-[rgba(45,212,191,0.12)] p-6 rounded-lg">
                <h3 className="text-lg font-bold text-[#0D9488] mb-4">Today's Schedule</h3>
                {todaySchedule.length === 0 ? (
                    <p className="text-[#7ABFB9]">No appointments today</p>
                ) : (
                    <div className="space-y-3">
                        {todaySchedule.map((apt) => (
                            <div
                                key={apt.id}
                                className="bg-[#0F2724] border-l-4 border-[#0D9488] p-4 rounded"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-[#E2FAF7]">{apt.patient}</p>
                                        <p className="text-sm text-[#7ABFB9]">{apt.type}</p>
                                    </div>
                                    <span className="text-[#0D9488] font-semibold">{apt.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

Dashboard.layout = (page) => <DentistLayout>{page}</DentistLayout>
