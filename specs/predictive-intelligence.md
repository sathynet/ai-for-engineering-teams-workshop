# Spec Template for Workshop

## Feature: Predictive Intelligence

### Context
- Purpose and role in the application: Unified predictive intelligence system combining customer risk alerting with market sentiment analysis for comprehensive proactive monitoring
- How it fits into the larger system: Intelligence layer integrating alert rules engine (`lib/alerts.ts`), market intelligence service, and dashboard widgets for real-time monitoring and early warning capabilities
- Who will use it and when: Customer success teams monitoring risk signals, sales teams tracking market conditions, and operations teams responding to predictive alerts

### Requirements
- Functional requirements (what it must do):
  - Multi-tier alert priority system: High Priority (immediate), Medium Priority (monitor)
  - High Priority alerts: Payment Risk, Engagement Cliff, Contract Expiration Risk
  - Medium Priority alerts: Support Ticket Spike, Feature Adoption Stall
  - Alert deduplication, cooldown periods, and priority scoring (customer value, urgency, recency)
  - Market sentiment analysis with color-coded indicators (positive/neutral/negative)
  - News headline aggregation with source and publication date
  - Real-time monitoring of health score changes and market conditions

- User interface requirements:
  - AlertsWidget with priority visualization (red=high, yellow=medium)
  - Alert detail panels with recommended actions and context
  - Alert dismissal and action tracking interface
  - Historical alerts view
  - MarketIntelligenceWidget with sentiment indicators (green/yellow/red)
  - Top 3 headlines display with source and date
  - News count and last updated timestamp
  - Loading and error states consistent with dashboard patterns

- Data requirements:
  - Customer health score monitoring and trend analysis
  - Login pattern analysis, payment behavior, support ticket tracking
  - Feature usage and adoption patterns
  - Market sentiment scores and news headlines
  - Alert history and audit trail
  - 10-minute TTL cache for market data

- Integration requirements:
  - Integrates with CustomerSelector for customer-specific alerts
  - Receives company name from selected customer for market intelligence
  - Consistent UI patterns with other dashboard widgets
  - Real-time updates on customer selection or data changes
  - Export capabilities for alerts and market data

### Constraints
- Technical stack and frameworks (Next.js 15, React 19, TypeScript, Tailwind CSS)
- Performance requirements: Real-time alert processing, efficient rule evaluation for 100+ customers, API caching with TTL
- Design constraints: Consistent color coding (green/yellow/red), responsive layout, widget styling patterns
- File structure:
  - `src/lib/alerts.ts`
  - `src/services/MarketIntelligenceService.ts`
  - `src/components/AlertsWidget.tsx`
  - `src/components/MarketIntelligenceWidget.tsx`
  - `src/app/api/market-intelligence/[company]/route.ts`
- Props interface and TypeScript definitions:
  ```typescript
  // Alert Types
  type AlertPriority = 'high' | 'medium';
  type AlertType =
    | 'payment_risk'
    | 'engagement_cliff'
    | 'contract_expiration_risk'
    | 'support_ticket_spike'
    | 'feature_adoption_stall';

  interface Alert {
    id: string;
    customerId: string;
    type: AlertType;
    priority: AlertPriority;
    title: string;
    description: string;
    recommendedAction: string;
    createdAt: string;
    dismissed: boolean;
  }

  interface AlertRule {
    type: AlertType;
    priority: AlertPriority;
    evaluate: (customer: CustomerData, history?: CustomerHistory) => boolean;
    generateAlert: (customer: Customer) => Omit<Alert, 'id' | 'createdAt'>;
  }

  // Market Intelligence Types
  type Sentiment = 'positive' | 'neutral' | 'negative';

  interface MarketIntelligenceResponse {
    company: string;
    sentiment: Sentiment;
    sentimentScore: number;
    newsCount: number;
    lastUpdated: string;
    headlines: Headline[];
  }

  interface Headline {
    title: string;
    source: string;
    publishedAt: string;
    url?: string;
  }

  // Component Props
  interface AlertsWidgetProps {
    alerts: Alert[];
    onDismiss: (alertId: string) => void;
    onAction: (alertId: string) => void;
    isLoading?: boolean;
  }

  interface MarketIntelligenceWidgetProps {
    companyName?: string;
    onError?: (error: Error) => void;
  }

  // Alert Thresholds (configurable)
  interface AlertThresholds {
    paymentOverdueDays: number;        // default: 30
    healthScoreDropPoints: number;     // default: 20
    engagementDropPercent: number;     // default: 50
    contractExpirationDays: number;    // default: 90
    supportTicketCount: number;        // default: 3
    featureAdoptionDays: number;       // default: 30
  }
  ```
- Security considerations:
  - Input validation for customer data and rule parameters
  - Company name sanitization to prevent injection attacks
  - No sensitive data in alert messages or market responses
  - Rate limiting on alert generation and API endpoints
  - Audit trail logging for alerts and user actions
  - Error message sanitization

### Integration Architecture

