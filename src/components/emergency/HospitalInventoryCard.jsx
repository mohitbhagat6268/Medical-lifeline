import { useEffect, useState } from 'react';
import { collection, doc, increment, onSnapshot, updateDoc } from 'firebase/firestore';
import { BedDouble, Droplet, Minus, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { db } from '../../services/firebase';
import { seedHospitalsIfEmpty } from '../../services/hospitalMatcher';

const BLOOD_GROUPS = ['A+', 'B+', 'O+', 'O-', 'AB+'];

export default function HospitalInventoryCard() {
  const [hospitals, setHospitals] = useState([]);
  const [selectedId, setSelectedId] = useState('hosp-city-general');

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'hospitals'), (snap) => {
      if (snap.empty) {
        seedHospitalsIfEmpty();
      } else {
        setHospitals(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      }
    });
    return () => unsub();
  }, []);

  const current = hospitals.find((h) => h.id === selectedId) || hospitals[0];
  if (!current) return null;

  const adjustField = async (fieldPath, delta, currentVal) => {
    if (currentVal + delta < 0) return;
    try {
      await updateDoc(doc(db, 'hospitals', current.id), {
        [fieldPath]: increment(delta),
      });
    } catch {
      toast.error('Failed to update inventory.');
    }
  };

  return (
    <div className="bg-surface border border-border-subtle rounded-xl p-5 shadow-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display font-semibold text-sm">Live ICU & Blood-Bank Inventory</h2>
          <p className="text-xs text-text-muted">Updates sync in real time with the Smart Hospital Matcher.</p>
        </div>

        <select
          value={current.id}
          onChange={(e) => setSelectedId(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-border-subtle text-xs bg-surface font-medium"
        >
          {hospitals.map((h) => (
            <option key={h.id} value={h.id}>{h.name}</option>
          ))}
        </select>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-3">
        {/* ICU Beds Control */}
        <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-primary flex items-center gap-1">
              <BedDouble className="w-3.5 h-3.5" /> ICU Beds
            </p>
            <p className="font-display font-bold text-lg">{current.icuBeds}</p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => adjustField('icuBeds', -1, current.icuBeds)}
              className="p-1 rounded-md bg-surface border border-border-subtle hover:bg-bg-app cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => adjustField('icuBeds', 1, current.icuBeds)}
              className="p-1 rounded-md bg-surface border border-border-subtle hover:bg-bg-app cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Blood Bank Controls */}
        {BLOOD_GROUPS.map((bg) => {
          const units = current.bloodBank?.[bg] ?? 0;
          return (
            <div key={bg} className="p-3 rounded-xl bg-bg-app border border-border-subtle flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-emergency flex items-center gap-1">
                  <Droplet className="w-3 h-3" /> {bg}
                </p>
                <p className="font-display font-bold text-base">{units} u</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => adjustField(`bloodBank.${bg}`, -1, units)}
                  className="p-1 rounded-md bg-surface border border-border-subtle hover:bg-bg-app cursor-pointer"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <button
                  onClick={() => adjustField(`bloodBank.${bg}`, 1, units)}
                  className="p-1 rounded-md bg-surface border border-border-subtle hover:bg-bg-app cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}