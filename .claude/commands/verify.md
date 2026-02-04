# Component Verification Command

Verify that a React component is correctly implemented with TypeScript types, rendering tests, and responsive design checks.

## Instructions

You are verifying the component: **$ARGUMENTS**

If no component path is provided, respond with: "Usage: /verify <component-path> (e.g., /verify components/CustomerCard.tsx or /verify CustomerHealthDisplay)"

### Steps

1. **Normalize the component path**
   - Accept formats: "ComponentName", "components/ComponentName.tsx", "src/components/ComponentName.tsx"
   - Resolve to full path: `src/components/<ComponentName>.tsx`
   - Store component name (PascalCase) for later use

2. **File Existence Check**
   - Verify the component file exists at the resolved path
   - If not found, check common locations:
     - `src/components/<ComponentName>.tsx`
     - `src/components/<ComponentName>/index.tsx`
     - `components/<ComponentName>.tsx`
   - If still not found, report error and exit

3. **TypeScript Type Check**
   - Run: `npm run type-check` or `npx tsc --noEmit`
   - Parse output for errors related to the component file
   - Check for:
     - ✓ No TypeScript errors
     - ✓ Props interface properly typed
     - ✓ No `any` types used
     - ✓ Return type specified
   - **Result**: Pass/Fail with specific error messages

4. **Component Structure Analysis**
   - Read the component file
   - Verify:
     - ✓ Valid React component (function or class)
     - ✓ Props interface exported or defined
     - ✓ Default export present
     - ✓ Proper imports (React, types, etc.)
   - Check for common issues:
     - Missing 'use client' directive (if using hooks)
     - Unused imports
     - Missing prop types
   - **Result**: Pass/Fail with specific issues

5. **Mock Data Compatibility Check**
   - Identify the data type from props interface
   - Attempt to locate mock data:
     - `src/data/mock-<datatype>.ts`
     - `src/data/mock-customers.ts`
     - Common mock data files in project
   - Verify mock data matches expected props interface
   - Check if at least one mock object can satisfy the props
   - **Result**: Pass/Fail with compatibility notes

6. **Render Test**
   - Create a temporary test file: `/tmp/verify-<component>-test.tsx`
   - Generate test code that:
     ```typescript
     import Component from 'path/to/component';
     import mockData from 'path/to/mock-data';

     // Attempt to render with mock data
     const test = <Component {...mockData[0]} />;
     ```
   - Check if it compiles without errors
   - **Result**: Pass/Fail with render errors if any
   - Clean up test file

7. **Responsive Design Check**
   - Analyze component code for responsive patterns:
     - ✓ Tailwind responsive classes (sm:, md:, lg:, xl:)
     - ✓ Flexbox or Grid layout
     - ✓ Proper breakpoint usage
   - Check for common breakpoints:
     - Mobile: default (< 640px)
     - Tablet: sm: (≥ 640px)
     - Desktop: md: (≥ 768px), lg: (≥ 1024px)
   - Identify responsive patterns:
     - Layout changes (column to row)
     - Text size adjustments
     - Spacing variations
     - Hidden elements at breakpoints
   - **Result**: Pass/Fail with responsive coverage report

8. **Accessibility Check**
   - Scan for accessibility features:
     - ✓ Semantic HTML elements
     - ✓ ARIA labels and roles
     - ✓ Keyboard navigation support (tabIndex, onKeyDown)
     - ✓ Alt text for images
     - ✓ Color contrast considerations
   - Identify missing accessibility features
   - **Result**: Pass/Fail with accessibility score

9. **Integration Check**
   - Search for component usage in `src/app/page.tsx` or other files
   - Verify the component is actually integrated into the application
   - Check if it's imported and rendered
   - **Result**: Pass/Fail with usage status

10. **Generate Verification Report**

    ```markdown
    # Verification Report: <ComponentName>

    **File**: `src/components/<ComponentName>.tsx`
    **Date**: <timestamp>
    **Overall Status**: ✅ PASS | ⚠️ PASS WITH WARNINGS | ❌ FAIL

    ---

    ## Test Results

    ### 1. File Existence: ✅ PASS | ❌ FAIL
    - Location: `<path>`
    - Size: <size> bytes

    ### 2. TypeScript Types: ✅ PASS | ❌ FAIL
    - No type errors: ✅ | ❌
    - Props interface defined: ✅ | ❌
    - No `any` types: ✅ | ❌
    - Issues: <list any issues>

    ### 3. Component Structure: ✅ PASS | ❌ FAIL
    - Valid React component: ✅ | ❌
    - Default export: ✅ | ❌
    - Props interface: ✅ | ❌
    - Issues: <list any issues>

    ### 4. Mock Data Compatibility: ✅ PASS | ❌ FAIL
    - Mock data found: ✅ | ❌
    - Type compatibility: ✅ | ❌
    - Data source: `<path>`
    - Issues: <list any issues>

    ### 5. Render Test: ✅ PASS | ❌ FAIL
    - Component renders: ✅ | ❌
    - No runtime errors: ✅ | ❌
    - Issues: <list any issues>

    ### 6. Responsive Design: ✅ PASS | ⚠️ PARTIAL | ❌ FAIL
    - Breakpoints used: <list breakpoints>
    - Mobile support: ✅ | ❌
    - Tablet support: ✅ | ❌
    - Desktop support: ✅ | ❌
    - Coverage: <percentage>%
    - Issues: <list any issues>

    ### 7. Accessibility: ✅ PASS | ⚠️ PARTIAL | ❌ FAIL
    - Semantic HTML: ✅ | ❌
    - ARIA labels: ✅ | ❌
    - Keyboard navigation: ✅ | ❌
    - Score: <score>/100
    - Issues: <list any issues>

    ### 8. Integration: ✅ PASS | ❌ FAIL
    - Used in application: ✅ | ❌
    - Locations: <list files>

    ---

    ## Summary

    **Tests Passed**: <count>/<total>
    **Tests Failed**: <count>
    **Warnings**: <count>

    ### Critical Issues
    <list critical issues that must be fixed>

    ### Recommendations
    <list improvements and best practices>

    ### Next Steps
    <suggest next actions based on results>
    ```

11. **Save Report** (optional)
    - If verification fails, save detailed report to: `verification-reports/<component-name>-<timestamp>.md`
    - Inform user of report location

### Guidelines

- Be thorough but concise in reporting
- Prioritize critical issues (TypeScript errors, render failures)
- Provide actionable feedback with line numbers when possible
- Include code snippets for problematic sections
- Suggest fixes for common issues
- Mark warnings vs. hard failures clearly
- Consider the component's purpose (complex vs. simple components)
- Validate against project standards (Tailwind, Next.js patterns)

### Error Handling

- If component doesn't exist: List similar components found
- If mock data missing: Suggest creating appropriate mock data
- If TypeScript fails: Show relevant error messages with context
- If integration missing: Show how to integrate into page.tsx

### Success Criteria

A component passes verification if:
- ✅ TypeScript compiles without errors
- ✅ Component renders with mock data
- ✅ At least 2 responsive breakpoints implemented
- ✅ Basic accessibility features present
- ✅ Integrated into the application

A component passes with warnings if:
- ✅ Core functionality works
- ⚠️ Missing some responsive breakpoints
- ⚠️ Limited accessibility features
- ⚠️ Not yet integrated

A component fails if:
- ❌ TypeScript errors present
- ❌ Cannot render with mock data
- ❌ No responsive design
- ❌ Critical accessibility issues
