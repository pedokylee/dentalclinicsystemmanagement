# Dental Clinic Design System Guide

## Overview
This guide provides comprehensive standards for building consistent UI across the Dental Clinic Management System. All developers must follow these guidelines when creating new pages and components.

---

## 1. Color System

### Brand Palette
All colors should be imported from Tailwind config using the `brand` prefix. **NEVER hardcode colors.**

```js
// ✅ CORRECT
className="bg-brand-bg-dark text-brand-text-light"

// ❌ WRONG
className="bg-[#0E2C28] text-[#E2FAF7]"
```

### Color Reference Table
| Token | Value | Usage |
|-------|-------|-------|
| `brand-primary` | `#0D9488` | Primary CTA buttons, accents |
| `brand-primary-dark` | `#0A7A70` | Button hover/active states |
| `brand-primary-light` | `#14B8A6` | Light accents, secondary text |
| `brand-primary-very-dark` | `#086860` | Pressed button state |
| `brand-bg-dark` | `#0E2C28` | Page/section backgrounds |
| `brand-bg-hover` | `#0F2724` | Hover states on dark backgrounds |
| `brand-text-light` | `#E2FAF7` | Primary text on dark backgrounds |
| `brand-text-muted` | `#7ABFB9` | Secondary text, subtitles |
| `brand-text-muted-dark` | `#4A8C85` | Dark secondary text |
| `brand-accent-warning` | `#F59E0B` | Warnings, alerts |

### Dark vs Light Theme
- **Dark Pages**: Use `bg-brand-bg-dark` as base, `text-brand-text-light` for text
- **Light Pages**: Use `bg-white`, `text-gray-900` for text
- **Never Mix**: Don't use light text on light backgrounds or dark text on dark backgrounds

---

## 2. Spacing System

All spacing must use predefined values. Custom pixel values are forbidden.

```js
// ✅ CORRECT
className="py-6 px-8 space-y-4"

// ❌ WRONG
className="py-24 px-32 space-y-6"
```

### Spacing Scale
| Class | Size | Usage |
|-------|------|-------|
| `space-1` | 4px | Micro spacing between elements |
| `space-2` | 8px | Small spacing within components |
| `space-3` | 12px | Component internal spacing |
| `space-4` | 16px | Between related components |
| `space-6` | 24px | Section spacing, card padding |
| `space-8` | 32px | Major section spacing |
| `space-12` | 48px | Page section breaks |

### Common Padding Patterns
```js
// Card padding
className="p-6"  // 24px all sides

// Section padding
className="py-12 px-6"  // 48px vertical, 24px horizontal

// Component internal spacing
className="space-y-4"   // 16px between child elements

// Form groups
className="space-y-3"   // 12px between fields
```

---

## 3. Button System

### Primary Button (Main CTAs)
```jsx
import { PrimaryButton } from '@/Components'

<PrimaryButton onClick={handleClick}>
  Create User
</PrimaryButton>
```

### Secondary Button (Alternative Actions)
```jsx
<SecondaryButton onClick={handleClick}>
  Cancel
</SecondaryButton>
```

### Outline Button (Low Priority)
```jsx
<OutlineButton onClick={handleClick}>
  Learn More
</OutlineButton>
```

### Danger Button (Destructive)
```jsx
<DangerButton onClick={handleClick}>
  Delete
</DangerButton>
```

### Success Button
```jsx
<SuccessButton onClick={handleClick}>
  Confirm
</SuccessButton>
```

### Button Sizing
```jsx
// Small buttons (e.g., in tables)
<PrimaryButton className="text-sm px-3 py-2">
  Edit
</PrimaryButton>

// Standard buttons (default)
<PrimaryButton>
  Save Changes
</PrimaryButton>

// Large buttons (full-width CTAs)
<PrimaryButton className="w-full">
  Complete Appointment
</PrimaryButton>
```

### Button States
- **Disabled**: Component handles automatically with opacity
- **Loading**: Add `disabled` + spinner icon
- **Active/Pressed**: Component handles with `brand-primary-very-dark`

---

## 4. Form Components

### Text Input
Always use the unified `FormField` component or `TextInput` for consistency.

```jsx
import { FormField } from '@/Components'

<FormField
  label="Patient Name"
  type="text"
  value={name}
  onChange={(e) => setName(e.target.value)}
  error={errors.name}
  required
/>
```

### Radio Buttons
```jsx
<div className="space-y-3">
  <label className="flex items-center space-x-2">
    <input type="radio" name="status" value="active" />
    <span className="text-brand-text-light">Active</span>
  </label>
</div>
```

### Checkboxes
```jsx
import { Checkbox } from '@/Components'

<Checkbox
  checked={isAgreed}
  onChange={(e) => setIsAgreed(e.target.checked)}
  label="I agree to the terms"
/>
```

### Select Dropdowns
```jsx
<select className="border border-brand-border-light rounded-md px-4 py-2 bg-white">
  <option>Select an option</option>
</select>
```

### Form Groups
Always wrap multiple fields for visual grouping:
```jsx
<div className="space-y-4">
  <FormField label="First Name" type="text" />
  <FormField label="Last Name" type="text" />
  <FormField label="Email" type="email" />
</div>
```

