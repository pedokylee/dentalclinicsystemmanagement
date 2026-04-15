$ErrorActionPreference = 'Stop'

$outputPath = Join-Path $PSScriptRoot '..\DCMS_System_Documentation.docx'
$outputPath = [System.IO.Path]::GetFullPath($outputPath)

function Add-StyledParagraph {
    param(
        [Parameter(Mandatory = $true)][object]$Selection,
        [Parameter(Mandatory = $true)][string]$Text,
        [string]$Style = 'Normal',
        [int]$SpaceAfter = 6,
        [int]$Alignment = 0,
        [switch]$Bold,
        [switch]$Italic
    )

    $Selection.Style = $Style
    $Selection.ParagraphFormat.Alignment = $Alignment
    $Selection.Font.Bold = [int]$Bold.IsPresent
    $Selection.Font.Italic = [int]$Italic.IsPresent
    $Selection.TypeText($Text)
    $Selection.TypeParagraph()
    $Selection.ParagraphFormat.SpaceAfter = $SpaceAfter
    $Selection.Font.Bold = 0
    $Selection.Font.Italic = 0
}

function Add-BulletList {
    param(
        [Parameter(Mandatory = $true)][object]$Selection,
        [Parameter(Mandatory = $true)][string[]]$Items
    )

    foreach ($item in $Items) {
        Add-StyledParagraph -Selection $Selection -Text ("• " + $item) -Style 'Normal' -SpaceAfter 2
    }

    $Selection.TypeParagraph()
}

