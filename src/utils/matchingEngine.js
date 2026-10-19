// Rule-Based Resource Matching System for ReLoop
import { calculateDistanceKm } from './maps';

/**
 * Calculates match score and reasons between a published Need and an available Resource.
 * Returns { score: number (0-100), reasons: string[], isCompatible: boolean, matchLevel: 'High' | 'Moderate' | 'Potential' }
 */
export function evaluateNeedMatch(need, resource) {
  // 1. Hard filters: Exclude inactive, expired, completed, or 0 quantity resources
  if (!resource || resource.status !== 'active' || (resource.available_quantity || resource.quantity) <= 0) {
    return { score: 0, reasons: [], isCompatible: false };
  }

  // Exclude if deadline passed
  if (need.deadline && new Date(need.deadline) < new Date()) {
    return { score: 0, reasons: [], isCompatible: false };
  }

  let score = 0;
  const reasons = [];

  // A. Category Compatibility (Weight: 35 points)
  if (need.category && resource.category) {
    if (need.category.toLowerCase() === resource.category.toLowerCase()) {
      score += 35;
      reasons.push(`Exact category match: "${resource.category}"`);
    } else {
      // Different category: not a direct match
      return { score: 0, reasons: [], isCompatible: false };
    }
  }

  // B. Keyword & Material Analysis (Weight: 25 points)
  const needText = `${need.title || ''} ${need.description || ''}`.toLowerCase();
  const resourceText = `${resource.title || ''} ${resource.description || ''}`.toLowerCase();

  // Extract meaningful tokens (> 3 letters)
  const tokens = needText
    .split(/[\s,.;:()/-]+/)
    .filter(t => t.length > 3 && !['need', 'want', 'looking', 'please', 'with', 'have', 'from', 'good', 'some', 'than'].includes(t));

  const matchedKeywords = tokens.filter(t => resourceText.includes(t));
  if (matchedKeywords.length > 0) {
    const keywordPoints = Math.min(25, matchedKeywords.length * 8);
    score += keywordPoints;
    const sampleKeywords = [...new Set(matchedKeywords)].slice(0, 3).join(', ');
    reasons.push(`Keywords aligned: ${sampleKeywords}`);
  }

  // C. Condition Compatibility (Weight: 15 points)
  if (need.acceptable_condition && Array.isArray(need.acceptable_condition) && need.acceptable_condition.length > 0) {
    if (need.acceptable_condition.includes(resource.condition)) {
      score += 15;
      reasons.push(`Condition meets criteria: ${resource.condition.replace('_', ' ')}`);
    } else {
      // Discard or penalize heavily if condition is unacceptable
      score -= 20;
    }
  } else {
    // No condition constraint specified, give default partial points
    score += 10;
  }

  // D. Quantity & Partial Allowance (Weight: 15 points)
  const requestedQty = parseFloat(need.quantity_required) || 1;
  const availableQty = parseFloat(resource.available_quantity ?? resource.quantity) || 1;

  if (availableQty >= requestedQty) {
    score += 15;
    reasons.push(`Full quantity available (${availableQty} ${resource.unit || 'units'} ≥ ${requestedQty} requested)`);
  } else if (resource.allow_partial_quantity && availableQty > 0) {
    score += 10;
    reasons.push(`Partial quantity available (${availableQty} of ${requestedQty} ${resource.unit || 'units'})`);
  } else {
    // Insufficient quantity and partial not allowed
    score -= 10;
  }

  // E. Budget & Listing Type Compatibility (Weight: 10 points)
  const resourcePrice = parseFloat(resource.price) || 0;
  const needBudget = need.budget ? parseFloat(need.budget) : null;

  if (resource.listing_type === 'giveaway' || resource.listing_type === 'donation' || resourcePrice === 0) {
    score += 10;
    reasons.push('Free resource (No cost to recipient)');
  } else if (needBudget !== null) {
    if (resourcePrice <= needBudget) {
      score += 10;
      reasons.push(`Within specified budget ($${resourcePrice} ≤ $${needBudget})`);
    } else {
      score -= 15;
    }
  }

  // F. Proximity / Geographic match (Weight: bonus up to 10 points)
  if (need.lat && need.lng && resource.lat && resource.lng) {
    const dist = calculateDistanceKm(need.lat, need.lng, resource.lat, resource.lng);
    if (dist !== null) {
      if (dist <= 15) {
        score += 10;
        reasons.push(`Nearby location (~${dist} km away)`);
      } else if (dist <= 50) {
        score += 5;
        reasons.push(`Regional proximity (~${dist} km away)`);
      }
    }
  } else if (need.preferred_location && resource.city && need.preferred_location.toLowerCase().includes(resource.city.toLowerCase())) {
    score += 5;
    reasons.push(`City match: ${resource.city}`);
  }

  const finalScore = Math.min(100, Math.max(0, Math.round(score)));
  const isCompatible = finalScore >= 40;

  let matchLevel = 'Potential';
  if (finalScore >= 75) matchLevel = 'High';
  else if (finalScore >= 55) matchLevel = 'Moderate';

  return {
    score: finalScore,
    reasons,
    isCompatible,
    matchLevel,
    disclaimer: 'Compatibility ranking is an algorithmic recommendation to facilitate connection; verify all specifications independently.'
  };
}

/**
 * Filter and rank a list of resources against a single need
 */
export function findRankedMatchesForNeed(need, allResources) {
  if (!need || !Array.isArray(allResources)) return [];

  return allResources
    .map(resource => {
      const evaluation = evaluateNeedMatch(need, resource);
      return {
        resource,
        need,
        ...evaluation
      };
    })
    .filter(item => item.isCompatible)
    .sort((a, b) => b.score - a.score);
}