---

## 5. Border Radius

Use consistent rounding values:

```js
// ✅ CORRECT - Use predefined values
className="rounded-button"  // 8px
className="rounded-card"    // 12px
className="rounded-pill"    // Full circle

// ❌ WRONG - No custom values
className="rounded-[7px]"
className="rounded-[13px]"
```

### Radius Scale
| Class | Size | Usage |
|-------|------|-------|
| `rounded-button` / `rounded-md` | 8px | Buttons, inputs |
| `rounded-card` | 12px | Cards, modals |
| `rounded-lg` | 16px | Large containers |
| `rounded-pill` | 9999px | Pills, badges, avatars |

---

## 6. Typography

### Font Stack
- **Body**: Calibri, system-ui, sans-serif
- **Headings**: Trebuchet MS, system-ui, sans-serif

### Text Sizes
```js
// ✅ CORRECT
<h1 className="text-4xl font-bold">Title</h1>
<h2 className="text-3xl font-bold">Subtitle</h2>
<h3 className="text-2xl font-semibold">Section Header</h3>
<p className="text-base">Body text</p>
<span className="text-sm">Secondary text</span>
<span className="text-xs">Helper/caption</span>
```

### Text Weight
| Weight | Class | Usage |
|--------|-------|-------|
| 400 | `font-normal` | Body text |
| 500 | `font-medium` | Emphasized text |
| 600 | `font-semibold` | Subheadings |
| 700 | `font-bold` | Headings, important labels |

### Line Height
```js
// Multi-line text
<p className="text-base leading-relaxed">
  Long paragraph text with good readability
</p>

// Single line labels
<label className="text-sm leading-none">Label</label>
```

---

## 7. Modal & Dialog Windows

### Using ConfirmModal
```jsx
import { ConfirmModal } from '@/Components'

const [showDeleteModal, setShowDeleteModal] = useState(false)

<ConfirmModal
  show={showDeleteModal}
  onClose={() => setShowDeleteModal(false)}
  title="Delete User"
  message="Are you sure you want to delete this user? This action cannot be undone."
  danger={true}
  onConfirm={handleDelete}
/>
```

### Using Modal for Custom Content
```jsx
import { Modal } from '@/Components'

<Modal show={isOpen} onClose={handleClose}>
  <Modal.Header>Modal Title</Modal.Header>
  <Modal.Body>
    Modal content goes here
  </Modal.Body>
  <Modal.Footer>
    <SecondaryButton onClick={handleClose}>Cancel</SecondaryButton>
    <PrimaryButton onClick={handleConfirm}>Confirm</PrimaryButton>
  </Modal.Footer>
</Modal>
```

---

## 8. Alerts & Notifications

### Alert Component
```jsx
import { Alert } from '@/Components'

<Alert type="success">
  User created successfully!
</Alert>

<Alert type="error">
  An error occurred while saving.
</Alert>

<Alert type="warning">
  This action will affect related records.
</Alert>

<Alert type="info">
  Please review the changes below.
</Alert>
```

### Flash Message (Server Success/Error)
```jsx
import { FlashMessage } from '@/Components'

<FlashMessage message={flash.message} type={flash.type} />
```

### Toast-style Notifications (Client-side)
```jsx
const [notification, setNotification] = useState(null)

// Show notification
setNotification({
  type: 'success',  // 'success', 'error', 'warning', 'info'
  message: 'Action completed!'
})

// Auto-clear after 3 seconds
setTimeout(() => setNotification(null), 3000)

// Render
{notification && (
  <Alert type={notification.type} onClose={() => setNotification(null)}>
    {notification.message}
  </Alert>
)}
```

---

## 9. Cards & Containers

### Standard Card
```jsx
<div className="bg-white border border-gray-200 rounded-card p-6 space-y-4">
  <h3 className="text-lg font-semibold text-gray-900">Card Title</h3>
  <p className="text-gray-600">Card content</p>
</div>
```

### Dark Theme Card
```jsx
<div className="bg-brand-bg-dark border border-brand-border-light rounded-card p-6 space-y-4">
  <h3 className="text-lg font-semibold text-brand-text-light">Card Title</h3>
  <p className="text-brand-text-muted">Card content</p>
</div>
```

### Cards with Hover Effects
```jsx
<div className="group bg-white border border-gray-200 rounded-card p-6 hover:border-brand-primary hover:shadow-lg transition-all">
  {/* Card content */}
</div>
```

---

## 10. Responsive Design

### Breakpoints (Tailwind defaults)
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Common Responsive Patterns
```jsx
// Grid layouts
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Items */}
</div>

// Flex layouts
<div className="flex flex-col md:flex-row gap-6">
  {/* Stacks vertically on mobile, horizontally on desktop */}
</div>

// Hidden on mobile
<div className="hidden lg:block">
  {/* Only visible on large screens */}
</div>

// Padding adjustments
<div className="px-4 md:px-6 lg:px-8">
  {/* Less padding on mobile, more on desktop */}
</div>
```

---

## 11. Component Usage Examples

