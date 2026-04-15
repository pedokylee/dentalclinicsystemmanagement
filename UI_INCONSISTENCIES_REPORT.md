# UI Inconsistencies Report

**Generated:** $(date)  
**Project:** Dental Clinic Management System (React + Laravel/Inertia)

---

## Executive Summary

This report documents comprehensive UI/UX inconsistencies across the Dental Clinic Management System React frontend. The analysis identifies **10 major categories** of inconsistencies affecting visual hierarchy, component reusability, and user experience.

---

## 1. Button Styling Inconsistencies

### Issue: Highly Inconsistent Button Padding and Size

**Severity:** 🔴 **CRITICAL**

#### Examples in Use:

| Location | Padding | Rounded | Font | Behavior |
|----------|---------|---------|------|----------|
| `Welcome.jsx:12` | `px-8 py-3` | `rounded-lg` | Default | Teal background |
| `Patients/Create.jsx:318` | `px-8 py-3` | `rounded-lg` | `text-base` | Teal background |
| `Appointments/Index.jsx:54` | `px-4 py-2.5` | `rounded-lg` | `text-sm` | Red border |
| `Staff/Checkin/Index.jsx:193` | `px-6 py-3` | `rounded-lg` | `text-base` | Teal background |
| `Staff/Dashboard.jsx:139` | `p-4` | `rounded-lg` | N/A | Card content |
| `Auth/Login.jsx` | N/A (not found outlined) | Variable | N/A | PrimaryButton component |

**Problems:**
- 🔴 Button sizes range from `px-2 py-2` to `px-8 py-4` with no clear system
- 🔴 Padding inconsistent between similar-priority buttons
- 🔴 Mix of `text-xs`, `text-sm`, `text-base` for button text
- 🔴 `PrimaryButton` component (uses `text-xs uppercase`) never used in modern pages; instead inline styles applied

**Current Component Definition** (`PrimaryButton.jsx`):
```jsx
`inline-flex items-center rounded-md border border-transparent bg-gray-800 px-4 py-2 text-xs font-semibold uppercase...`
```

**Production Button** (`Welcome.jsx:12`):
```jsx
className="px-8 py-3 bg-[#0D9488] text-white rounded-lg hover:bg-[#14B8A6]"
```

### Recommendation:

Create a **Button Component System** with defined variants:

```jsx
// Button.jsx
const buttonVariants = {
  primary: 'px-6 py-2.5 bg-[#0D9488] hover:bg-[#0A7A70] text-white rounded-lg font-semibold text-sm',
  secondary: 'px-6 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-50',
  danger: 'px-6 py-2.5 bg-white border-2 border-red-200 text-red-600 rounded-lg font-semibold text-sm hover:bg-red-50',
  success: 'px-6 py-2.5 bg-white border-2 border-green-200 text-green-600 rounded-lg font-semibold text-sm hover:bg-green-50',
  subtle: 'px-4 py-1.5 bg-transparent text-[#0D9488] hover:bg-teal-50 rounded-lg text-sm',
  lg: 'px-8 py-3.5 bg-[#0D9488] hover:bg-[#0A7A70] text-white rounded-lg font-bold text-base'
}
```

---

## 2. Form Input Inconsistencies

### Issue: Multiple Input Styling Patterns Without Unified Component Usage

**Severity:** 🟠 **HIGH**

#### Inline Styling Patterns Found:

| File | Pattern | Rounded | Border | Focus Ring |
|------|---------|---------|--------|-----------|
| `Patients/Create.jsx:69+` | Repeated inline | `rounded-lg` | `border` | `focus:ring-2 focus:ring-[#0D9488]` |
| `Appointments/BookPublic.jsx:99+` | Repeated inline | (none) | `border` | Similar pattern |
| `Appointments/Index.jsx:82+` | Repeated inline | `rounded-lg` | `border-gray-300` | Same pattern |
| `TextInput.jsx` | Component exists | `rounded-md` | `border-gray-300` | `focus:ring-indigo-500` |

**Code Comparison:**

**Current Multiple Inline Patterns:**
```jsx
// Pattern 1: Patients/Create.jsx
<input className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition ${errorClass}`} />

// Pattern 2: Appointments/BookPublic.jsx
<input type="text" className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none..." />

