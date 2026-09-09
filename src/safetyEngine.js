/* =========================================================
   MAUSAM SAFETY ENGINE
   Deterministic safety decision layer

   Safety decisions must not depend on personalization.
   Demo scenarios are controlled inputs for the prototype.
   ========================================================= */

const DEMO_SOURCE = "DEMO WEATHER SIMULATOR";

export function evaluateSafetyState({
  scenario,
  weather,
}) {
  /*
   * Severe scenario is the controlled demonstration trigger.
   *
   * This is intentionally deterministic:
   * personalization, interests, and card ranking cannot
   * disable an active safety condition.
   */

  if (scenario === "severe") {
    return {
      active: true,
      severity: "severe",
      mode: "emergency",
      reason:
        "Severe weather conditions are currently active in the prototype.",
      action:
        "Stay indoors, avoid unnecessary travel, and monitor official weather alerts.",
      source: DEMO_SOURCE,
      issuedAt: "Demo scenario start",
      validUntil: "While severe scenario is active",
    };
  }

  if (scenario === "rain") {
    return {
      active: false,
      severity: "warning",
      mode: "normal",
      reason:
        "Rain conditions are active, but the deterministic emergency threshold is not met.",
      action:
        "Use normal rain precautions and monitor changing conditions.",
      source: DEMO_SOURCE,
      issuedAt: "Demo scenario start",
      validUntil: "While rain scenario is active",
    };
  }

  return {
    active: false,
    severity: "normal",
    mode: "normal",
    reason: "No severe weather condition is active.",
    action: "Continue normal activities with routine weather awareness.",
    source: DEMO_SOURCE,
    issuedAt: "Demo scenario start",
    validUntil: "While normal scenario is active",
  };
}