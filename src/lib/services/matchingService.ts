/**
 * Matching Service
 *
 * Provides rule-based matching between advocates and opportunities.
 * Implements scoring algorithms based on various criteria like industry,
 * company size, use cases, expertise areas, and availability.
 */

import { Advocate, Opportunity, CompanySize } from '@/types/database';

export interface MatchResult {
  advocate: Advocate;
  score: number;
  reasons: string[];
  confidence: 'low' | 'medium' | 'high';
}

export interface MatchingCriteria {
  opportunityId: string;
  maxResults?: number;
  minScore?: number;
  includeInactive?: boolean;
  preferredRegions?: string[];
  excludeAdvocateIds?: string[];
}

export interface MatchingStats {
  totalAdvocates: number;
  eligibleAdvocates: number;
  matchesFound: number;
  averageScore: number;
  topScore: number;
  criteria: MatchingCriteria;
}

// Scoring weights for different criteria
const SCORING_WEIGHTS = {
  INDUSTRY_MATCH: 25,
  COMPANY_SIZE_MATCH: 15,
  USE_CASE_MATCH: 20,
  EXPERTISE_MATCH: 20,
  REGION_MATCH: 10,
  AVAILABILITY_SCORE: 10,
} as const;

// Company size hierarchy for scoring
const COMPANY_SIZE_HIERARCHY: Record<CompanySize, number> = {
  '1-10': 1,
  '11-50': 2,
  '51-200': 3,
  '201-500': 4,
  '501-1000': 5,
  '1000+': 6,
};

/**
 * Calculate industry match score
 */
function calculateIndustryScore(
  advocateIndustry: string | undefined,
  opportunityIndustry: string | undefined,
  desiredIndustry: string | undefined
): { score: number; reason: string } {
  if (!advocateIndustry) {
    return { score: 0, reason: 'No advocate industry specified' };
  }

  const targetIndustry = desiredIndustry || opportunityIndustry;
  if (!targetIndustry) {
    return {
      score: 50,
      reason: 'No target industry specified - partial match',
    };
  }

  // Exact match
  if (advocateIndustry.toLowerCase() === targetIndustry.toLowerCase()) {
    return { score: 100, reason: 'Exact industry match' };
  }

  // Partial match (contains target industry or vice versa)
  if (
    advocateIndustry.toLowerCase().includes(targetIndustry.toLowerCase()) ||
    targetIndustry.toLowerCase().includes(advocateIndustry.toLowerCase())
  ) {
    return { score: 75, reason: 'Partial industry match' };
  }

  // Related industries (basic mapping)
  const relatedIndustries: Record<string, string[]> = {
    technology: ['software', 'saas', 'tech', 'it', 'digital'],
    software: ['technology', 'saas', 'tech', 'it', 'digital'],
    saas: ['technology', 'software', 'tech', 'it', 'digital'],
    manufacturing: ['industrial', 'production', 'factory'],
    healthcare: ['medical', 'pharmaceutical', 'biotech'],
    finance: ['banking', 'fintech', 'financial services'],
    retail: ['ecommerce', 'commerce', 'shopping'],
    education: ['edtech', 'learning', 'training'],
  };

  const advocateIndustryLower = advocateIndustry.toLowerCase();
  const targetIndustryLower = targetIndustry.toLowerCase();

  for (const [key, related] of Object.entries(relatedIndustries)) {
    if (
      (key === advocateIndustryLower &&
        related.includes(targetIndustryLower)) ||
      (key === targetIndustryLower && related.includes(advocateIndustryLower))
    ) {
      return { score: 60, reason: 'Related industry match' };
    }
  }

  return { score: 0, reason: 'No industry match' };
}

/**
 * Calculate company size match score
 */
