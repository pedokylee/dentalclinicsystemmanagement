# Code Quality & Best Practices

## Import Management

### Best Practices for PHP Imports

1. **Keep Imports Clean**
   - Remove unused imports to improve code readability
   - Use IDE's "organize imports" feature regularly
   - All imports should be referenced in the code

2. **Detecting Unused Imports**
   
   **Using VS Code:**
   - Install PHP Intelephense extension
   - Unused imports appear grayed out
   - Right-click → "Remove unused imports"
   
   **Using Command Line:**
   ```bash
   # Run PHP Mess Detector to find unused imports
   ./vendor/bin/phpmd app/ text unusedcode --extensions php
   ```

3. **Common Patterns to Match Imports**

   ```php
   // ❌ Don't do this - import but never use
   use App\Models\UnusedModel;
   
   // ✅ Do this - only import what you use
   use App\Models\Patient;
   use App\Models\Appointment;
   
   // If you use facades
   use Illuminate\Support\Facades\Cache;  // Only if you use Cache::
   use Illuminate\Support\Facades\Log;    // Only if you use Log::
   ```

4. **IDE Configuration (VS Code)**
   
   Add to `.vscode/settings.json`:
   ```json
   {
       "intelephense.analysis.unusedVariable": true,
       "intelephense.analysis.unused": true,
       "php.validate.enable": true,
       "php.validate.run": "onSave"
   }
   ```

5. **Pre-commit Check**
   
   Before committing, check for unused imports:
   ```bash
   # Find potential unused imports in controllers
   grep -r "^use " app/Http/Controllers/ | wc -l
   
   # Review specific file
   php -l app/Http/Controllers/YourController.php
   ```

## Import Organization Standard

**Expected order** (PSR-12 compliant):

```php
<?php

namespace App\Http\Controllers\Admin;

// 1. Framework imports
use Illuminate\Routing\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

// 2. Model imports
use App\Models\User;
use App\Models\AuditLog;

// 3. Export/Library imports
use App\Exports\UsersExport;
use Barryvdh\DomPDF\Facade\Pdf;
use Inertia\Inertia;

class UserController extends Controller
{
    // ...
}
```

## Running Maintenance

To clean up unused imports across the project:

```bash
# Analyze controllers for issues
php vendor/bin/phpstan analyze app/Http/Controllers/ --level=0

# Use PHP Insights for code quality
php vendor/bin/phpinsights analyze app/Http/Controllers/
```

## Recommended Tools

### Development Dependencies

Consider adding these to `composer.json` (dev):

```bash
composer require --dev phpstan/phpstan
composer require --dev larastan/larastan
composer require --dev phpmd/phpmd
```

## Automated Cleanup

For fast cleanup, use Pint:

```bash
php vendor/bin/pint app/Http/Controllers/ --fix
```

This will fix formatting and basic code quality issues automatically.
