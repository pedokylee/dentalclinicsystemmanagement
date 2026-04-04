import PatientLayout from '@/Layouts/PatientLayout'
import StatCard from '@/Components/StatCard'

export default function Dashboard({ nextAppointment, notifications }) {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-[#E2FAF7]">My Dashboard</h1>

            {/* Next Appointment */}
            {nextAppointment ? (
                <div className="bg-[#0E2C28] border-l-4 border-[#0D9488] p-6 rounded-lg">
                    <h3 className="text-lg font-bold text-[#0D9488] mb-4">Your Next Appointment</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-[#7ABFB9]">Date</p>
                            <p className="font-bold text-[#E2FAF7]">{nextAppointment.appointment_date}</p>
                        </div>
                        <div>
                            <p className="text-sm text-[#7ABFB9]">Time</p>
                            <p className="font-bold text-[#E2FAF7]">{nextAppointment.appointment_time}</p>
                        </div>
                        <div>
                            <p className="text-sm text-[#7ABFB9]">Dentist</p>
                            <p className="font-bold text-[#E2FAF7]">Dr. {nextAppointment.dentist?.user?.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-[#7ABFB9]">Status</p>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#0D9488] text-white">
                                {nextAppointment.status}
                            </span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-[#0E2C28] border border-[rgba(45,212,191,0.12)] p-6 rounded-lg text-center">
                    <p className="text-[#7ABFB9]">No upcoming appointments</p>
                </div>
            )}

            {/* Notifications */}
            <div className="bg-[#0E2C28] border border-[rgba(45,212,191,0.12)] p-6 rounded-lg">
                <h3 className="text-lg font-bold text-[#0D9488] mb-4">Notifications</h3>
                {notifications.length === 0 ? (
                    <p className="text-[#7ABFB9]">No notifications</p>
                ) : (
                    <div className="space-y-3">
                        {notifications.map((notif, idx) => (
                            <div
                                key={idx}
                                className={`p-4 rounded ${
                                    notif.type === 'reminder'
                                        ? 'bg-[#0D9488] bg-opacity-20 border-l-4 border-[#0D9488]'
                                        : 'bg-[#F59E0B] bg-opacity-20 border-l-4 border-[#F59E0B]'
                                }`}
                            >
                                <p className="text-[#E2FAF7]">{notif.message}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

Dashboard.layout = (page) => <PatientLayout>{page}</PatientLayout>