function calculateCompanySizeScore(
  advocateSize: CompanySize | undefined,
  opportunitySize: CompanySize | undefined,
  desiredSize: CompanySize | undefined
): { score: number; reason: string } {
  if (!advocateSize) {
    return { score: 0, reason: 'No advocate company size specified' };
  }

  const targetSize = desiredSize || opportunitySize;
  if (!targetSize) {
    return {
      score: 50,
      reason: 'No target company size specified - partial match',
    };
  }

  // Exact match
  if (advocateSize === targetSize) {
    return { score: 100, reason: 'Exact company size match' };
  }

  // Size proximity scoring (closer sizes get higher scores)
  const advocateLevel = COMPANY_SIZE_HIERARCHY[advocateSize];
  const targetLevel = COMPANY_SIZE_HIERARCHY[targetSize];
  const difference = Math.abs(advocateLevel - targetLevel);

  if (difference === 1) {
    return { score: 80, reason: 'Similar company size (1 level difference)' };
  } else if (difference === 2) {
    return {
      score: 60,
      reason: 'Moderately similar company size (2 level difference)',
    };
  } else if (difference === 3) {
    return {
      score: 40,
      reason: 'Somewhat similar company size (3 level difference)',
    };
  } else {
    return { score: 20, reason: 'Different company size' };
  }
}

/**
 * Calculate use case match score
 */
function calculateUseCaseScore(
  advocateUseCases: string[] | undefined,
  opportunityUseCase: string | undefined,
  desiredUseCases: string[] | undefined
): { score: number; reason: string } {
  if (!advocateUseCases || advocateUseCases.length === 0) {
    return { score: 0, reason: 'No advocate use cases specified' };
  }

  const targetUseCases =
    desiredUseCases || (opportunityUseCase ? [opportunityUseCase] : []);
  if (targetUseCases.length === 0) {
    return {
      score: 50,
      reason: 'No target use cases specified - partial match',
    };
  }

  // Find matching use cases
  const matches = targetUseCases.filter((targetUseCase) =>
    advocateUseCases.some(
      (advocateUseCase) =>
        advocateUseCase.toLowerCase().includes(targetUseCase.toLowerCase()) ||
        targetUseCase.toLowerCase().includes(advocateUseCase.toLowerCase())
    )
  );

  if (matches.length === 0) {
    return { score: 0, reason: 'No use case matches' };
  }

  const matchPercentage = (matches.length / targetUseCases.length) * 100;
  const reason =
    matches.length === targetUseCases.length
      ? `All use cases match: ${matches.join(', ')}`
      : `Partial use case match: ${matches.join(', ')}`;

  return { score: matchPercentage, reason };
}

/**
 * Calculate expertise match score
 */
function calculateExpertiseScore(
  advocateExpertise: string[] | undefined,
  desiredExpertise: string[] | undefined
): { score: number; reason: string } {
  if (!advocateExpertise || advocateExpertise.length === 0) {
    return { score: 0, reason: 'No advocate expertise specified' };
  }

  if (!desiredExpertise || desiredExpertise.length === 0) {
    return {
      score: 50,
      reason: 'No desired expertise specified - partial match',
    };
  }

  // Find matching expertise areas
  const matches = desiredExpertise.filter((desiredArea) =>
    advocateExpertise.some(
      (advocateArea) =>
        advocateArea.toLowerCase().includes(desiredArea.toLowerCase()) ||
        desiredArea.toLowerCase().includes(advocateArea.toLowerCase())
    )
  );

  if (matches.length === 0) {
    return { score: 0, reason: 'No expertise matches' };
  }

  const matchPercentage = (matches.length / desiredExpertise.length) * 100;
  const reason =
    matches.length === desiredExpertise.length
      ? `All expertise areas match: ${matches.join(', ')}`
      : `Partial expertise match: ${matches.join(', ')}`;

  return { score: matchPercentage, reason };
}

/**
 * Calculate region match score
 */
function calculateRegionScore(
  advocateRegion: string | undefined,
  opportunityRegion: string | undefined,
  desiredRegion: string | undefined
): { score: number; reason: string } {
  if (!advocateRegion) {
    return { score: 0, reason: 'No advocate region specified' };
  }

  const targetRegion = desiredRegion || opportunityRegion;
  if (!targetRegion) {
    return { score: 50, reason: 'No target region specified - partial match' };
  }

  // Exact match
  if (advocateRegion.toLowerCase() === targetRegion.toLowerCase()) {
    return { score: 100, reason: 'Exact region match' };
  }

  // Partial match (contains target region or vice versa)
  if (
    advocateRegion.toLowerCase().includes(targetRegion.toLowerCase()) ||
    targetRegion.toLowerCase().includes(advocateRegion.toLowerCase())
  ) {
    return { score: 75, reason: 'Partial region match' };
  }

  // Related regions (basic mapping)
  const relatedRegions: Record<string, string[]> = {
    'north america': ['usa', 'united states', 'canada', 'us', 'america'],
    europe: [
      'eu',
      'european union',
      'uk',
      'united kingdom',
      'germany',
      'france',
    ],
    'asia pacific': ['asia', 'apac', 'australia', 'japan', 'singapore'],
    'latin america': ['south america', 'brazil', 'mexico', 'latam'],
  };

  const advocateRegionLower = advocateRegion.toLowerCase();
  const targetRegionLower = targetRegion.toLowerCase();

  for (const [key, related] of Object.entries(relatedRegions)) {
    if (
      (key === advocateRegionLower && related.includes(targetRegionLower)) ||
      (key === targetRegionLower && related.includes(advocateRegionLower))
    ) {
      return { score: 60, reason: 'Related region match' };
    }
  }

  return { score: 0, reason: 'No region match' };
}

