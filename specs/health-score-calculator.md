# Spec Template for Workshop

## Feature: HealthScoreCalculator

### Context
The HealthScoreCalculator is a comprehensive customer health scoring system that provides predictive analytics for customer relationship health and churn risk within the Customer Intelligence Dashboard. This feature demonstrates AI-assisted algorithm design and collaborative development for complex business logic.

**Purpose**: Calculate customer health scores on a 0-100 scale using multi-factor analysis to predict churn risk and guide customer success interventions.

**Role in Application**: Core business intelligence engine that powers the CustomerHealthDisplay widget and provides actionable insights for customer success teams.

**Users**: Customer success managers, account managers, and executive stakeholders who need to monitor customer relationship health and identify at-risk accounts.

**When Used**: Real-time during dashboard interactions, particularly when viewing customer details or monitoring portfolio health across multiple accounts.

### Requirements

#### Functional Requirements
- Calculate customer health scores on 0-100 scale with three risk level categories:
  - **Healthy**: 71-100 (green indicator)
  - **Warning**: 31-70 (yellow indicator)
  - **Critical**: 0-30 (red indicator)
- Multi-factor weighted scoring algorithm:
  - Payment History: 40% weight
  - Engagement Metrics: 30% weight
  - Contract Status: 20% weight
  - Support Satisfaction: 10% weight
- Individual scoring functions for each factor with normalization
- Main `calculateHealthScore` function combining all factors
- Comprehensive input validation with descriptive error messages
- Edge case handling for new customers and missing data
- Trend analysis consideration for improving vs declining customers

#### Data Requirements
**Payment History Inputs**:
- Days since last payment (number)
- Average payment delay in days (number)
- Overdue amount (number, currency)

**Engagement Metrics Inputs**:
- Login frequency (number, logins per month)
- Feature usage count (number)
- Support tickets submitted (number)

**Contract Information Inputs**:
- Days until renewal (number)
- Contract value (number, currency)
- Recent upgrades flag (boolean)

**Support Data Inputs**:
- Average resolution time in hours (number)
- Customer satisfaction scores (number, 1-5 scale)
- Escalation counts (number)

#### User Interface Requirements
- CustomerHealthDisplay widget component following established dashboard patterns
- Overall health score display with large, color-coded number
- Expandable breakdown section showing:
  - Individual factor scores with percentages
  - Visual progress bars or indicators per factor
  - Factor weights displayed for transparency
- Loading states with skeleton UI during calculation
- Error states with user-friendly messages
- Tooltip explanations for each factor
- Integration with CustomerSelector for real-time updates

#### Integration Requirements
- Seamless integration with CustomerSelector component
- Real-time score recalculation on customer selection change
- Consistent error handling patterns across dashboard
- Dashboard layout integration maintaining responsive grid
- Color coding consistency with other health indicators
- API endpoint integration for fetching customer metrics data

### Constraints

#### Technical Stack
- **Framework**: Next.js 15 with App Router
- **React**: React 19 with Server Components where applicable
- **Language**: TypeScript 5.x with strict mode enabled
- **Styling**: Tailwind CSS for component styling
- **Architecture**: Pure function approach in `lib/healthCalculator.ts`

#### File Structure
```
lib/
  healthCalculator.ts          # Main calculation logic
  types/
    healthScore.ts             # TypeScript interfaces
components/
  CustomerHealthDisplay.tsx    # UI component
  __tests__/
    healthCalculator.test.ts   # Unit tests
```

#### TypeScript Interfaces

```typescript
// Core data interfaces
interface PaymentData {
  daysSinceLastPayment: number;
  averagePaymentDelay: number;
  overdueAmount: number;
}

interface EngagementData {
  loginFrequency: number;        // per month
  featureUsageCount: number;
  supportTickets: number;
}

interface ContractData {
  daysUntilRenewal: number;
  contractValue: number;
  hasRecentUpgrade: boolean;
}

interface SupportData {
  averageResolutionTime: number; // hours
  satisfactionScore: number;      // 1-5 scale
  escalationCount: number;
}

interface CustomerMetrics {
  payment: PaymentData;
  engagement: EngagementData;
  contract: ContractData;
  support: SupportData;
}

// Scoring results
interface FactorScore {
  score: number;              // 0-100
  weight: number;             // 0-1
  weightedScore: number;      // contribution to final score
  details?: string;           // explanation
}

interface HealthScoreResult {
  overallScore: number;       // 0-100
  riskLevel: 'healthy' | 'warning' | 'critical';
  breakdown: {
    payment: FactorScore;
    engagement: FactorScore;
    contract: FactorScore;
    support: FactorScore;
  };
  calculatedAt: Date;
  trend?: 'improving' | 'declining' | 'stable';
}

// Error handling
class HealthScoreError extends Error {
  constructor(
    message: string,
    public code: string,
    public factor?: string
  ) {
    super(message);
    this.name = 'HealthScoreError';
  }
}
```

#### Performance Requirements
- Health score calculation must complete in < 100ms for real-time updates
- Caching strategy for repeated calculations within 5-minute window
- Minimal re-renders when customer selection changes
- Optimized data structures to avoid unnecessary iterations
- Lazy loading for expanded breakdown view

#### Design Constraints
- Component must be responsive at breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Maximum component height: 400px collapsed, 600px expanded
- Color scheme:
  - Healthy (green): `bg-green-100 text-green-800`
  - Warning (yellow): `bg-yellow-100 text-yellow-800`
  - Critical (red): `bg-red-100 text-red-800`