#### Component Interaction Diagram
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Dashboard Orchestrator                             │
│                    (specs/dashboard-orchestrator.md)                         │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            CustomerSelector                                  │
│                      (specs/customer-selector.md)                            │
│  ┌─────────────┐                                                            │
│  │ CustomerCard │ ◄── specs/customer-card.md                                │
│  └─────────────┘                                                            │
└─────────────────────────────────────────────────────────────────────────────┘
          │                           │                            │
          │ selectedCustomer          │ selectedCustomer           │ company
          ▼                           ▼                            ▼
┌──────────────────┐    ┌──────────────────────┐    ┌─────────────────────────┐
│  AlertsWidget    │    │ CustomerHealthDisplay │    │ MarketIntelligenceWidget│
│                  │    │                        │    │                         │
│  ┌────────────┐  │    │  ┌────────────────┐   │    │  ┌───────────────────┐  │
│  │ Alert Rules│  │    │  │HealthCalculator│   │    │  │MarketIntelligence │  │
│  │  Engine    │  │    │  │                │   │    │  │    Service        │  │
│  └────────────┘  │    │  └────────────────┘   │    │  └───────────────────┘  │
└──────────────────┘    └──────────────────────┘    └─────────────────────────┘
          │                           │                            │
          │                           │                            │
          ▼                           ▼                            ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Data Layer                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │ Alert State │  │Health Scores│  │Customer Data│  │ Market Data Cache   │ │
│  │ & History   │  │ & Breakdown │  │ (Mock Data) │  │ (10-min TTL)        │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Data Flow Description
1. **Customer Selection Flow**
   - User selects customer in CustomerSelector → triggers state update
   - Selected customer propagates to AlertsWidget, CustomerHealthDisplay, and MarketIntelligenceWidget
   - Each widget fetches/calculates relevant data for the selected customer

2. **Alert Generation Flow**
   - Health score changes detected → Alert Rules Engine evaluates all rules
   - Rules check thresholds (payment, engagement, contract, support)
   - Matching rules generate alerts with deduplication check
   - New alerts added to AlertsWidget with priority sorting

3. **Market Intelligence Flow**
   - Company name extracted from selected customer
   - MarketIntelligenceService checks cache (10-min TTL)
   - Cache miss → API route fetches/generates mock data
   - Response rendered in MarketIntelligenceWidget

4. **Health Score Flow**
   - Customer data passed to healthCalculator
   - Individual factor scores calculated (payment, engagement, contract, support)
   - Weighted combination produces overall score and risk level
   - Results displayed in CustomerHealthDisplay with breakdown

#### Key Integration Points
| Integration Point | Source Component | Target Component | Data Exchanged |
|-------------------|------------------|------------------|----------------|
| Customer Selection | CustomerSelector | All Widgets | `selectedCustomerId`, `Customer` object |
| Health Score Input | Customer Data | Alert Rules Engine | `HealthScoreResult`, trend data |
| Alert Generation | Alert Rules Engine | AlertsWidget | `Alert[]` with priority |
| Market Lookup | CustomerSelector | MarketIntelligenceWidget | `companyName` string |
| Error Propagation | All Widgets | DashboardErrorBoundary | `Error` objects |
| Export Data | All Widgets | ExportUtils | Typed data arrays |

#### Dependencies on Previously Created Specs
| Spec Dependency | File | Required Interfaces/Components |
|-----------------|------|--------------------------------|
| **CustomerCard** | `specs/customer-card.md` | `CustomerCardProps`, health score color coding (red/yellow/green) |
| **CustomerSelector** | `specs/customer-selector.md` | `CustomerSelectorProps`, `onSelectCustomer` callback, search/filter logic |
| **Health Score Calculator** | `specs/health-score-calculator.md` | `HealthScoreResult`, `calculateHealthScore()`, factor breakdown interfaces |
| **Market Intelligence** | `specs/market-intelligence.md` | `MarketIntelligenceResponse`, `MarketIntelligenceService`, API route |
| **Customer Health Monitoring** | `specs/customer-health-monitoring.md` | Alert types, `AlertRule` interface, threshold configurations |
| **Dashboard Orchestrator** | `specs/dashboard-orchestrator.md` | Error boundaries, export system, performance monitoring |

### Acceptance Criteria
- [ ] Payment Risk Alert triggers: payment >30 days overdue OR health drops >20 points in 7 days
- [ ] Engagement Cliff Alert triggers: login frequency drops >50% vs 30-day average
- [ ] Contract Expiration Risk triggers: <90 days to expiration AND health score <50
- [ ] Support Ticket Spike triggers: >3 tickets in 7 days OR escalated ticket
- [ ] Feature Adoption Stall triggers: no new feature usage in 30 days (growing accounts)
- [ ] Alert deduplication prevents duplicate alerts for same customer/issue
- [ ] Cooldown periods prevent alert spam
- [ ] AlertsWidget displays alerts with correct priority color coding
- [ ] Alert dismissal and action tracking works correctly
- [ ] Market intelligence API returns valid sentiment and headlines
- [ ] Company name input is validated and sanitized
- [ ] Sentiment displays with correct color coding (green=positive, yellow=neutral, red=negative)
- [ ] Top 3 headlines display with source and publication date
- [ ] Market data caches with 10-minute TTL
- [ ] Real-time updates when customer selection changes
- [ ] Loading and error states display correctly for both widgets
- [ ] Pure functions for all alert rule evaluation logic
- [ ] Comprehensive unit tests for alerts and market intelligence
