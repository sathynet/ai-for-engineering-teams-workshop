# Spec Template for Workshop

## Feature: Health Score Calculator

### Context
- Purpose and role in the application: Comprehensive customer health scoring system for the Customer Intelligence Dashboard providing predictive analytics for customer relationship health and churn risk
- How it fits into the larger system: Core business logic library (`lib/healthCalculator.ts`) with a UI widget (`CustomerHealthDisplay`) that integrates with CustomerSelector for real-time updates
- Who will use it and when: Dashboard users analyzing customer health to identify at-risk customers and prioritize engagement efforts

### Requirements
- Functional requirements (what it must do):
  - Calculate customer health scores on 0-100 scale
  - Multi-factor weighted scoring: Payment (40%), Engagement (30%), Contract (20%), Support (10%)
  - Risk level classification: Healthy (71-100), Warning (31-70), Critical (0-30)
  - Individual scoring functions for each factor
  - Input validation with descriptive error messages
  - Edge case handling for new customers and missing data

- User interface requirements:
  - CustomerHealthDisplay widget with color-coded visualization
  - Overall health score display
  - Expandable breakdown showing individual factor scores
  - Loading and error states consistent with dashboard patterns
  - Color coding consistent with other dashboard health indicators

- Data requirements:
  - Payment history: days since last payment, average payment delay, overdue amounts
  - Engagement metrics: login frequency, feature usage count, support tickets
  - Contract information: days until renewal, contract value, recent upgrades
  - Support data: average resolution time, satisfaction scores, escalation counts

- Integration requirements:
  - Integrates with CustomerSelector for real-time updates
  - Consistent error handling patterns with other components
  - Dashboard layout integration maintaining responsive design

### Constraints
- Technical stack and frameworks (Next.js 15, React 19, TypeScript, Tailwind CSS)
- Performance requirements: Efficient algorithms for real-time dashboard updates, caching for repeated calculations, minimal computational overhead
- Design constraints: Responsive breakpoints, expandable/collapsible factor breakdown
- File structure and naming conventions:
  - Calculator library: `src/lib/healthCalculator.ts`
  - UI component: `src/components/CustomerHealthDisplay.tsx`
- Props interface and TypeScript definitions:
  ```typescript
  // Data input interfaces
  interface PaymentData {
    daysSinceLastPayment: number;
    averagePaymentDelay: number;
    overdueAmount: number;
  }

  interface EngagementData {
    loginFrequency: number;
    featureUsageCount: number;
    supportTickets: number;
  }

  interface ContractData {
    daysUntilRenewal: number;
    contractValue: number;
    recentUpgrades: boolean;
  }

  interface SupportData {
    averageResolutionTime: number;
    satisfactionScore: number;
    escalationCount: number;
  }

  interface HealthScoreResult {
    overallScore: number;
    riskLevel: 'healthy' | 'warning' | 'critical';
    breakdown: {
      payment: number;
      engagement: number;
      contract: number;
      support: number;
    };
  }

  // Component props
  interface CustomerHealthDisplayProps {
    customerId: string;
    healthScore: HealthScoreResult;
    isLoading?: boolean;
    error?: Error;
  }
  ```
- Security considerations: Input validation for all data, no sensitive data exposure, sanitize displayed values
- Architecture: Pure functions with no side effects for predictable testing

### Acceptance Criteria
- [ ] calculateHealthScore returns score on 0-100 scale
- [ ] Individual factor functions (calculatePaymentScore, calculateEngagementScore, etc.) work correctly
- [ ] Weighting applied correctly: Payment 40%, Engagement 30%, Contract 20%, Support 10%
- [ ] Risk levels classified correctly: Healthy (71-100), Warning (31-70), Critical (0-30)
- [ ] Input validation rejects invalid data with descriptive errors
- [ ] Edge cases handled (new customers, missing data, boundary values)
- [ ] CustomerHealthDisplay shows overall score with correct color coding
- [ ] Factor breakdown is expandable/collapsible
- [ ] Loading and error states display correctly
- [ ] Real-time updates when customer selection changes
- [ ] Comprehensive unit tests for all calculation functions
- [ ] JSDoc comments explain business logic and formulas
- [ ] TypeScript strict typing for all interfaces and functions
