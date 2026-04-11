import DentistLayout from '@/Layouts/DentistLayout'
import StatCard from '@/Components/StatCard'

const IconUsers = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM6 20a9 9 0 0118 0v-2a9 9 0 00-18 0v2z" />
    </svg>
)

const IconCalendar = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
)

const IconNotes = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
)

export default function Dashboard({ todaySchedule, pendingNotes, myPatientsCount }) {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-[#E2FAF7]">Dentist Dashboard</h1>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard label="My Patients" value={myPatientsCount} icon={<IconUsers />} />
                <StatCard label="Today's Appointments" value={todaySchedule.length} icon={<IconCalendar />} />
                <StatCard label="Pending Treatment Notes" value={pendingNotes} color="gold" icon={<IconNotes />} />
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
