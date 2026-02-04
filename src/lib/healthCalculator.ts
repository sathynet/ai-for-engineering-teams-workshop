/**
 * Customer Health Score Calculator
 *
 * Pure function library for calculating customer health scores using a weighted
 * multi-factor algorithm. Scores range from 0-100 with risk level classification.
 */

import {
  CustomerMetrics,
  PaymentData,
  EngagementData,
  ContractData,
  SupportData,
  HealthScoreResult,
  FactorScore,
  RiskLevel,
  HealthScoreError,
} from './types/healthScore';

/**
 * Scoring weights for each factor (must sum to 1.0)
 */
const WEIGHTS = {
  payment: 0.4,    // 40% - highest priority
  engagement: 0.3, // 30% - product stickiness
  contract: 0.2,   // 20% - temporal risk
  support: 0.1,    // 10% - reactive indicator
} as const;

/**
 * Risk level thresholds
 */
const RISK_THRESHOLDS = {
  healthy: 71,   // 71-100
  warning: 31,   // 31-70
  critical: 0,   // 0-30
} as const;

/**
 * Simple in-memory cache with TTL
 */
class HealthScoreCache {
  private cache = new Map<string, { result: HealthScoreResult; expiresAt: number }>();
  private readonly ttlMs = 5 * 60 * 1000; // 5 minutes
  private readonly maxEntries = 100;

  get(key: string): HealthScoreResult | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.result;
  }

  set(key: string, result: HealthScoreResult): void {
    this.cleanup();
    this.cache.set(key, {
      result,
      expiresAt: Date.now() + this.ttlMs,
    });
  }

  private cleanup(): void {
    if (this.cache.size >= this.maxEntries) {
      // Remove oldest entries
      const entries = Array.from(this.cache.entries());
      entries.sort((a, b) => a[1].expiresAt - b[1].expiresAt);
      const toRemove = entries.slice(0, Math.floor(this.maxEntries / 2));
      toRemove.forEach(([key]) => this.cache.delete(key));
    }
  }
}

const cache = new HealthScoreCache();

/**
 * Validates payment data
 */
function validatePaymentData(data: PaymentData): void {
  if (data.daysSinceLastPayment < 0 || !isFinite(data.daysSinceLastPayment)) {
    throw new HealthScoreError(
      'daysSinceLastPayment must be a non-negative finite number',
      'INVALID_INPUT',
      'payment'
    );
  }
  if (data.averagePaymentDelay < 0 || !isFinite(data.averagePaymentDelay)) {
    throw new HealthScoreError(
      'averagePaymentDelay must be a non-negative finite number',
      'INVALID_INPUT',
      'payment'
    );
  }
  if (data.outstandingBalance < 0 || !isFinite(data.outstandingBalance)) {
    throw new HealthScoreError(
      'outstandingBalance must be a non-negative finite number',
      'INVALID_INPUT',
      'payment'
    );
  }
}

/**
 * Validates engagement data
 */
function validateEngagementData(data: EngagementData): void {
  if (data.monthlyLogins < 0 || !isFinite(data.monthlyLogins)) {
    throw new HealthScoreError(
      'monthlyLogins must be a non-negative finite number',
      'INVALID_INPUT',
      'engagement'
    );
  }
  if (data.featuresUsed < 0 || !isFinite(data.featuresUsed)) {
    throw new HealthScoreError(
      'featuresUsed must be a non-negative finite number',
      'INVALID_INPUT',
      'engagement'
    );
  }
  if (data.supportTicketsOpened < 0 || !isFinite(data.supportTicketsOpened)) {
    throw new HealthScoreError(
      'supportTicketsOpened must be a non-negative finite number',
      'INVALID_INPUT',
      'engagement'
    );
  }
}

/**
 * Validates contract data
 */
function validateContractData(data: ContractData): void {
  if (!isFinite(data.daysUntilRenewal)) {
    throw new HealthScoreError(
      'daysUntilRenewal must be a finite number',
      'INVALID_INPUT',
      'contract'
    );
  }
  if (data.contractValue <= 0 || !isFinite(data.contractValue)) {
    throw new HealthScoreError(
      'contractValue must be a positive finite number',
      'INVALID_INPUT',
      'contract'
    );
  }
  if (typeof data.hasRecentUpgrade !== 'boolean') {
    throw new HealthScoreError(
      'hasRecentUpgrade must be a boolean',
      'TYPE_ERROR',
      'contract'
    );
  }
}

/**
 * Validates support data
 */
