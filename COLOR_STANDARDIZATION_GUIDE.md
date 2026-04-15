# Color Standardization Fix Guide

## Quick Start
This guide will help you systematically replace all hardcoded colors with Tailwind design system tokens.

## Files Needing Fixes (Priority Order)
1. **Home.jsx** (95+ instances)
2. **Appointments/Confirmation.jsx** (50+ instances)
3. **Appointments/BookPublic.jsx** (30+ instances)
4. **Appointments/Edit.jsx**, **Show.jsx**, etc.
5. **Admin/Users/Index.jsx**, **Create.jsx**, **Edit.jsx**
6. **Admin/AuditLog.jsx**, **Reports.jsx**, etc.

## Color Mapping Reference

### Use `brand-primary` (Teal #0D9488) for:
- Primary CTA buttons
- Link hover states
- Icon accents
- Primary accent colors

```
OLD: text-[#0D9488] → NEW: text-brand-primary
OLD: bg-[#0D9488] → NEW: bg-brand-primary
OLD: border-[#0D9488] → NEW: border-brand-primary
```

### Use `brand-primary-dark` (#0A7A70) for:
- Button hover states
- Active states

```
OLD: hover:bg-[#0A7A70] → NEW: hover:bg-brand-primary-dark
```

### Use `brand-primary-very-dark` (#086860) for:
- Button pressed/active states

```
OLD: active:bg-[#086860] → NEW: active:bg-brand-primary-very-dark
```

### Use `brand-primary-light` (#14B8A6) for:
- Light accents
- Secondary highlights

```
OLD: from-[#14B8A6] → NEW: from-brand-primary-light
```

### Use `brand-bg-dark` (#0E2C28) for:
- Page/section backgrounds (dark theme)
- Card backgrounds on dark backgrounds

```
OLD: bg-[#0E2C28] → NEW: bg-brand-bg-dark
OLD: from-[#0E2C28] → NEW: from-brand-bg-dark
```

### Use `brand-bg-darker` (#061A18) for:
- Header backgrounds
- Navigation bars
- Overlay backgrounds
- Darkest page elements

```
OLD: bg-[#061A18] → NEW: bg-brand-bg-darker
```

### Use `brand-bg-hover` (#0F2724) for:
- Hover states on dark backgrounds
- Secondary backgrounds

```
OLD: to-[#0F2724] → NEW: to-brand-bg-hover
```

### Use `brand-text-light` (#E2FAF7) for:
- Primary text on dark backgrounds
- Headings on dark backgrounds

```
OLD: text-[#E2FAF7] → NEW: text-brand-text-light
```

### Use `brand-text-muted` (#7ABFB9) for:
- Secondary text on dark backgrounds
- Subtitles
- Help text

```
OLD: text-[#7ABFB9] → NEW: text-brand-text-muted
```

### Use `brand-text-muted-dark` (#4A8C85) for:
- Dark secondary text
- Diminished secondary elements

```
OLD: text-[#4A8C85] → NEW: text-brand-text-muted-dark
```

### Use `brand-accent-warning` (#F59E0B) for:
- Warning/alert accents
- Attention-grabbing elements

```
OLD: to-[#F59E0B] → NEW: to-brand-accent-warning
```

## Border Color Fixes

### Use `border-brand-primary` for:
- Primary accent borders

```
OLD: border-[#0D9488] → NEW: border-brand-primary
OLD: border-[#0D9488]/20 → NEW: border-brand-primary/20
```

### Use `border-[rgba(45,212,191,0.12)]` (Brand border color):
- Subtle borders on dark backgrounds with opacity
- Keep as-is or can use `border-brand-primary/20`

```
OLD: border-[rgba(45,212,191,0.12)] → NEW: border-brand-primary/20
```

## Border Radius Fixes

### Use `rounded-button` (8px) for:
- Input fields
- Buttons
- Small interactive elements

```
OLD: rounded-md → NEW: rounded-button  (or leave as-is, both are 8px)
OLD: rounded-lg → Stay rounded-lg (12px, not 8px)
```

### Use `rounded-card` (12px) for:
- Cards
- Modals
- Larger containers

```
OLD: rounded-2xl → NEW: rounded-lg or rounded-card
OLD: rounded-xl → NEW: rounded-lg or rounded-card
```

## Gradient Fixes

When using gradients with colors:

