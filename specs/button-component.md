# Feature: Button Component

## Context
- Reusable button component for the Customer Intelligence Dashboard
- Part of the design system ensuring visual consistency across the application
- Used throughout the dashboard for primary user actions (submit, cancel, delete, etc.)
- Foundation component that other interactive elements will build upon
- Critical for maintaining accessible and consistent user interactions

## Requirements

### Functional Requirements
- Accept `label` prop for button text content
- Accept `onClick` handler for click events
- Support three variants: `primary`, `secondary`, `danger`
- Include loading state that disables interaction and shows spinner
- Prevent multiple submissions during loading state
- Support disabled state independent of loading

### User Interface Requirements
- Variant styling:
  - Primary: Blue background (`bg-blue-600`), white text, used for main actions
  - Secondary: Gray background (`bg-gray-200`), dark text, used for cancel/back actions
  - Danger: Red background (`bg-red-600`), white text, used for destructive actions
- Loading state displays spinner icon replacing or alongside label
- Hover and focus states for each variant
- Disabled state with reduced opacity and cursor change
- Consistent padding and rounded corners across variants

### Data Requirements
- Props interface with TypeScript strict typing
- `label`: string (required)
- `onClick`: function (required)
- `variant`: 'primary' | 'secondary' | 'danger' (default: 'primary')
- `isLoading`: boolean (default: false)
- `disabled`: boolean (default: false)
- `type`: 'button' | 'submit' | 'reset' (default: 'button')
- `ariaLabel`: string (optional, for accessibility override)

### Integration Requirements
- Importable from `@/components/Button`
- Works with form submissions and standalone click handlers
- Compatible with React 19 event handling
- Props interface exported for parent component typing

## Constraints

### Technical Stack
- Next.js 15 (App Router)
- React 19
- TypeScript with strict mode
- Tailwind CSS for styling (no external UI libraries)

### Performance Requirements
- Fast rendering (< 8ms per button)
- No unnecessary re-renders (use React.memo if needed)
- Lightweight spinner animation (CSS-based, no heavy libraries)

### Design Constraints
- Maximum width: 200px
- Minimum width: 80px
- Height: 40px (consistent across variants)
- Border radius: 8px (`rounded-lg`)
- Font: 14px semi-bold (`text-sm font-semibold`)
- Padding: 8px vertical, 16px horizontal (`py-2 px-4`)

### File Structure and Naming
- Component file: `components/Button.tsx`
- Props interface: `ButtonProps` exported from component file
- Follow project naming conventions (PascalCase for components)

### Accessibility Requirements
- Proper `aria-label` support for icon-only or unclear labels
- `aria-busy="true"` during loading state
- `aria-disabled="true"` when disabled
- Visible focus ring for keyboard navigation
- Minimum touch target size (40px height)

### Security Considerations
- Sanitize any dynamic label content
- Prevent click handler execution during loading/disabled states
- No sensitive data in button labels or ARIA attributes

## Acceptance Criteria

- [ ] Renders with correct label text
- [ ] Executes onClick handler when clicked
- [ ] Primary variant displays blue background with white text
- [ ] Secondary variant displays gray background with dark text
- [ ] Danger variant displays red background with white text
- [ ] Loading state shows spinner and disables button
- [ ] Loading state sets `aria-busy="true"`
- [ ] Disabled state prevents clicks and shows visual feedback
- [ ] Hover states work correctly for all variants
- [ ] Focus ring visible for keyboard navigation
- [ ] Maximum width constrained to 200px
- [ ] TypeScript `ButtonProps` interface exported
- [ ] Passes TypeScript strict mode checks
- [ ] No console errors or warnings
- [ ] Accessible with screen readers (proper ARIA attributes)
- [ ] Works in forms with `type="submit"`