- Font sizes: Score display 4xl, factor labels text-sm, factor scores text-base
- Consistent spacing using Tailwind's scale (4, 6, 8 units)

#### Algorithm Constraints
- Pure functions with no side effects for predictable testing
- All calculations must be deterministic (same input = same output)
- Weights must sum to 100% (validated at runtime)
- Score normalization must handle edge cases (division by zero, null values)
- Missing data handling: use neutral score (50) with reduced confidence indicator

#### Documentation Requirements
- JSDoc comments for all public functions explaining business logic
- Mathematical formula documentation with examples
- Business assumption documentation in algorithm comments
- Error code reference guide
- Calibration and monitoring recommendations

#### Security Considerations
- Input sanitization for all numeric inputs
- Validation to prevent injection attacks in error messages
- No sensitive customer data in console logs or error messages
- Proper TypeScript typing to prevent type coercion vulnerabilities

### Acceptance Criteria

#### Core Calculation Logic
- [ ] `calculateHealthScore` function accepts `CustomerMetrics` object and returns `HealthScoreResult`
- [ ] Payment score calculated correctly with 40% weight applied
- [ ] Engagement score calculated correctly with 30% weight applied
- [ ] Contract score calculated correctly with 20% weight applied
- [ ] Support score calculated correctly with 10% weight applied
- [ ] Overall score is weighted sum of all factors, bounded 0-100
- [ ] Risk level correctly categorized: healthy (71-100), warning (31-70), critical (0-30)

#### Individual Factor Calculations
- [ ] Payment score: Lower days since payment = higher score
- [ ] Payment score: Lower average delay = higher score
- [ ] Payment score: Zero overdue amount = maximum score
- [ ] Engagement score: Higher login frequency = higher score
- [ ] Engagement score: More feature usage = higher score
- [ ] Engagement score: Moderate support tickets = optimal (not too many, not zero)
- [ ] Contract score: More days until renewal = higher score
- [ ] Contract score: Higher contract value = higher score
- [ ] Contract score: Recent upgrade adds bonus points
- [ ] Support score: Lower resolution time = higher score
- [ ] Support score: Higher satisfaction = higher score
- [ ] Support score: Zero escalations = maximum score

#### Edge Cases and Validation
- [ ] Missing payment data defaults to neutral score (50) with flag
- [ ] Missing engagement data defaults to neutral score (50) with flag
- [ ] Missing contract data defaults to neutral score (50) with flag
- [ ] Missing support data defaults to neutral score (50) with flag
- [ ] Negative numeric inputs throw `HealthScoreError` with code 'INVALID_INPUT'
- [ ] Non-numeric inputs throw `HealthScoreError` with code 'TYPE_ERROR'
- [ ] Null/undefined customer metrics throw `HealthScoreError` with code 'MISSING_DATA'
- [ ] New customers (< 30 days) handled with reduced weighting on payment history
- [ ] Customers with no contract show N/A for contract factor

#### UI Component Integration
- [ ] CustomerHealthDisplay component renders overall health score prominently
- [ ] Health score displays with correct color coding based on risk level
- [ ] Clicking component expands to show factor breakdown
- [ ] Factor breakdown shows all four factors with individual scores
- [ ] Factor breakdown displays weight percentage for each factor
- [ ] Visual progress bars display for each factor (0-100 scale)
- [ ] Loading state displays during score calculation
- [ ] Error state displays user-friendly message on calculation failure
- [ ] Tooltip explanations available on hover for each factor
- [ ] Component updates in real-time when CustomerSelector changes

#### Performance and Optimization
- [ ] Health score calculation completes in < 100ms (measured via performance.now())
- [ ] Calculation results cached for 5 minutes with same input
- [ ] Component re-renders only when customer selection changes (React.memo)
- [ ] Expanded breakdown uses lazy loading pattern
- [ ] No unnecessary API calls on repeated calculations

#### Testing Coverage
- [ ] Unit tests for `calculateHealthScore` with realistic customer data
- [ ] Unit tests for each individual factor calculation function
- [ ] Edge case tests for missing data scenarios
- [ ] Edge case tests for boundary values (0, 100, 30, 31, 70, 71)
- [ ] Validation tests for invalid inputs (negative, non-numeric, null)
- [ ] Error handling tests verify correct error codes and messages
- [ ] Mathematical accuracy tests with known expected outputs
- [ ] Performance benchmark tests verify < 100ms calculation time
- [ ] Integration tests for CustomerHealthDisplay component rendering
- [ ] Integration tests for CustomerSelector interaction

#### Code Quality
- [ ] All functions have comprehensive JSDoc comments
- [ ] TypeScript strict mode enabled with no `any` types
- [ ] ESLint passes with no warnings
- [ ] Prettier formatting applied consistently
- [ ] No console.log statements in production code
- [ ] Error messages are clear and actionable
- [ ] Mathematical formulas documented with examples

#### Business Logic Validation
- [ ] Algorithm produces reasonable scores for typical customers
- [ ] High-value, engaged customers score > 80
- [ ] Customers with overdue payments score < 50
- [ ] Declining engagement trends reflected in lower scores
- [ ] Algorithm explainability documented for stakeholder review
- [ ] Weighting scheme validated against business priorities
- [ ] Calibration recommendations provided for production deployment

#### Accessibility and UX
- [ ] Color indicators supplemented with text labels (not color-only)
- [ ] Keyboard navigation supported for expand/collapse
- [ ] Screen reader announces score and risk level
- [ ] Focus states visible on interactive elements
- [ ] Tooltips accessible via keyboard (not hover-only)