$sections = @(
    @{
        Title = '1. Introduction'
        Paragraphs = @(
            'The Dental Clinic Management System (DCMS) is a web-based clinic operations platform built to centralize patient registration, appointment scheduling, treatment documentation, notifications, reporting, and administrative control in one system.',
            'This documentation explains how the system works in a real-world clinic setting, what each role can do, how the modules are connected, and how the application should be installed, maintained, and extended.',
            'The structure of this document was prepared using the provided SIA documentation PDF files as reference for the title-page and table-of-contents style.'
        )
    }
    @{
        Title = '2. Project Overview'
        Paragraphs = @(
            'DCMS serves four primary user roles: Admin, Dentist, Staff, and Patient. Each role signs in through one shared login page, but the system automatically redirects the user to the correct role-specific dashboard after authentication.',
            'The application follows a Laravel plus Inertia plus React architecture. Laravel handles routing, business logic, validation, data access, notifications, exports, and security. Inertia connects Laravel responses to React pages without a full-page reload. React renders the user interface, while Tailwind CSS applies the design system and layout rules.',
            'The public side of the system also includes a landing page and a patient inquiry intake flow. This allows a guest to submit their details so staff can review, verify, and convert the inquiry into a proper patient record.'
        )
        Bullets = @(
            'Shared login with automatic role-based redirection',
            'Role-based dashboards and permissions',
            'Public patient inquiry and booking entry points',
            'Appointment scheduling with conflict detection and dentist availability checks',
            'Treatment records with odontogram data and file attachments',
            'In-app notifications, audit logging, reports, and backup tools'
        )
    }
    @{
        Title = '3. Objectives of the System'
        Bullets = @(
            'Reduce manual paperwork and fragmented clinic processes',
            'Provide separate but connected interfaces for administrators, clinicians, staff, and patients',
            'Prevent scheduling conflicts and improve daily operations',
            'Maintain reliable treatment records and patient history',
            'Improve communication through notifications and email-based workflows',
            'Support clinic oversight through reports, audit logs, and configuration tools'
        )
    }
    @{
        Title = '4. Scope of the System'
        Paragraphs = @(
            'DCMS covers the front-desk workflow, clinical workflow, patient self-service workflow, and administrative oversight workflow. It is designed for a dental clinic environment where appointments, check-ins, treatment notes, and patient records need to be handled in a single coordinated system.'
        )
        Bullets = @(
            'In scope: patient registration, appointment booking, check-in, treatment recording, notifications, patient portal access, reporting, audit logs, and backup management',
            'In scope: role-based access control for Admin, Dentist, Staff, and Patient',
            'In scope: document exports, profile settings, clinic configuration, and local file uploads for treatment attachments',
            'Out of scope: SMS integrations and paid messaging gateways, since the project requirement is to avoid cost-generating third-party messaging features'
        )
    }
    @{
        Title = '5. System Users and Access Levels'
        Subsections = @(
            @{
                Title = '5.1 Admin'
                Paragraphs = @(
                    'The Admin has full access to the system. This role manages users, reviews reports, checks audit logs, manages backups, and updates clinic-wide configuration settings.'
                )
                Bullets = @(
                    'View system-wide dashboard statistics',
                    'Create, edit, activate, or deactivate users',
                    'Export reports to PDF and Excel',
                    'Review audit log history',
                    'Create and restore backups',
                    'Maintain clinic information and system settings'
                )
            }
            @{
                Title = '5.2 Dentist'
                Paragraphs = @(
                    'The Dentist sees only assigned patients and their own schedule. This role is focused on consultation, treatment recording, dental history review, and prescription entry.'
                )
                Bullets = @(
                    'View today’s schedule and assigned patients',
                    'Open patient profiles and dental history',
                    'Record treatments and notes',
                    'Manage odontogram data',
                    'Upload X-rays and procedure photos',
                    'Export treatment records to PDF'
                )
            }
            @{
                Title = '5.3 Staff'
                Paragraphs = @(
                    'The Staff role supports the front desk and daily clinic operations. Staff registers patients, verifies public inquiries, books appointments, reschedules visits, sends reminders, and checks in patients.'
                )
                Bullets = @(
                    'Create and update patient records',
                    'Review and convert public inquiries',
                    'Book, reschedule, and cancel appointments',
                    'Handle check-in and queue management',
                    'Send reminders through supported channels',
                    'View staff-level reports'
                )
            }
            @{
                Title = '5.4 Patient'
                Paragraphs = @(
                    'The Patient role is a self-service portal for the clinic’s patient. Patients can view their upcoming appointments, treatment history, profile information, and notifications.'
                )
                Bullets = @(
                    'View dashboard summary and notifications',
                    'Manage profile information and preferences',
                    'See upcoming and past appointments',
                    'Cancel eligible upcoming appointments',
                    'Download treatment history records',
                    'Mark notifications as read or dismiss them'
                )
            }
        )
    }
    @{
        Title = '6. Real-Life Operational Flow'
        Subsections = @(
            @{
                Title = '6.1 New Patient Inquiry'
                Paragraphs = @(
                    'A guest visits the landing page and fills out the new patient intake form. The inquiry is stored in the system and active staff users receive an in-app notification asking them to verify the request.'
                )
            }
            @{
                Title = '6.2 Staff Verification and Conversion'
                Paragraphs = @(
                    'Staff members open the Patient Inquiries page, review the submitted information, and decide whether to convert the inquiry into a proper patient record. Once converted, the data is connected to a user account and patient profile.'
                )
            }
            @{
                Title = '6.3 Appointment Booking'
                Paragraphs = @(
                    'Staff selects a patient, dentist, date, time, appointment type, and notes. The system checks whether the dentist is active, scheduled for the selected date, and still available for the chosen time. Unavailable dentists are grayed out and taken slots cannot be submitted.'
                )
            }
            @{
                Title = '6.4 Check-In and Queue Handling'
                Paragraphs = @(
                    'On the appointment date, staff uses the check-in screen or dashboard queue to mark the patient as checked in. This updates the appointment status so the clinic team can track who is ready for consultation.'
                )
            }
            @{
                Title = '6.5 Consultation and Treatment Recording'
                Paragraphs = @(
                    'The dentist opens the patient profile, reviews medical alerts and treatment history, and records the procedure details. Odontogram data, notes, prescriptions, and image attachments are stored as part of the treatment record.'
                )
            }
            @{
                Title = '6.6 Patient Follow-Up'
                Paragraphs = @(
                    'After the visit, the patient can review records from the patient portal, view notifications, and download treatment documentation where allowed. The clinic can also send supported reminders using the built-in notification and email flows.'
                )
            }
        )
    }
    @{
        Title = '7. Architecture and Technical Design'
        Paragraphs = @(
            'The system follows a server-driven single-page application pattern. Laravel is the backend framework, Inertia is the bridge between backend responses and frontend pages, and React is the rendering layer. Instead of returning a separate API and frontend app, Laravel returns valid Inertia responses that hydrate React pages directly.',
            'This approach reduces full browser reloads while keeping routing, validation, authentication, authorization, and data access centralized on the Laravel side.'
        )
        Bullets = @(
            'Backend Framework: Laravel 12',
            'Frontend Library: React 19',
            'Navigation Layer: Inertia.js',
            'Styling: Tailwind CSS',
            'Bundler: Vite',
            'Charts and Calendar: Chart.js and FullCalendar',
            'Exports: DomPDF and Laravel Excel',
            'Database: MySQL',
            'Authentication Scaffolding: Laravel Breeze-based foundation'
        )
    }
    @{
        Title = '8. Core Functional Modules'
        Subsections = @(
            @{
                Title = '8.1 Authentication and Role Routing'
                Paragraphs = @(
                    'The shared login page authenticates the user once, then redirects the account to the correct dashboard based on the role value stored on the users table.'
                )
            }
            @{
                Title = '8.2 User Management'
                Paragraphs = @(
                    'Admin users can create and update accounts, manage active status, filter by role, and export user data. Activation changes are handled through Inertia-safe updates so the user interface remains responsive.'
                )
            }
            @{
                Title = '8.3 Patient Management'
                Paragraphs = @(
                    'Staff can register patients manually or convert inquiry records into patient accounts. Duplicate patient emails are handled safely by reusing the existing patient account instead of crashing.'
                )
            }
            @{
                Title = '8.4 Appointment Management'
                Paragraphs = @(
                    'Staff, Admin, and Patients use appointment-related flows with conflict detection and availability checks. The system validates bookings on both the frontend and backend to prevent double booking or off-schedule assignment.'
                )
            }
            @{
                Title = '8.5 Treatment Records'
                Paragraphs = @(
                    'Dentists can create treatment records that include treatment notes, procedure data, prescription details, odontogram values, and uploaded attachments such as X-rays and procedure photos.'
                )
            }
            @{
                Title = '8.6 Notifications'
                Paragraphs = @(
                    'The system provides in-app notifications for reminders, inquiry verification, and account-relevant events. Mark as read, mark all as read, and dismiss actions are available across supported roles.'
                )
            }
            @{
                Title = '8.7 Reports, Audit Logs, and Backup'
                Paragraphs = @(
                    'Administrative modules provide analytics, report export, audit trail visibility, and backup management. These features support monitoring, accountability, and system recovery.'
                )
            }
            @{
                Title = '8.8 Settings and Configuration'
                Paragraphs = @(
                    'There are two levels of settings in the application. System settings store clinic-wide configuration, while user settings store per-user preferences such as notification and display choices.'
                )
            }
        )
    }
    @{
        Title = '9. Data and Database Overview'
        Paragraphs = @(
            'The database design supports user identity, patient records, appointment workflows, treatment history, notifications, and administration. The schema is managed through Laravel migrations and is designed to keep role-specific features connected through consistent foreign keys and status values.'
        )
        Bullets = @(
            'users: authentication account, role, active status, and last login information',
            'patients: patient demographic and medical details linked to a user account',
            'dentists: clinician profile information and schedule data',
            'appointments: date, time, dentist, patient, type, status, notes, and confirmation flags',
            'treatment_records: clinical notes, procedures, prescriptions, and odontogram data',
            'treatment_record_attachments: stored files such as X-rays and procedure photos',
            'notifications: role-specific in-app notification records with read state',
            'audit_logs: chronological record of significant system actions',
            'system_settings: clinic-wide configurable values',
            'user_settings: per-user preferences and personalization settings',
            'patient_inquiries: landing page intake records for staff verification',
            'profile_change_requests: patient-submitted requests for sensitive profile changes'
        )
    }
    @{
        Title = '10. User Interface and Navigation'
        Paragraphs = @(
            'All authenticated roles use the same application shell composed of a sidebar, top bar, and content area. Navigation items change according to the current role, but the overall layout remains consistent. This improves usability and reduces training time for users moving between modules.',
            'The application uses Inertia page visits and partial reloads so navigation feels smooth while still keeping backend validation and authorization logic on the server.'
        )
        Bullets = @(
            'Shared sidebar with role-specific menu items',
            'Top bar with breadcrumb, notifications, and user menu',
            'Role chip and account context in the layout',
            'Optimized quick actions for toggles and notification updates',
            'Responsive behavior for dashboard and form pages'
        )
    }
    @{
        Title = '11. Security and Reliability'
        Paragraphs = @(
            'DCMS relies on Laravel security features and application-level rules to keep access controlled and data protected. Passwords are hashed, role checks are enforced through middleware, and form requests are validated before writes happen.',
            'Sensitive actions also create audit trail entries where applicable, and duplicate or conflicting submissions are handled gracefully through validation or safe update paths rather than raw database crashes.'
        )
        Bullets = @(
            'Role-based middleware prevents unauthorized page access',
            'Password hashing protects user credentials',
            'CSRF protection secures form submissions',
            'Validation prevents malformed or conflicting data',
            'Audit logs support accountability and traceability',
            'Backup tools support system recovery',
            'Settings and inquiry modules include fallback guards for missing database tables'
        )
    }
    @{
        Title = '12. Installation and Setup'
        Paragraphs = @(
            'The system can be set up locally using the Laravel and Node.js toolchain. The following steps summarize the standard development workflow.'
        )
        Bullets = @(
            'Run composer install',
            'Create the environment file from .env.example if needed',
            'Generate the application key',
            'Configure database and mail settings in .env',
            'Run php artisan migrate',
            'Seed demo accounts and sample data if required',
            'Run npm install',
            'Use composer run dev or run the Laravel server, queue listener, and Vite separately',
            'Use php artisan test and npm run build before release'
        )
    }
    @{
        Title = '13. Deployment and Maintenance Considerations'
        Paragraphs = @(
            'For production, debug mode must be disabled and environment-specific values must be configured securely. Migrations should be run with force in production after staging validation. Built assets, mail configuration, queue processing, and backup routines should be prepared before go-live.',
            'The current project already includes deployment guidance, backup setup notes, and security best-practice documents that should be reviewed before deployment.'
        )
        Bullets = @(
            'Set APP_ENV to production and APP_DEBUG to false',
            'Use a production-ready session and cache driver',
            'Configure a real SMTP service if email is required',
            'Run queues for reminders and background jobs',
            'Store backups safely and test restore procedures',
            'Run npm run build and php artisan optimize before deployment'
        )
    }
    @{
        Title = '14. Testing and Quality Assurance'
        Paragraphs = @(
            'The project includes automated tests that cover authentication, booking access, appointment availability, inquiry conversion, notifications, staff appointment flow, duplicate patient registration handling, and user settings. The frontend build is also validated through Vite production builds.',
            'At the time this documentation was generated, the application test suite passed successfully, which provides a baseline level of confidence that major connected features are working as intended.'
        )
        Bullets = @(
            'Feature tests verify multi-role behavior and protected flows',
            'Appointment conflict and dentist availability checks are tested',
            'Notification actions such as mark all as read are tested',
            'Patient inquiry conversion and duplicate email handling are tested',
            'Build validation confirms that the React and Inertia frontend compiles successfully'
        )
    }
    @{
        Title = '15. Current Limitations and Recommended Enhancements'
        Bullets = @(
            'Introduce queue-backed mail sending everywhere to improve perceived performance for user actions',
            'Expand rate limiting on login and sensitive endpoints',
            'Add a full admin approval interface for profile change requests if deeper governance is required',
            'Continue optimizing heavy shared props and page payloads to keep Inertia navigation smooth',
            'Document formal operational procedures for backups, restore testing, and clinic user onboarding'
        )
    }
    @{
        Title = '16. Conclusion'
        Paragraphs = @(
            'DCMS is designed to serve as a full clinic workflow platform rather than a static record keeper. Its role-based dashboards, connected patient lifecycle, appointment protection rules, treatment record handling, and administrative oversight tools make it suitable for real clinic operations when paired with proper deployment, training, and data management practices.',
            'This document should help administrators, developers, and evaluators understand how the system is structured, how users interact with it, and how the individual modules work together in practice.'
        )
    }
    @{
        Title = 'References'
        Bullets = @(
            'Project source code and route definitions from the current DCMS Laravel, Inertia, React, and Tailwind codebase',
            'Project documentation files including PRODUCTION_DEPLOYMENT.md, SECURITY_BEST_PRACTICES.md, GETTING_STARTED.md, IMPLEMENTATION_SUMMARY.md, and related setup references',
            'Reference PDFs provided by the user: SIA-Documentation-Contents.pdf and SIA-Documentation-Title-and-Table-of-Contents.pdf'
        )
    }
)

