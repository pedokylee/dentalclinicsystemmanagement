export default function Footer() {
    return (
        <footer className="bg-[#0F2724] border-t border-[rgba(45,212,191,0.12)] px-6 py-4 text-center text-sm text-[#4A8C85]">
            © {new Date().getFullYear()} DentalClinic Management System. All rights reserved.
        </footer>
    )
}