```
OLD: 
from-[#0D9488]/20 to-[#F59E0B]/20
NEW: 
from-brand-primary/20 to-brand-accent-warning/20

OLD:
from-[#0E2C28] to-[#0F2724]
NEW:
from-brand-bg-dark to-brand-bg-hover

OLD:
from-[#0D9488]/10 to-transparent
NEW:
from-brand-primary/10 to-transparent
```

## Shadow Color Fixes

Shadows with colors should use tokens too:

```
OLD: 
shadow-[#0D9488]/10
NEW:
shadow-brand-primary/10
```

## Semi-Transparent Color Fixes

Opacity modifiers work with brand tokens:

```
OLD: 
bg-[#0D9488]/20 hover:bg-[#0D9488]/40
NEW:
bg-brand-primary/20 hover:bg-brand-primary/40

OLD:
border-[#0D9488]/30
NEW:
border-brand-primary/30
```

## Quick Find & Replace Commands

You can use these patterns in your editor's Find & Replace:

### Find & Replace Examples (use Regex mode)

1. **Replace `#0D9488` with `brand-primary`:**
   - Find: `\[#0D9488\]`
   - Replace: `[brand-primary]`
   - Then change regex to non-regex and replace `text-[brand-primary]` with `text-brand-primary`

2. **Replace `#0E2C28` with `brand-bg-dark`:**
   - Find: `\[#0E2C28\]`
   - Replace: `[brand-bg-dark]`

3. **Replace all hardcoded colors at once:**
   - Find: `bg-\[#061A18\]|bg-\[#0E2C28\]|text-\[#E2FAF7\]|text-\[#7ABFB9\]|border-\[#0D9488\]`
   - Replace: (process each match individually)

## Manual Fix Process

For each file:

1. **Open the file**
2. **Scan for hardcoded colors** - look for patterns like `[#0D9488]`, `[#0E2C28]`, etc.
3. **Replace with design system token** - use the mapping above
4. **Test responsiveness** - check on mobile, tablet, desktop
5. **Commit with message** like "Standardize colors in Home.jsx"

## Example Fixes

### Before (Home.jsx, line 38-39):
```jsx
<h1 className="text-6xl font-bold text-[#E2FAF7] leading-tight">
    Your Smile,<br /><span className="text-[#0D9488]">Our Priority</span>
</h1>
```

### After:
```jsx
<h1 className="text-6xl font-bold text-brand-text-light leading-tight">
    Your Smile,<br /><span className="text-brand-primary">Our Priority</span>
</h1>
```

---

### Before (Confirmation.jsx, line 47):
```jsx
<div className="bg-gradient-to-br from-[#0E2C28] to-[#0F2724] border border-[rgba(45,212,191,0.12)] rounded-2xl p-8 space-y-6">
```

### After:
```jsx
<div className="bg-gradient-to-br from-brand-bg-dark to-brand-bg-hover border border-brand-primary/20 rounded-card p-8 space-y-6">
```

---

### Before (BookPublic.jsx, lines 96):
```jsx
className={`w-full px-4 py-2 bg-[#061A18] border rounded-lg text-[#E2FAF7] placeholder-[#7ABFB9]/50 focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488] outline-none transition-all`}
```

### After (use FormField component instead):
```jsx
<FormField
    label="First Name"
    type="text"
    value={firstName}
    onChange={(e) => setFirstName(e.target.value)}
/>
```

## Verification Checklist

After fixing a file, verify:

- [ ] No hardcoded hex colors remain (scan for `[#` pattern)
- [ ] All border colors use design system or variants
- [ ] Border radius values are from design system
- [ ] Text colors follow theme (dark on light, light on dark)
- [ ] Tested on mobile view
- [ ] Component renders correctly
- [ ] Hover/active states work properly

## Tools & Shortcuts

### VS Code Regex Find & Replace
1. Click ".*" button to enable Regex mode
2. Use regex patterns from above section

### Command Line (for verification)
```bash
# Find all hardcoded colors in a file
grep -E "#0D9488|#0E2C28|#0F2724|#E2FAF7|#7ABFB9" resources/js/Pages/Home.jsx

# Find all hardcoded colors in all JSX files
grep -r -E "#0D9488|#0E2C28|#0F2724|#E2FAF7|#7ABFB9" resources/js/Pages/
```

## Questions?
Refer to `DESIGN_SYSTEM.md` for component usage and full color reference.