$word = $null
$doc = $null

try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    $word.DisplayAlerts = 0

    $doc = $word.Documents.Add()
    $selection = $word.Selection

    $selection.Font.Name = 'Times New Roman'
    $selection.Font.Size = 12

    Add-StyledParagraph -Selection $selection -Text 'Dental Clinic Management System (DCMS)' -Style 'Title' -SpaceAfter 12 -Alignment 1
    Add-StyledParagraph -Selection $selection -Text 'System Documentation' -Style 'Subtitle' -SpaceAfter 24 -Alignment 1
    Add-StyledParagraph -Selection $selection -Text 'Laravel + Inertia.js + React + Tailwind CSS' -Style 'Normal' -SpaceAfter 18 -Alignment 1
    Add-StyledParagraph -Selection $selection -Text 'Prepared for project documentation and presentation use' -Style 'Normal' -SpaceAfter 18 -Alignment 1
    Add-StyledParagraph -Selection $selection -Text ('Generated on ' + (Get-Date -Format 'MMMM dd, yyyy')) -Style 'Normal' -SpaceAfter 18 -Alignment 1
    Add-StyledParagraph -Selection $selection -Text 'Prepared using the current implementation of the DCMS repository and the supplied SIA documentation files as structural reference.' -Style 'Normal' -SpaceAfter 18 -Alignment 1

    $selection.InsertBreak(7)

    Add-StyledParagraph -Selection $selection -Text 'Table of Contents' -Style 'Heading 1' -SpaceAfter 12
    $tocRange = $selection.Range
    $doc.TablesOfContents.Add($tocRange, $true, 1, 3) | Out-Null
    $selection.MoveDown() | Out-Null
    $selection.InsertBreak(7)

    foreach ($section in $sections) {
        Add-StyledParagraph -Selection $selection -Text $section.Title -Style 'Heading 1' -SpaceAfter 6

        if ($section.ContainsKey('Paragraphs')) {
            foreach ($paragraph in $section.Paragraphs) {
                Add-StyledParagraph -Selection $selection -Text $paragraph -Style 'Normal' -SpaceAfter 6
            }
        }

        if ($section.ContainsKey('Bullets')) {
            Add-BulletList -Selection $selection -Items $section.Bullets
        }

        if ($section.ContainsKey('Subsections')) {
            foreach ($subsection in $section.Subsections) {
                Add-StyledParagraph -Selection $selection -Text $subsection.Title -Style 'Heading 2' -SpaceAfter 6

                if ($subsection.ContainsKey('Paragraphs')) {
                    foreach ($paragraph in $subsection.Paragraphs) {
                        Add-StyledParagraph -Selection $selection -Text $paragraph -Style 'Normal' -SpaceAfter 6
                    }
                }

                if ($subsection.ContainsKey('Bullets')) {
                    Add-BulletList -Selection $selection -Items $subsection.Bullets
                }
            }
        }
    }

    foreach ($table in $doc.TablesOfContents) {
        $table.Update()
    }

    $doc.SaveAs([ref]$outputPath)
    $doc.Close()
    $word.Quit()

    Write-Output "Documentation generated at: $outputPath"
}
finally {
    if ($doc -ne $null) {
        try { $doc.Close() } catch {}
    }

    if ($word -ne $null) {
        try { $word.Quit() } catch {}
    }
}