// Component (Unused): TextInput.jsx
<input className={'rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ...'} />
```

**Problems:**
- 🔴 Component `TextInput.jsx` exists but ignored; inline styles everywhere instead
- 🔴 Focus ring colors mismatch (teal vs indigo)
- 🔴 Border radii vary: `rounded-lg`, `rounded-md`, `rounded` (default)
- 🔴 Padding inconsistent: `px-3 py-2` vs `px-4 py-3`
- 🔴 Different error handling patterns
- 🔴 Placeholder colors assumed vs styled

### Recommendation:

Modify and standardize `TextInput.jsx`, then use it everywhere:

```jsx
// Updated TextInput.jsx
export default forwardRef(function TextInput(
    { type = 'text', variant = 'default', error = false, className = '', isFocused = false, ...props },
    ref,
) {
    const baseStyles = 'w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 transition'
    const focusStyles = 'focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent'
    const errorStyles = error ? 'border-red-500 focus:ring-red-500' : ''
    
    return (
        <input
            {...props}
            type={type}
            className={`${baseStyles} ${focusStyles} ${errorStyles} ${className}`}
            ref={localRef}
        />
    )
})
```

Usage:
```jsx
<TextInput error={!!errors.email} {...form.getFieldProps('email')} />
```

---

## 3. Dark Theme vs Light Theme Mismatch

### Issue: Inconsistent Color Theming Across Pages

**Severity:** 🔴 **CRITICAL**

#### Color Palette Misalignment:

| Component | Background | Text | Border | Used In |
|-----------|-----------|------|--------|---------|
| DataTable, Patient Dashboard | `#0E2C28` (dark teal) | `#E2FAF7` (light teal) | `rgba(45,212,191,0.12)` | Staff pages, Patient pages |
| Alerts, Cards | White (`bg-white`) | `text-gray-900` | `border-gray-200` | Staff/Patients/Create |
| Primary Brand | `#0D9488` (teal) | `#7ABFB9` (light) | Variable | Buttons, accents |
| StatCard Component | `bg-white` | `text-gray-900` | `border-l-4 border-teal-500` | Dashboard |

**Problems:**
- 🔴 Dark theme pages inconsistent with light theme components
- 🔴 `StatCard.jsx` uses light theme (`bg-white`) but dashboard uses dark theme
- 🔴 DataTable component hardcoded to dark theme only
- 🔴 No theming system to toggle themes
- 🔴 Colors hardcoded in components instead of Tailwind config
- 🔴 Missing accessibility contrast in some combinations

**File Examples:**
- `Patient/Dashboard.jsx:6`: `text-[#E2FAF7]` (light text on dark theme only)
- `Staff/Dashboard.jsx:72`: `bg-white border border-gray-200` (light theme)
- `DataTable.jsx:7-10`: Dark theme hardcoded with `#0E2C28` and `#E2FAF7`

### Recommendation:

Create unified color system in `tailwind.config.js`:

```jsx
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        teal: {
          DEFAULT: '#0D9488',
          light: '#14B8A6',
          dark: '#0A7A70',
          very_light: '#E2FAF7',
          very_dark: '#0E2C28',
          medium: '#7ABFB9'
        }
      }
    }
  }
}
```

Create a theme context:
```jsx
// ThemeContext.jsx
const ThemeContext = React.createContext()

export function useTheme() {
  const context = React.useContext(ThemeContext)
  return context
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = React.useState('dark') // or 'light'
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
```

---

## 4. Rounded Corner/Border Radius Inconsistencies

### Issue: No Standard Border Radius Scale

**Severity:** 🟠 **HIGH**

#### Found Patterns:

```
rounded-md      → Patient/Appointments forms (6px)
rounded-lg      → Most buttons, cards (8px)
rounded-xl      → Some cards (12px)
rounded-full    → Status badges (9999px)
rounded         → Default elements (4px)
(no class)      → Some inputs in old forms
```

**Inconsistency Examples:**

| Component | Border Radius | File |
|-----------|--------------|------|
| Section Cards | `rounded-lg` | `Welcome.jsx:19` |
| Section Cards | `rounded-xl` | `Staff/Checkin/Index.jsx:112` |
| Buttons | `rounded-lg` | Most buttons |
| Status Badges | `rounded-full` | Dashboard status badges |
| Alert Box | `rounded` | Some notification components |

**Problems:**
- 🔴 No designed system for when to use which radius
- 🔴 Cards and containers range from `rounded` to `rounded-xl`
- 🔴 Buttons mostly `rounded-lg` but inconsistent
- 🔴 Breaks visual hierarchy

