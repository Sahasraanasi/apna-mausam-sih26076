import { evaluateSafetyState } from "./safetyEngine";
import { useState } from "react";
import { assessSafety } from "./utils/safetyAssessment";
import "./App.css";
import {
  rankPersonalizationItems,
} from "./personalizationEngine"

/* =========================================================
   INTERESTS
   ========================================================= */

const interests = [
  {
    id: "health",
    icon: "❤️",
    title: "Health",
    description: "AQI • UV • Pollen",
  },
  {
    id: "fitness",
    icon: "🏃",
    title: "Fitness",
    description: "Running • Heat • Wind",
  },
  {
    id: "beach",
    icon: "🏖️",
    title: "Beach & Surf",
    description: "Waves • Tides • Sea",
  },
  {
    id: "travel",
    icon: "✈️",
    title: "Travel",
    description: "Trips • Alerts • Packing",
  },
  {
    id: "family",
    icon: "👨‍👩‍👧",
    title: "Family",
    description: "School • Rain • Safety",
  },
  {
    id: "agriculture",
    icon: "🌱",
    title: "Agriculture",
    description: "Rain • Soil • Frost",
  },
  {
    id: "commute",
    icon: "🚗",
    title: "Commute",
    description: "Traffic • Fog • Visibility",
  },
  {
    id: "events",
    icon: "🎪",
    title: "Events",
    description: "Rain • Forecast • Comfort",
  },
];

/* =========================================================
   MOCK LOCATIONS
   ========================================================= */

const locations = {
  Hyderabad: {
    temperature: 29,
    high: 32,
    low: 23,
    condition: "Partly Cloudy",
    feelsLike: 31,
    humidity: 68,
    wind: 14,
    visibility: 8,
    aqi: 82,
    uv: 7,
    rain: 20,
    icon: "🌤️",
    weatherMessage:
      "A warm afternoon with comfortable conditions.",
    insight:
      "Good conditions for your evening with moderate wind and low rain probability.",
    advice:
      "Carry water if you're heading outdoors this afternoon.",
    locationNote:
      "Weather conditions are being personalized for Hyderabad.",
  },

  Mumbai: {
    temperature: 27,
    high: 29,
    low: 24,
    condition: "Light Rain",
    feelsLike: 29,
    humidity: 81,
    wind: 18,
    visibility: 6,
    aqi: 64,
    uv: 4,
    rain: 72,
    icon: "🌧️",
    weatherMessage:
      "Rain is likely. Keep an umbrella handy.",
    insight:
      "Rain may affect outdoor plans, so allow extra time for travel.",
    advice:
      "Carry an umbrella or light rain jacket when heading outside.",
    locationNote:
      "Mausam is prioritizing rain and travel conditions for Mumbai.",
  },

  Delhi: {
    temperature: 31,
    high: 35,
    low: 25,
    condition: "Hazy Sunshine",
    feelsLike: 34,
    humidity: 54,
    wind: 9,
    visibility: 5,
    aqi: 156,
    uv: 8,
    rain: 10,
    icon: "🌤️",
    weatherMessage:
      "Warm and hazy. Consider limiting prolonged outdoor exposure.",
    insight:
      "Hazy conditions and elevated AQI make air-quality awareness important today.",
    advice:
      "Consider shorter outdoor sessions and check air quality before exercising.",
    locationNote:
      "Air quality and visibility are receiving higher priority for Delhi.",
  },

  Bengaluru: {
    temperature: 24,
    high: 27,
    low: 20,
    condition: "Cloudy",
    feelsLike: 25,
    humidity: 73,
    wind: 12,
    visibility: 9,
    aqi: 48,
    uv: 5,
    rain: 38,
    icon: "☁️",
    weatherMessage:
      "Pleasant weather with a chance of passing showers.",
    insight:
      "Comfortable temperatures make the evening suitable for outdoor activities.",
    advice:
      "A light layer or umbrella could be useful if you're staying outdoors.",
    locationNote:
      "Mausam is balancing comfortable temperatures with possible showers.",
  },

  Visakhapatnam: {
    temperature: 28,
    high: 31,
    low: 24,
    condition: "Sunny",
    feelsLike: 30,
    humidity: 76,
    wind: 21,
    visibility: 10,
    aqi: 55,
    uv: 8,
    rain: 15,
    icon: "☀️",
    weatherMessage:
      "Sunny coastal weather with a noticeable sea breeze.",
    insight:
      "Clear visibility and low rain probability make outdoor plans favorable.",
    advice:
      "Use sun protection and stay hydrated during prolonged outdoor activity.",
    locationNote:
      "Mausam is highlighting coastal conditions for Visakhapatnam.",
  },
};

/* =========================================================
   WEATHER SCENARIOS
   ========================================================= */

const scenarios = {
  normal: {
    label: "Normal",
    icon: "☀️",
    temperatureChange: 0,
    rain: 20,
    windChange: 0,
    visibilityChange: 0,
  },

  rain: {
    label: "Heavy Rain",
    icon: "🌧️",
    temperatureChange: -3,
    rain: 85,
    windChange: 6,
    visibilityChange: -3,
  },

  severe: {
    label: "Severe Alert",
    icon: "⚠️",
    temperatureChange: -2,
    rain: 95,
    windChange: 18,
    visibilityChange: -5,
  },
};

/* =========================================================
   AI ASSISTANT QUESTIONS
   8 INTERESTS × 8 QUESTIONS = 64 QUESTIONS
   ========================================================= */

const assistantQuestions = {
  health: [
    "❤️ Is the air quality safe today?",
    "☀️ Is the UV level too high today?",
    "🌼 Is the pollen level high today?",
    "😷 Should I wear a mask outside today?",
    "🏃 Is it okay to exercise outdoors today?",
    "💧 Is today's humidity comfortable?",
    "🚶 What is the best time for a healthy outdoor walk?",
    "⚠️ Are there any health-related weather alerts today?",
  ],

  fitness: [
    "🏃 When is the best time to run today?",
    "💨 Is the wind okay for a workout?",
    "🌡️ Is it too hot to exercise outside?",
    "🚴 Are the conditions good for cycling?",
    "💪 Is today suitable for an outdoor workout?",
    "💧 Will I need extra hydration today?",
    "🌅 What is the best time for a sunrise workout?",
    "🔥 Is there a heat alert for outdoor exercise?",
  ],

  beach: [
    "🏖️ Is it safe to go to the beach today?",
    "🌊 How are the waves today?",
    "🌅 When is the best time to visit the beach?",
    "🏄 Is today suitable for surfing?",
    "🌊 When is the next high tide?",
    "💨 Is the wind too strong for water activities?",
    "🌡️ What is the water temperature?",
    "⚠️ Are there any coastal weather warnings?",
  ],

  travel: [
    "✈️ Will the weather affect my trip?",
    "🧳 What should I pack for my trip?",
    "🌧️ Will I need an umbrella for my trip?",
    "✈️ Could severe weather affect my flight?",
    "🕐 What is the best time to travel today?",
    "📍 What is the weather like at my destination?",
    "🌧️ Will it rain at my destination?",
    "⚠️ Are there any severe weather alerts for my destination?",
  ],

  family: [
    "👨‍👩‍👧 Is the school commute safe today?",
    "🌧️ Will it rain during school pickup?",
    "🛡️ Are there any family safety alerts?",
    "👶 Is it safe for children to play outside today?",
    "🌳 What is the best time to take kids to the park?",
    "🌡️ Is the heat a concern for children today?",
    "☔ Should my children carry an umbrella?",
    "🚗 Are road and visibility conditions safe for the family?",
  ],

  agriculture: [
    "🌱 Should I irrigate my crops today?",
    "💧 Is the soil moisture level okay?",
    "🌧️ Will there be enough rain for my crops?",
    "🌾 Is today suitable for planting?",
    "🌧️ What rainfall can I expect over the next few days?",
    "❄️ Is there any frost risk for my crops?",
    "🔥 Could today's heat cause crop stress?",
    "🚜 What is the best time for field work today?",
  ],

  commute: [
    "🚗 Is my commute safe today?",
    "🌧️ Will rain affect my route?",
    "👁️ Is visibility good for driving?",
    "🌫️ Is there any fog on my route?",
    "💨 Is the wind strong enough to affect driving?",
    "🕐 What is the best time to leave?",
    "🚦 What weather risks should I expect during my commute?",
    "⚠️ Are there any severe weather alerts along my route?",
  ],

  events: [
    "🎪 Is today good for an outdoor event?",
    "🌧️ Will rain affect my event?",
    "😊 Will guests be comfortable outdoors?",
    "🕐 What is the best time for my event?",
    "💨 Is the wind too strong for an outdoor event?",
    "🌡️ Will the heat be uncomfortable for guests?",
    "☔ Should I prepare a backup indoor plan?",
    "📅 What does the extended forecast look like?",
  ],
};

/* =========================================================
   APP
   ========================================================= */

