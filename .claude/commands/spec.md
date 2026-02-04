# Spec Generator Command

Generate a specification file from requirements using the project template.

## Instructions

You are generating a spec for: **$ARGUMENTS**

If no component name is provided, respond with: "Usage: /spec <ComponentName> (e.g., /spec CustomerCard)"

### Steps

1. **Normalize the component name**
   - Convert to kebab-case for file paths (e.g., "CustomerCard" → "customer-card")
   - Keep PascalCase for the feature title

2. **Check for requirements file**
   - Look for: `requirements/<component-name>.md`
   - If not found, inform the user and ask if they want to proceed without requirements

3. **Read the template**
   - Load `templates/spec-template.md` for the structure

4. **Generate the spec** with these sections:

   ```markdown
   # Spec Template for Workshop

   ## Feature: [ComponentName]

   ### Context
   - Purpose and role in the application
   - How it fits into the larger system
   - Who will use it and when

   ### Requirements
   - Functional requirements (what it must do)
   - User interface requirements
   - Data requirements
   - Integration requirements

   ### Constraints
   - Technical stack and frameworks (Next.js 15, React 19, TypeScript, Tailwind CSS)
   - Performance requirements (load times, rendering thresholds)
   - Design constraints (responsive breakpoints, component size limits)
   - File structure and naming conventions
   - Props interface and TypeScript definitions
   - Security considerations

   ### Acceptance Criteria
   - [ ] Testable success criteria as checkboxes
   ```

5. **Populate from requirements**
   - Extract and organize content from the requirements file
   - Infer technical constraints from the project stack
   - Generate specific acceptance criteria based on functional requirements
   - Include TypeScript interface definitions where applicable

6. **Save the spec**
   - Write to: `specs/<component-name>.md`
   - Confirm the file was created

7. **Provide summary**
   ```
   ✓ Generated spec: specs/<component-name>.md

   Sections populated:
   - Context: [source]
   - Requirements: [source]
   - Constraints: [inferred/specified]
   - Acceptance Criteria: [count] items

   Next steps:
   - Review and refine the generated spec
   - Use /spec-review specs/<component-name>.md to validate
   ```

### Guidelines

- Be specific in acceptance criteria (include measurable outcomes)
- Include props interface in Constraints section
- Reference actual file paths from the project
- Add edge cases to acceptance criteria
- Keep requirements atomic and testable
