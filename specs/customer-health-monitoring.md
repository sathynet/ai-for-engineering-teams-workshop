# Spec Template for Workshop

## Feature: Customer Health Monitoring

### Context
- Purpose and role in the application: Comprehensive customer health monitoring system combining health score calculation with predictive alerting for proactive customer risk management
- How it fits into the larger system: Core intelligence layer integrating health scoring (`lib/healthCalculator.ts`), alert rules engine (`lib/alerts.ts`), and dashboard widgets for real-time monitoring
- Who will use it and when: Customer success teams monitoring health trends, identifying at-risk customers, and taking proactive action based on predictive alerts

### Requirements
- Functional requirements (what it must do):
  - Calculate customer health scores on 0-100 scale with weighted factors
  - Multi-factor scoring: Payment (40%), Engagement (30%), Contract (20%), Support (10%)
  - Risk level classification: Healthy (71-100), Warning (31-70), Critical (0-30)
  - Multi-tier alert priority: High Priority (immediate), Medium Priority (monitor)
  - High Priority alerts: Payment Risk, Engagement Cliff, Contract Expiration Risk
  - Medium Priority alerts: Support Ticket Spike, Feature Adoption Stall
  - Alert deduplication and cooldown periods

- User interface requirements:
  - CustomerHealthDisplay widget with color-coded health score
  - Expandable factor score breakdown
  - AlertsWidget with priority visualization (red=high, yellow=medium)
  - Alert detail panels with recommended actions
  - Alert dismissal and action tracking
  - Loading and error states

- Data requirements:
  - Payment: days since payment, average delay, overdue amounts
  - Engagement: login frequency, feature usage, support tickets
  - Contract: days until renewal, value, recent upgrades
  - Support: resolution time, satisfaction scores, escalations
  - Alert history and audit trail

- Integration requirements:
  - Integrates with CustomerSelector for real-time updates
  - Consistent error handling patterns
  - Dashboard layout integration

### Constraints
- Technical stack and frameworks (Next.js 15, React 19, TypeScript, Tailwind CSS)
- Performance requirements: Real-time processing, efficient evaluation for 100+ customers
- File structure:
  - `src/lib/healthCalculator.ts`
  - `src/lib/alerts.ts`
  - `src/components/CustomerHealthDisplay.tsx`
  - `src/components/AlertsWidget.tsx`
- Props interface and TypeScript definitions:
  ```typescript
  interface HealthScoreResult {
    overallScore: number;
    riskLevel: 'healthy' | 'warning' | 'critical';
    breakdown: { payment: number; engagement: number; contract: number; support: number };
  }

  interface Alert {
    id: string;
    customerId: string;
    type: 'payment_risk' | 'engagement_cliff' | 'contract_expiration_risk' | 'support_ticket_spike' | 'feature_adoption_stall';
    priority: 'high' | 'medium';
    title: string;
    description: string;
    recommendedAction: string;
    createdAt: string;
    dismissed: boolean;
  }
  ```
- Security: Input validation, no sensitive data in alerts, rate limiting, audit logging

### Acceptance Criteria
- [ ] Health score calculates correctly on 0-100 scale with proper weighting
- [ ] Risk levels classified: Healthy (71-100), Warning (31-70), Critical (0-30)
- [ ] Payment Risk Alert: payment >30 days overdue OR health drops >20 points in 7 days
- [ ] Engagement Cliff Alert: login frequency drops >50% vs 30-day average
- [ ] Contract Expiration Risk: <90 days to expiration AND health score <50
- [ ] Support Ticket Spike: >3 tickets in 7 days OR escalated ticket
- [ ] Feature Adoption Stall: no new feature usage in 30 days (growing accounts)
- [ ] Alert deduplication and cooldown periods work correctly
- [ ] UI displays health scores and alerts with correct color coding
- [ ] Real-time updates on customer selection change
- [ ] Pure functions for all calculation and rule evaluation logic
- [ ] Comprehensive unit tests for health calculator and alert rules
