# Code Quality Standards - Part 2

## 1. Null Safety (Safe Operators)

### PHP Null Safe Operator (`?.`)

Always use the null-safe operator when accessing properties via relationships:

```php
// ❌ WRONG - Can crash if $patient is null
$name = $appointment->patient->full_name;

// ✅ CORRECT - Returns null if $patient is null
$name = $appointment->patient?->full_name;

// ✅ CORRECT - Provide fallback value
$name = $appointment->patient?->full_name ?? 'Unknown Patient';
```

**Rule:** If any part of the chain might be null, use `?.` for that level.

### Patterns in This Codebase

```php
// Controllers - Model relationships
$dentist = $user->dentist ?? abort(403, 'Dentist profile not...'); // Correct
$patient = $user->patient?->full_name; // Correct
$apt->patient?->full_name; // Correct

// Models - Accessors/Mutators
return $this->date_of_birth?->age ?? 0; // Correct

// Views - Template access
{{ $appointment->patient?->full_name ?? 'Unknown' }} {{-- Correct --}}
```

### Type Hints for Null-Safety

```php
// ❌ Missing return type
public function getPatient() {
    return $this->project->patient;
}

// ✅ Proper return type - explicitly may be null
public function getPatient(): ?Patient {
    return $this->project->patient;
}
```

---

## 2. Consistent Date Formatting

**Problem:** Different date formats in different places cause confusion.

**Solution:** Use `App\Helpers\DateFormatter` class

### Examples

```php
// OLD - Inconsistent formats
'appointment_date' => $apt->appointment_date->format('M d, Y'),
'created_at' => $apt->created_at->format('Y-m-d'),

// NEW - Consistent, using helper
use App\Helpers\DateFormatter;

'appointment_date' => DateFormatter::appointmentDate($apt->appointment_date),
'created_at' => DateFormatter::databaseDate($apt->created_at),
```

### Available Methods

- `appointmentDate()` - "Apr 12, 2026"
- `appointmentTime()` - "09:30 AM"
- `appointmentDateTime()` - "Apr 12, 2026 at 09:30 AM"
- `databaseDate()` - "2026-04-12" (for API/DB storage)
- `timestamp()` - "2026-04-12 14:30:00"
- `auditLog()` - "Apr 12 14:30"
- `relative()` - "2 days ago"

---

## 3. Magic Status Strings → Enums

**Problem:** Status values like 'pending', 'confirmed' scattered throughout code.

**Solution:** Use `App\Enums\AppointmentStatus` enum

### Before (Magic Strings)

```php
// In validation
'status' => 'in:pending,confirmed,scheduled,cancelled',

// In logic
if ($appointment->status === 'confirmed') { ... }

// In assignments
$appointment->status = 'scheduled';
```

### After (Using Enum)

```php
use App\Enums\AppointmentStatus;

// In validation
'status' => 'in:' . implode(',', AppointmentStatus::values()),

// In logic
if ($appointment->status === AppointmentStatus::CONFIRMED->value) { ... }

// In assignments
$appointment->status = AppointmentStatus::SCHEDULED->value;

// Get display name
$displayName = AppointmentStatus::CONFIRMED->label(); // "Confirmed"
```

---

## 4. Array Key Consistency

**Problem:** Property names use different cases in different places.

**Rule:** Use `camelCase` for all array keys (for JavaScript compatibility in frontend).

```php
// ❌ INCONSISTENT
return [
    'todo_count' => 10,           // snake_case
    'pendingNotes' => 5,          // camelCase
    'TotalPatients' => 100,       // PascalCase
];

// ✅ CONSISTENT
return [
    'todoCount' => 10,
    'pendingNotes' => 5,
    'totalPatients' => 100,
];
```

**In Controllers:**

```php
// Model data with proper camelCase keys
$today = Appointment::today()->get()->map(fn($apt) => [
    'id' => $apt->id,
    'patientName' => $apt->patient?->full_name,
    'appointmentTime' => $apt->appointment_time,
    'appointmentDate' => $apt->appointment_date,
]);
```

---

## 5. Type Hints & Return Types

All methods should have return types (PHP 7.4+):

```php
// ❌ NO return type
public function getPatient() {
    return Patient::find(1);
}

// ✅ WITH return type
public function getPatient(): Patient {
    return Patient::find(1);
}

// ✅ Nullable return type
public function getPatient(): ?Patient {
    return Patient::find(1);
}

// ✅ Collection return type
public function getAppointments(): Collection {
    return Appointment::all();
}
```

### Benefit

- IDE autocomplete works better
- Type checking tools can find errors
- Self-documenting code
- Easier refactoring

---

## Summary

1. **Always use safe operator (`?.`)** for property chains that might be null
2. **Use `DateFormatter`** for all date formatting
3. **Use `AppointmentStatus` enum** instead of magic strings
4. **Use `camelCase`** for all array keys
5. **Add return types** to all methods

These changes eliminate common bugs and improve code maintainability.
