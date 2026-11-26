import { useState } from 'react';
import { AlertTriangle, MapPin, X } from 'lucide-react';
import { toast } from 'sonner';
import { calculateTriage, TRIAGE_STYLES } from '../../services/triageEngine';

const EMERGENCY_TYPES = [
  'Cardiac Distress',
  'Road Accident / Trauma',
  'Severe Breathing Difficulty',
  'Unconscious / Fainting',
  'Allergic Reaction',
  'Other Medical Emergency',
];

export default function SOSModal({ isOpen, onClose, onConfirm }) {
  const [type, setType] = useState(EMERGENCY_TYPES[0]);
  const [conscious, setConscious] = useState(true);
  const [breathing, setBreathing] = useState(true);
  const [heavyBleeding, setHeavyBleeding] = useState(false);
  const [coords, setCoords] = useState({ lat: 21.1458, lng: 79.0882, label: 'Nagpur Sector 4 (Default)' });
  const [locating, setLocating] = useState(false);

  if (!isOpen) return null;

  const triage = calculateTriage({ type, conscious, breathing, heavyBleeding });
  const triageStyle = TRIAGE_STYLES[triage.level];

  const captureLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: Number(pos.coords.latitude.toFixed(4)),
          lng: Number(pos.coords.longitude.toFixed(4)),
          label: `GPS (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`,
        });
        setLocating(false);
        toast.success('Current GPS coordinates captured.');
      },
      () => {
        setLocating(false);
        toast.info('Location permission denied. Using last known coordinates.');
      }
    );
  };

  const handleConfirm = () => {
    onConfirm({ type, location: coords, triage });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-surface border border-border-subtle rounded-2xl max-w-md w-full p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-emergency font-display font-bold text-lg">
            <AlertTriangle className="w-5 h-5" />
            <span>Confirm Emergency SOS</span>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-text-main cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-main mb-1.5">Emergency Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-border-subtle text-sm bg-surface focus:outline-none focus:border-primary"
            >
              {EMERGENCY_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Quick Triage Assessment */}
          <div className="p-3.5 rounded-xl bg-bg-app border border-border-subtle space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-main">Quick Triage Check</span>
              <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${triageStyle.badge}`}>
                <span className={`w-2 h-2 rounded-full ${triageStyle.dot}`} />
                {triageStyle.label}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setConscious(!conscious)}
                className={`py-2 px-2 rounded-lg border font-medium transition-colors cursor-pointer ${
                  conscious
                    ? 'bg-surface border-border-subtle text-text-main'
                    : 'bg-red-50 border-red-300 text-red-700 font-semibold'
                }`}
              >
                {conscious ? 'Conscious' : 'Unconscious'}
              </button>

              <button
                type="button"
                onClick={() => setBreathing(!breathing)}
                className={`py-2 px-2 rounded-lg border font-medium transition-colors cursor-pointer ${
                  breathing
                    ? 'bg-surface border-border-subtle text-text-main'
                    : 'bg-red-50 border-red-300 text-red-700 font-semibold'
                }`}
              >
                {breathing ? 'Breathing OK' : 'Not Breathing'}
              </button>

              <button
                type="button"
                onClick={() => setHeavyBleeding(!heavyBleeding)}
                className={`py-2 px-2 rounded-lg border font-medium transition-colors cursor-pointer ${
                  heavyBleeding
                    ? 'bg-red-50 border-red-300 text-red-700 font-semibold'
                    : 'bg-surface border-border-subtle text-text-main'
                }`}
              >
                {heavyBleeding ? 'Heavy Bleed' : 'No Bleed'}
              </button>
            </div>
          </div>

          {/* GPS Row */}
          <div className="p-3 rounded-xl bg-bg-app border border-border-subtle flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-text-main">
              <MapPin className="w-4 h-4 text-primary shrink-0" />
              <span>{coords.label}</span>
            </div>
            <button
              type="button"
              onClick={captureLocation}
              disabled={locating}
              className="text-xs font-semibold text-primary hover:underline shrink-0 cursor-pointer"
            >
              {locating ? 'Locating...' : 'Update GPS'}
            </button>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg border border-border-subtle text-sm font-medium text-text-muted hover:bg-bg-app cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-2.5 rounded-lg bg-emergency text-white text-sm font-semibold hover:bg-emergency/90 cursor-pointer"
          >
            Broadcast SOS
          </button>
        </div>
      </div>
    </div>
  );
}