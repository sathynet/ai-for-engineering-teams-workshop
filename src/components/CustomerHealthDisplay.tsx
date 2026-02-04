'use client';

import React, { useState, useEffect } from 'react';
import { CustomerMetrics, HealthScoreResult, FactorScore } from '../lib/types/healthScore';
import { calculateHealthScore } from '../lib/healthCalculator';

/**
 * Props for CustomerHealthDisplay component
 */
export interface CustomerHealthDisplayProps {
  customerId: string;
  metrics: CustomerMetrics;
  onScoreChange?: (score: number) => void;
}

/**
 * Returns Tailwind CSS color classes based on health score
 */
function getHealthColor(score: number): {
  bg: string;
  text: string;
  border: string;
  progress: string;
} {
  if (score >= 71) {
    return {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-300',
      progress: 'bg-green-500',
    };
  }
  if (score >= 31) {
    return {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      border: 'border-yellow-300',
      progress: 'bg-yellow-500',
    };
  }
  return {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-300',
    progress: 'bg-red-500',
  };
}

/**
 * Factor display subcomponent
 */
interface FactorDisplayProps {
  factor: FactorScore;
  color: ReturnType<typeof getHealthColor>;
}

function FactorDisplay({ factor, color }: FactorDisplayProps) {
  const widthPercentage = Math.max(0, Math.min(100, factor.score));

  return (
    <div className="mb-4 last:mb-0">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700">{factor.name}</span>
          <span className="text-xs text-gray-500">
            ({Math.round(factor.weight * 100)}% weight)
          </span>
        </div>
        <span className={`text-sm font-semibold ${color.text}`}>
          {factor.score.toFixed(1)}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full ${color.progress} transition-all duration-500 ease-out`}
          style={{ width: `${widthPercentage}%` }}
          role="progressbar"
          aria-valuenow={factor.score}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>Weighted contribution: {factor.weightedScore.toFixed(1)}</span>
      </div>
    </div>
  );
}

/**
 * Customer Health Display Component
 *
 * Displays customer health score with expandable factor breakdown.
 * Follows CustomerCard.tsx styling patterns for consistency.
 */
export default function CustomerHealthDisplay({
  customerId,
  metrics,
  onScoreChange,
}: CustomerHealthDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [healthScore, setHealthScore] = useState<HealthScoreResult | null>(null);

  // Calculate health score when metrics change
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    try {
      const result = calculateHealthScore(metrics, customerId);
      setHealthScore(result);
      onScoreChange?.(result.overallScore);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to calculate health score';
      setError(errorMessage);
      console.error('Health score calculation error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [metrics, customerId, onScoreChange]);

  // Handle expand/collapse
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleExpand();
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse" />
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-48" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !healthScore) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-red-600">
          <p className="font-semibold">Error calculating health score</p>
          <p className="text-sm mt-1">{error || 'Unknown error'}</p>
        </div>
      </div>
    );
  }

  const color = getHealthColor(healthScore.overallScore);
  const riskLevelText = {
    healthy: 'Healthy',
    warning: 'Warning',
    critical: 'Critical',
  }[healthScore.riskLevel];

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
      <div
        className="p-6 cursor-pointer"
        onClick={toggleExpand}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-label={`Customer health score: ${healthScore.overallScore}. Click to ${isExpanded ? 'collapse' : 'expand'} details.`}
      >
        <div className="flex items-center gap-4">
          {/* Large score badge */}
          <div
            className={`w-20 h-20 rounded-full ${color.bg} ${color.text} flex flex-col items-center justify-center border-2 ${color.border}`}
          >
            <span className="text-2xl font-bold">{Math.round(healthScore.overallScore)}</span>
            <span className="text-xs font-medium">Score</span>
          </div>

          {/* Info section */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">Health Score</h3>
            <p className={`text-sm font-medium ${color.text}`}>
              Status: {riskLevelText}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Click to {isExpanded ? 'hide' : 'view'} breakdown
            </p>
          </div>

          {/* Expand/collapse icon */}
          <div className="text-gray-400">
            <svg
              className={`w-6 h-6 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Expanded breakdown section */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
            Factor Breakdown
          </h4>

          <FactorDisplay factor={healthScore.factors.payment} color={color} />
          <FactorDisplay factor={healthScore.factors.engagement} color={color} />
          <FactorDisplay factor={healthScore.factors.contract} color={color} />
          <FactorDisplay factor={healthScore.factors.support} color={color} />

          <div className="mt-4 pt-4 border-t border-gray-300">
            <p className="text-xs text-gray-500">
              Calculated at: {healthScore.calculatedAt.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Screen reader only text */}
      <span className="sr-only">
        Customer {customerId} has a health score of {healthScore.overallScore} with {riskLevelText} risk level.
      </span>
    </div>
  );
}