/**
 * Calculate availability score
 */
function calculateAvailabilityScore(advocate: Advocate): {
  score: number;
  reason: string;
} {
  const availabilityScore = advocate.availability_score || 0;

  if (availabilityScore >= 80) {
    return { score: 100, reason: 'High availability' };
  } else if (availabilityScore >= 60) {
    return { score: 75, reason: 'Good availability' };
  } else if (availabilityScore >= 40) {
    return { score: 50, reason: 'Moderate availability' };
  } else if (availabilityScore >= 20) {
    return { score: 25, reason: 'Low availability' };
  } else {
    return { score: 0, reason: 'Very low availability' };
  }
}

/**
 * Calculate overall match score for an advocate-opportunity pair
 */
export function calculateMatchScore(
  advocate: Advocate,
  opportunity: Opportunity
): MatchResult {
  const reasons: string[] = [];
  let totalScore = 0;

  // Industry match
  const industryMatch = calculateIndustryScore(
    advocate.industry ?? undefined,
    opportunity.prospect_industry ?? undefined,
    opportunity.desired_advocate_industry ?? undefined
  );
  const industryScore =
    (industryMatch.score / 100) * SCORING_WEIGHTS.INDUSTRY_MATCH;
  totalScore += industryScore;
  if (industryMatch.score > 0) {
    reasons.push(industryMatch.reason);
  }

  // Company size match
  const sizeMatch = calculateCompanySizeScore(
    advocate.company_size ?? undefined,
    opportunity.prospect_size ?? undefined,
    opportunity.desired_advocate_size ?? undefined
  );
  const sizeScore =
    (sizeMatch.score / 100) * SCORING_WEIGHTS.COMPANY_SIZE_MATCH;
  totalScore += sizeScore;
  if (sizeMatch.score > 0) {
    reasons.push(sizeMatch.reason);
  }

  // Use case match
  const useCaseMatch = calculateUseCaseScore(
    advocate.use_cases ?? undefined,
    opportunity.use_case ?? undefined,
    opportunity.desired_use_cases ?? undefined
  );
  const useCaseScore =
    (useCaseMatch.score / 100) * SCORING_WEIGHTS.USE_CASE_MATCH;
  totalScore += useCaseScore;
  if (useCaseMatch.score > 0) {
    reasons.push(useCaseMatch.reason);
  }

  // Expertise match
  const expertiseMatch = calculateExpertiseScore(
    advocate.expertise_areas ?? undefined,
    opportunity.desired_expertise_areas ?? undefined
  );
  const expertiseScore =
    (expertiseMatch.score / 100) * SCORING_WEIGHTS.EXPERTISE_MATCH;
  totalScore += expertiseScore;
  if (expertiseMatch.score > 0) {
    reasons.push(expertiseMatch.reason);
  }

  // Region match
  const regionMatch = calculateRegionScore(
    advocate.geographic_region ?? undefined,
    opportunity.geographic_region ?? undefined,
    opportunity.desired_advocate_region ?? undefined
  );
  const regionScore = (regionMatch.score / 100) * SCORING_WEIGHTS.REGION_MATCH;
  totalScore += regionScore;
  if (regionMatch.score > 0) {
    reasons.push(regionMatch.reason);
  }

  // Availability score
  const availabilityMatch = calculateAvailabilityScore(advocate);
  const availabilityScore =
    (availabilityMatch.score / 100) * SCORING_WEIGHTS.AVAILABILITY_SCORE;
  totalScore += availabilityScore;
  if (availabilityMatch.score > 0) {
    reasons.push(availabilityMatch.reason);
  }

  // Determine confidence level
  let confidence: 'low' | 'medium' | 'high';
  if (totalScore >= 80) {
    confidence = 'high';
  } else if (totalScore >= 60) {
    confidence = 'medium';
  } else {
    confidence = 'low';
  }

  return {
    advocate,
    score: Math.round(totalScore),
    reasons,
    confidence,
  };
}

