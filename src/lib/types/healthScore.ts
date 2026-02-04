/**
 * Type definitions for the Customer Health Score Calculator
 */

/**
 * Payment-related metrics
 */
export interface PaymentData {
  daysSinceLastPayment: number;
  averagePaymentDelay: number; // days
  outstandingBalance: number; // dollars
}

/**
 * Customer engagement metrics
 */
export interface EngagementData {
  monthlyLogins: number;
  featuresUsed: number;
  supportTicketsOpened: number;
}

/**
 * Contract and subscription metrics
 */
export interface ContractData {
  daysUntilRenewal: number;
  contractValue: number; // annual value in dollars
  hasRecentUpgrade: boolean;
}

/**
 * Support interaction metrics
 */
export interface SupportData {
  averageResolutionTime: number; // hours
  satisfactionScore: number; // 1-5 scale
  escalationCount: number;
}

/**
 * Complete customer metrics for health score calculation
 */
export interface CustomerMetrics {
  payment: PaymentData;
  engagement: EngagementData;
  contract: ContractData;
  support: SupportData;
}

/**
 * Individual factor score with weight
 */
export interface FactorScore {
  name: string;
  score: number; // 0-100
  weight: number; // 0-1
  weightedScore: number;
}

/**
 * Risk level classification
 */
export type RiskLevel = 'healthy' | 'warning' | 'critical';

/**
 * Complete health score result
 */
export interface HealthScoreResult {
  customerId: string;
  overallScore: number; // 0-100
  riskLevel: RiskLevel;
  factors: {
    payment: FactorScore;
    engagement: FactorScore;
    contract: FactorScore;
    support: FactorScore;
  };
  calculatedAt: Date;
}

/**
 * Custom error for health score calculation failures
 */
export class HealthScoreError extends Error {
  constructor(
    message: string,
    public code: 'INVALID_INPUT' | 'TYPE_ERROR' | 'MISSING_DATA',
    public factor?: string
  ) {
    super(message);
    this.name = 'HealthScoreError';
  }
}
