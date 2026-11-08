const STORAGE_KEY = 'roll_the_night_age_verified';

export function checkAgeVerified() {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setAgeVerified() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, 'true');
  } catch {
    // Storage fallback
  }
}