function validateSupportData(data: SupportData): void {
  if (data.averageResolutionTime < 0 || !isFinite(data.averageResolutionTime)) {
    throw new HealthScoreError(
      'averageResolutionTime must be a non-negative finite number',
      'INVALID_INPUT',
      'support'
    );
  }
  if (data.satisfactionScore < 1 || data.satisfactionScore > 5 || !isFinite(data.satisfactionScore)) {
    throw new HealthScoreError(
      'satisfactionScore must be between 1 and 5',
      'INVALID_INPUT',
      'support'
    );
  }
  if (data.escalationCount < 0 || !isFinite(data.escalationCount)) {
    throw new HealthScoreError(
      'escalationCount must be a non-negative finite number',
      'INVALID_INPUT',
      'support'
    );
  }
}

/**
 * Validates complete customer metrics
 */
function validateCustomerMetrics(metrics: CustomerMetrics): void {
  if (!metrics.payment) {
    throw new HealthScoreError('Missing payment data', 'MISSING_DATA', 'payment');
  }
  if (!metrics.engagement) {
    throw new HealthScoreError('Missing engagement data', 'MISSING_DATA', 'engagement');
  }
  if (!metrics.contract) {
    throw new HealthScoreError('Missing contract data', 'MISSING_DATA', 'contract');
  }
  if (!metrics.support) {
    throw new HealthScoreError('Missing support data', 'MISSING_DATA', 'support');
  }

  validatePaymentData(metrics.payment);
  validateEngagementData(metrics.engagement);
  validateContractData(metrics.contract);
  validateSupportData(metrics.support);
}

/**
 * Calculate payment score (0-100)
 *
 * Components:
 * - Recency (40%): Linear decay from 100 at 0 days to 0 at 90+ days
 * - Timeliness (40%): Exponential decay for payment delay
 * - Debt (20%): Progressive penalty tiers
 */
export function calculatePaymentScore(data: PaymentData): number {
  // Recency component (40%)
  const recencyScore = Math.max(0, 100 - (data.daysSinceLastPayment / 90) * 100);

  // Timeliness component (40%) - exponential decay
  const timelinessScore = Math.max(0, 100 * Math.exp(-data.averagePaymentDelay / 15));

  // Debt component (20%) - progressive penalty tiers
  let debtScore: number;
  if (data.outstandingBalance === 0) {
    debtScore = 100;
  } else if (data.outstandingBalance <= 1000) {
    debtScore = 70;
  } else if (data.outstandingBalance <= 5000) {
    debtScore = 40;
  } else {
    debtScore = 0;
  }

  const score = recencyScore * 0.4 + timelinessScore * 0.4 + debtScore * 0.2;
  return Math.max(0, Math.min(100, score));
}

/**
 * Calculate engagement score (0-100)
 *
 * Components:
 * - Login activity (40%): Bell curve, optimal 8-20 logins/month
 * - Feature adoption (40%): Logarithmic growth
 * - Support interaction (20%): Inverted U-shape
 */
export function calculateEngagementScore(data: EngagementData): number {
  // Login activity (40%) - bell curve
  let loginScore: number;
  if (data.monthlyLogins <= 15) {
    loginScore = Math.min(100, (data.monthlyLogins / 15) * 100);
  } else {
    // Slight decline after 15 (automation concern)
    loginScore = Math.max(80, 100 - ((data.monthlyLogins - 15) / 15) * 20);
  }

  // Feature adoption (40%) - logarithmic growth
  const featureScore = Math.min(100, 50 * Math.log10(data.featuresUsed + 1) * 2);

  // Support interaction (20%) - inverted U-shape
  let supportInteractionScore: number;
  if (data.supportTicketsOpened <= 2) {
    supportInteractionScore = 100;
  } else if (data.supportTicketsOpened <= 5) {
    supportInteractionScore = 85;
  } else if (data.supportTicketsOpened <= 10) {
    supportInteractionScore = 50;
  } else {
    supportInteractionScore = 20;
  }

  const score = loginScore * 0.4 + featureScore * 0.4 + supportInteractionScore * 0.2;
  return Math.max(0, Math.min(100, score));
}

/**
 * Calculate contract score (0-100)
 *
 * Components:
 * - Renewal timeline (50%): Urgency increases as renewal nears
 * - Contract value (30%): Logarithmic scaling
 * - Growth indicator (20%): Recent upgrade bonus
 */
