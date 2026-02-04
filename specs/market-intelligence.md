# Spec Template for Workshop

## Feature: Market Intelligence Widget

### Context
- Purpose and role in the application: Market intelligence widget for the Customer Intelligence Dashboard providing real-time market sentiment and news analysis for customer companies
- How it fits into the larger system: Full-stack feature with API route, service layer, and UI component that integrates with the dashboard alongside existing widgets
- Who will use it and when: Dashboard users analyzing market conditions and news sentiment for selected customer companies

### Requirements
- Functional requirements (what it must do):
  - API route at `/api/market-intelligence/[company]` returning sentiment, news count, and headlines
  - Mock data generation for reliable workshop demonstration
  - Caching with 10-minute TTL expiration
  - Validate company name input and sanitize responses
  - Realistic API delay simulation for authentic user experience

- User interface requirements:
  - Input field for company name entry with validation
  - Market sentiment display with color-coded indicators (green/yellow/red)
  - News article count and last updated timestamp
  - Top 3 headlines with source and publication date
  - Loading and error states consistent with other widgets

- Data requirements:
  - Consistent JSON response format from API
  - Mock data service generates company-specific headlines and sentiment
  - Cached responses with TTL management

- Integration requirements:
  - Integrates into main Dashboard component alongside existing widgets
  - Receives company name from selected customer data
  - Follows same prop passing and state management patterns
  - Maintains responsive grid layout and consistent spacing

### Constraints
- Technical stack and frameworks (Next.js 15 App Router, React 19, TypeScript, Tailwind CSS)
- Performance requirements: Caching with 10-minute TTL, realistic API delay simulation, efficient re-renders
- Design constraints: Match existing widget styling, same color coding system (green/yellow/red), consistent spacing and typography
- File structure and naming conventions:
  - API route: `src/app/api/market-intelligence/[company]/route.ts`
  - Service: `src/services/MarketIntelligenceService.ts`
  - UI component: `src/components/MarketIntelligenceWidget.tsx`
- Props interface and TypeScript definitions:
  ```typescript
  // API response interface
  interface MarketIntelligenceResponse {
    company: string;
    sentiment: 'positive' | 'neutral' | 'negative';
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

  // Service interfaces
  interface MarketIntelligenceService {
    getMarketIntelligence(company: string): Promise<MarketIntelligenceResponse>;
    clearCache(): void;
  }

  // Custom error class
  class MarketIntelligenceError extends Error {
    constructor(message: string, public statusCode: number);
  }

  // Component props
  interface MarketIntelligenceWidgetProps {
    companyName?: string;
    onError?: (error: Error) => void;
  }
  ```
- Security considerations:
  - Company name parameter validation to prevent injection attacks
  - Input sanitization for mock data generation
  - Error message sanitization (no sensitive information leakage)
  - Proper timeout handling

### Acceptance Criteria
- [ ] API route `/api/market-intelligence/[company]` returns valid JSON response
- [ ] Company name input is validated and sanitized
- [ ] Mock data generates realistic company-specific headlines
- [ ] Caching works with 10-minute TTL expiration
- [ ] Sentiment displays with correct color coding (green=positive, yellow=neutral, red=negative)
- [ ] Shows news count and last updated timestamp
- [ ] Displays top 3 headlines with source and date
- [ ] Loading state displays during API fetch
- [ ] Error state displays with user-friendly message
- [ ] Widget matches existing dashboard styling patterns
- [ ] Responsive layout works in dashboard grid
- [ ] Integration with CustomerSelector updates company automatically
- [ ] MarketIntelligenceError class handles errors consistently
- [ ] TypeScript strict typing for all interfaces
