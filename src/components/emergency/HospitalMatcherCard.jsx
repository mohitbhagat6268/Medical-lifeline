import { useEffect, useState } from 'react';
import { collection, doc, increment, onSnapshot, updateDoc } from 'firebase/firestore';
import { BedDouble, Building2, CheckCircle2, Droplet, MapPin, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { db } from '../../services/firebase';
import { rankHospitals, seedHospitalsIfEmpty } from '../../services/hospitalMatcher';
import { useEmergency } from '../../context/EmergencyContext';

export default function HospitalMatcherCard({ emergency }) {
  const { updateCaseStatus } = useEmergency();
  const [hospitals, setHospitals] = useState([]);
  const [routingId, setRoutingId] = useState(null);

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

  const ranked = rankHospitals(hospitals, emergency);

  const handleRouteAndReserve = async (hospital) => {
    try {
      setRoutingId(hospital.id);
      if (hospital.icuBeds > 0) {
        await updateDoc(doc(db, 'hospitals', hospital.id), {
          icuBeds: increment(-1),
        });
      }
      await updateCaseStatus(emergency.id, {
        assignedHospital: hospital.name,
        status: 'Dispatched',
      });
      toast.success(`Routed to ${hospital.name} (1 ICU bed reserved).`);
    } catch (err) {
      toast.error('Failed to reserve bed in Firestore.');
    } finally {
      setRoutingId(null);
    }
  };

  return (
    <div className="bg-surface border border-border-subtle rounded-xl p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <h2 className="font-display font-semibold text-sm">Smart Hospital Matcher (Live Inventory)</h2>
        </div>
        <span className="text-[11px] font-medium text-text-muted">
          Matching for <strong className="text-emergency">{emergency.bloodGroup}</strong> + ICU
        </span>
      </div>

      <div className="space-y-3">
        {ranked.map((h, idx) => {
          const isBest = idx === 0 && h.hasICU;
          const isAssigned = emergency.assignedHospital === h.name;

          return (
            <div
              key={h.id}
              className={`p-4 rounded-xl border transition-colors ${
                isBest
                  ? 'bg-primary/5 border-primary/40'
                  : 'bg-bg-app border-border-subtle'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Building2 className="w-4 h-4 text-primary shrink-0" />
                    <span className="font-semibold text-xs text-text-main">{h.name}</span>
                    {isBest && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary text-white">
                        Recommended
                      </span>
                    )}
                    {isAssigned && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-success">
                        <CheckCircle2 className="w-3 h-3" /> Assigned
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-text-muted pt-1">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-primary" /> {h.distanceKm} km away
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 font-semibold ${
                        h.hasICU ? 'text-success' : 'text-emergency'
                      }`}
                    >
                      <BedDouble className="w-3.5 h-3.5" />
                      {h.icuBeds} ICU {h.icuBeds === 1 ? 'Bed' : 'Beds'}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 font-semibold ${
                        h.hasExactBlood ? 'text-secondary' : 'text-amber-600'
                      }`}
                    >
                      <Droplet className="w-3.5 h-3.5" />
                      {emergency.bloodGroup}: {h.exactBloodUnits} units
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={!h.hasICU || routingId === h.id || isAssigned}
                  onClick={() => handleRouteAndReserve(h)}
                  className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 disabled:opacity-45 cursor-pointer shrink-0"
                >
                  {isAssigned
                    ? 'Routed'
                    : !h.hasICU
                    ? 'No ICU Beds'
                    : routingId === h.id
                    ? 'Reserving...'
                    : 'Route & Reserve'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}