const TYPE_TO_CODE = {
  'Cardiac Distress': 'C1',
  'Road Accident / Trauma': 'T1',
  'Severe Breathing Difficulty': 'B1',
  'Unconscious / Fainting': 'U1',
  'Allergic Reaction': 'A1',
  'Other Medical Emergency': 'O1',
};

const CODE_TO_TYPE = Object.fromEntries(
  Object.entries(TYPE_TO_CODE).map(([label, code]) => [code, label])
);

/**
 * Packs an SOS object into a compact plain-ASCII string (~28-33 bytes).
 * Format: ML1|<id>|<blood>|<codeType>|<lat>,<lng>
 */
export function encodeSOSPayload({ patientId = 'PT00', bloodGroup = 'O+', type = 'Other Medical Emergency', location }) {
  const shortId = String(patientId).replace(/[^A-Za-z0-9]/g, '').slice(0, 6);
  const code = TYPE_TO_CODE[type] || 'O1';
  const lat = Number(location?.lat ?? 21.1458).toFixed(4);
  const lng = Number(location?.lng ?? 79.0882).toFixed(4);

  return `ML1|${shortId}|${bloodGroup}|${code}|${lat},${lng}`;
}

/**
 * Decodes a compact ML1 payload string back into a structured emergency case.
 */
export function decodeSOSPayload(raw) {
  const cleaned = String(raw || '').trim();
  const parts = cleaned.split('|');

  if (parts.length !== 5 || parts[0] !== 'ML1') {
    throw new Error('Invalid payload format. Expected: ML1|ID|BLOOD|CODE|LAT,LNG');
  }

  const [, shortId, bloodGroup, code, coords] = parts;
  const [latStr, lngStr] = (coords || '').split(',');
  const lat = parseFloat(latStr);
  const lng = parseFloat(lngStr);

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    throw new Error('Invalid GPS coordinates inside payload.');
  }

  return {
    patientId: shortId.startsWith('PT') ? `${shortId.slice(0, 2)}-${shortId.slice(2)}` : shortId,
    patientName: `SMS Patient (${shortId})`,
    bloodGroup,
    type: CODE_TO_TYPE[code] || 'Other Medical Emergency',
    location: {
      lat,
      lng,
      label: `SMS GPS (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
    },
    medicalNotes: 'Received via Offline SMS Fallback Bridge (Compact ML1 Payload).',
  };
}

export function getByteSize(str) {
  return new TextEncoder().encode(str).length;
}

/**
 * Builds a cross-platform sms: URI (iOS uses &body=, Android uses ?body=).
 */
export function buildSmsUri(phoneNumber, body) {
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent || '');
  const separator = isIOS ? '&' : '?';
  return `sms:${phoneNumber}${separator}body=${encodeURIComponent(body)}`;
}