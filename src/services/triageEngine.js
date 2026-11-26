export const TRIAGE_STYLES = {
  Red: {
    badge: 'bg-red-100 text-red-700 border-red-300',
    dot: 'bg-red-600',
    label: 'Red — Immediate',
    score: 3,
  },
  Yellow: {
    badge: 'bg-amber-100 text-amber-800 border-amber-300',
    dot: 'bg-amber-500',
    label: 'Yellow — Urgent',
    score: 2,
  },
  Green: {
    badge: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    dot: 'bg-emerald-500',
    label: 'Green — Minor',
    score: 1,
  },
};

const CRITICAL_TYPES = [
  'Cardiac Distress',
  'Severe Breathing Difficulty',
  'Unconscious / Fainting',
];

const URGENT_TYPES = [
  'Road Accident / Trauma',
  'Allergic Reaction',
];

/**
 * Calculates Red / Yellow / Green triage level from vitals toggles + emergency type.
 */
export function calculateTriage({ type, conscious = true, breathing = true, heavyBleeding = false }) {
  if (!conscious || !breathing || heavyBleeding || CRITICAL_TYPES.includes(type)) {
    return { level: 'Red', priority: 'Immediate', score: 3 };
  }
  if (URGENT_TYPES.includes(type)) {
    return { level: 'Yellow', priority: 'Urgent', score: 2 };
  }
  return { level: 'Green', priority: 'Minor', score: 1 };
}

/**
 * Fallback helper for older Firestore records created before triage scoring existed.
 */
export function getTriageLevel(req) {
  if (req.triageLevel && TRIAGE_STYLES[req.triageLevel]) return req.triageLevel;
  if (req.priority === 'Critical' || req.priority === 'Immediate') return 'Red';
  if (req.priority === 'Urgent') return 'Yellow';
  return 'Green';
}