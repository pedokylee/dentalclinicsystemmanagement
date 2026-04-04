import PatientLayout from '@/Layouts/PatientLayout'

export default function Notifications() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-[#E2FAF7]">Notifications</h1>

            <div className="space-y-3">
                <div className="bg-[#0E2C28] border-l-4 border-[#0D9488] p-4 rounded">
                    <p className="font-bold text-[#E2FAF7]">Appointment Reminder</p>
                    <p className="text-[#7ABFB9]">Your appointment is tomorrow at 2:00 PM</p>
                    <p className="text-xs text-[#4A8C85] mt-2">2 hours ago</p>
                </div>

                <div className="bg-[#0E2C28] border-l-4 border-[#F59E0B] p-4 rounded">
                    <p className="font-bold text-[#E2FAF7]">Follow-up Alert</p>
                    <p className="text-[#7ABFB9]">You have a pending follow-up treatment</p>
                    <p className="text-xs text-[#4A8C85] mt-2">1 day ago</p>
                </div>
            </div>
        </div>
    )
}

Notifications.layout = (page) => <PatientLayout>{page}</PatientLayout>
