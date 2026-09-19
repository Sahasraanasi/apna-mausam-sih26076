# Apna Mausam

### Smart, personalized weather experience with safety-first automation

**Smart India Hackathon 2026 — SIH26076**
**Team: Climate Cryptics**

Apna Mausam is a prototype for a personalized weather experience that combines contextual recommendations with a deterministic safety layer.

The system is designed around one core principle:

> **Personalization improves relevance, but safety always comes first.**

## Key Features

* 🌤️ **Personalized Weather Experience**
  Presents weather information and recommendations based on user context and preferences.

* 📍 **Location Selection**
  Supports manual location selection and browser location permission. Hyderabad is used as the controlled demonstration location.

* 🛡️ **Safety Override**
  A deterministic safety layer takes priority over personalization when a severe-weather condition is active.

* 🚨 **Emergency Mode**
  Provides a single generic emergency state with clear safety guidance.

* 📦 **Offline Support**
  Previously cached weather information remains available when offline, with the cache/synchronization state shown to the user.

* 🔐 **Privacy Controls**
  Allows users to manage personalization and clear locally stored application data.

## Prototype & Data Note

This version uses **controlled demonstration scenarios and mock weather data** for the prototype.

The demonstration data should **not be interpreted as live IMD data**.

The architecture is designed so that approved weather/IMD data sources can be integrated in a future implementation.

## Tech Stack

* React
* Vite
* JavaScript
* CSS
* Browser Local Storage
* Git & GitHub

## Running Locally

Clone the repository:

```bash
git clone https://github.com/Sahasraanasi/apna-mausam-sih26076.git
cd apna-mausam-sih26076
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

## Demo

**Live Prototype:**
https://apna-mausam-sih26076-navy.vercel.app/

## Project Status

**Working Prototype**

The current prototype demonstrates:

* Personalized weather presentation
* Location permission and manual location selection
* Deterministic Safety Override
* Generic Emergency Mode
* Offline cached weather state
* Local privacy controls
* Controlled demonstration scenarios

## Team

**Climate Cryptics**
Smart India Hackathon 2026
Problem Statement: **SIH26076**
