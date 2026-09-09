/* =========================================================
   MAUSAM PERSONALIZATION ENGINE
   Transparent heuristic ranking for homepage content
   ========================================================= */

const WEIGHTS = {
  context: 0.30,
  severity: 0.20,
  location: 0.20,
  interest: 0.15,
  interaction: 0.10,
  seasonal: 0.05,
};

/* =========================================================
   CALCULATE RELEVANCE SCORE
   Each input score should be between 0 and 100.
   ========================================================= */

export function calculateRelevance({
  contextScore = 0,
  severityScore = 0,
  locationScore = 0,
  interestScore = 0,
  interactionScore = 0,
  seasonalScore = 0,
}) {
  const score =
    contextScore * WEIGHTS.context +
    severityScore * WEIGHTS.severity +
    locationScore * WEIGHTS.location +
    interestScore * WEIGHTS.interest +
    interactionScore * WEIGHTS.interaction +
    seasonalScore * WEIGHTS.seasonal;

  return Math.round(score);
}

/* =========================================================
   GENERATE HUMAN-READABLE REASONS
   ========================================================= */

export function getRelevanceReasons({
  contextScore = 0,
  severityScore = 0,
  locationScore = 0,
  interestScore = 0,
  interactionScore = 0,
  seasonalScore = 0,
}) {
  const reasons = [];

  if (contextScore >= 70) {
    reasons.push("Relevant to your current context");
  }

  if (severityScore >= 70) {
    reasons.push("Weather conditions increase its priority");
  }

  if (locationScore >= 70) {
    reasons.push("Important for your selected location");
  }

  if (interestScore >= 70) {
    reasons.push("Matches your selected interests");
  }

  if (interactionScore >= 70) {
    reasons.push("You have interacted with this type of information");
  }

  if (seasonalScore >= 70) {
    reasons.push("Relevant to the current seasonal conditions");
  }

  return reasons;
}

/* =========================================================
   RANK A SINGLE PERSONALIZATION ITEM
   ========================================================= */

export function rankPersonalizationItem({
  id,
  title,
  contextScore = 0,
  severityScore = 0,
  locationScore = 0,
  interestScore = 0,
  interactionScore = 0,
  seasonalScore = 0,
}) {
  const score = calculateRelevance({
    contextScore,
    severityScore,
    locationScore,
    interestScore,
    interactionScore,
    seasonalScore,
  });

  const reasons = getRelevanceReasons({
    contextScore,
    severityScore,
    locationScore,
    interestScore,
    interactionScore,
    seasonalScore,
  });

  return {
    id,
    title,
    score,
    reasons,
  };
}

/* =========================================================
   RANK MULTIPLE ITEMS
   ========================================================= */

export function rankPersonalizationItems(items) {
  return items
    .map((item) =>
      rankPersonalizationItem(item)
    )
    .sort((a, b) => b.score - a.score);
}