### Recommendation:

Establish consistent scale:
```
- Buttons & Small Components: rounded-lg (8px)
- Cards & Containers: rounded-xl (12px)  
- Badges & Pills: rounded-full
- Form Inputs: rounded-lg (8px)
- Alert Boxes: rounded-lg (8px)
```

Update `tailwind.config.js`:
```jsx
borderRadius: {
  'button': '0.5rem',      // 8px - primary UI elements
  'card': '0.75rem',       // 12px - major containers
  'input': '0.5rem',       // 8px - form fields
  'pill': '9999px'         // Full rounding for badges
}
```

---

## 5. Spacing & Padding Inconsistencies

### Issue: No Unified Spacing Scale

**Severity:** 🟠 **HIGH**

#### Padding Patterns Found:

| Element | Padding | File | Context |
|---------|---------|------|---------|
| Cards | `p-6`, `p-4`, `p-2` | Various | Main content cards |
| Buttons | `px-3 py-2`, `px-4 py-3`, `px-8 py-4` | Various | Action buttons |
| Form Groups | Varies | Forms | Input wrappers |
| Sections | `space-y-6`, `space-y-4`, `space-y-3` | Layouts | Layout spacing |

**Code Examples:**

```jsx
// Staff/Dashboard.jsx - spacing inconsistency
<div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">

// Patient/Dashboard.jsx
<div className="bg-[#0E2C28] border-l-4 border-[#0D9488] p-6 rounded-lg">

// Appointments/Index.jsx - mixed spacing
space-y-6, mb-6, mt-8, gap-2, gap-3, gap-4
```

**Problems:**
- 🔴 No consistent spacing scale
- 🔴 Mix of margin and spacing classes without system
- 🔴 Gap sizes: 2, 3, 4, 6, 8 used inconsistently
- 🔴 No padding scale hierarchy

### Recommendation:

Apply consistent spacing scale from `tailwind.config.js`:

```jsx
spacing: {
  // Section/Container spacing
  'section': '1.5rem',      // 24px
  'card': '1.5rem',         // 24px
  'component': '1rem',      // 16px
  'input': '0.75rem',       // 12px  
}

// In components:
<div className="space-y-section">...</div>  // Large sections
<div className="space-y-component">...</div>  // Internal components
```

---

## 6. Typography Inconsistencies

### Issue: No Standardized Type Scale

**Severity:** 🟠 **HIGH**

#### Found Patterns:

| Hierarchy | Size | Weight | File | Purpose |
|-----------|------|--------|------|---------|
| H1 (Page) | `text-3xl` | `font-bold` | Dashboard pages | Page titles |
| H2 (Modal/Section) | `text-xl` | `font-bold` | Various | Section headers |
| H3 (Card) | `text-lg` | `font-bold` | Cards | Card titles |
| Body | `text-base` | `font-normal` | Content | Main text |
| Label | `text-sm` | `font-medium` | Forms | Form labels |
| Caption | `text-sm` | `font-normal` | Various | Secondary text |
| Tiny | `text-xs` | `font-semibold` | Buttons | Button text |

**Inconsistencies:**

```jsx
// Conflicting heading sizes for same purpose
<h1 className="text-3xl font-bold text-[#E2FAF7]">My Dashboard</h1>
<h1 className="text-2xl font-bold">Users</h1>
<h2 className="text-xl font-bold">Section Title</h2>

// Inconsistent body text
<p className="text-[#7ABFB9] text-lg">Paragraph</p>
<p className="text-[#7ABFB9] text-base">Text</p>
<p className="text-sm text-gray-600">Caption</p>
<p className="font-bold text-[#E2FAF7]">Label</p>  // No size specified
```

**Problems:**
- 🔴 No clear type hierarchy
- 🔴 Same component types use different sizes
- 🔴 Mixed `text-xs` for labels, buttons, and small text
- 🔴 Weight inconsistencies:  some use `font-semibold`, others `font-bold`
- 🔴 Default size sometimes assumed (`font-bold` without size)

### Recommendation:

Create typography utility classes:

```jsx
// In Tailwind config or CSS
@layer components {
  @apply text-h1 text-3xl font-bold;
  @apply text-h2 text-2xl font-bold;
  @apply text-h3 text-xl font-bold;
  @apply text-body text-base font-normal;
  @apply text-label text-sm font-medium;
  @apply text-caption text-xs font-normal;
  @apply text-button-label text-sm font-semibold;
}
```

