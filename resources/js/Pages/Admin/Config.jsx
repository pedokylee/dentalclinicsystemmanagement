import AdminLayout from '@/Layouts/AdminLayout'

export default function Config() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-[#E2FAF7]">Configuration</h1>

            <div className="bg-[#0E2C28] border border-[rgba(45,212,191,0.12)] rounded-lg p-6">
                <h2 className="text-xl font-bold text-[#0D9488] mb-6">Clinic Settings</h2>

                <div className="space-y-4 max-w-md">
                    <div>
                        <label className="block text-[#7ABFB9] mb-2">Clinic Name</label>
                        <input
                            type="text"
                            defaultValue="DCMS Dental Clinic"
                            className="w-full px-4 py-2 bg-[#0F2724] border border-[rgba(45,212,191,0.12)] rounded text-[#E2FAF7]"
                        />
                    </div>

                    <div>
                        <label className="block text-[#7ABFB9] mb-2">Contact Number</label>
                        <input
                            type="tel"
                            defaultValue="+1-555-DENTAL"
                            className="w-full px-4 py-2 bg-[#0F2724] border border-[rgba(45,212,191,0.12)] rounded text-[#E2FAF7]"
                        />
                    </div>

                    <div>
                        <label className="block text-[#7ABFB9] mb-2">Address</label>
                        <textarea
                            defaultValue="123 Smile Street, Dental City"
                            rows="3"
                            className="w-full px-4 py-2 bg-[#0F2724] border border-[rgba(45,212,191,0.12)] rounded text-[#E2FAF7]"
                        ></textarea>
                    </div>

                    <button className="w-full px-6 py-2 bg-[#0D9488] text-white rounded hover:bg-[#14B8A6] transition-colors">
                        Save Settings
                    </button>
                </div>
            </div>
        </div>
    )
}

Config.layout = (page) => <AdminLayout>{page}</AdminLayout>
