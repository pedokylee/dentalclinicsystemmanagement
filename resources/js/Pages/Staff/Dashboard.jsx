import StaffLayout from '@/Layouts/StaffLayout'
import StatCard from '@/Components/StatCard'

export default function Dashboard({ checkInQueue, walkInCount, remindersToSend }) {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-[#E2FAF7]">Staff Dashboard</h1>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard label="Check-in Queue" value={checkInQueue.length} icon="📋" />
                <StatCard label="Walk-ins" value={walkInCount} icon="🚶" />
                <StatCard label="Reminders to Send" value={remindersToSend} color="gold" icon="🔔" />
            </div>

            {/* Check-in Queue */}
            <div className="bg-[#0E2C28] border border-[rgba(45,212,191,0.12)] p-6 rounded-lg">
                <h3 className="text-lg font-bold text-[#0D9488] mb-4">Today's Check-in Queue</h3>
                {checkInQueue.length === 0 ? (
                    <p className="text-[#7ABFB9]">No appointments today</p>
                ) : (
                    <div className="space-y-3">
                        {checkInQueue.map((apt) => (
                            <div
                                key={apt.id}
                                className="bg-[#0F2724] border-l-4 border-[#0D9488] p-4 rounded flex justify-between items-center"
                            >
                                <div>
                                    <p className="font-bold text-[#E2FAF7]">{apt.patient}</p>
                                    <p className="text-sm text-[#7ABFB9]">
                                        With {apt.dentist} - {apt.time}
                                    </p>
                                </div>
                                <button className="px-4 py-2 bg-[#0D9488] text-white rounded hover:bg-[#14B8A6] transition-colors">
                                    Check In
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

Dashboard.layout = (page) => <StaffLayout>{page}</StaffLayout>