Usage:
```jsx
<h1 className="text-h1">Dashboard</h1>
<p className="text-body">Content here</p>
<label className="text-label">Email Address</label>
```

---

## 7. Component Library Abandonment

### Issue: Existing Components Not Used; Styles Hardcoded Inline

**Severity:** 🟠 **HIGH**

#### Findings:

**Existing Components (Unused or Partially Used):**

| Component | Purpose | Current Usage |
|-----------|---------|---|
| `PrimaryButton.jsx` | Primary actions | ❌ Not used anywhere |
| `SecondaryButton.jsx` | Secondary actions | ❌ Not used anywhere |
| `DangerButton.jsx` | Delete/cancel actions | ❌ Not used anywhere |
| `TextInput.jsx` | Form inputs | ❌ Completely ignored; inline styles used |
| `InputLabel.jsx` | Form labels | ❌ Partially used |
| `InputError.jsx` | Error messages | ❌ Manual error rendering |
| `StatCard.jsx` | Dashboard stats | ✓ Used (but with light theme only) |
| `DataTable.jsx` | Data tables | ✓ Used (hardcoded to dark theme) |

**Example: Button Abandonment**

```jsx
// Component definition (unused)
export default function PrimaryButton({ className = '', disabled, children, ...props }) {
  return (
    <button
      className={`inline-flex items-center rounded-md border border-transparent bg-gray-800 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white...`}
    />
  )
}

// Actual usage in pages (inline style)
<button className="px-8 py-3 bg-[#0D9488] text-white rounded-lg hover:bg-[#14B8A6] transition-colors">
  Submit
</button>
```

**Example: Input Component Abandonment**

```jsx
// Existing TextInput component
<input className={'rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500...'} />

// Actual repeated pattern in forms (copied 40+ times)
<input className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition...`} />
```

**Problems:**
- 🔴 Components created for consistency but not used
- 🔴 Developers recreating styles inline, leading to duplication
- 🔴 40+ repeated input field styles across `Patients/Create.jsx` alone
- 🔴 If style components change, all inline copies must be updated manually
- 🔴 Maintenance nightmare

### Recommendation:

1. **Update all button components** to match current design:
```jsx
// Updated PrimaryButton.jsx
export default function PrimaryButton({
    className = '',
    disabled,
    size = 'md',
    children,
    ...props
}) {
    const sizeClasses = {
        sm: 'px-4 py-1.5 text-sm',
        md: 'px-6 py-2.5 text-base',
        lg: 'px-8 py-3.5 text-lg'
    }
    
    return (
        <button
            {...props}
            className={`inline-flex items-center rounded-lg border border-transparent bg-[#0D9488] hover:bg-[#0A7A70] text-white font-semibold transition-colors ${sizeClasses[size]} ${className}`}
            disabled={disabled}
        >
            {children}
        </button>
    )
}
```

2. **Enforce component usage** with linting rule or manual PR review

3. **Create component conversion guide** for team

---

## 8. Color Hardcoding Across Files

### Issue: No Centralized Color Palette; Colors Hardcoded Everywhere

**Severity:** 🟠 **HIGH**

#### Found Hardcoded Colors:

```
#0D9488         → Primary teal (button hover, accents, success)
#0A7A70         → Darker teal (button hover state)
#14B8A6         → Lighter teal (button hover, accents)
#0E2C28         → Very dark teal (dark background)
#E2FAF7         → Very light teal (light text)
#7ABFB9         → Medium teal (secondary text)
#F59E0B         → Amber (warning, secondary actions)
rgba(45,212,191,0.12) → Teal with opacity (borders)
```

**Occurrences:** 200+ instances of color hardcoding

**Examples:**
```jsx
// Welcome.jsx:12
className="px-8 py-3 bg-[#0D9488] text-white rounded-lg hover:bg-[#14B8A6]"

// Staff/Dashboard.jsx:139
className="flex items-start gap-4 p-4 bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200 rounded-lg hover:border-[#0D9488]"

