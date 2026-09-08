export function assessSafety({
  selectedScenario,
  weather,
}) {
  const severeWarning =
    selectedScenario === "severe";

  if (severeWarning) {
    return {
      isEmergency: true,
      level: "HIGH",
      title: "Severe weather warning",
      message:
        "Severe weather conditions are active. Stay indoors and monitor official weather alerts.",
      action:
        "Avoid unnecessary outdoor activity and travel.",
      reason:
        "A severe weather warning has priority over normal personalization.",
    };
  }

  return {
    isEmergency: false,
    level: "NORMAL",
    title: "",
    message: "",
    action: "",
    reason: "",
  };
}