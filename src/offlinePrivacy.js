const PROFILE_KEY = "mausam.profile";
const CACHE_KEY = "mausam.weatherCache";

const isStorageAvailable = () => {
  try {
    const testKey = "__mausam_storage_test__";

    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);

    return true;
  } catch {
    return false;
  }
};

const readJson = (key, fallback = null) => {
  if (!isStorageAvailable()) {
    return fallback;
  }

  try {
    const value = window.localStorage.getItem(key);

    if (!value) {
      return fallback;
    }

    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) => {
  if (!isStorageAvailable()) {
    return false;
  }

  try {
    window.localStorage.setItem(
      key,
      JSON.stringify(value)
    );

    return true;
  } catch {
    return false;
  }
};

export const loadProfile = () =>
  readJson(PROFILE_KEY, null);

export const saveProfile = (profile) =>
  writeJson(PROFILE_KEY, profile);

export const clearProfile = () => {
  if (!isStorageAvailable()) {
    return false;
  }

  try {
    window.localStorage.removeItem(PROFILE_KEY);
    return true;
  } catch {
    return false;
  }
};

export const loadWeatherCache = () =>
  readJson(CACHE_KEY, null);

export const saveWeatherCache = (cache) =>
  writeJson(CACHE_KEY, cache);

export const clearWeatherCache = () => {
  if (!isStorageAvailable()) {
    return false;
  }

  try {
    window.localStorage.removeItem(CACHE_KEY);
    return true;
  } catch {
    return false;
  }
};