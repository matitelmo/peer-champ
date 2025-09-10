/**
 * Matching Hook
 *
 * React hook for managing advocate-opportunity matching functionality.
 * Provides methods for finding matches, calculating scores, and managing matching state.
 */

'use client';

import { useState, useCallback } from 'react';
import { Advocate, Opportunity } from '@/types/database';
import {
  MatchResult,
  MatchingCriteria,
  MatchingStats,
  calculateMatchScore,
  findMatchingAdvocates,
  getMatchingRecommendations,
  getMatchQualityInsights,
} from '@/lib/services/matchingService';

interface UseMatchingOptions {
  advocates?: Advocate[];
  opportunities?: Opportunity[];
}

export const useMatching = (options: UseMatchingOptions = {}) => {
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [stats, setStats] = useState<MatchingStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Find matching advocates for an opportunity
   */
  const findMatches = useCallback(
    async (
      opportunity: Opportunity,
      criteria: Partial<MatchingCriteria> = {}
    ) => {
      if (!options.advocates) {
        setError('No advocates available for matching');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = getMatchingRecommendations(
          options.advocates,
          opportunity,
          criteria
        );
        setMatches(result.matches);
        setStats(result.stats);
      } catch (err: any) {
        setError(err.message || 'Failed to find matches');
        console.error('Error finding matches:', err);
      } finally {
        setLoading(false);
      }
    },
    [options.advocates]
  );

  /**
   * Calculate match score for a specific advocate-opportunity pair
   */
  const calculateScore = useCallback(
    (advocate: Advocate, opportunity: Opportunity): MatchResult => {
      return calculateMatchScore(advocate, opportunity);
    },
    []
  );

  /**
   * Get match quality insights for current matches
   */
  const getInsights = useCallback(() => {
    if (matches.length === 0) {
      return {
        highConfidenceCount: 0,
        mediumConfidenceCount: 0,
        lowConfidenceCount: 0,
        averageScore: 0,
        topReasons: [],
      };
    }

    return getMatchQualityInsights(matches);
  }, [matches]);

  /**
   * Clear current matches
   */
  const clearMatches = useCallback(() => {
    setMatches([]);
    setStats(null);
    setError(null);
  }, []);

  /**
   * Get matches for multiple opportunities
   */
  const findMatchesForMultipleOpportunities = useCallback(
    async (
      opportunities: Opportunity[],
      criteria: Partial<MatchingCriteria> = {}
    ) => {
      if (!options.advocates) {
        setError('No advocates available for matching');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const allMatches: MatchResult[] = [];
        const allStats: MatchingStats[] = [];

        for (const opportunity of opportunities) {
          const result = getMatchingRecommendations(
            options.advocates,
            opportunity,
            criteria
          );
          allMatches.push(
            ...result.matches.map((match) => ({
              ...match,
              // Add opportunity context to each match
              opportunityId: opportunity.id,
              opportunityName: opportunity.opportunity_name,
            }))
          );
          allStats.push(result.stats);
        }

        // Sort all matches by score
        allMatches.sort((a, b) => b.score - a.score);

        setMatches(allMatches);

        // Calculate combined stats
        const combinedStats: MatchingStats = {
          totalAdvocates: allStats[0]?.totalAdvocates || 0,
          eligibleAdvocates: allStats[0]?.eligibleAdvocates || 0,
          matchesFound: allMatches.length,
          averageScore:
            allMatches.length > 0
              ? Math.round(
                  allMatches.reduce((sum, match) => sum + match.score, 0) /
                    allMatches.length
                )
              : 0,
          topScore: allMatches.length > 0 ? allMatches[0].score : 0,
          criteria: {
            opportunityId: 'multiple',
            ...criteria,
          },
        };

        setStats(combinedStats);
      } catch (err: any) {
        setError(
          err.message || 'Failed to find matches for multiple opportunities'
        );
        console.error('Error finding matches for multiple opportunities:', err);
      } finally {
        setLoading(false);
      }
    },
    [options.advocates]
  );

  /**
   * Filter matches by confidence level
   */
  const filterMatchesByConfidence = useCallback(
    (confidence: 'low' | 'medium' | 'high') => {
      return matches.filter((match) => match.confidence === confidence);
    },
    [matches]
  );

  /**
   * Filter matches by minimum score
   */
  const filterMatchesByScore = useCallback(
    (minScore: number) => {
      return matches.filter((match) => match.score >= minScore);
    },
    [matches]
  );

  /**
   * Get top N matches
   */
  const getTopMatches = useCallback(
    (count: number) => {
      return matches.slice(0, count);
    },
    [matches]
  );

  /**
   * Get matches for a specific opportunity
   */
  const getMatchesForOpportunity = useCallback(
    (opportunityId: string) => {
      return matches.filter(
        (match) => (match as any).opportunityId === opportunityId
      );
    },
    [matches]
  );

  /**
   * Get advocate match history (if available)
   */
  const getAdvocateMatchHistory = useCallback(
    (advocateId: string) => {
      return matches.filter((match) => match.advocate.id === advocateId);
    },
    [matches]
  );

  return {
    // State
    matches,
    stats,
    loading,
    error,

    // Actions
    findMatches,
    calculateScore,
    getInsights,
    clearMatches,
    findMatchesForMultipleOpportunities,

    // Filters and utilities
    filterMatchesByConfidence,
    filterMatchesByScore,
    getTopMatches,
    getMatchesForOpportunity,
    getAdvocateMatchHistory,

    // Computed values
    hasMatches: matches.length > 0,
    matchCount: matches.length,
    highConfidenceMatches: filterMatchesByConfidence('high'),
    mediumConfidenceMatches: filterMatchesByConfidence('medium'),
    lowConfidenceMatches: filterMatchesByConfidence('low'),
  };
};