// DataTable.jsx - hardcoded colors
<th className="px-6 py-3 text-[#0D9488] font-semibold">
<tr className="border-b border-[rgba(45,212,191,0.12)] hover:bg-[#0F2724]">
```

**Problems:**
- 🔴 No single source of truth for colors
- 🔴 Changing brand color requires 200+ file edits
- 🔴 Inconsistent shade usage (e.g., multiple teal variants)
- 🔴 Cannot implement dark mode without rewriting everything
- 🔴 Colors not optimized for accessibility

### Recommendation:

**Update `tailwind.config.js`:**

```jsx
export default {
  theme: {
    extend: {
      colors: {
        'brand': {
          'primary': '#0D9488',      // Main teal
          'primary-dark': '#0A7A70',  // Button hover
          'primary-light': '#14B8A6', // Lighter accent
          'bg-dark': '#0E2C28',       // Dark BG
          'bg-hover': '#0F2724',      // Dark hover
          'text-light': '#E2FAF7',    // Light text on dark
          'text-muted': '#7ABFB9',    // Secondary text
          'text-muted-dark': '#4A8C85',
          'border-light': 'rgba(45,212,191,0.12)',
          'accent-warning': '#F59E0B'
        }
      }
    }
  }
}
```

**Usage (Replace hardcoded):**

```jsx
// Before
className="bg-[#0D9488] hover:bg-[#0A7A70]"

// After
className="bg-brand-primary hover:bg-brand-primary-dark"

// Before
className="text-[#E2FAF7] bg-[#0E2C28]"

// After
className="text-brand-text-light bg-brand-bg-dark"

// Before
<div className="border border-[rgba(45,212,191,0.12)]">

// After
<div className="border border-brand-border-light">
```

---

## 9. Modal/Dialog Styling Inconsistencies

### Issue: Different Styling Approaches Across Modals

**Severity:** 🟡 **MEDIUM**

#### Examples:

| File | Pattern | Overflow Handling |
|------|---------|------------------|
| `Modal.jsx` | `bg-white rounded-lg` | Headless UI handled |
| `ConfirmModal.jsx` | Custom implementation | Variable |
| `Appointments/Index.jsx` | Modal not found | Inline implementation? |

**Problems:**
- 🟡 `Modal.jsx` component exists but unclear if it's used everywhere
- 🟡 No standardized modal sizing (`max-w-sm`, `max-w-md`, `max-w-lg`, `max-w-2xl`)
- 🟡 No consistency in modal header/footer styling
- 🟡 Backdrop color hardcoded as `bg-gray-500/75` (not brand color)

### Recommendation:

Extend Modal component:
```jsx
export default function Modal({
    children,
    show = false,
    maxWidth = '2xl',
    closeable = true,
    title,
    footer,
    onClose = () => {},
}) {
    return (
        <Transition show={show} leave="duration-200">
            <Dialog as="div" id="modal" onClose={close}>
                <TransitionChild>
                    <div className="absolute inset-0 bg-black/50" />
                </TransitionChild>
                <DialogPanel className="rounded-xl bg-white shadow-xl">
                    {title && (
                        <div className="border-b border-gray-200 px-6 py-4">
                            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                        </div>
                    )}
                    <div className="px-6 py-4">
                        {children}
                    </div>
                    {footer && (
                        <div className="border-t border-gray-200 flex justify-end gap-3 px-6 py-4">
                            {footer}
                        </div>
                    )}
                </DialogPanel>
            </Dialog>
        </Transition>
    )
}
```

---

## 10. Alert/Notification Box Inconsistencies

### Issue: Different Alert Styling in Different Pages

**Severity:** 🟡 **MEDIUM**

#### Found Patterns:

| Location | Style | Border | Background | Usage |
|----------|-------|--------|------------|-------|
| `Staff/Notifications/Index.jsx:60` | Teal border-l, rounded-lg, p-4 | Yes | Color-coded | Notification items |
| `Staff/Dashboard.jsx:53` | Yellow alert | `border-l-4 border-yellow-400` | `bg-yellow-50` | Warning banner |
| `Appointments/BookPublic.jsx:178` | Inline error | Red text, small | N/A | Form errors |
| `Appointments/Confirmation.jsx:104` | Inline list | N/A | Semi-transparent | Info box |

**Problems:**
- 🟡 No unified alert component
- 🟡 Color patterns vary (border-l vs border)
- 🟡 Padding inconsistent (`p-4`, `p-6`, no padding + text-sm)
- 🟡 No standard for error/warning/success/info alerts
- 🟡 `FlashMessage.jsx` component exists but unclear how it's used

### Recommendation:

Create unified Alert component:

```jsx
// Alert.jsx
export default function Alert({ type = 'info', title, children, onClose }) {
    const styles = {
        success: {
            bg: 'bg-green-50',
            border: 'border-l-4 border-green-500',
            text: 'text-green-800',
            title: 'text-green-900 font-semibold'
        },
        error: {
            bg: 'bg-red-50',
            border: 'border-l-4 border-red-500',
            text: 'text-red-800',
            title: 'text-red-900 font-semibold'
        },
        warning: {
            bg: 'bg-yellow-50',
            border: 'border-l-4 border-yellow-500',
            text: 'text-yellow-800',
            title: 'text-yellow-900 font-semibold'
        },
        info: {
            bg: 'bg-blue-50',
            border: 'border-l-4 border-blue-500',
            text: 'text-blue-800',
            title: 'text-blue-900 font-semibold'
        }
    }
    
    const style = styles[type]
    
    return (
        <div className={`${style.bg} ${style.border} p-4 rounded-lg`}>
            {title && <h4 className={style.title}>{title}</h4>}
            <p className={style.text}>{children}</p>
        </div>
    )
}
```

---

## Summary of Inconsistencies by Impact

### 🔴 CRITICAL (Immediate Action Required)

1. **Button Padding/Size System** - Affects every page, 100+ instances
2. **Dark/Light Theme Mismatch** - Breaks visual consistency across sections
3. **Unused Component Library** - Causes code duplication and maintenance debt

### 🟠 HIGH (Priority)

4. **Form Input Styling** - 40+ repeated patterns causing duplication
5. **Hardcoded Colors** - 200+ instances prevent brand updates
6. **Border Radius Scale** - No hierarchy, looks unprofessional
7. **Spacing System** - No consistent scale

### 🟡 MEDIUM

8. **Typography Scale** - Missing hierarchy
9. **Modal Styling** - Minor inconsistencies
10. **Alert Components** - Multiple implementations

---

## Implementation Priority

### Phase 1 (Week 1) - Foundation
- [ ] Create unified button component system
- [ ] Update color palette in `tailwind.config.js`
- [ ] Update TextInput, InputLabel, InputError components

### Phase 2 (Week 2) - Component Updates
- [ ] Replace all button inline styles with component
- [ ] Replace all input inline styles with components
- [ ] Update form labels and error messages

### Phase 3 (Week 3) - Advanced Updates
- [ ] Implement consistent spacing scale
- [ ] Create typography utilities
- [ ] Create Alert component system
- [ ] Update Modal component

### Phase 4 (Week 4) - Review & Testing
- [ ] QA all pages for visual consistency
- [ ] Update documentation
- [ ] Create style guide for team

---

## Code Change Examples

### Example 1: Button Conversion
```jsx
// BEFORE (Welcome.jsx)
<button
    onClick={() => navigate('/appointments/book')}
    className="px-8 py-3 bg-[#0D9488] text-white rounded-lg hover:bg-[#14B8A6] transition-colors"
