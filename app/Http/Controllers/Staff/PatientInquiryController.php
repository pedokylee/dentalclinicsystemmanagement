<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Notification;
use App\Models\Patient;
use App\Models\PatientInquiry;
use App\Models\User;
use App\Support\PatientInquiryFeature;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class PatientInquiryController extends Controller
{
    public function index(Request $request)
    {
        if (! PatientInquiryFeature::isAvailable()) {
            return redirect()->route('staff.dashboard')->with('error', PatientInquiryFeature::unavailableMessage());
        }

        $filters = $request->only(['search', 'status']);
        $status = $filters['status'] ?? 'pending_verification';

        $inquiries = PatientInquiry::query()
            ->with(['matchedUser.patient'])
            ->when(filled($filters['search'] ?? null), function ($query) use ($filters) {
                $search = trim((string) $filters['search']);
                $query->where(function ($innerQuery) use ($search) {
                    $innerQuery
                        ->where('full_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%");
                });
            })
            ->when($status !== 'all', fn ($query) => $query->where('status', $status))
            ->latest()
            ->paginate(config('app.pagination.notifications'))
            ->withQueryString();

        return Inertia::render('Staff/Inquiries/Index', [
            'inquiries' => $inquiries,
            'filters' => [
                'search' => $filters['search'] ?? '',
                'status' => $status,
            ],
            'stats' => [
                'pending' => PatientInquiry::where('status', 'pending_verification')->count(),
                'converted' => PatientInquiry::where('status', 'converted')->count(),
                'rejected' => PatientInquiry::where('status', 'rejected')->count(),
                'total' => PatientInquiry::count(),
            ],
        ]);
    }

    public function createConversion(int $inquiry)
    {
        if (! PatientInquiryFeature::isAvailable()) {
            return redirect()->route('staff.dashboard')->with('error', PatientInquiryFeature::unavailableMessage());
        }

        $inquiry = $this->findInquiryOrFail($inquiry);
        $inquiry->loadMissing(['matchedUser.patient']);
        $matchedUser = $inquiry->matchedUser;

        [$firstName, $lastName] = $this->splitName($inquiry->full_name);
        $matchedPatient = $matchedUser?->patient;

        return Inertia::render('Staff/Inquiries/Convert', [
            'inquiry' => $inquiry,
            'matchedPatient' => $matchedPatient,
            'hasPortalAccount' => (bool) $matchedUser,
            'defaults' => [
                'first_name' => $matchedPatient->first_name ?? $firstName,
                'last_name' => $matchedPatient->last_name ?? $lastName,
                'email' => $matchedPatient->email ?? $inquiry->email,
                'date_of_birth' => optional($matchedPatient?->date_of_birth)->format('Y-m-d') ?? '',
                'gender' => $matchedPatient->gender ?? '',
                'contact_number' => $matchedPatient->contact_number ?? $matchedPatient->phone ?? $inquiry->phone,
                'street_address' => $matchedPatient->street_address ?? '',
                'city' => $matchedPatient->city ?? '',
                'state' => $matchedPatient->state ?? '',
                'zip_code' => $matchedPatient->zip_code ?? '',
                'medical_alerts' => $matchedPatient->medical_alerts ?? '',
                'emergency_contact_name' => $matchedPatient->emergency_contact_name ?? '',
                'emergency_contact_phone' => $matchedPatient->emergency_contact_phone ?? '',
            ],
        ]);
    }

    public function storeConversion(Request $request, int $inquiry)
    {
        if (! PatientInquiryFeature::isAvailable()) {
            return redirect()->route('staff.dashboard')->with('error', PatientInquiryFeature::unavailableMessage());
        }

        $inquiry = $this->findInquiryOrFail($inquiry);
        $existingUser = $this->findExistingPatientUser($inquiry, (string) $request->input('email'));
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'date_of_birth' => 'required|date',
            'gender' => 'required|in:male,female,other',
            'contact_number' => 'required|string|max:20',
            'street_address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'zip_code' => 'nullable|string|max:10',
            'medical_alerts' => 'nullable|string',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:20',
            'temporary_password' => $existingUser ? 'nullable|string|min:8|confirmed' : 'required|string|min:8|confirmed',
        ]);

        DB::transaction(function () use ($validated, $inquiry) {
            $user = $this->resolvePatientUser($inquiry, $validated['email']);
            $patient = $user->patient;

            $patientPayload = [
                'user_id' => $user->id,
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'email' => $validated['email'],
                'phone' => $validated['contact_number'],
                'contact_number' => $validated['contact_number'],
                'date_of_birth' => $validated['date_of_birth'],
                'gender' => $validated['gender'],
                'address' => $this->composeAddress($validated),
                'street_address' => $validated['street_address'] ?? null,
                'city' => $validated['city'] ?? null,
                'state' => $validated['state'] ?? null,
                'zip_code' => $validated['zip_code'] ?? null,
                'medical_alerts' => $validated['medical_alerts'] ?? null,
                'emergency_contact_name' => $validated['emergency_contact_name'] ?? null,
                'emergency_contact_phone' => $validated['emergency_contact_phone'] ?? null,
            ];

            if ($patient) {
                $patient->update($patientPayload);
            } else {
                Patient::create($patientPayload);
            }

            $user->update([
                'name' => $validated['first_name'] . ' ' . $validated['last_name'],
                'email' => $validated['email'],
            ]);

            if (filled($validated['temporary_password'] ?? null)) {
                $user->update([
                    'password' => Hash::make($validated['temporary_password']),
                ]);
            }

            $inquiry->update([
                'status' => 'converted',
                'reviewed_at' => now(),
                'matched_user_id' => $user->id,
            ]);

            Notification::query()
                ->where('type', 'patient_inquiry_submitted')
                ->where('related_id', $inquiry->id)
                ->update(['read' => true]);
        });

        AuditLog::log('converted', 'patient_inquiries', "Converted inquiry #{$inquiry->id} into a patient profile");

        $passwordMessage = filled($validated['temporary_password'] ?? null)
            ? " Portal password set for {$validated['email']}."
            : '';

        return redirect()->route('staff.inquiries.index', ['status' => 'converted'])->with('success', "Inquiry converted into a registered patient successfully.{$passwordMessage}");
    }

    public function reject(Request $request, int $inquiry)
    {
        if (! PatientInquiryFeature::isAvailable()) {
            return redirect()->route('staff.dashboard')->with('error', PatientInquiryFeature::unavailableMessage());
        }

        $inquiry = $this->findInquiryOrFail($inquiry);
        $validated = $request->validate([
            'reason' => 'nullable|string|max:500',
        ]);

        $inquiry->update([
            'status' => 'rejected',
            'reviewed_at' => now(),
        ]);

        Notification::query()
            ->where('type', 'patient_inquiry_submitted')
            ->where('related_id', $inquiry->id)
            ->update(['read' => true]);

        $reason = filled($validated['reason'] ?? null) ? " Reason: {$validated['reason']}" : '';
        AuditLog::log('rejected', 'patient_inquiries', "Rejected inquiry #{$inquiry->id}.{$reason}");

        return redirect()->route('staff.inquiries.index')->with('success', 'Inquiry marked as rejected.');
    }

    private function findInquiryOrFail(int $inquiryId): PatientInquiry
    {
        return PatientInquiry::query()->findOrFail($inquiryId);
    }

    private function resolvePatientUser(PatientInquiry $inquiry, string $email): User
    {
        $user = $this->findExistingPatientUser($inquiry, $email);

        if ($user && $user->role !== 'patient') {
            throw ValidationException::withMessages([
                'email' => 'This email already belongs to a non-patient account and cannot be converted automatically.',
            ]);
        }

        if ($user) {
            return $user;
        }

        return User::create([
            'name' => $inquiry->full_name,
            'email' => $email,
            'password' => Hash::make('Temp' . Str::random(8)),
            'role' => 'patient',
            'active' => true,
        ]);
    }

    private function findExistingPatientUser(PatientInquiry $inquiry, string $email): ?User
    {
        return $inquiry->matchedUser ?: User::where('email', $email)->first();
    }

    private function composeAddress(array $validated): ?string
    {
        $segments = array_filter([
            $validated['street_address'] ?? null,
            $validated['city'] ?? null,
            $validated['state'] ?? null,
            $validated['zip_code'] ?? null,
        ]);

        return $segments ? implode(', ', $segments) : null;
    }

    private function splitName(string $fullName): array
    {
        $parts = preg_split('/\s+/', trim($fullName)) ?: [];

        if (count($parts) <= 1) {
            $name = $parts[0] ?? '';
            return [$name, $name];
        }

        $firstName = array_shift($parts);

        return [$firstName, implode(' ', $parts)];
    }
}