### User Table
```jsx
import { DataTable } from '@/Components'

<DataTable
  columns={[
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
  ]}
  data={users}
  actions={(user) => (
    <div className="flex gap-2">
      <PrimaryButton>Edit</PrimaryButton>
      <DangerButton>Delete</DangerButton>
    </div>
  )}
/>
```

### Stat Cards
```jsx
import { StatCard } from '@/Components'

<div className="grid md:grid-cols-3 gap-6">
  <StatCard
    title="Total Appointments"
    value="1,234"
    icon={<CalendarIcon />}
  />
  <StatCard
    title="Active Patients"
    value="892"
    icon={<UserIcon />}
  />
</div>
```

### Navigation
```jsx
import { Navbar } from '@/Components'

<Navbar>
  <NavLink href="/dashboard">Dashboard</NavLink>
  <NavLink href="/patients">Patients</NavLink>
</Navbar>
```

---

## 12. Common Mistakes to Avoid

### ❌ DO NOT
```jsx
// Hardcoded colors
className="bg-[#0E2C28] text-[#E2FAF7]"

// Inline styles
style={{ padding: '24px', borderRadius: '8px' }}

// Custom utility classes
className="rounded-7 px-10 py-5"

// Inconsistent padding
className="px-2 py-1"  // Tiny, inconsistent
className="px-8 py-4"  // Too large, not on scale

// Multiple button component types
<button className="...">  // Use PrimaryButton
<a className="...">       // Use Link + Button

// Repeating input markup
<input className="..." />  // Use FormField component
<input className="..." />
<input className="..." />

// Mixed dark/light themes
className="bg-[#0E2C28] text-gray-900"  // Dark BG, light text
```

### ✅ DO
```jsx
// Use design system colors
className="bg-brand-bg-dark text-brand-text-light"

// Use semantic Tailwind classes
className="rounded-card p-6"

// Use standardized spacing
className="px-6 py-4"
className="space-y-4"

// Use designed components
<PrimaryButton>Click me</PrimaryButton>
<FormField label="Name" />

// Keep layouts consistent
className="grid md:grid-cols-2 gap-6"
```

---

## 13. Implementation Checklist

Before committing code, verify:

- [ ] No hardcoded colors (`#0D9488`, `#0E2C28`, etc.)
- [ ] All buttons use button components (Primary/Secondary/Danger/etc.)
- [ ] All form inputs use FormField component
- [ ] Spacing uses predefined values (4, 8, 12, 16, 24, 32, 48px)
- [ ] Border radius uses predefined values (button, card, pill)
- [ ] Text hierarchy follows typography guidelines
- [ ] Responsive design tested at: mobile (375px), tablet (768px), desktop (1024px)
- [ ] Dark theme pages use `brand-bg-dark`, `brand-text-light`
- [ ] Light theme pages use `bg-white`, `text-gray-900`
- [ ] Alerts use Alert component or notification state
- [ ] Modals use Modal or ConfirmModal components

---

## 14. Component Reference

| Component | Location | Purpose |
|-----------|----------|---------|
| `PrimaryButton` | `Components/PrimaryButton.jsx` | Main CTA buttons |
| `SecondaryButton` | `Components/SecondaryButton.jsx` | Alternative actions |
| `DangerButton` | `Components/DangerButton.jsx` | Destructive actions |
| `SuccessButton` | `Components/SuccessButton.jsx` | Confirmation actions |
| `OutlineButton` | `Components/OutlineButton.jsx` | Low-priority buttons |
| `TextInput` | `Components/TextInput.jsx` | Text input fields |
| `FormField` | `Components/FormField.jsx` | Complete form field with label |
| `Checkbox` | `Components/Checkbox.jsx` | Checkbox inputs |
| `Modal` | `Components/Modal.jsx` | Custom modal dialogs |
| `ConfirmModal` | `Components/ConfirmModal.jsx` | Confirmation dialogs |
| `Alert` | `Components/Alert.jsx` | Alert messages |
| `DataTable` | `Components/DataTable.jsx` | Data display tables |
| `StatCard` | `Components/StatCard.jsx` | Statistics cards |
| `Navbar` | `Components/Navbar.jsx` | Top navigation |
| `Sidebar` | `Components/Sidebar.jsx` | Side navigation |

---

## 15. Quick Reference Card

```
COLORS:     Use brand-primary, brand-bg-dark, brand-text-light (NEVER hardcode)
SPACING:    Use 4, 8, 12, 16, 24, 32, 48px values (NEVER custom px)
BUTTONS:    Use PrimaryButton, SecondaryButton, DangerButton (NEVER <button>)
FORMS:      Use FormField component (NEVER raw <input>)
RADIUS:     Use rounded-button, rounded-card, rounded-pill (NEVER custom)
TEXT:       Use text-4xl, text-3xl, text-2xl, text-base, text-sm, text-xs
DARK BG:    USE: bg-brand-bg-dark text-brand-text-light
LIGHT BG:   USE: bg-white text-gray-900
```

---

## Questions?
Refer to existing modern components in `Resources/js/Pages/Home.jsx` for implementation examples.
