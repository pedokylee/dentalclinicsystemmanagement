# Security Best Practices

## 1. SQL Injection Prevention

### Current Implementation - ✅ SECURE

The application uses Laravel's query builder which prevents SQL injection:

```php
// ✅ SAFE - Using query builder
$users = User::where('role', $role)->get();

// ✅ SAFE - Using bindings
$appointments = Appointment::where('dentist_id', $dentist_id)->get();

// ❌ DANGEROUS - Raw SQL unsanitized (DO NOT USE)
$users = DB::select("SELECT * FROM users WHERE role = " . $role);
```

**Rules:**
- Always use query builder (`User::where()`) or Eloquent
- Never interpolate variables into raw SQL
- Use parameter binding when raw SQL is absolutely necessary:
  ```php
  DB::select('SELECT * FROM users WHERE role = ?', [$role]);
  ```

---

## 2. Sensitive Data Protection

### Passwords - ✅ SECURE
```php
// ✅ Correct - Using Hash facade
'password' => Hash::make($plainPassword),

// Verification
if (Hash::check($plainPassword, $user->password)) { ... }
```

### Sensitive Fields

Never log or expose:
- Passwords
- API keys
- Credit card numbers
- Social security numbers
- Medical records (beyond what's necessary)

**Configuration in config/logging.php:**
```php
'redact' => [
    'keys' => ['password', 'secret', 'token', 'api_key'],
    'replace' => '***',
],
```

### Example - Audit Logs

```php
// ❌ WRONG - Logs sensitive data
AuditLog::log('created', 'users', "Password: {$password}");

// ✅ CORRECT - Logs only necessary info
AuditLog::log('created', 'users', "User created with role: {$role}");
```

---

## 3. CSRF Protection

### In Laravel Forms - ✅ AUTOMATIC

```blade
{{-- ✅ Automatic CSRF token in forms --}}
<form method="POST" action="/appointments">
    @csrf
    {{-- inputs --}}
</form>
```

### In AJAX Requests

```php
// ✅ Laravel adds CSRF token header automatically via axios
axios.post('/api/appointments', data);

// If manual:
axios.post('/api/appointments', data, {
    headers: {
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
    }
});
```

### Route Middleware - Already Configured

```php
// In app/Http/Middleware/VerifyCsrfToken.php
protected $except = [
    // Only add routes here that legitimately need to skip CSRF
    // (like webhooks from external APIs)
];
```

---

## 4. Secure Random Numbers

### Current Implementation - ✅ SECURE

```php
// ✅ SECURE - Using Str::random()
$tempPassword = 'Temp' . Str::random(8);

// ✅ SECURE - Using random_bytes
$token = bin2hex(random_bytes(16));

// ❌ INSECURE - Using rand() or mt_rand()
$token = rand(1000, 9999); // Predictable!
```

**Rule:** Always use `Str::random()` or `random_bytes()` for security-sensitive values.

---

## 5. Rate Limiting

### Current Status - NOT IMPLEMENTED

Recommended for authentication and API endpoints:

```php
// Protect login attempts
Route::post('/login', [LoginController::class, 'store'])
    ->middleware('throttle:5,1'); // 5 attempts per 1 minute

// Protect API endpoints
Route::middleware('throttle:60,1')->group(function () {
    Route::post('/appointments', ...);
    Route::patch('/profile', ...);
});
```

### Implementation Steps

1. Configure in `.env`:
   ```
   RATE_LIMIT_PER_MINUTE=100
   ```

2. Apply to routes:
   ```php
   Route::post('/login', [LoginController::class, 'store'])
       ->middleware('throttle:5,1');
   ```

3. Custom rate limiting:
   ```php
   Route::post('/api/bookings', ...)
       ->middleware('throttle:appointments');
   
   // In kernel.php
   protected $routeMiddleware = [
       'throttle' => \Illuminate\Routing\Middleware\ThrottleRequests::class,
   ];
   ```

---

## 6. Sensitive Information in Logs

### Current Configuration

Laravel logs are stored in `storage/logs/laravel.log`

### What NOT to Log

```php
// ❌ DO NOT LOG
\Log::info("Patient data: ", $patient->toArray()); // Logs all fields
\Log::info("Email: {$email}, Password: {$password}"); // Logs credentials

// ✅ DO LOG
\Log::info("Patient updated", ['id' => $patient->id]);
\Log::info("Login attempt", ['email' => $email, 'ip' => $request->ip()]);
```

### Protected Sensitive Fields

All database sensitive fields should be in `$hidden` on models:

```php
class User extends Model {
    protected $hidden = ['password', 'remember_token'];
}

class Patient extends Model {
    protected $hidden = ['ssn']; // If applicable
}
```

### Log File Permissions

```bash
# Ensure logs are not readable by web server
chmod 600 storage/logs/laravel.log
```

---

## 7. File Upload Security

Store uploads outside web root:

```php
// ✅ CORRECT - Outside public directory
'disks' => [
    'private' => [
        'driver' => 'local',
        'root' => storage_path('app/private'),
        'visibility' => 'private',
    ],
],

// Usage
Storage::disk('private')->put('files/' . $uploadedFile->hashName(), $file);
```

---

## 8. Environment Variables

### Never in Code

```php
// ❌ DO NOT DO THIS
$apiKey = 'sk_test_abc123';

// ✅ USE ENVIRONMENT VARIABLES
$apiKey = env('API_KEY');
```

### `.env` File

```
APP_DEBUG=false
APP_ENV=production
DB_PASSWORD=complex_password_here
API_KEY=secret_key_here
```

**Never commit `.env` to version control.**

---

## Security Checklist

Before production deployment:

- [ ] `APP_DEBUG=false`
- [ ] `APP_ENV=production`
- [ ] All secrets in `.env` (not in code)
- [ ] HTTPS enforced (redirect HTTP to HTTPS)
- [ ] Database password is strong
- [ ] Files are backed up
- [ ] Error pages don't expose paths
- [ ] No sensitive data in logs
- [ ] Rate limiting enabled
- [ ] CORS configured properly

---

## Additional Resources

- [Laravel Security Documentation](https://laravel.com/docs/security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Laravel Security Audit Tool](https://github.com/enlightn/enlightn)
