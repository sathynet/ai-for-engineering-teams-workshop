# Spec Template for Workshop

## Feature: CustomerSelector

### Context
- Purpose and role in the application: Main customer selection interface for the Customer Intelligence Dashboard that allows users to browse and select customers
- How it fits into the larger system: Container component that displays CustomerCard components and manages selection state for the dashboard
- Who will use it and when: Dashboard users who need to quickly find and select customers from a list of 100+ customers

### Requirements
- Functional requirements (what it must do):
  - Display customer cards showing name, company, and health score
  - Search/filter customers by name or company
  - Handle visual selection state (highlight selected customer)
  - Persist selection across page interactions
  - Handle 100+ customers efficiently

- User interface requirements:
  - Search input field for filtering customers
  - Scrollable list of CustomerCard components
  - Clear visual indication of selected customer
  - Responsive layout for mobile and desktop

- Data requirements:
  - Consumes customer data from `src/data/mock-customers.ts`
  - Manages selected customer state
  - Filters customer list based on search query

- Integration requirements:
  - Uses CustomerCard component for individual customer display
  - Exposes selected customer to parent components
  - Integrates with dashboard layout

### Constraints
- Technical stack and frameworks (Next.js 15, React 19, TypeScript, Tailwind CSS)
- Performance requirements: Must render 100+ customers without lag, implement virtualization if needed
- Design constraints: Responsive breakpoints, scrollable container with fixed height
- File structure and naming conventions: Component in `src/components/CustomerSelector.tsx`
- Props interface and TypeScript definitions:
  ```typescript
  interface CustomerSelectorProps {
    customers: Customer[];
    selectedCustomerId?: string;
    onSelectCustomer: (customerId: string) => void;
  }
  ```
- Security considerations: Sanitize search input, prevent XSS in displayed data

### Acceptance Criteria
- [ ] Displays list of CustomerCard components
- [ ] Search input filters customers by name or company (case-insensitive)
- [ ] Selected customer is visually highlighted
- [ ] Selection persists during filtering
- [ ] Handles empty search results gracefully
- [ ] Performs well with 100+ customers
- [ ] Responsive layout works on mobile and desktop
- [ ] Component uses TypeScript with proper type definitions
- [ ] Styled with Tailwind CSS
