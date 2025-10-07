---
background: /bg-blue-bottom-right.jpeg
---

# Exercise 02: Expanding Dashboard Specs

**Time:** 15 minutes
**Goal:** Generate additional specifications for Customer Intelligence Dashboard components

## The Challenge

Build on your CustomerCard specification experience to create specs for additional dashboard components, practicing requirements analysis and component integration planning.

## Success Criteria

- [ ] Generate 1-2 additional component specifications
- [ ] Ensure consistent interface patterns across specs
- [ ] Document component integration points
- [ ] All specs follow template structure completely

---

## Your Task

**Choose one dashboard component to specify:**

<div class="grid grid-cols-3 gap-4 text-sm">

<div>

**CustomerSelector**
```
@templates/spec-template.md
+ @requirements/customer-selector.md
```
Focus: Container, search, selection

</div>

<div>

**HealthScoreCalculator**
```
@templates/spec-template.md
+ @requirements/health-score-calculator.md
```
Focus: Business logic, algorithms

</div>

<div>

**MarketIntelligence**
```
@templates/spec-template.md
+ @requirements/market-intelligence.md
```
Focus: Data display, integration

</div>

</div>

**Cross-check integration with CustomerCard spec, then save:**
```
git add @specs/*.md && git commit -m "docs: expand dashboard specifications"
```

## Expected Outcomes

- 1-2 additional dashboard component specifications
- Understanding of component integration planning
- Experience with different component types (container, business logic, data display)
- Consistent specification patterns across multiple components