function App() {
  const [screen, setScreen] = useState("welcome");

  /* =========================================================
     MOCK USER PROFILE
     ========================================================= */

  const [userName, setUserName] = useState("");
  const [userContact, setUserContact] = useState("");

  const [selectedInterests, setSelectedInterests] =
    useState([]);

  const [selectedLocation, setSelectedLocation] =
    useState("Hyderabad");

  const [selectedScenario, setSelectedScenario] =
    useState("normal");

  const [showAssistant, setShowAssistant] =
    useState(false);

  const [showAlerts, setShowAlerts] =
    useState(false);

  const [assistantQuestion, setAssistantQuestion] =
    useState("");

  const [assistantReply, setAssistantReply] =
    useState("");

  /* =========================================================
     INTEREST FUNCTIONS
     ========================================================= */

  const toggleInterest = (id) => {
    setSelectedInterests((current) => {
      if (current.includes(id)) {
        return current.filter(
          (item) => item !== id
        );
      }

      return [...current, id];
    });
  };

  const hasInterest = (id) =>
    selectedInterests.includes(id);

  /* =========================================================
     WEATHER CONTEXT ENGINE
     ========================================================= */

  const baseWeather =
    locations[selectedLocation];

  const scenario =
    scenarios[selectedScenario];

  const weather = {
    ...baseWeather,

    temperature:
      baseWeather.temperature +
      scenario.temperatureChange,

    rain:
      selectedScenario === "normal"
        ? baseWeather.rain
        : scenario.rain,

    wind:
      baseWeather.wind +
      scenario.windChange,

    visibility: Math.max(
      1,
      baseWeather.visibility +
        scenario.visibilityChange
    ),

    condition:
      selectedScenario === "rain"
        ? "Heavy Rain"
        : selectedScenario === "severe"
        ? "Severe Weather"
        : baseWeather.condition,

    icon:
      selectedScenario === "rain"
        ? "🌧️"
        : selectedScenario === "severe"
        ? "⛈️"
        : baseWeather.icon,
  };
  const safetyAssessment =
  assessSafety({
    selectedScenario,
    weather,
  });

  /* =========================================================
     INTEREST NAMES
     ========================================================= */

  const interestNames =
    selectedInterests
      .map(
        (id) =>
          interests.find(
            (interest) =>
              interest.id === id
          )?.title
      )
      .filter(Boolean);
      /* =========================================================
   PERSONAL WEATHER IMPACT
   Transparent prototype heuristic — 0 to 100
   ========================================================= */

const getPersonalImpact = (interestId) => {
  let score = 20;
  const reasons = [];

  /* WEATHER SEVERITY */
  if (selectedScenario === "severe") {
    score += 40;
    reasons.push("Severe weather is active");
  } else if (selectedScenario === "rain") {
    score += 20;
    reasons.push("Heavy rain is affecting conditions");
  }

  /* INTEREST-SPECIFIC WEATHER FACTORS */
  if (interestId === "health") {
    if (weather.aqi >= 120) {
      score += 25;
      reasons.push("Air quality is elevated");
    }

    if (weather.humidity >= 75) {
      score += 10;
      reasons.push("Humidity is high");
    }

    if (weather.uv >= 7) {
      score += 10;
      reasons.push("UV exposure is high");
    }
  }

  if (interestId === "fitness") {
    if (weather.temperature >= 30) {
      score += 20;
      reasons.push("Temperature is high");
    }

    if (weather.humidity >= 75) {
      score += 15;
      reasons.push("High humidity may increase discomfort");
    }

    if (weather.wind >= 25) {
      score += 15;
      reasons.push("Wind may affect outdoor exercise");
    }

    if (weather.uv >= 7) {
      score += 10;
      reasons.push("UV exposure is high");
    }
  }

  if (interestId === "beach") {
    if (weather.wind >= 25) {
      score += 20;
      reasons.push("Stronger wind may affect water conditions");
    }

    if (weather.rain >= 60) {
      score += 20;
      reasons.push("High rain probability");
    }

    if (selectedScenario === "severe") {
      score += 20;
      reasons.push("Severe conditions make water activities unsafe");
    }
  }

  if (interestId === "travel") {
    if (weather.rain >= 60) {
      score += 20;
      reasons.push("Rain may disrupt travel");
    }

    if (weather.visibility <= 5) {
      score += 20;
      reasons.push("Visibility is reduced");
    }

    if (weather.wind >= 25) {
      score += 10;
      reasons.push("Wind may affect travel conditions");
    }
  }

  if (interestId === "family") {
    if (weather.rain >= 60) {
      score += 20;
      reasons.push("Rain may affect outdoor family plans");
    }

    if (weather.temperature >= 30) {
      score += 15;
      reasons.push("Warm conditions may affect comfort");
    }

    if (weather.uv >= 7) {
      score += 10;
      reasons.push("UV exposure is high");
    }
  }

  if (interestId === "agriculture") {
    if (weather.rain >= 60) {
      score += 25;
      reasons.push("Heavy rain may affect field activities");
    }

    if (weather.wind >= 25) {
      score += 15;
      reasons.push("Strong wind may affect agricultural work");
    }
  }

  if (interestId === "commute") {
    if (weather.visibility <= 5) {
      score += 25;
      reasons.push("Reduced visibility may affect driving");
    }

    if (weather.rain >= 60) {
      score += 20;
      reasons.push("Heavy rain may slow travel");
    }

    if (weather.wind >= 30) {
      score += 15;
      reasons.push("Strong wind may affect driving");
    }
  }

  if (interestId === "events") {
    if (weather.rain >= 60) {
      score += 25;
      reasons.push("Rain may disrupt outdoor events");
    }

    if (weather.wind >= 30) {
      score += 20;
      reasons.push("Strong wind may affect event setup");
    }

    if (weather.temperature >= 32) {
      score += 15;
      reasons.push("High temperature may affect guest comfort");
    }
  }

  /* SELECTED INTEREST = DIRECT PERSONAL RELEVANCE */
  if (selectedInterests.includes(interestId)) {
    score += 10;
    reasons.push("Matches your selected interest");
  }

  /* SAFETY OVERRIDE ALWAYS WINS */
 
  score = Math.min(100, score);

  let status = "Low";

  if (score >= 75) {
    status = "Critical";
  } else if (score >= 55) {
    status = "High";
  } else if (score >= 35) {
    status = "Moderate";
  }

  return {
    score,
    status,
    reasons:
      reasons.length > 0
        ? reasons
        : ["Current weather has limited impact on this interest"],
  };
};

  /* =========================================================
     PERSONALIZATION PRIORITY
     ========================================================= */

  const getDynamicPriorityOrder = () => {
    const scoredInterests = interests.map((interest) => {
      const impact = getPersonalImpact(interest.id);

      return {
        id: interest.id,
        score: impact.score,
      };
    });

    const scenarioPriority = {
      severe: [
        "health",
        "family",
        "commute",
        "travel",
        "fitness",
        "events",
        "agriculture",
        "beach",
      ],

      rain: [
        "commute",
        "family",
        "travel",
        "health",
        "fitness",
        "events",
        "agriculture",
        "beach",
      ],
    };

    const selectedScenarioOrder =
      scenarioPriority[selectedScenario] || [];

    return [...scoredInterests]
      .sort((a, b) => {
        const aSelected = selectedInterests.includes(a.id);
        const bSelected = selectedInterests.includes(b.id);

        /* Safety/scenario priority comes first */
        const aScenario =
          selectedScenarioOrder.indexOf(a.id);
        const bScenario =
          selectedScenarioOrder.indexOf(b.id);

        if (
          aScenario !== -1 &&
          bScenario !== -1 &&
          aScenario !== bScenario
        ) {
          return aScenario - bScenario;
        }

        if (
          aScenario !== -1 &&
          bScenario === -1
        ) {
          return -1;
        }

        if (
          aScenario === -1 &&
          bScenario !== -1
        ) {
          return 1;
        }

        /* Selected interests win when scores are equal */
        if (
          aSelected &&
          !bSelected &&
          a.score === b.score
        ) {
          return -1;
        }

        if (
          !aSelected &&
          bSelected &&
          a.score === b.score
        ) {
          return 1;
        }

        /* Higher weather impact score first */
        return b.score - a.score;
      })
      .map((interest) => interest.id);
  };

  const priorityOrder =
    getDynamicPriorityOrder();

  /* =========================================================
     GET PERSONALIZED AI QUESTIONS
     ========================================================= */

  const getAssistantQuestions = () => {
    const questions = [];

    selectedInterests.forEach((interestId) => {
      const questionsForInterest =
        assistantQuestions[interestId];

      if (questionsForInterest) {
        questions.push(
          ...questionsForInterest
        );
      }
    });

    if (questions.length === 0) {
      return [
        "🌦️ What is today's weather like?",
        "🌧️ Will it rain today?",
        "🌡️ How should I plan my day?",
      ];
    }

    return questions;
  };

  const personalizedQuestions =
    getAssistantQuestions();

  /* =========================================================
     AI ASSISTANT ANSWER ENGINE
     ========================================================= */

  const askMausam = (question) => {
    setAssistantQuestion(question);

    let answer = "";

    /* =========================
       HEALTH
       ========================= */

    if (
      question.includes("air quality")
    ) {
      answer =
        weather.aqi <= 50
          ? `The air quality in ${selectedLocation} is good today with an AQI of ${weather.aqi}. Outdoor activities should be comfortable.`
          : weather.aqi <= 100
          ? `The AQI in ${selectedLocation} is ${weather.aqi}, which is moderate. Most people can continue normal outdoor activities, but sensitive individuals should avoid prolonged exposure.`
          : `The AQI in ${selectedLocation} is ${weather.aqi}, which is elevated. Consider reducing prolonged outdoor exposure, especially if you are sensitive to air pollution.`;
    }

    else if (
      question.includes("UV level")
    ) {
      answer =
        weather.uv >= 7
          ? `The UV Index is ${weather.uv}, which is high. If you go outside, use sunscreen, stay hydrated and avoid long periods of direct sunlight.`
          : weather.uv >= 4
          ? `The UV Index is ${weather.uv}, which is moderate. Sun protection is recommended if you will be outdoors for a long time.`
          : `The UV Index is ${weather.uv}, which is relatively low. Normal outdoor activity should be comfortable.`;
    }

    else if (
      question.includes("pollen")
    ) {
      answer =
        "Pollen levels are currently simulated as low. Conditions should be relatively comfortable for most people with seasonal allergies.";
    }

    else if (
      question.includes("wear a mask")
    ) {
      answer =
        weather.aqi > 120
          ? `Because the AQI is ${weather.aqi}, wearing a well-fitting mask outdoors can help reduce exposure to airborne particles.`
          : `The current AQI is ${weather.aqi}. A mask is not generally necessary because of air quality alone, but you can use one if you prefer extra protection.`;
    }

    else if (
      question.includes("exercise outdoors")
    ) {
      answer =
        selectedScenario === "severe"
          ? "Outdoor exercise is not recommended right now because severe weather conditions are active. An indoor workout would be safer."
          : weather.aqi > 120
          ? "Outdoor exercise is not ideal today because air quality is elevated. Consider exercising indoors or choosing a shorter outdoor session."
          : weather.uv >= 7
          ? "Outdoor exercise is possible, but it is better to choose an early morning or evening session because the UV level is high."
          : "Yes. Current conditions are generally suitable for outdoor exercise. Stay hydrated and monitor the weather as conditions change.";
    }

    else if (
      question.includes("humidity")
    ) {
      answer =
        weather.humidity > 75
          ? `Humidity is ${weather.humidity}%, which is high. It may feel warmer and more uncomfortable during outdoor activity.`
          : `Humidity is ${weather.humidity}%, which is reasonably comfortable for most outdoor activities.`;
    }

    else if (
      question.includes("healthy outdoor walk")
    ) {
      answer =
        weather.aqi > 120 ||
        selectedScenario === "severe"
          ? "A long outdoor walk is not recommended right now. Consider a shorter walk when conditions improve or choose an indoor activity."
          : weather.uv >= 7
          ? "A better walking window would be early morning or after sunset when UV exposure is lower."
          : "The evening is a good option for a comfortable outdoor walk based on the current conditions.";
    }

    else if (
      question.includes("health-related weather alerts")
    ) {
      answer =
        selectedScenario === "severe"
          ? "Yes. Severe weather is currently simulated. Stay indoors and monitor official weather alerts."
          : weather.aqi > 120
          ? "Yes. Air quality is elevated today, so reducing prolonged outdoor exposure is recommended."
          : "No major health-related weather alert is active in this simulation.";
    }

    /* =========================
       FITNESS
       ========================= */

    else if (
      question.includes("best time to run")
    ) {
      answer =
        selectedScenario === "severe"
          ? "Running outdoors is not recommended during the simulated severe weather. Consider an indoor workout."
          : weather.temperature >= 30 ||
            weather.uv >= 7
          ? "The best option is early morning or evening when temperatures and UV levels are lower."
          : "Morning or evening should both be comfortable for running under the current simulated conditions.";
    }

    else if (
      question.includes("wind okay")
    ) {
      answer =
        weather.wind >= 30
          ? `Wind is around ${weather.wind} km/h, which may make outdoor workouts uncomfortable.`
          : `Wind is around ${weather.wind} km/h, which is generally manageable for a normal workout.`;
    }

    else if (
      question.includes("too hot")
    ) {
      answer =
        weather.temperature >= 32
          ? `Yes. The temperature is around ${weather.temperature}°C and it feels like ${weather.feelsLike}°C. Consider exercising during cooler hours.`
          : `The temperature is around ${weather.temperature}°C. It is not extremely hot, but hydration and timing still matter.`;
    }

    else if (
      question.includes("cycling")
    ) {
      answer =
        selectedScenario === "severe"
          ? "Cycling outdoors is not recommended during the simulated severe weather."
          : weather.wind >= 25
          ? `Cycling may be challenging because wind speed is around ${weather.wind} km/h.`
          : "Conditions are generally suitable for cycling. Stay hydrated and watch for changing weather.";
    }

    else if (
      question.includes("outdoor workout")
    ) {
      answer =
        selectedScenario === "severe"
          ? "An outdoor workout is not recommended while severe weather is active."
          : weather.rain >= 60
          ? "Heavy rain may interrupt an outdoor workout. An indoor session would be more reliable."
          : "Yes. Current conditions are generally suitable for an outdoor workout.";
    }

    else if (
      question.includes("extra hydration")
    ) {
      answer =
        weather.temperature >= 30 ||
        weather.humidity >= 75
          ? "Yes. Warm temperatures or high humidity can increase fluid needs. Carry water during outdoor activity."
          : "Normal hydration should generally be sufficient, but carrying water is still a good idea during exercise.";
    }

    else if (
      question.includes("sunrise workout")
    ) {
      answer =
        "A sunrise workout around 6:00 AM–8:00 AM would generally provide cooler temperatures and lower UV exposure.";
    }

    else if (
      question.includes("heat alert")
    ) {
      answer =
        weather.temperature >= 32
          ? "Yes. The current simulated temperature is high enough to justify a heat-conscious workout plan."
          : "No major heat alert is active in this simulation. Cooler hours are still preferable for intense exercise.";
    }

    /* =========================
       BEACH
       ========================= */

    else if (
      question.includes("safe to go to the beach")
    ) {
      answer =
        selectedScenario === "severe"
          ? "A beach visit is not recommended while severe weather conditions are active."
          : weather.rain >= 60
          ? "The beach may be less comfortable because of the high rain probability. Check local coastal safety information before going."
          : "Conditions look generally favorable for a beach visit, but always check local sea-safety warnings before entering the water.";
    }

    else if (
      question.includes("waves")
    ) {
      answer =
        weather.wind >= 25
          ? "Waves may be stronger because of the higher wind. Check the local surf and coastal safety report before entering the water."
          : "The simulated wave height is around 1.2 m, suggesting moderate conditions for the current prototype.";
    }

    else if (
      question.includes("best time to visit the beach")
    ) {
      answer =
        weather.uv >= 7
          ? "Early morning or late afternoon would be more comfortable because UV levels are high during stronger sunlight hours."
          : "Morning and late afternoon are both reasonable options under the current simulated conditions.";
    }

    else if (
      question.includes("surfing")
    ) {
      answer =
        selectedScenario === "severe"
          ? "Surfing is not recommended during severe weather."
          : weather.wind >= 25
          ? "Stronger wind may create more challenging water conditions. Check the local surf warning before entering."
          : "The simulated conditions are reasonably suitable for recreational surfing, subject to local safety warnings.";
    }

    else if (
      question.includes("next high tide")
    ) {
      answer =
        "The current prototype does not use live tide data. In a full Mausam implementation, the assistant would use location-specific tide timings.";
    }

    else if (
      question.includes("wind too strong for water")
    ) {
      answer =
        weather.wind >= 30
          ? `Yes. Wind around ${weather.wind} km/h could make water activities more challenging.`
          : `Wind is around ${weather.wind} km/h, which is not extremely strong in this simulation.`;
    }

    else if (
      question.includes("water temperature")
    ) {
      answer =
        "The prototype uses a simulated water temperature of around 27°C. A production version would retrieve location-specific water temperature data.";
    }

    else if (
      question.includes("coastal weather warnings")
    ) {
      answer =
        selectedScenario === "severe"
          ? "Yes. Severe weather is simulated, so coastal activities should be avoided."
          : "No major coastal warning is simulated right now. Always check official local coastal safety information before entering the water.";
    }

    /* =========================
       TRAVEL
       ========================= */

    else if (
      question.includes("weather affect my trip")
    ) {
      answer =
        weather.rain >= 60 ||
        selectedScenario === "severe"
          ? `Yes. Weather may affect your trip from ${selectedLocation}. Allow extra time and keep your plans flexible.`
          : `The current weather in ${selectedLocation} should have a limited impact on normal travel plans.`;
    }

    else if (
      question.includes("pack for my trip")
    ) {
      answer =
        weather.rain >= 60
          ? "Pack an umbrella or rain jacket, comfortable footwear and a waterproof bag for important items."
          : weather.temperature >= 30
          ? "Pack light clothing, sunscreen, sunglasses and enough water."
          : "Pack comfortable clothing, water and a light layer in case temperatures change.";
    }

    else if (
      question.includes("umbrella for my trip")
    ) {
      answer =
        weather.rain >= 50
          ? `Yes. The simulated rain probability is ${weather.rain}%, so an umbrella or rain jacket would be useful.`
          : "Rain probability is relatively low, so an umbrella is optional.";
    }

    else if (
      question.includes("severe weather affect my flight")
    ) {
      answer =
        selectedScenario === "severe"
          ? "Severe weather is simulated and could potentially disrupt travel. Check official airline and airport updates before leaving."
          : "No severe flight-related weather disruption is simulated right now.";
    }

    else if (
      question.includes("best time to travel today")
    ) {
      answer =
        weather.rain >= 60
          ? "Try to travel outside the heaviest rain period and allow additional time for possible delays."
          : "Earlier or later in the day should be reasonably comfortable under the current simulated conditions.";
    }

    else if (
      question.includes("weather like at my destination")
    ) {
      answer = `Your selected destination context is ${selectedLocation}: ${weather.temperature}°C, ${weather.condition}, ${weather.rain}% rain probability and ${weather.wind} km/h wind.`;
    }

    else if (
      question.includes("rain at my destination")
    ) {
      answer =
        `The simulated rain probability for ${selectedLocation} is ${weather.rain}%. ` +
        (weather.rain >= 60
          ? "Rain is likely, so keep rain protection ready."
          : "Rain is not expected to be a major concern.");
    }

    else if (
      question.includes("severe weather alerts for my destination")
    ) {
      answer =
        selectedScenario === "severe"
          ? `A severe weather scenario is currently simulated for ${selectedLocation}. Check official warnings before travelling.`
          : "No severe weather alert is simulated for the selected destination.";
    }

    /* =========================
       FAMILY
       ========================= */

    else if (
      question.includes("school commute")
    ) {
      answer =
        selectedScenario === "severe"
          ? "The school commute needs extra caution because severe weather is simulated. Consider avoiding unnecessary travel."
          : weather.rain >= 60
          ? "Rain may slow the school commute. Keep umbrellas ready and allow additional travel time."
          : "The school commute should be manageable under the current simulated conditions.";
    }

    else if (
      question.includes("school pickup")
    ) {
      answer =
        weather.rain >= 60
          ? "Rain is likely around your current weather scenario. Keep rain protection ready during school pickup."
          : "Rain probability is relatively low, so school pickup should be manageable.";
    }

    else if (
      question.includes("family safety alerts")
    ) {
      answer =
        selectedScenario === "severe"
          ? "Yes. Severe weather is simulated. Keep children indoors and monitor weather alerts."
          : "No major family safety alert is currently simulated.";
    }

    else if (
      question.includes("children to play outside")
    ) {
      answer =
        selectedScenario === "severe"
          ? "Children should avoid outdoor play while severe weather is active."
          : weather.aqi > 120
          ? "Because AQI is elevated, consider limiting prolonged outdoor play."
          : weather.temperature >= 32
          ? "Avoid the hottest afternoon period and choose a cooler time."
          : "Outdoor play should generally be manageable with normal weather precautions.";
    }

    else if (
      question.includes("kids to the park")
    ) {
      answer =
        weather.rain >= 60
          ? "A drier period later in the day would be preferable, but keep an indoor backup plan."
          : "Late afternoon or early evening would generally be comfortable for a park visit.";
    }

    else if (
      question.includes("heat a concern for children")
    ) {
      answer =
        weather.temperature >= 32
          ? "Yes. The current simulated temperature is high. Keep children hydrated and avoid prolonged afternoon exposure."
          : "Heat does not appear to be a major concern under the current simulated temperature.";
    }

    else if (
      question.includes("children carry an umbrella")
    ) {
      answer =
        weather.rain >= 50
          ? "Yes. Rain probability is elevated, so an umbrella or rain jacket would be useful."
          : "An umbrella is optional because rain probability is currently relatively low.";
    }

    else if (
      question.includes("road and visibility conditions")
    ) {
      answer =
        weather.visibility <= 5
          ? `Visibility is around ${weather.visibility} km, so extra caution is recommended for family travel.`
          : `Visibility is around ${weather.visibility} km, which is reasonably good in this simulation.`;
    }

    /* =========================
       AGRICULTURE
       ========================= */

    else if (
      question.includes("irrigate my crops")
    ) {
      answer =
        weather.rain >= 60
          ? "Rain probability is high, so additional irrigation may not be necessary immediately. Check soil moisture first."
          : "Check the actual soil moisture before irrigating. The prototype currently simulates moderate soil moisture.";
    }

    else if (
      question.includes("soil moisture")
    ) {
      answer =
        "The prototype currently simulates soil moisture at around 64%. Check the real field condition before making irrigation decisions.";
    }

    else if (
      question.includes("enough rain for my crops")
    ) {
      answer =
        weather.rain >= 60
          ? "Rain probability is high in this simulation, but actual rainfall totals should be checked before relying on it for crop water needs."
          : "Rain probability is relatively low, so additional irrigation may need to be considered based on actual soil moisture.";
    }

    else if (
      question.includes("suitable for planting")
    ) {
      answer =
        selectedScenario === "severe"
          ? "Planting should be postponed until severe weather conditions improve."
          : weather.rain >= 60
          ? "Wet conditions may support some planting activities, but avoid field work if soil becomes waterlogged."
          : "Planting may be possible if soil moisture and crop-specific conditions are suitable.";
    }

    else if (
      question.includes("rainfall can I expect")
    ) {
      answer =
        `The current simulated rain probability is ${weather.rain}%. This prototype does not provide actual rainfall accumulation forecasts.`;
    }

    else if (
      question.includes("frost risk")
    ) {
      answer =
        "Frost risk is simulated as low for the selected locations. A production system would use location-specific minimum-temperature forecasts.";
    }

    else if (
      question.includes("crop stress")
    ) {
      answer =
        weather.temperature >= 32
          ? `Yes. Temperatures around ${weather.temperature}°C may create heat stress for some crops. Monitor soil moisture and plant condition.`
          : "Heat stress does not appear to be a major concern under the current simulated conditions.";
    }

    else if (
      question.includes("field work")
    ) {
      answer =
        selectedScenario === "severe"
          ? "Avoid unnecessary field work during severe weather."
          : weather.rain >= 60
          ? "A drier period would be preferable because heavy rain may make field work difficult."
          : "Morning or late afternoon can be suitable for field work depending on crop and soil conditions.";
    }

    /* =========================
       COMMUTE
       ========================= */

    else if (
      question.includes("my commute safe")
    ) {
      answer =
        selectedScenario === "severe"
          ? "Your commute needs extra caution because severe weather is simulated. Avoid unnecessary travel."
          : weather.visibility <= 5 ||
            weather.rain >= 60
          ? "Travel conditions need extra caution. Allow additional time and drive carefully."
          : "Current simulated conditions are generally manageable for commuting.";
    }

    else if (
      question.includes("rain affect my route")
    ) {
      answer =
        weather.rain >= 60
          ? "Yes. Heavy rain may slow traffic and reduce visibility. Consider leaving earlier."
          : "Rain is not expected to significantly affect your route under the current simulation.";
    }

    else if (
      question.includes("visibility good for driving")
    ) {
      answer =
        weather.visibility <= 5
          ? `Visibility is reduced to around ${weather.visibility} km. Drive carefully and use appropriate lighting.`
          : `Visibility is around ${weather.visibility} km, which is reasonably good for driving.`;
    }

    else if (
      question.includes("fog on my route")
    ) {
      answer =
        weather.visibility <= 5
          ? "Reduced visibility is simulated. This could represent fog, rain or haze, so drive cautiously."
          : "No significant fog-like low visibility is simulated right now.";
    }

    else if (
      question.includes("wind strong enough to affect driving")
    ) {
      answer =
        weather.wind >= 30
          ? `Wind speed is around ${weather.wind} km/h and could make driving more difficult, especially for exposed roads.`
          : `Wind speed is around ${weather.wind} km/h and is not expected to significantly affect normal driving.`;
    }

    else if (
      question.includes("best time to leave")
    ) {
      answer =
        weather.rain >= 60
          ? "Leave earlier than usual to account for rain-related traffic delays."
          : "Leaving outside peak traffic hours would generally provide a smoother commute.";
    }

    else if (
      question.includes("weather risks should I expect")
    ) {
      answer =
        selectedScenario === "severe"
          ? "The main risk is severe weather. Avoid unnecessary travel and monitor official alerts."
          : weather.rain >= 60
          ? "Rain and reduced visibility are the main simulated commute risks."
          : weather.visibility <= 5
          ? "Reduced visibility is the main simulated commute risk."
          : "No major weather-related commute risk is currently simulated.";
    }

    else if (
      question.includes("severe weather alerts along my route")
    ) {
      answer =
        selectedScenario === "severe"
          ? "Yes. A severe weather scenario is currently active in this prototype. Check official alerts before travelling."
          : "No severe weather route alert is simulated right now.";
    }

    /* =========================
       EVENTS
       ========================= */

    else if (
      question.includes("good for an outdoor event")
    ) {
      answer =
        selectedScenario === "severe"
          ? "Outdoor events are not recommended while severe weather is active."
          : weather.rain >= 60
          ? "Outdoor events may be affected by rain. Keep an indoor backup plan."
          : weather.temperature >= 32
          ? "An outdoor event is possible, but shade, hydration and timing are important."
          : "Conditions look reasonably favorable for an outdoor event.";
    }

    else if (
      question.includes("rain affect my event")
    ) {
      answer =
        weather.rain >= 60
          ? "Yes. Rain probability is high, so weather protection or an indoor backup plan is recommended."
          : "Rain probability is relatively low, so major disruption is not currently simulated.";
    }

    else if (
      question.includes("guests be comfortable")
    ) {
      answer =
        weather.temperature >= 32
          ? "Guests may feel warm. Provide shade, hydration and good ventilation."
          : weather.rain >= 60
          ? "Rain may reduce outdoor comfort. Consider covered areas or an indoor backup."
          : "Guests should generally be comfortable under the current simulated conditions.";
    }

    else if (
      question.includes("best time for my event")
    ) {
      answer =
        weather.temperature >= 30 ||
        weather.uv >= 7
          ? "Around 5:00 PM–8:00 PM would generally be more comfortable as temperatures and UV levels decrease."
          : "Late afternoon and early evening are good options for an outdoor event.";
    }

    else if (
      question.includes("wind too strong for an outdoor event")
    ) {
      answer =
        weather.wind >= 30
          ? `Yes. Wind around ${weather.wind} km/h may affect decorations, temporary structures and guest comfort.`
          : `Wind around ${weather.wind} km/h is generally manageable for an outdoor event.`;
    }

    else if (
      question.includes("heat be uncomfortable")
    ) {
      answer =
        weather.temperature >= 32
          ? `Yes. Temperatures are around ${weather.temperature}°C, so guests may feel uncomfortable without shade and hydration.`
          : "Heat is unlikely to be a major comfort problem under the current simulated conditions.";
    }

    else if (
      question.includes("backup indoor plan")
    ) {
      answer =
        weather.rain >= 60 ||
        selectedScenario === "severe"
          ? "Yes. A backup indoor plan is strongly recommended because weather conditions could disrupt an outdoor event."
          : "A backup plan is always useful, but current conditions do not indicate a high rain risk.";
    }

    else if (
      question.includes("extended forecast")
    ) {
      answer =
        "The current prototype uses simulated weather data rather than a live extended forecast. In the full Mausam system, this section would show upcoming weather trends for event planning.";
    }

    /* =========================
       GENERAL
       ========================= */

    else if (
      question.includes("today's weather")
    ) {
      answer =
        `${selectedLocation} is currently ${weather.temperature}°C with ${weather.condition.toLowerCase()}. There is a ${weather.rain}% chance of rain and wind around ${weather.wind} km/h.`;
    }

    else if (
      question.includes("Will it rain today")
    ) {
      answer =
        `The current simulated rain probability is ${weather.rain}%. ${
          weather.rain >= 60
            ? "Rain is likely, so keep rain protection ready."
            : "Rain is not currently expected to be a major concern."
        }`;
    }

    else if (
      question.includes("plan my day")
    ) {
      answer =
        selectedScenario === "severe"
          ? "Plan for a safety-focused day. Avoid unnecessary outdoor activities and monitor weather alerts."
          : weather.rain >= 60
          ? "Keep an umbrella or rain jacket ready and allow extra time for travel."
          : "Conditions look reasonably comfortable. Plan outdoor activities for the cooler parts of the day.";
    }

    else {
      answer =
        `Based on the current simulated conditions in ${selectedLocation}, the weather is ${weather.temperature}°C with ${weather.rain}% rain probability. Mausam recommends planning around the current weather conditions.`;
    }

    setAssistantReply(answer);
  };

  /* =========================================================
     SMART ALERT ENGINE
     ========================================================= */

  const getSmartAlert = () => {
    if (selectedScenario === "severe") {
      if (hasInterest("fitness")) {
        return {
          icon: "🏃",
          label: "FITNESS SAFETY",
          title: "Your workout plan changed",
          message:
            "Severe weather is affecting outdoor activity. Consider an indoor workout until conditions improve.",
          priority: "HIGH PRIORITY",
        };
      }

      if (hasInterest("health")) {
        return {
          icon: "❤️",
          label: "HEALTH ALERT",
          title: "Outdoor exposure is not recommended",
          message:
            "Severe weather is affecting your area. Stay indoors and monitor weather conditions.",
          priority: "HIGH PRIORITY",
        };
      }

      if (hasInterest("commute")) {
        return {
          icon: "🚗",
          label: "COMMUTE ALERT",
          title: "Your commute needs attention",
          message:
            "Severe weather may make travel difficult. Avoid unnecessary travel and allow extra time if travel is essential.",
          priority: "HIGH PRIORITY",
        };
      }

      if (hasInterest("travel")) {
        return {
          icon: "✈️",
          label: "TRAVEL ALERT",
          title: "Travel conditions have changed",
          message:
            "Severe weather may disrupt your travel plans. Check alerts before leaving and keep your itinerary flexible.",
          priority: "HIGH PRIORITY",
        };
      }

      if (hasInterest("family")) {
        return {
          icon: "👨‍👩‍👧",
          label: "FAMILY SAFETY",
          title: "Family plans may need to change",
          message:
            "Keep children indoors and monitor weather alerts until conditions improve.",
          priority: "HIGH PRIORITY",
        };
      }

      if (hasInterest("agriculture")) {
        return {
          icon: "🌱",
          label: "AGRICULTURE ALERT",
          title: "Field work needs caution",
          message:
            "Severe weather may affect field activities. Monitor conditions before working outdoors.",
          priority: "HIGH PRIORITY",
        };
      }

      if (hasInterest("events")) {
        return {
          icon: "🎪",
          label: "EVENT ALERT",
          title: "Outdoor event conditions changed",
          message:
            "Severe weather may disrupt outdoor events. Consider postponing or moving indoors.",
          priority: "HIGH PRIORITY",
        };
      }

      return {
        icon: "⚠️",
        label: "SEVERE WEATHER",
        title: `Severe weather in ${selectedLocation}`,
        message:
          "Conditions have changed significantly. Stay indoors and monitor official weather alerts.",
        priority: "HIGH PRIORITY",
      };
    }

    if (selectedScenario === "rain") {
      if (hasInterest("fitness")) {
        return {
          icon: "🏃",
          label: "FITNESS UPDATE",
          title: "Rain may affect your workout",
          message:
            "Heavy rain is expected. Consider an indoor workout or wait until conditions improve.",
          priority: "WEATHER UPDATE",
        };
      }

      if (hasInterest("commute")) {
        return {
          icon: "🚗",
          label: "COMMUTE UPDATE",
          title: "Rain may slow your journey",
          message:
            "Heavy rain can affect travel time. Consider leaving earlier and drive carefully.",
          priority: "WEATHER UPDATE",
        };
      }

      if (hasInterest("travel")) {
        return {
          icon: "✈️",
          label: "TRAVEL UPDATE",
          title: "Rain expected during your plans",
          message:
            "Carry a rain jacket or umbrella and allow extra time for travel.",
          priority: "WEATHER UPDATE",
        };
      }

      if (hasInterest("family")) {
        return {
          icon: "👨‍👩‍👧",
          label: "FAMILY UPDATE",
          title: "Rain may affect family plans",
          message:
            "Keep an umbrella ready and consider an indoor backup plan.",
          priority: "WEATHER UPDATE",
        };
      }

      if (hasInterest("events")) {
        return {
          icon: "🎪",
          label: "EVENT UPDATE",
          title: "Outdoor plans may be affected",
          message:
            "Rain probability is high. Consider weather protection or an indoor backup venue.",
          priority: "WEATHER UPDATE",
        };
      }

      return {
        icon: "🌧️",
        label: "RAIN ALERT",
        title: `Heavy rain in ${selectedLocation}`,
        message:
          "Rain is expected to affect outdoor conditions. Carry rain protection and plan extra travel time.",
        priority: "WEATHER UPDATE",
      };
    }

    if (
      hasInterest("health") &&
      weather.aqi > 120
    ) {
      return {
        icon: "❤️",
        label: "HEALTH INSIGHT",
        title: "Air quality needs attention",
        message:
          "Air quality is elevated today. Consider reducing prolonged outdoor exposure.",
        priority: "HEALTH",
      };
    }

    if (
      hasInterest("commute") &&
      weather.visibility <= 5
    ) {
      return {
        icon: "🚗",
        label: "COMMUTE INSIGHT",
        title: "Visibility is reduced",
        message:
          "Allow extra travel time and stay alert on the road.",
        priority: "TRAVEL",
      };
    }

    return {
      icon: "☀️",
      label: "ALL CLEAR",
      title: "No severe weather alerts",
      message:
        "Conditions are currently stable. Your personalized weather recommendations are active.",
      priority: "NORMAL",
    };
  };/* =========================================================
   PERSONAL IMPACT SCORE
   Decision-support score — not weather prediction
   ========================================================= */

const getImpactScore = (type) => {
  let score = 90;

  if (type === "health") {
    if (weather.aqi > 120) score -= 30;
    else if (weather.aqi > 80) score -= 15;

    if (weather.uv >= 8) score -= 20;
    else if (weather.uv >= 7) score -= 12;

    if (weather.humidity >= 80) score -= 10;
    else if (weather.humidity >= 75) score -= 5;

    if (selectedScenario === "rain") score -= 5;
    if (selectedScenario === "severe") score = 20;
  }

  if (type === "fitness") {
    if (weather.temperature >= 35) score -= 30;
    else if (weather.temperature >= 32) score -= 20;
    else if (weather.temperature >= 30) score -= 10;

    if (weather.humidity >= 80) score -= 15;
    else if (weather.humidity >= 75) score -= 8;

    if (weather.uv >= 8) score -= 15;
    else if (weather.uv >= 7) score -= 8;

    if (weather.wind >= 30) score -= 15;
    else if (weather.wind >= 25) score -= 8;

    if (weather.rain >= 60) score -= 20;

    if (selectedScenario === "severe") score = 15;
  }

  if (type === "agriculture") {
    if (weather.rain >= 80) score -= 25;
    else if (weather.rain >= 60) score -= 15;

    if (weather.temperature >= 35) score -= 20;
    else if (weather.temperature >= 32) score -= 10;

    if (weather.wind >= 30) score -= 20;
    else if (weather.wind >= 25) score -= 10;

    if (selectedScenario === "severe") score = 20;
  }

  if (type === "commute") {
    if (weather.visibility <= 3) score -= 35;
    else if (weather.visibility <= 5) score -= 20;

    if (weather.rain >= 80) score -= 25;
    else if (weather.rain >= 60) score -= 15;

    if (weather.wind >= 30) score -= 20;
    else if (weather.wind >= 25) score -= 10;

    if (selectedScenario === "severe") score = 15;
  }

  return Math.max(10, Math.min(100, score));
};

  /* =========================================================
     SAFETY OVERRIDE ENGINE
     Deterministic safety decision — always above personalization
     ========================================================= */

  const safetyState = evaluateSafetyState({
    scenario: selectedScenario,
    weather,
  });

  const safetyOverride = safetyState.active;
  const emergencyMode = safetyOverride;
  const smartAlert = getSmartAlert();

  /* =========================================================
     DAILY ADVICE
     ========================================================= */

  const getDailyAdvice = () => {
    if (selectedScenario === "severe") {
      if (
        hasInterest("fitness") ||
        hasInterest("health")
      ) {
        return "Your outdoor plan has changed. Stay indoors and consider an indoor workout today.";
      }

      if (hasInterest("commute")) {
        return "Your commute needs attention. Avoid unnecessary travel and allow extra time if travel is essential.";
      }

      if (hasInterest("travel")) {
        return "Severe weather may disrupt travel. Check alerts before leaving and keep a flexible plan.";
      }

      if (hasInterest("family")) {
        return "Keep the family indoors and monitor weather alerts until conditions improve.";
      }

      if (hasInterest("beach")) {
        return "Avoid water activities while severe weather conditions are active.";
      }

      if (hasInterest("agriculture")) {
        return "Pause unnecessary field work and monitor severe weather conditions.";
      }

      if (hasInterest("events")) {
        return "Consider postponing outdoor events or moving them indoors.";
      }

      return "Severe weather is affecting your area. Stay indoors and monitor official weather alerts.";
    }

    if (selectedScenario === "rain") {
      if (hasInterest("fitness")) {
        return "Outdoor running conditions have changed. Consider an indoor workout until the rain eases.";
      }

      if (hasInterest("commute")) {
        return "Heavy rain may slow your commute. Leave earlier and drive carefully.";
      }

      if (hasInterest("family")) {
        return "Rain may affect school and outdoor plans. Keep an umbrella and backup plans ready.";
      }

      if (hasInterest("travel")) {
        return "Rain is likely. Carry a rain jacket or umbrella and allow extra travel time.";
      }

      if (hasInterest("events")) {
        return "Rain may affect your outdoor event. Keep an indoor backup plan ready.";
      }

      return "Heavy rain is expected. Carry rain protection and plan extra travel time.";
    }

    if (
      hasInterest("health") &&
      weather.aqi > 120
    ) {
      return "Air quality is elevated today. Consider reducing prolonged outdoor exposure.";
    }

    if (
      hasInterest("fitness") &&
      weather.uv >= 7
    ) {
      return "Your workout window is better later in the day when UV levels are lower.";
    }

    if (
      hasInterest("commute") &&
      weather.visibility <= 5
    ) {
      return "Visibility is reduced today. Allow extra travel time and stay alert on the road.";
    }

    if (
      hasInterest("family") &&
      weather.rain >= 60
    ) {
      return "Rain may affect outdoor family plans. Keep an indoor backup plan ready.";
    }

    if (
      hasInterest("events") &&
      weather.rain >= 60
    ) {
      return "Rain probability is high. Consider an indoor venue or prepare weather protection.";
    }

    if (
      hasInterest("travel") &&
      weather.rain >= 60
    ) {
      return "Rain is likely at your current location. Pack a rain jacket or umbrella.";
    }

    if (hasInterest("agriculture")) {
      return "Check rainfall and soil conditions before planning irrigation or field work.";
    }

    if (hasInterest("beach")) {
      return "Check coastal conditions before heading to the water and stay hydrated.";
    }

    return weather.advice;
  };

  /* =========================================================
     HEALTH CARD
     ========================================================= */

  const renderHealthCard = () => {
  const impact = getPersonalImpact("health");

  return (
    <section
      className={`section-block impact-${impact.status.toLowerCase()}`}
      key="health"
    >
      <div className="section-title-row">
        <h2>Health & environment</h2>
        <span>Now</span>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">❤️</div>

          <p>AQI</p>

          <strong>{weather.aqi}</strong>

          <span
            className={
              weather.aqi > 120
                ? "poor"
                : weather.aqi > 80
                ? "moderate"
                : "good"
            }
          >
            {weather.aqi > 120
              ? "Poor"
              : weather.aqi > 80
              ? "Moderate"
              : "Good"}
          </span>
        </div>

        <div className="metric-card">
          <div className="metric-icon">☀️</div>

          <p>UV Index</p>

          <strong>{weather.uv}</strong>

          <span
            className={
              weather.uv >= 7
                ? "poor"
                : weather.uv >= 4
                ? "moderate"
                : "good"
            }
          >
            {weather.uv >= 7
              ? "High"
              : weather.uv >= 4
              ? "Moderate"
              : "Low"}
          </span>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🌼</div>

          <p>Pollen</p>

          <strong>Low</strong>

          <span className="good">
            Comfortable
          </span>
        </div>

        <div className="metric-card">
          <div className="metric-icon">💧</div>

          <p>Humidity</p>

          <strong>{weather.humidity}%</strong>

          <span>
            {weather.humidity > 75
              ? "High"
              : "Comfortable"}
          </span>
        </div>
      </div>

      <div className="mini-advice">
        {selectedScenario === "severe"
          ? "⚠️ Severe conditions detected. Stay indoors and monitor weather alerts."
          : weather.aqi > 120
          ? "🫁 Air quality is elevated today. Consider reducing prolonged outdoor exposure."
          : "🫁 Air quality is suitable for normal outdoor activity."}
      </div>
      <div className="impact-score-inline">
  <div>
    <span>Personal Health Impact</span>
    <strong>{getImpactScore("health")}/100</strong>
  </div>

  <small>
    {weather.aqi > 120
      ? "Air quality is the main factor reducing your outdoor comfort."
      : weather.uv >= 7
      ? "Higher UV exposure is the main factor affecting outdoor comfort."
      : weather.humidity >= 75
      ? "Higher humidity may increase outdoor discomfort."
      : "Current conditions are generally comfortable for health-focused outdoor activity."}
  </small>
</div>
    </section>
  );
};

  /* =========================================================
     FITNESS CARD
     ========================================================= */

  const renderFitnessCard = () => {
  const impact = getPersonalImpact("fitness");

  return (
    <section
      className={`feature-card fitness-card impact-${impact.status.toLowerCase()}`}
      key="fitness"
    >
      <div className="feature-card-top">
        <div className="feature-icon">
          🏃
        </div>

        <span className="feature-tag">
          FITNESS
        </span>
      </div>
      <h2>
        {selectedScenario === "severe"
        ? "Outdoor workout paused"
        : selectedScenario === "rain"
        ? "Rain-aware workout plan"
        : "Make the most of your workout window"}
      </h2>

      <div className="activity-window">
        <div>
          <span>🌅</span>
          <strong>Best window</strong>
          <small>
            6:00 AM – 8:00 AM
          </small>
        </div>

        <div>
          <span>🌡️</span>
          <strong>Temperature</strong>
          <small>
            {weather.temperature}°
          </small>
        </div>
      </div>

      <div className="fitness-stats">
        <div>
          <strong>
            {weather.wind}
          </strong>
          <span>km/h wind</span>
        </div>

        <div>
          <strong>
            {weather.uv}
          </strong>
          <span>UV index</span>
        </div>

        <div>
          <strong>
            {weather.humidity}%
          </strong>
          <span>humidity</span>
        </div>
      </div>

      <p>
        {selectedScenario === "severe"
       ? "Choose an indoor workout until conditions improve."
      : selectedScenario === "rain"
      ? "Rain is affecting outdoor activity. Consider an indoor workout or wait for a safer window."
      : weather.uv >= 7
      ? "Early morning or evening is better because UV levels are high."
      : "Current conditions are generally suitable for outdoor activity."}
      </p>
      <div className="impact-score-inline">
  <div>
    <span>Fitness Impact</span>
    <strong>{getImpactScore("fitness")}/100</strong>
  </div>

  <small>
    {selectedScenario === "severe"
      ? "Severe weather is the dominant factor. Indoor exercise is safer."
      : weather.rain >= 60
      ? "Rain may disrupt outdoor workouts."
      : weather.temperature >= 32
      ? "High temperature may increase exercise discomfort."
      : weather.uv >= 7
      ? "UV exposure is elevated. Morning or evening is preferable."
      : "Conditions are generally suitable for outdoor exercise."}
  </small>
</div>
    </section>
  );
};

  /* =========================================================
     BEACH CARD
     ========================================================= */

  const renderBeachCard = () => {
  const impact = getPersonalImpact("beach");

  return (
    <section
      className={`feature-card beach-card impact-${impact.status.toLowerCase()}`}
      key="beach"
    >
      <div className="feature-card-top">
        <div className="feature-icon">
          🏖️
        </div>

        <span className="feature-tag">
          BEACH
        </span>
      </div>
      <div className="impact-indicator">
      <span>Weather impact</span>
      <strong>{impact.score}/100</strong>
      <small>{impact.status}</small>
</div>

      <h2>Coastal conditions</h2>

      <div className="beach-visual">
        <div className="wave-symbol">
          🌊
        </div>

        <div>
          <strong>1.2 m</strong>
          <span>Wave height</span>
        </div>
      </div>

      <div className="beach-stats">
        <div>
          <strong>
            {weather.wind}
          </strong>
          <span>Wind km/h</span>
        </div>

        <div>
          <strong>
            27°
          </strong>
          <span>Water temp</span>
        </div>

        <div>
          <strong>
            Moderate
          </strong>
          <span>Sea state</span>
        </div>
      </div>

      <p>
        {selectedScenario === "severe"
          ? "Avoid water activities while severe weather is active."
          : weather.rain >= 60
          ? "Rain may reduce beach comfort. Check local coastal warnings."
          : "Conditions are generally favorable for a beach visit."}
      </p>
    </section>
  );
};

  /* =========================================================
     TRAVEL CARD
     ========================================================= */

  const renderTravelCard = () => {
  const impact = getPersonalImpact("travel");

  return (
    <section
      className={`feature-card travel-card impact-${impact.status.toLowerCase()}`}
      key="travel"
    >
      <div className="feature-card-top">
        <div className="feature-icon">
          ✈️
        </div>

        <span className="feature-tag">
          TRAVEL
        </span>
      </div>

      <div className="impact-indicator">
        <span>Weather impact</span>
        <strong>{impact.score}/100</strong>
        <small>{impact.status}</small>
      </div>

      <h2>Travel weather</h2>
      
      

      <div className="destination-box">
        <span>📍</span>

        <div>
          <strong>
            {selectedLocation}
          </strong>

          <small>
            {weather.condition}
          </small>
        </div>
      </div>

      <div className="travel-stats">
        <div>
          <strong>
            {weather.temperature}°
          </strong>
          <span>Temperature</span>
        </div>

        <div>
          <strong>
            {weather.rain}%
          </strong>
          <span>Rain chance</span>
        </div>

        <div>
          <strong>
            {weather.wind}
          </strong>
          <span>Wind</span>
        </div>
      </div>

      <div className="packing-tip">
        🎒{" "}
        <strong>Smart packing:</strong>{" "}
        {weather.rain >= 50
          ? "Carry an umbrella or rain jacket."
          : "Carry light clothes, sunglasses and water."}
      </div>
    </section>
  );
};

  /* =========================================================
     FAMILY CARD
     ========================================================= */

  const renderFamilyCard = () => {
  const impact = getPersonalImpact("family");

  return (
    <section
      className={`feature-card family-card impact-${impact.status.toLowerCase()}`}
      key="family"
    >
      <div className="feature-card-top">
        <div className="feature-icon">
          👨‍👩‍👧
        </div>

        <span className="feature-tag">
          FAMILY
        </span>
      </div>

      <h2>Family day planner</h2>

      <div className="family-status">
        <span>
          {selectedScenario === "severe"
            ? "⚠️"
            : weather.rain >= 60
            ? "☔"
            : "✓"}
        </span>

        <div>
          <strong>
            {selectedScenario === "severe"
              ? "Safety first"
              : weather.rain >= 60
              ? "Plan for rain"
              : "Routine looks good"}
          </strong>

          <small>
            School & family activities
          </small>
        </div>
      </div>

      <div className="family-stats">
        <div>
          <span>🌧️</span>
          <strong>
            {weather.rain}%
          </strong>
          <small>Rain</small>
        </div>

        <div>
          <span>👁️</span>
          <strong>
            {weather.visibility} km
          </strong>
          <small>Visibility</small>
        </div>

        <div>
          <span>🌡️</span>
          <strong>
            {weather.temperature}°
          </strong>
          <small>Temperature</small>
        </div>
      </div>

      <p>
        {selectedScenario === "severe"
          ? "Keep children indoors and monitor weather alerts."
          : weather.rain >= 60
          ? "Keep umbrellas ready for school and family travel."
          : "Family activities should be manageable with normal precautions."}
      </p>
    </section>
  );
};

  /* =========================================================
     AGRICULTURE CARD
     ========================================================= */

  const renderAgricultureCard = () => {
  const impact = getPersonalImpact("agriculture");

  return (
    <section
      className={`feature-card agriculture-card impact-${impact.status.toLowerCase()}`}
      key="agriculture"
    >
      <div className="feature-card-top">
        <div className="feature-icon">
          🌱
        </div>

        <span className="feature-tag">
          AGRICULTURE
        </span>
      </div>

      <h2>Field conditions</h2>

      <div className="soil-section">
        <div className="soil-header">
          <span>Soil moisture</span>
          <strong>64%</strong>
        </div>

        <div className="soil-bar">
          <div
            style={{
              width: "64%",
            }}
          ></div>
        </div>
      </div>

      <div className="farm-stats">
        <div>
          <strong>
            {weather.rain}%
          </strong>
          <span>Rain chance</span>
        </div>

        <div>
          <strong>
            Low
          </strong>
          <span>Frost risk</span>
        </div>

        <div>
          <strong>
            {weather.temperature}°
          </strong>
          <span>Temperature</span>
        </div>
      </div>

      <p>
        {selectedScenario === "severe"
          ? "Pause unnecessary field work until severe weather improves."
          : weather.rain >= 60
          ? "Rain is likely. Monitor drainage and avoid unnecessary irrigation."
          : "Check soil moisture before irrigation or field work."}
      </p>
      <div className="impact-score-inline">
  <div>
    <span>Agriculture Impact</span>
    <strong>{getImpactScore("agriculture")}/100</strong>
  </div>

  <small>
    {selectedScenario === "severe"
      ? "Severe weather may affect field activities. Monitor conditions before working outdoors."
      : weather.rain >= 80
      ? "Heavy rainfall may disrupt field work and harvesting."
      : weather.rain >= 60
      ? "Rain may affect field activities and outdoor work."
      : weather.temperature >= 35
      ? "High temperature may increase crop and field-work stress."
      : weather.wind >= 25
      ? "Stronger winds may affect outdoor field activities."
      : "Current simulated conditions are generally manageable for field activities."}
  </small>
</div>
    </section>
  );
};

  /* =========================================================
     COMMUTE CARD
     ========================================================= */

  const renderCommuteCard = () => {
  const impact = getPersonalImpact("commute");

  return (
    <section
      className={`feature-card commute-card impact-${impact.status.toLowerCase()}`}
      key="commute"
    >
      <div className="feature-card-top">
        <div className="feature-icon">
          🚗
        </div>

        <span className="feature-tag">
          COMMUTE
        </span>
      </div>

      <h2>Weather-aware commute</h2>

      <div className="route-preview">
        <div className="route-point">
          🏠
        </div>

        <div className="route-line">
          <span></span>
        </div>

        <div className="route-point">
          🏢
        </div>
      </div>

      <div className="commute-stats">
        <div>
          <strong>
            {weather.visibility} km
          </strong>
          <span>Visibility</span>
        </div>

        <div>
          <strong>
            {weather.rain}%
          </strong>
          <span>Rain</span>
        </div>

        <div>
          <strong>
            {weather.wind}
          </strong>
          <span>Wind km/h</span>
        </div>
      </div>

      <p>
        {selectedScenario === "severe"
          ? "Avoid unnecessary travel. If travel is essential, stay alert and follow safety guidance."
          : weather.visibility <= 5
          ? "Visibility is reduced. Drive carefully and allow extra travel time."
          : weather.rain >= 60
          ? "Rain may slow traffic. Consider leaving earlier."
          : "Traffic is expected to move normally with good visibility."}
      </p>
      <div className="impact-score-inline">
  <div>
    <span>Commute Impact</span>
    <strong>{getImpactScore("commute")}/100</strong>
  </div>

  <small>
    {selectedScenario === "severe"
      ? "Severe weather is the dominant travel risk. Avoid unnecessary travel."
      : weather.visibility <= 5
      ? "Reduced visibility may affect driving conditions."
      : weather.rain >= 60
      ? "Heavy rain may slow travel and reduce visibility."
      : weather.wind >= 25
      ? "Stronger winds may make exposed routes more difficult."
      : "Current simulated conditions are generally manageable for commuting."}
  </small>
</div>
    </section>
  );
};

  /* =========================================================
     EVENTS CARD
     ========================================================= */

  const renderEventsCard = () => {
  const impact = getPersonalImpact("events");

  return (
    <section
      className={`feature-card events-card impact-${impact.status.toLowerCase()}`}
      key="events"
    >
      <div className="feature-card-top">
        <div className="feature-icon">
          🎪
        </div>

        <span className="feature-tag">
          EVENTS
        </span>
      </div>

      <h2>
        Outdoor event outlook
      </h2>

      <div className="comfort-score">
        <div className="comfort-ring">
          <strong>
            {selectedScenario === "severe"
              ? 25
              : selectedScenario === "rain"
              ? 55
              : weather.temperature >= 30
              ? 72
              : 86}
          </strong>

          <span>
            /100
          </span>
        </div>

        <div>
          <p>
            Comfort Index
          </p>

          <strong>
            {selectedScenario === "severe"
              ? "Poor"
              : selectedScenario === "rain"
              ? "Fair"
              : weather.temperature >= 30
              ? "Good"
              : "Excellent"}
          </strong>

          <small>
            {selectedScenario === "severe"
              ? "Severe weather may disrupt outdoor events."
              : selectedScenario === "rain"
              ? "Rain could affect outdoor plans."
              : "Good conditions for outdoor events."}
          </small>
        </div>
      </div>

      <div className="event-stats">
        <div>
          <span>🌧️</span>

          <strong>
            {weather.rain}%
          </strong>

          <small>
            Rain chance
          </small>
        </div>

        <div>
          <span>🌡️</span>

          <strong>
            {weather.temperature}°
          </strong>

          <small>
            Evening temp
          </small>
        </div>

        <div>
          <span>💨</span>

          <strong>
            {weather.wind} km/h
          </strong>

          <small>
            Wind
          </small>
        </div>
      </div>

      <div className="event-tip">
        🎉{" "}
        {selectedScenario === "severe"
          ? "Postpone or move the event indoors."
          : selectedScenario === "rain"
          ? "Consider an indoor backup plan."
          : "Ideal window: 5:00 PM – 8:00 PM"}
      </div>
    </section>
  );
};

  /* =========================================================
     PERSONALIZED CARDS
     ========================================================= */

  const featureCards = {
    health: renderHealthCard,
    fitness: renderFitnessCard,
    beach: renderBeachCard,
    travel: renderTravelCard,
    family: renderFamilyCard,
    agriculture: renderAgricultureCard,
    commute: renderCommuteCard,
    events: renderEventsCard,
  };

  const personalizedCards = priorityOrder
    .filter((id) => hasInterest(id))
    .map((id) => featureCards[id]());

  /* =========================================================
     HOME SCREEN
     ========================================================= */

  if (screen === "home") {
    return (
      <main className="weather-home">
      {emergencyMode && (
        <section className="emergency-mode-card">
          <div className="emergency-mode-icon">
            ⚠️
          </div>

          <div className="emergency-mode-content">
            <span className="emergency-mode-label">
              EMERGENCY MODE
            </span>

            <h2>
              {safetyAssessment.title}
            </h2>

<p>
  {safetyAssessment.message}
</p>

<p>
  Safety guidance is taking priority over
  personalized recommendations.
</p>

<div className="emergency-mode-meta">
  <small>
    Source: {safetyState.source}
  </small>

  <small>
    Valid: {safetyState.validUntil}
  </small>
</div>

<strong>
  {safetyAssessment.action}
</strong>

<small>
  Safety Override is active and takes priority
  over personalization.
</small>
          </div>
        </section>
      )}


        {/* HEADER */}

        <header className="weather-header">

          <div>
            <div className="app-logo">
              MAUSAM
            </div>

            <div className="location">
              📍 {selectedLocation}, India
            </div>
          </div>

          <div className="header-actions">

            <button
              title="Smart Alerts"
              className={
                showAlerts
                  ? "notification-button active"
                  : "notification-button"
              }
              onClick={() =>
                setShowAlerts(
                  (current) => !current
                )
              }
            >
              🔔

              {selectedScenario !==
                "normal" && (
                <span className="notification-dot">
                  1
                </span>
              )}
            </button>

            <button
              title="Profile"
              onClick={() =>
                setScreen(
                  "personalization"
                )
              }
            >
              👤
            </button>

          </div>

        </header>

        {/* SMART ALERT PANEL */}

        {showAlerts && (
          <section
            className="smart-alert-panel"
            style={{
              margin: "0 16px 18px",
              padding: "18px",
              borderRadius: "24px",
              background:
                selectedScenario === "severe"
                  ? "linear-gradient(135deg, #fff1f2, #ffe4e6)"
                  : selectedScenario === "rain"
                  ? "linear-gradient(135deg, #eff6ff, #e0f2fe)"
                  : "linear-gradient(135deg, #f8fafc, #eef2ff)",
              border:
                selectedScenario === "severe"
                  ? "1px solid #fecdd3"
                  : "1px solid #dbeafe",
              boxShadow:
                "0 16px 40px rgba(30, 41, 59, 0.12)",
            }}
          >

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "12px",
                marginBottom: "14px",
              }}
            >

              <div>

                <p
                  style={{
                    margin: 0,
                    fontSize: "11px",
                    fontWeight: 800,
                    letterSpacing: "0.12em",
                    color:
                      selectedScenario === "severe"
                        ? "#be123c"
                        : "#2563eb",
                  }}
                >
                  {smartAlert.label}
                </p>

                <h2
                  style={{
                    margin: "5px 0 0",
                    fontSize: "20px",
                    color: "#0f172a",
                  }}
                >
                  {smartAlert.title}
                </h2>

              </div>

              <button
                onClick={() =>
                  setShowAlerts(false)
                }
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: "18px",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>

            </div>

            <p
              style={{
                margin: 0,
                color: "#475569",
                lineHeight: 1.6,
              }}
            >
              {smartAlert.message}
            </p>

          </section>
        )}

        {/* LOCATION + SCENARIO */}

        <section className="location-section">

          <div className="location-select-row">

            <div>
              <p className="card-label">
                YOUR LOCATION
              </p>

              <select
                value={selectedLocation}
                onChange={(event) =>
                  setSelectedLocation(
                    event.target.value
                  )
                }
              >
                {Object.keys(locations).map(
                  (location) => (
                    <option
                      key={location}
                      value={location}
                    >
                      {location}
                    </option>
                  )
                )}
              </select>
            </div>

          </div>

          <div className="scenario-controls">

            <p className="card-label">
              DEMO WEATHER SIMULATOR
            </p>

            <div className="scenario-buttons">

              {Object.entries(scenarios).map(
                ([id, scenarioItem]) => (
                  <button
                    key={id}
                    className={
                      selectedScenario === id
                        ? "scenario-button active"
                        : "scenario-button"
                    }
                    onClick={() => {
                      setSelectedScenario(id);
                      setShowAlerts(false);
                    }}
                  >
                    <span>
                      {scenarioItem.icon}
                    </span>

                    {scenarioItem.label}
                  </button>
                )
              )}

            </div>

            <div
              className={`scenario-status ${selectedScenario}`}
            >

              <span>
                {scenario.icon}
              </span>

              <div>

                <strong>
                  {selectedScenario ===
                  "normal"
                    ? "Normal conditions"
                    : selectedScenario ===
                      "rain"
                    ? "Heavy rain detected"
                    : "Severe weather detected"}
                </strong>

                <small>
                  {selectedScenario ===
                  "normal"
                    ? "Your normal personalized homepage is active."
                    : selectedScenario ===
                      "rain"
                    ? "Mausam is adapting recommendations to the changing weather."
                    : "Mausam has activated safety-focused recommendations."}
                </small>

              </div>

            </div>

          </div>

        </section>

        {/* SEVERE ALERT */}

        {selectedScenario === "severe" && (
          <section className="severe-alert-card">

            <div className="severe-alert-icon">
              ⚠️
            </div>

            <div className="severe-alert-content">

              <span className="alert-label">
                SMART WEATHER ALERT
              </span>

              <h2>
                Severe weather in{" "}
                {selectedLocation}
              </h2>

              <p>
                Conditions have changed
                significantly. Mausam has
                automatically adjusted your
                recommendations.
              </p>

              <div className="alert-actions">

                <span>
                  🌧️ {weather.rain}% rain
                </span>

                <span>
                  💨 {weather.wind} km/h wind
                </span>

                <span>
                  👁️ {weather.visibility} km
                  visibility
                </span>

              </div>

            </div>

          </section>
        )}

        {/* GREETING */}

        <section className="greeting-section">

          <p className="greeting">
            Good afternoon
            {userName
              ? `, ${userName}`
              : ""}{" "}
            👋
          </p>

          <h1>
            Here's your weather.
          </h1>

          <p className="personalized-label">

            ✨ Personalized for{" "}

            {interestNames.length === 1
              ? interestNames[0]
              : interestNames
                  .slice(0, 2)
                  .join(" + ")}

            {interestNames.length > 2
              ? " + more"
              : ""}

          </p>

        </section>

        {/* PERSONALIZATION ENGINE */}

        <section className="personalization-engine-card">

          <div className="engine-top">

            <div className="engine-icon">
              🧠
            </div>

            <div>

              <p className="card-label">
                YOUR MAUSAM
              </p>

              <h2>
                Personalization Engine
              </h2>

            </div>

            <div className="engine-status">
              <span>●</span> ACTIVE
            </div>

          </div>

          <p className="engine-description">
            Your homepage is prioritizing
            information based on what matters
            most to you.
          </p>

          <div className="selected-interest-pills">

            {selectedInterests.map((id) => {

              const interest =
                interests.find(
                  (item) => item.id === id
                );

              return (
                <span key={id}>
                  {interest?.icon}{" "}
                  {interest?.title}
                </span>
              );

            })}

          </div>

          <div className="engine-result">

            <span>✨</span>

            <div>

              <strong>
                {selectedScenario === "severe"
                  ? "Safety mode activated"
                  : selectedScenario === "rain"
                  ? "Rain-aware personalization active"
                  : `${selectedInterests.length} ${
                      selectedInterests.length === 1
                        ? "interest"
                        : "interests"
                    } prioritized`}
              </strong>

              <small>
                {selectedScenario === "severe"
                  ? "Health, commute and safety-related information is prioritized first."
                  : selectedScenario === "rain"
                  ? "Commute, family and rain-sensitive information is prioritized first."
                  : "Relevant insights appear first on your homepage."}
              </small>

            </div>

          </div>

        </section>

        {/* MAIN WEATHER */}

        <section className="main-weather-card">

          <div className="weather-top">

            <div>

              <p className="weather-condition">
                {weather.condition}
              </p>

              <div className="temperature">
                {weather.temperature}°
              </div>

              <p className="feels-like">
                Feels like{" "}
                {weather.feelsLike}°
              </p>

            </div>

            <div className="weather-icon-large">
              {weather.icon}
            </div>

          </div>

          <div className="weather-metrics">
  <div className="weather-main-temperature">
    <span>Temperature</span>
    <strong>{weather.temperature}°</strong>
  </div>

  <div className="weather-metric-list">

  <div className="weather-metric-row">
    <span className="weather-metric-label">
      <span className="weather-metric-icon">💧</span>
      Humidity
    </span>
    <strong>{weather.humidity}%</strong>
  </div>

  <div className="weather-metric-row">
    <span className="weather-metric-label">
      <span className="weather-metric-icon">💨</span>
      Wind
    </span>
    <strong>{weather.wind} km/h</strong>
  </div>

  <div className="weather-metric-row">
    <span className="weather-metric-label">
      <span className="weather-metric-icon">👁️</span>
      Visibility
    </span>
    <strong>{weather.visibility} km</strong>
  </div>

  <div className="weather-metric-row">
    <span className="weather-metric-label">
      <span className="weather-metric-icon">🌧️</span>
      Rain
    </span>
    <strong>{weather.rain}%</strong>
  </div>
  </div>

</div>

          <p className="weather-smart-message">
            💡{" "}
            {selectedScenario === "severe"
              ? "Severe weather is affecting today's conditions."
              : selectedScenario === "rain"
              ? "Heavy rain is changing your outdoor and travel recommendations."
              : weather.weatherMessage}
          </p>

        </section>

        {/* FOCUS */}

        <section className="focus-card">

          <div className="focus-header">

            <div>

              <p className="card-label">
                YOUR FOCUS TODAY
              </p>

              <h2>
                {selectedScenario === "severe"
                  ? "Safety comes first while severe weather is active."
                  : selectedScenario === "rain"
                  ? hasInterest("commute")
                    ? "Plan your journey around the changing rain conditions."
                    : hasInterest("family")
                    ? "Keep your family's day smooth and rain-ready."
                    : hasInterest("travel")
                    ? "Travel prepared for changing rain conditions."
                    : hasInterest("events")
                    ? "Plan your event around the rain forecast."
                    : hasInterest("fitness")
                    ? "Adjust your workout around the rain."
                    : "Plan your day around the changing weather."
                  : hasInterest("health")
                  ? "Stay comfortable and protect your health."
                  : hasInterest("fitness")
                  ? "Make the most of your workout window."
                  : hasInterest("beach")
                  ? "Enjoy the water while conditions are favorable."
                  : hasInterest("travel")
                  ? "Travel prepared with destination-aware weather."
                  : hasInterest("family")
                  ? "Keep your family's day smooth and safe."
                  : hasInterest("agriculture")
                  ? "Plan field work around today's conditions."
                  : hasInterest("commute")
                  ? "Know what your journey looks like before you leave."
                  : hasInterest("events")
                  ? "Plan your outdoor event around the weather."
                  : "Your weather, personalized for you."}
              </h2>

            </div>

          </div>

          <p>
            {weather.insight}
          </p>

        </section>

        {/* PERSONALIZED FEATURE CARDS */}

        <section className="personalized-section">

          <div className="section-heading">

            <div>

              <p className="card-label">
                YOUR PERSONALIZED INSIGHTS
              </p>

              <h2>
                Designed around you
              </h2>

            </div>

            <span>
              {personalizedCards.length}
              {" "}
              active
            </span>

          </div>

          <div className="personalized-cards">

            {personalizedCards}

          </div>

        </section>

        {/* DAILY ADVICE */}

        <section className="daily-advice-card">

          <div className="advice-icon">
            💡
          </div>

          <div>

            <p className="card-label">
              PERSONALIZED ADVICE
            </p>

            <h2>
              Your day, made simpler
            </h2>

            <p>
              {getDailyAdvice()}
            </p>

          </div>

        </section>

        {/* WEATHER SUMMARY */}

        <section className="summary-card">

          <div className="summary-header">

            <div>
              <p className="card-label">
                TODAY AT A GLANCE
              </p>

              <h2>
                {selectedLocation}
              </h2>
            </div>

            <span>
              {weather.icon}
            </span>

          </div>

          <div className="summary-grid">

            <div>
              <span>High</span>
              <strong>
                {weather.high}°
              </strong>
            </div>

            <div>
              <span>Low</span>
              <strong>
                {weather.low}°
              </strong>
            </div>

            <div>
              <span>Rain</span>
              <strong>
                {weather.rain}%
              </strong>
            </div>

            <div>
              <span>Wind</span>
              <strong>
                {weather.wind}
              </strong>
            </div>

          </div>

        </section>

        {/* AI ASSISTANT */}

        {showAssistant && (
          <div
            className="assistant-panel"
            style={{
              position: "fixed",
              left: "50%",
              bottom: "20px",
              transform:
                "translateX(-50%)",
              width:
                "min(430px, calc(100vw - 24px))",
              maxHeight:
                "calc(100vh - 40px)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              zIndex: 9999,
              boxSizing: "border-box",
            }}
          >

            <div
              className="assistant-header"
              style={{
                flexShrink: 0,
                position: "relative",
                zIndex: 10,
              }}
            >

              <div>

                <span>
                  🤖
                </span>

                <div>

                  <strong>
                    Ask Mausam
                  </strong>

                  <small>
                    Your weather assistant
                  </small>

                </div>

              </div>

              <button
                onClick={() => {
                  setShowAssistant(false);
                  setAssistantQuestion("");
                  setAssistantReply("");
                }}
              >
                ✕
              </button>

            </div>

            <div
              style={{
                flex: 1,
                minHeight: 0,
                overflowY: "auto",
                overflowX: "hidden",
                padding:
                  "4px 8px 20px 0",
                WebkitOverflowScrolling:
                  "touch",
                scrollbarWidth: "thin",
              }}
            >

              {assistantQuestion && (
                <div className="assistant-conversation">

                  <div className="user-question">
                    {assistantQuestion}
                  </div>

                  {assistantReply && (
                    <div className="assistant-reply">
                      <span>
                        🤖
                      </span>

                      <p>
                        {assistantReply}
                      </p>
                    </div>
                  )}

                </div>
              )}

              <div className="assistant-suggestions">

                <p
                  style={{
                    margin:
                      "12px 0 10px",
                    fontSize: "12px",
                    fontWeight: 800,
                    opacity: 0.75,
                  }}
                >
                  💬 Questions based on your
                  interests
                </p>

                {personalizedQuestions.map(
                  (question, index) => (

                    <button
                      key={`${question}-${index}`}
                      onClick={() =>
                        askMausam(question)
                      }
                    >
                      {question}
                    </button>

                  )
                )}

              </div>

            </div>

          </div>
        )}

        {/* AI FLOATING BUTTON */}

        {!showAssistant && (

          <button
            className="ai-button"
            onClick={() => {
              setShowAssistant(true);
              setAssistantQuestion("");
              setAssistantReply("");
            }}
          >

            <span>
              🤖
            </span>

            <div>

              <strong>
                Ask Mausam
              </strong>

              <small>
                Weather assistant
              </small>

            </div>

          </button>

        )}

      </main>
    );
  }

  /* =========================================================
     MOCK LOGIN / PROFILE SCREEN
     ========================================================= */

  if (screen === "login") {

    const canContinue =
      userName.trim().length > 0 &&
      userContact.trim().length > 0;

    return (

      <main className="personalization-screen">

        <div className="personalization-content">

          <div className="small-logo">
            MAUSAM
          </div>

          <div className="step-indicator">
            STEP 1 OF 2
          </div>

          <h1>
            Welcome to
            <span>
              {" "}
              Mausam.
            </span>
          </h1>

          <p className="personalization-subtitle">
            Create your profile to get a
            <br />
            weather experience made for you.
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              margin: "26px 0 18px",
            }}
          >

            <label
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                textAlign: "left",
                fontSize: "13px",
                fontWeight: 800,
                color: "#334155",
              }}
            >
              YOUR NAME

              <input
                type="text"
                value={userName}
                onChange={(event) =>
                  setUserName(event.target.value)
                }
                placeholder="Enter your name"
                autoComplete="name"
                style={{
                  width: "100%",
                  padding: "16px 18px",
                  borderRadius: "16px",
                  border:
                    "1px solid #dbe4f0",
                  outline: "none",
                  fontSize: "15px",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                  background: "#ffffff",
                  color: "#0f172a",
                }}
              />

            </label>

            <label
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                textAlign: "left",
                fontSize: "13px",
                fontWeight: 800,
                color: "#334155",
              }}
            >
              EMAIL OR MOBILE

              <input
                type="text"
                value={userContact}
                onChange={(event) =>
                  setUserContact(event.target.value)
                }
                placeholder="Enter email or mobile number"
                autoComplete="email"
                style={{
                  width: "100%",
                  padding: "16px 18px",
                  borderRadius: "16px",
                  border:
                    "1px solid #dbe4f0",
                  outline: "none",
                  fontSize: "15px",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                  background: "#ffffff",
                  color: "#0f172a",
                }}
              />

            </label>

          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "14px 16px",
              borderRadius: "16px",
              background:
                "linear-gradient(135deg, #f0f9ff, #eef2ff)",
              color: "#475569",
              fontSize: "12px",
              lineHeight: 1.5,
              textAlign: "left",
              marginBottom: "18px",
            }}
          >

            <span
              style={{
                fontSize: "20px",
              }}
            >
              🔒
            </span>

            <span>
              Demo profile only — no real account,
              password or OTP is required.
            </span>

          </div>

          <button
            className="continue-button"
            disabled={!canContinue}
            onClick={() =>
              setScreen(
                "personalization"
              )
            }
          >

            Continue

            <span>
              →
            </span>

          </button>

          <p className="selection-count">

            {canContinue
              ? "Profile ready • Next: choose your interests"
              : "Enter your name and email/mobile to continue"}

          </p>

          <button
            onClick={() =>
              setScreen("welcome")
            }
            style={{
              marginTop: "12px",
              border: "none",
              background: "transparent",
              color: "#64748b",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            ← Back to welcome
          </button>

        </div>

      </main>

    );
  }

  /* =========================================================
     PERSONALIZATION SCREEN
     ========================================================= */

  if (screen === "personalization") {

    return (

      <main className="personalization-screen">

        <div className="personalization-content">

          <div className="small-logo">
            MAUSAM
          </div>

          <div className="step-indicator">
            STEP 2 OF 2
          </div>

          <h1>
            Let's make
            <span>
              {" "}
              Mausam yours.
            </span>
          </h1>

          <p className="personalization-subtitle">
            Tell us what matters to you.
            <br />
            You can choose more than one.
          </p>

          <div className="interest-grid">

            {interests.map(
              (interest) => {

                const isSelected =
                  selectedInterests.includes(
                    interest.id
                  );

                return (

                  <button
                    key={interest.id}
                    className={`interest-card ${
                      isSelected
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      toggleInterest(
                        interest.id
                      )
                    }
                  >

                    <div className="interest-icon">
                      {interest.icon}
                    </div>

                    <div className="interest-info">

                      <h3>
                        {interest.title}
                      </h3>

                      <p>
                        {interest.description}
                      </p>

                    </div>

                    <div className="selection-mark">

                      {isSelected
                        ? "✓"
                        : ""}

                    </div>

                  </button>

                );
              }
            )}

          </div>

          <button
            className="continue-button"
            disabled={
              selectedInterests.length === 0
            }
            onClick={() =>
              setScreen("home")
            }
          >

            Personalize My Mausam

            <span>
              →
            </span>

          </button>

          <p className="selection-count">

            {selectedInterests.length === 0
              ? "Select at least one interest"
              : `${selectedInterests.length} interest${
                  selectedInterests.length >
                  1
                    ? "s"
                    : ""
                } selected`}

          </p>

          <button
            onClick={() =>
              setScreen("login")
            }
            style={{
              marginTop: "10px",
              border: "none",
              background: "transparent",
              color: "#64748b",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            ← Back to profile
          </button>

        </div>

      </main>

    );
  }

  /* =========================================================
     WELCOME SCREEN
     ========================================================= */

  return (

    <main className="welcome-screen">

      <div className="weather-decoration sun">
        ☀️
      </div>

      <div className="weather-decoration cloud">
        ☁️
      </div>

      <div className="weather-decoration cloud cloud-two">
        ☁️
      </div>

      <div className="welcome-content">

        <div className="logo">
          MAUSAM
        </div>

        <div className="weather-icon">
          🌤️
        </div>

        <p className="welcome-kicker">
          SMART WEATHER • YOUR WAY
        </p>

        <h1>
          Weather that
          <span>
            {" "}
            understands you.
          </span>
        </h1>

        <p>
          Personalized weather insights
          designed around your lifestyle,
          location and daily needs.
        </p>

        <button
          className="start-button"
          onClick={() =>
            setScreen("login")
          }
        >

          Get Started

          <span>
            →
          </span>

        </button>

        <div className="feature-hints">

          <div>
            <span>📍</span>
            Smart Location
          </div>

          <div>
            <span>✨</span>
            Personalized
          </div>

          <div>
            <span>🌦️</span>
            Smart Weather
          </div>

        </div>

      </div>

    </main>

  );

}

export default App;