>
    Book Now
</button>

// AFTER
import PrimaryButton from '@/Components/PrimaryButton'

<PrimaryButton onClick={() => navigate('/appointments/book')} size="lg">
    Book Now
</PrimaryButton>
```

### Example 2: Input Field Conversion
```jsx
// BEFORE (Patients/Create.jsx)
<input
    type="email"
    value={formData.email}
    onChange={(e) => setFormData({...formData, email: e.target.value})}
    className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition ${
        errors.email ? 'border-red-500' : 'border-gray-300'
    }`}
/>

// AFTER
import TextInput from '@/Components/TextInput'

<TextInput
    type="email"
    value={formData.email}
    onChange={(e) => setFormData({...formData, email: e.target.value})}
    error={!!errors.email}
    errorMessage={errors.email}
/>
```

### Example 3: Color Conversion
```jsx
// BEFORE
<div className="bg-[#0D9488] text-[#E2FAF7] border border-[rgba(45,212,191,0.12)]">

// AFTER
<div className="bg-brand-primary text-brand-text-light border border-brand-border-light">
```

---

## References

- **Color Palette:** `tailwind.config.js` (to be created)
- **Component Library:** `resources/js/Components/`
- **Design System:** Dental Clinic brand guidelines (if exists)
- **Tailwind CSS:** https://tailwindcss.com/docs

---

**Document Status:** Complete  
**Last Updated:** $(date)  
**Prepared By:** UI/UX Analysis Tool
