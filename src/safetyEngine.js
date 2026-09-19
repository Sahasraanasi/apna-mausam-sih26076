/* =========================================================
   APNA MAUSAM SAFETY ENGINE
   Deterministic safety decision layer

   Safety decisions must not depend on personalization.
   Demo scenarios are controlled inputs for the prototype.
   ========================================================= */

const DEMO_SOURCE = "DEMO WEATHER SIMULATOR";

export function evaluateSafetyState({ scenario }) {
  /*
   * Severe scenario is the controlled demonstration trigger.
   *
   * This decision is deterministic:
   * personalization, interests, and recommendation ranking
   * cannot disable or weaken an active safety condition.
   */

  if (scenario === "severe") {
    return {
      active: true,
      severity: "severe",
      mode: "emergency",
      reason:
        "Severe weather conditions are currently active in the prototype.",
      message:
        "Severe weather conditions require your attention.",
      source: DEMO_SOURCE,
      validUntil: "Demo scenario active",
    };
  }

  return {
    active: false,
    severity: "normal",
    mode: "normal",
    reason: "",
    message: "",
    source: DEMO_SOURCE,
    validUntil: "",
  };
}