/**
 * Find matching advocates for an opportunity
 */
export function findMatchingAdvocates(
  advocates: Advocate[],
  opportunity: Opportunity,
  criteria: MatchingCriteria
): { matches: MatchResult[]; stats: MatchingStats } {
  const {
    maxResults = 10,
    minScore = 30,
    includeInactive = false,
    preferredRegions = [],
    excludeAdvocateIds = [],
  } = criteria;

  // Filter advocates based on criteria
  const eligibleAdvocates = advocates.filter((advocate) => {
    // Exclude specified advocate IDs
    if (excludeAdvocateIds.includes(advocate.id)) {
      return false;
    }

    // Filter by status
    if (!includeInactive && advocate.status !== 'active') {
      return false;
    }

    // Filter by preferred regions if specified
    if (preferredRegions.length > 0 && advocate.geographic_region) {
      const advocateRegionLower = advocate.geographic_region.toLowerCase();
      const hasPreferredRegion = preferredRegions.some(
        (region) =>
          advocateRegionLower.includes(region.toLowerCase()) ||
          region.toLowerCase().includes(advocateRegionLower)
      );
      if (!hasPreferredRegion) {
        return false;
      }
    }

    return true;
  });

  // Calculate match scores for all eligible advocates
  const matchResults = eligibleAdvocates
    .map((advocate) => calculateMatchScore(advocate, opportunity))
    .filter((match) => match.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);

  // Calculate statistics
  const totalScore = matchResults.reduce((sum, match) => sum + match.score, 0);
  const averageScore =
    matchResults.length > 0 ? totalScore / matchResults.length : 0;
  const topScore = matchResults.length > 0 ? matchResults[0].score : 0;

  const stats: MatchingStats = {
    totalAdvocates: advocates.length,
    eligibleAdvocates: eligibleAdvocates.length,
    matchesFound: matchResults.length,
    averageScore: Math.round(averageScore),
    topScore,
    criteria,
  };

  return { matches: matchResults, stats };
}

/**
 * Get matching recommendations for an opportunity
 */
export function getMatchingRecommendations(
  advocates: Advocate[],
  opportunity: Opportunity,
  criteria: Partial<MatchingCriteria> = {}
): { matches: MatchResult[]; stats: MatchingStats } {
  const fullCriteria: MatchingCriteria = {
    opportunityId: opportunity.id,
    maxResults: 10,
    minScore: 30,
    includeInactive: false,
    preferredRegions: [],
    excludeAdvocateIds: [],
    ...criteria,
  };

  return findMatchingAdvocates(advocates, opportunity, fullCriteria);
}

/**
 * Get match quality insights
 */
export function getMatchQualityInsights(matches: MatchResult[]): {
  highConfidenceCount: number;
  mediumConfidenceCount: number;
  lowConfidenceCount: number;
  averageScore: number;
  topReasons: string[];
} {
  const highConfidenceCount = matches.filter(
    (m) => m.confidence === 'high'
  ).length;
  const mediumConfidenceCount = matches.filter(
    (m) => m.confidence === 'medium'
  ).length;
  const lowConfidenceCount = matches.filter(
    (m) => m.confidence === 'low'
  ).length;

  const totalScore = matches.reduce((sum, match) => sum + match.score, 0);
  const averageScore =
    matches.length > 0 ? Math.round(totalScore / matches.length) : 0;

  // Count reason frequency
  const reasonCounts: Record<string, number> = {};
  matches.forEach((match) => {
    match.reasons.forEach((reason) => {
      reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
    });
  });

  // Get top 5 most common reasons
  const topReasons = Object.entries(reasonCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([reason]) => reason);

  return {
    highConfidenceCount,
    mediumConfidenceCount,
    lowConfidenceCount,
    averageScore,
    topReasons,
  };
}
