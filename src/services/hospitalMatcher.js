import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export const DEFAULT_HOSPITALS = [
  {
    id: 'hosp-city-general',
    name: 'City General Trauma Center',
    lat: 21.1498,
    lng: 79.0806,
    icuBeds: 4,
    ventilators: 2,
    specialties: ['Cardiac Distress', 'Road Accident / Trauma', 'Severe Breathing Difficulty'],
    bloodBank: { 'A+': 6, 'A-': 1, 'B+': 5, 'B-': 0, 'O+': 8, 'O-': 2, 'AB+': 3, 'AB-': 1 },
  },
  {
    id: 'hosp-lifeline-cardiac',
    name: 'Lifeline Cardiac & ICU Institute',
    lat: 21.1382,
    lng: 79.0954,
    icuBeds: 6,
    ventilators: 4,
    specialties: ['Cardiac Distress', 'Unconscious / Fainting', 'Severe Breathing Difficulty'],
    bloodBank: { 'A+': 3, 'A-': 2, 'B+': 4, 'B-': 1, 'O+': 5, 'O-': 3, 'AB+': 2, 'AB-': 0 },
  },
  {
    id: 'hosp-metro-care',
    name: 'Metro Care Multispecialty',
    lat: 21.1585,
    lng: 79.1012,
    icuBeds: 0,
    ventilators: 0,
    specialties: ['Allergic Reaction', 'Other Medical Emergency'],
    bloodBank: { 'A+': 2, 'A-': 0, 'B+': 0, 'B-': 0, 'O+': 4, 'O-': 0, 'AB+': 1, 'AB-': 0 },
  },
  {
    id: 'hosp-east-trauma',
    name: 'East Sector Emergency Hospital',
    lat: 21.1320,
    lng: 79.0740,
    icuBeds: 3,
    ventilators: 1,
    specialties: ['Road Accident / Trauma', 'Allergic Reaction', 'Other Medical Emergency'],
    bloodBank: { 'A+': 4, 'A-': 1, 'B+': 3, 'B-': 2, 'O+': 6, 'O-': 1, 'AB+': 2, 'AB-': 1 },
  },
];

/**
 * Seeds default hospitals using fixed IDs so duplicates are never created.
 */
export async function seedHospitalsIfEmpty() {
  await Promise.all(
    DEFAULT_HOSPITALS.map((h) => setDoc(doc(db, 'hospitals', h.id), h, { merge: true }))
  );
}

/**
 * Haversine distance in kilometers between two GPS coordinates.
 */
export function getDistanceKm(lat1, lng1, lat2, lng2) {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return Number((R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1));
}

/**
 * Ranks hospitals by ICU availability, blood-group match, specialty, and distance.
 */
export function rankHospitals(hospitals, emergency) {
  const lat = emergency?.location?.lat ?? 21.1458;
  const lng = emergency?.location?.lng ?? 79.0882;
  const bloodGroup = emergency?.bloodGroup || 'O+';
  const type = emergency?.type || '';

  return hospitals
    .map((h) => {
      const distanceKm = getDistanceKm(lat, lng, h.lat, h.lng);
      const exactBloodUnits = h.bloodBank?.[bloodGroup] ?? 0;
      const universalBloodUnits = h.bloodBank?.['O-'] ?? 0;
      const hasExactBlood = exactBloodUnits > 0;
      const hasICU = (h.icuBeds ?? 0) > 0;
      const hasSpecialty = (h.specialties || []).includes(type);

      let score = 100 - distanceKm * 6;
      if (hasICU) score += 35;
      else score -= 40;

      if (hasExactBlood) score += 25;
      else if (universalBloodUnits > 0) score += 10;
      else score -= 15;

      if (hasSpecialty) score += 15;

      return {
        ...h,
        distanceKm,
        exactBloodUnits,
        hasExactBlood,
        hasICU,
        hasSpecialty,
        score: Math.max(0, Math.round(score)),
      };
    })
    .sort((a, b) => b.score - a.score);
}