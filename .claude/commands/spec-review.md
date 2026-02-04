# Spec Review Command

Review and validate a specification file against the project's spec template.

## Instructions

You are reviewing the spec file at: $ARGUMENTS

1. **Read the spec file** at the provided path
2. **Read the template** at `templates/spec-template.md` for reference
3. **Validate required sections** - Check that the spec contains all required sections:
   - `### Context` - Must include purpose, system fit, and user information
   - `### Requirements` - Must include functional, UI, data, and integration requirements
   - `### Constraints` - Must include technical stack, performance, design, file structure, props interface, and security
   - `### Acceptance Criteria` - Must include testable criteria as checkboxes

4. **Evaluate completeness** for each section:
   - **Complete**: Section has substantive content addressing all subsections
   - **Partial**: Section exists but missing key details
   - **Missing**: Section not found

5. **Provide actionable feedback**:
   - List specific missing subsections
   - Suggest improvements for incomplete areas
   - Note any ambiguous requirements that need clarification

6. **Return a validation summary** in this format:

```
## Spec Validation: [filename]

### Section Status
| Section | Status | Notes |
|---------|--------|-------|
| Context | ✅/⚠️/❌ | ... |
| Requirements | ✅/⚠️/❌ | ... |
| Constraints | ✅/⚠️/❌ | ... |
| Acceptance Criteria | ✅/⚠️/❌ | ... |

### Issues Found
- [List specific issues]

### Recommendations
- [Actionable improvements]

### Overall: PASS / NEEDS WORK / FAIL
```

If no file path is provided, respond with: "Usage: /spec-review <path-to-spec-file>"
