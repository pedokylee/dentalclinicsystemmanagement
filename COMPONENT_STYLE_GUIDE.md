# Dental Clinic UI Component & Style Guide

**Last Updated:** April 12, 2026  
**Status:** Active - All components are production-ready

---

## Table of Contents

1. [Button Components](#button-components)
2. [Form Components](#form-components)
3. [Color Palette](#color-palette)
4. [Typography](#typography)
5. [Spacing System](#spacing-system)
6. [Common Patterns](#common-patterns)
7. [Migration Checklist](#migration-checklist)

---

## Button Components

### PrimaryButton
Used for primary actions that progress the user through a workflow.

```jsx
import PrimaryButton from '@/Components/PrimaryButton'

// Small
<PrimaryButton size="sm">Save</PrimaryButton>

// Medium (default)
<PrimaryButton>Save Changes</PrimaryButton>

// Large
<PrimaryButton size="lg">Submit Form</PrimaryButton>

// Disabled
<PrimaryButton disabled>Processing...</PrimaryButton>

// With Icon
<PrimaryButton>
  <SaveIcon className="w-5 h-5" />
  Save
</PrimaryButton>
```

**Styling:** `bg-brand-primary hover:bg-brand-primary-dark text-white rounded-lg`

---

### SecondaryButton
Used for secondary actions like "Cancel", "Skip", or reversible actions.

```jsx
import SecondaryButton from '@/Components/SecondaryButton'

<SecondaryButton>Cancel</SecondaryButton>
<SecondaryButton size="lg">Back to Dashboard</SecondaryButton>
```

**Styling:** `border-2 border-gray-300 bg-white text-gray-700 rounded-lg`

---

### DangerButton
Used for destructive actions like delete, remove, or cancel operations.

```jsx
import DangerButton from '@/Components/DangerButton'

<DangerButton>Delete Patient</DangerButton>
<DangerButton size="sm">Remove</DangerButton>
```

**Styling:** `bg-red-500 hover:bg-red-600 text-white rounded-lg`

---

### SuccessButton
Used for confirmatory actions or positive operations.

```jsx
import SuccessButton from '@/Components/SuccessButton'

<SuccessButton>Confirm Appointment</SuccessButton>
```

**Styling:** `bg-green-600 hover:bg-green-700 text-white rounded-lg`

---

### OutlineButton
Used for less prominent actions or alternatives.

```jsx
import OutlineButton from '@/Components/OutlineButton'

// Primary outline
<OutlineButton>Learn More</OutlineButton>

// Danger outline
<OutlineButton variant="danger">Cancel Appointment</OutlineButton>

// Success outline
<OutlineButton variant="success">Approve</OutlineButton>

// Warning outline
<OutlineButton variant="warning">Review</OutlineButton>
```

**Styling:** `border-2 bg-white rounded-lg with variant-specific colors`

---

## Form Components

### FormField
Composite component that handles label, input, and error messages in one place. **Use this for ALL form fields.**

```jsx
import FormField from '@/Components/FormField'

// Text input
<FormField
  label="Patient Name"
  placeholder="Enter full name"
  value={data.name}
  onChange={(e) => setData('name', e.target.value)}
  error={errors.name}
  required
/>

// Email input
<FormField
  label="Email Address"
  type="email"
  placeholder="patient@example.com"
  value={data.email}
  onChange={(e) => setData('email', e.target.value)}
  error={errors.email}
/>

// Date input
<FormField
  label="Date of Birth"
  type="date"
  value={data.date_of_birth}
  onChange={(e) => setData('date_of_birth', e.target.value)}
  error={errors.date_of_birth}
  required
/>

// Select dropdown
<FormField
  label="Gender"
  as="select"
  value={data.gender}
  onChange={(e) => setData('gender', e.target.value)}
  error={errors.gender}
>
  <option value="">Select Gender</option>
  <option value="male">Male</option>
  <option value="female">Female</option>
  <option value="other">Other</option>
</FormField>

// Textarea
<FormField
  label="Medical Alerts"
  as="textarea"
  placeholder="List any allergies or medical alerts..."
  value={data.medical_alerts}
  onChange={(e) => setData('medical_alerts', e.target.value)}
  error={errors.medical_alerts}
  rows={4}
/>

// Disabled input
<FormField
  label="Read Only Field"
  value={data.readonly}
  disabled
/>
```

### TextInput (Direct Usage)
For advanced use cases where you need more control.

```jsx
import TextInput from '@/Components/TextInput'

<TextInput
  type="text"
  placeholder="Search..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  error={!!errors.search}
/>
```

### InputLabel & InputError
For creating custom form structures.

```jsx
import InputLabel from '@/Components/InputLabel'
import InputError from '@/Components/InputError'

<div>
  <InputLabel>Email Address *</InputLabel>
  <input type="email" />
  {error && <InputError message={error} />}
</div>
```

---

## Color Palette

All colors are defined in `tailwind.config.js` under the `brand` namespace for easy maintenance.

### Brand Colors

```jsx
// Primary Actions
bg-brand-primary              // #0D9488 - Main teal
hover:bg-brand-primary-dark   // #0A7A70 - Hover/active state
active:bg-brand-primary-very-dark // #086860 - Pressed state
text-brand-primary            // Teal text

// Dark Theme (for dark pages)
bg-brand-bg-dark              // #0E2C28 - Dark page background
hover:bg-brand-bg-hover       // #0F2724 - Hover on dark
text-brand-text-light         // #E2FAF7 - Light text on dark
text-brand-text-muted         // #7ABFB9 - Secondary text
border-brand-border-light     // rgba(45,212,191,0.12) - Subtle borders

// Accents
text-brand-accent-warning     // #F59E0B - Warning/secondary accent
```

### Usage Examples

```jsx
// Replace hardcoded colors:
// ❌ BEFORE
className="bg-[#0D9488] hover:bg-[#0A7A70] text-[#E2FAF7]"

// ✅ AFTER
className="bg-brand-primary hover:bg-brand-primary-dark text-brand-text-light"

// Dark theme cards
className="bg-brand-bg-dark border border-brand-border-light"

// Links and accents
className="text-brand-primary hover:text-brand-primary-dark transition-colors"
```

---

## Typography

Use semantic HTML and Tailwind's type scale:

```jsx
// Page title
<h1 className="text-3xl font-bold">Dashboard</h1>

// Section heading
<h2 className="text-2xl font-bold">Patient Information</h2>

// Card/Box title
<h3 className="text-xl font-bold">Upcoming Appointments</h3>

// Body text
<p className="text-base text-gray-700">Regular paragraph text</p>

// Labels
<label className="text-sm font-medium text-gray-700">Form Label</label>

// Small/secondary text
<p className="text-sm text-gray-500">Help text or secondary info</p>

// Tiny text
<span className="text-xs text-gray-400">Status badge or caption</span>
```

---

## Spacing System

Consistent spacing defined in `tailwind.config.js`:

```jsx
// Section-level spacing (24px)
<div className="space-y-section">
  <section>...</section>
  <section>...</section>
</div>

// Component spacing (16px)
<div className="space-y-component">
  <div>Component 1</div>
  <div>Component 2</div>
</div>

// Card padding
<div className="bg-white p-card rounded-lg">
  Card content with 24px padding
</div>

// Input spacing
<div className="space-y-input">
  <label>Input 1</label>
  <label>Input 2</label>
</div>

// Form group spacing (gap between fields)
<div className="grid grid-cols-2 gap-6">
  <FormField ... />
  <FormField ... />
</div>
```

---

## Border Radius

```jsx
// Buttons & Form Inputs
className="rounded-lg"         // 8px

// Cards & Containers
className="rounded-xl"         // 12px

// Badges & Pills
className="rounded-full"       // 9999px - circular
```

---

## Common Patterns

### Alert Component (4 Types)

```jsx
import Alert from '@/Components/Alert'

// Info alert
<Alert type="info" title="Information">
  This is an informational message
</Alert>

// Success alert
<Alert type="success" title="Success!">
  Operation completed successfully
</Alert>

// Warning alert
<Alert type="warning" title="Warning">
  Please review before proceeding
</Alert>

// Error alert
<Alert type="error" title="Error">
  Something went wrong. Please try again.
</Alert>

// Dismissible alert
<Alert 
  type="info" 
  dismissible
  onDismiss={() => setShowAlert(false)}
>
  Close me by clicking the X
</Alert>
```

### Data Table with Theme Support

```jsx
import DataTable from '@/Components/DataTable'

// Dark theme (default for dashboard)
<DataTable
  columns={[
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' }
  ]}
  rows={data}
  actions={(row) => (
    <>
      <Link href={`/edit/${row.id}`}>Edit</Link>
      <button>Delete</button>
    </>
  )}
  theme="dark"  // or "light"
/>
```

### Form Layout Pattern

```jsx
<form onSubmit={handleSubmit} className="space-y-section">
  {/* Section 1 */}
  <div>
    <h2 className="text-xl font-bold mb-6">Personal Information</h2>
    <div className="grid grid-cols-2 gap-6">
      <FormField label="First Name" ... />
      <FormField label="Last Name" ... />
    </div>
  </div>

  {/* Section 2 */}
  <div className="border-t pt-section">
    <h2 className="text-xl font-bold mb-6">Address</h2>
    <div className="space-y-component">
      <FormField label="Street" ... />
      <div className="grid grid-cols-3 gap-6">
        <FormField label="City" ... />
        <FormField label="State" ... />
        <FormField label="Zip" ... />
      </div>
    </div>
  </div>

  {/* Actions */}
  <div className="flex gap-4 pt-section border-t">
    <PrimaryButton type="submit">Save</PrimaryButton>
    <SecondaryButton type="button" onClick={handleCancel}>
      Cancel
    </SecondaryButton>
  </div>
</form>
```

---

## Migration Checklist

Follow this checklist when updating pages to use new components:

### For Button Elements
- [ ] Replace all `<button className="px-8 py-3 bg-[#0D9488]...">` with `<PrimaryButton>`
- [ ] Replace all secondary button patterns with `<SecondaryButton>`
- [ ] Replace delete/destructive buttons with `<DangerButton>`
- [ ] Add appropriate `size` prop (sm, md, lg) if needed

### For Form Inputs
- [ ] Replace all inline `<input>` with `<FormField>`  
- [ ] Move all labels into FormField's `label` prop
- [ ] Move all error handling into FormField's `error` prop
- [ ] Remove manual error message `<p>` tags

### For Colors
- [ ] Search for all `#0D9488` and replace with `brand-primary`
- [ ] Replace `#0E2C28` with `brand-bg-dark`
- [ ] Replace `#E2FAF7` with `brand-text-light`
- [ ] Replace `#7ABFB9` with `brand-text-muted`
- [ ] Replace `rgba(45,212,191,0.12)` with `brand-border-light`
- [ ] Verify the page is still using correct theme

### For Alerts
- [ ] Replace all `<div className="bg-yellow-50 border-l-4 border-yellow-400...">` patterns with `<Alert type="warning">`
- [ ] Use appropriate alert type (success, error, warning, info)
- [ ] Add `dismissible` prop if alert should be closeable

### Verification
- [ ] Page matches the design from UI_INCONSISTENCIES_REPORT.md
- [ ] All buttons are consistent in size and styling
- [ ] All form fields have labels with required indicator
- [ ] Error messages are displayed consistently
- [ ] Hover states work properly
- [ ] Focus states are visible
- [ ] Color scheme matches brand palette

---

## Common Mistakes to Avoid

❌ **DON'T:** Hardcode colors
```jsx
<button className="bg-[#0D9488]">Save</button>
```

✅ **DO:** Use brand color classes
```jsx
<PrimaryButton>Save</PrimaryButton>
```

---

❌ **DON'T:** Create inline form field markup
```jsx
<div>
  <label>{label}</label>
  <input type="text" />
  {error && <p>{error}</p>}
</div>
```

✅ **DO:** Use FormField component
```jsx
<FormField label={label} error={error} />
```

---

❌ **DON'T:** Mix button styles
```jsx
<button className="px-4 py-2 bg-blue-600">One</button>
<button className="px-8 py-3 bg-[#0D9488]">Two</button>
<button className="px-6 py-2.5 bg-teal-500">Three</button>
```

✅ **DO:** Use consistent button components
```jsx
<PrimaryButton size="md">One</PrimaryButton>
<PrimaryButton size="lg">Two</PrimaryButton>
<PrimaryButton size="md">Three</PrimaryButton>
```

---

## Questions or Issues?

Refer to:
- [UI_INCONSISTENCIES_REPORT.md](../UI_INCONSISTENCIES_REPORT.md) - Detailed analysis of what was fixed
- Component files in `resources/js/Components/` - View source code
- Tailwind config - `tailwind.config.js` - Color, spacing, and sizing definitions

---

**Document Status:** Complete  
**Last Updated:** April 12, 2026
