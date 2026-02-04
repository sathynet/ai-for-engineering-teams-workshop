# Spec Template for Workshop

## Feature: CustomerCard

### Context
- Purpose and role in the application: Individual customer display component for the Customer Intelligence Dashboard that provides at-a-glance customer information for quick identification
- How it fits into the larger system: Used within the CustomerSelector container component as the foundation for domain health monitoring integration
- Who will use it and when: Dashboard users viewing customer lists to identify and select customers for detailed health monitoring

### Requirements
- Functional requirements (what it must do):
  - Display customer name, company name, and health score
  - Show customer domains (websites) for health monitoring context
  - Use color-coded health indicator based on score ranges
  - Display domain count when customer has multiple domains

- User interface requirements:
  - Clean, card-based visual design with domain information
  - Color-coded health indicator:
    - Red (0-30): Poor health score
    - Yellow (31-70): Moderate health score
    - Green (71-100): Good health score
  - Basic responsive design for mobile and desktop

- Data requirements:
  - Uses mock data from `src/data/mock-customers.ts`
  - Customer interface includes optional `domains` array of website URLs
  - Supports customers with 1 or multiple domains for health checking

- Integration requirements:
  - Must integrate with CustomerSelector container component
  - Must consume Customer interface from mock data

### Constraints
- Technical stack and frameworks (Next.js 15, React 19, TypeScript, Tailwind CSS)
- Performance requirements: Component should render efficiently within lists
- Design constraints: Card-based layout, responsive breakpoints for mobile/desktop
- File structure and naming conventions: Component in `src/components/CustomerCard.tsx`
- Props interface and TypeScript definitions:
  ```typescript
  interface CustomerCardProps {
    name: string;
    company: string;
    healthScore: number;
    domains?: string[];
  }
  ```
- Security considerations: Sanitize any displayed URLs, no sensitive data exposure

### Acceptance Criteria
- [ ] Displays customer name and company name
- [ ] Displays health score with correct color coding (red 0-30, yellow 31-70, green 71-100)
- [ ] Shows customer domains when available
- [ ] Displays domain count badge for multiple domains
- [ ] Responsive layout works on mobile and desktop
- [ ] Component uses TypeScript with proper type definitions
- [ ] Styled with Tailwind CSS following card-based design
- [ ] Integrates with mock customer data structure