export function calculateContractScore(data: ContractData): number {
  // Renewal timeline (50%) - urgency scoring
  let renewalScore: number;
  if (data.daysUntilRenewal > 180) {
    renewalScore = 100;
  } else if (data.daysUntilRenewal > 90) {
    renewalScore = 80;
  } else if (data.daysUntilRenewal > 30) {
    renewalScore = 50;
  } else {
    // Linear decay from 50 to 20 for last 30 days
    renewalScore = Math.max(20, 20 + (data.daysUntilRenewal / 30) * 30);
  }

  // Contract value (30%) - logarithmic scaling
  const valueScore = Math.min(100, 30 + 20 * Math.log10(data.contractValue / 1000 + 1));

  // Growth indicator (20%)
  const growthScore = data.hasRecentUpgrade ? 100 : 50;

  const score = renewalScore * 0.5 + valueScore * 0.3 + growthScore * 0.2;
  return Math.max(0, Math.min(100, score));
}

/**
 * Calculate support score (0-100)
 *
 * Components:
 * - Resolution speed (40%): Exponential penalty for slow resolution
 * - Satisfaction (40%): Linear mapping from 1-5 scale
 * - Escalations (20%): Progressive penalty
 */
export function calculateSupportScore(data: SupportData): number {
  // Resolution speed (40%) - exponential decay
  const resolutionScore = Math.max(10, 100 * Math.exp(-data.averageResolutionTime / 12));

  // Satisfaction (40%) - linear mapping from 1-5 to 0-100
  const satisfactionScore = ((data.satisfactionScore - 1) / 4) * 100;

  // Escalations (20%) - progressive penalty
  let escalationScore: number;
  if (data.escalationCount === 0) {
    escalationScore = 100;
  } else if (data.escalationCount <= 2) {
    escalationScore = 70;
  } else if (data.escalationCount <= 5) {
    escalationScore = 40;
  } else {
    escalationScore = 0;
  }

  const score = resolutionScore * 0.4 + satisfactionScore * 0.4 + escalationScore * 0.2;
  return Math.max(0, Math.min(100, score));
}

/**
 * Determines risk level based on overall score
 */
function getRiskLevel(score: number): RiskLevel {
  if (score >= RISK_THRESHOLDS.healthy) return 'healthy';
  if (score >= RISK_THRESHOLDS.warning) return 'warning';
  return 'critical';
}

/**
 * Generates cache key for a customer
 */
function getCacheKey(customerId: string, metrics: CustomerMetrics): string {
  return `${customerId}_${JSON.stringify(metrics)}`;
}

/**
 * Main health score calculation function
 *
 * @param metrics - Complete customer metrics
 * @param customerId - Unique customer identifier
 * @returns Complete health score result with breakdown
 * @throws HealthScoreError if validation fails
 */
export function calculateHealthScore(
  metrics: CustomerMetrics,
  customerId: string
): HealthScoreResult {
  // Check cache first
  const cacheKey = getCacheKey(customerId, metrics);
  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  // Validate inputs
  validateCustomerMetrics(metrics);

  // Calculate individual factor scores
  const paymentScore = calculatePaymentScore(metrics.payment);
  const engagementScore = calculateEngagementScore(metrics.engagement);
  const contractScore = calculateContractScore(metrics.contract);
  const supportScore = calculateSupportScore(metrics.support);

  // Create factor results with weights
  const factors = {
    payment: {
      name: 'Payment',
      score: paymentScore,
      weight: WEIGHTS.payment,
      weightedScore: paymentScore * WEIGHTS.payment,
    },
    engagement: {
      name: 'Engagement',
      score: engagementScore,
      weight: WEIGHTS.engagement,
      weightedScore: engagementScore * WEIGHTS.engagement,
    },
    contract: {
      name: 'Contract',
      score: contractScore,
      weight: WEIGHTS.contract,
      weightedScore: contractScore * WEIGHTS.contract,
    },
    support: {
      name: 'Support',
      score: supportScore,
      weight: WEIGHTS.support,
      weightedScore: supportScore * WEIGHTS.support,
    },
  };

  // Calculate overall weighted score
  const overallScore = Math.round(
    (factors.payment.weightedScore +
      factors.engagement.weightedScore +
      factors.contract.weightedScore +
      factors.support.weightedScore) * 100
  ) / 100;

  // Determine risk level
  const riskLevel = getRiskLevel(overallScore);

  // Build result
  const result: HealthScoreResult = {
    customerId,
    overallScore,
    riskLevel,
    factors,
    calculatedAt: new Date(),
  };

  // Cache result
  cache.set(cacheKey, result);

  return result;
}
