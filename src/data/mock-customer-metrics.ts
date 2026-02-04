/**
 * Mock customer metrics data for health score testing
 *
 * Metrics are tuned to produce target health scores for each customer:
 * - Customer 1 (John Smith): 85 - Healthy
 * - Customer 2 (Sarah Johnson): 45 - Warning
 * - Customer 3 (Michael Brown): 15 - Critical
 * - Customer 4 (Emily Davis): 92 - Healthy
 * - Customer 5 (David Wilson): 60 - Warning
 * - Customer 6 (Lisa Anderson): 73 - Healthy
 * - Customer 7 (Robert Chen): 88 - Healthy
 * - Customer 8 (Maria Rodriguez): 35 - Warning
 */

import { CustomerMetrics } from '../lib/types/healthScore';

export const mockCustomerMetrics: Record<string, CustomerMetrics> = {
  // Customer 1 - John Smith (Target: 85 - Healthy)
  '1': {
    payment: {
      daysSinceLastPayment: 10,
      averagePaymentDelay: 2,
      outstandingBalance: 0,
    },
    engagement: {
      monthlyLogins: 18,
      featuresUsed: 12,
      supportTicketsOpened: 2,
    },
    contract: {
      daysUntilRenewal: 200,
      contractValue: 50000,
      hasRecentUpgrade: false,
    },
    support: {
      averageResolutionTime: 6,
      satisfactionScore: 4.5,
      escalationCount: 0,
    },
  },

  // Customer 2 - Sarah Johnson (Target: 45 - Warning)
  '2': {
    payment: {
      daysSinceLastPayment: 45,
      averagePaymentDelay: 10,
      outstandingBalance: 2500,
    },
    engagement: {
      monthlyLogins: 8,
      featuresUsed: 5,
      supportTicketsOpened: 6,
    },
    contract: {
      daysUntilRenewal: 120,
      contractValue: 25000,
      hasRecentUpgrade: false,
    },
    support: {
      averageResolutionTime: 15,
      satisfactionScore: 3.0,
      escalationCount: 2,
    },
  },

  // Customer 3 - Michael Brown (Target: 15 - Critical)
  '3': {
    payment: {
      daysSinceLastPayment: 85,
      averagePaymentDelay: 30,
      outstandingBalance: 8000,
    },
    engagement: {
      monthlyLogins: 2,
      featuresUsed: 2,
      supportTicketsOpened: 12,
    },
    contract: {
      daysUntilRenewal: 25,
      contractValue: 15000,
      hasRecentUpgrade: false,
    },
    support: {
      averageResolutionTime: 48,
      satisfactionScore: 1.5,
      escalationCount: 7,
    },
  },

  // Customer 4 - Emily Davis (Target: 92 - Healthy)
  '4': {
    payment: {
      daysSinceLastPayment: 5,
      averagePaymentDelay: 0,
      outstandingBalance: 0,
    },
    engagement: {
      monthlyLogins: 22,
      featuresUsed: 18,
      supportTicketsOpened: 1,
    },
    contract: {
      daysUntilRenewal: 250,
      contractValue: 100000,
      hasRecentUpgrade: true,
    },
    support: {
      averageResolutionTime: 3,
      satisfactionScore: 5.0,
      escalationCount: 0,
    },
  },

  // Customer 5 - David Wilson (Target: 60 - Warning)
  '5': {
    payment: {
      daysSinceLastPayment: 30,
      averagePaymentDelay: 7,
      outstandingBalance: 1200,
    },
    engagement: {
      monthlyLogins: 12,
      featuresUsed: 8,
      supportTicketsOpened: 4,
    },
    contract: {
      daysUntilRenewal: 150,
      contractValue: 35000,
      hasRecentUpgrade: false,
    },
    support: {
      averageResolutionTime: 10,
      satisfactionScore: 3.5,
      escalationCount: 1,
    },
  },

  // Customer 6 - Lisa Anderson (Target: 73 - Healthy)
  '6': {
    payment: {
      daysSinceLastPayment: 15,
      averagePaymentDelay: 3,
      outstandingBalance: 500,
    },
    engagement: {
      monthlyLogins: 16,
      featuresUsed: 10,
      supportTicketsOpened: 3,
    },
    contract: {
      daysUntilRenewal: 190,
      contractValue: 45000,
      hasRecentUpgrade: false,
    },
    support: {
      averageResolutionTime: 8,
      satisfactionScore: 4.0,
      escalationCount: 1,
    },
  },

  // Customer 7 - Robert Chen (Target: 88 - Healthy)
  '7': {
    payment: {
      daysSinceLastPayment: 7,
      averagePaymentDelay: 1,
      outstandingBalance: 0,
    },
    engagement: {
      monthlyLogins: 20,
      featuresUsed: 15,
      supportTicketsOpened: 2,
    },
    contract: {
      daysUntilRenewal: 220,
      contractValue: 120000,
      hasRecentUpgrade: true,
    },
    support: {
      averageResolutionTime: 4,
      satisfactionScore: 4.8,
      escalationCount: 0,
    },
  },

  // Customer 8 - Maria Rodriguez (Target: 35 - Warning)
  '8': {
    payment: {
      daysSinceLastPayment: 60,
      averagePaymentDelay: 20,
      outstandingBalance: 4500,
    },
    engagement: {
      monthlyLogins: 5,
      featuresUsed: 4,
      supportTicketsOpened: 8,
    },
    contract: {
      daysUntilRenewal: 40,
      contractValue: 20000,
      hasRecentUpgrade: false,
    },
    support: {
      averageResolutionTime: 28,
      satisfactionScore: 2.5,
      escalationCount: 4,
    },
  },
};
