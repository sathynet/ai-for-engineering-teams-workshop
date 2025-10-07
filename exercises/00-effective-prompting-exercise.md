---
background: /bg-blue-bottom-right.jpeg
---

# Exercise 00: Effective Prompting

**Time:** 15 minutes
**Goal:** Compare vague vs refined prompts and measure token efficiency

## The Challenge

You need a button component for the Customer Intelligence Dashboard. You'll create it twice - first with a vague prompt, then with a refined prompt - and compare the results.

## Record your results ##
- Token count: ________
- Did the output match your needs?
- How many follow-up questions or iterations were needed?

---
background: /bg-blue-bottom-right.jpeg
---

## Part 1: Try a Vague Prompt

**1. Ask Claude Code:**
```
Generate a spec for a button component
```

**2. After Claude responds, run:**
```
/context
```

**3. Note these metrics:**
- Input tokens used
- Output tokens generated
- Total conversation tokens
- Quality of the generated spec (completeness, detail)

**4. Start a new conversation**
```
/clear
```
---
background: /bg-blue-bottom-right.jpeg
---

## Part 2: Try a Refined Prompt

<div class="grid grid-cols-2 gap-8">

<div>

**1. Ask Claude Code:**
```
Generate a spec for a button component

Context:
- Button component for the Customer 
Intelligence Dashboard
- Used throughout the dashboard for primary
actions
- Part of the design system that needs consistency

Requirements:
- Accept label, onClick, and variant props
- Support variants: primary, secondary, danger
- Include loading state with spinner
- Accessible with proper ARIA labels
- Follow our spec template structure

Constraints:
- React 19 with TypeScript
- Tailwind CSS for styling
- Export TypeScript interface for props
- Maximum width: 200px
- Store the generated spec in @specs/
```

</div>

<div>

**2. After Claude responds, run:**
```
/context
```

**3. Note these metrics:**
- Input tokens used
- Output tokens generated
- Total conversation tokens
- Quality of the generated spec (completeness, detail)
- Did it follow the spec template structure correctly?

</div>

</div>

