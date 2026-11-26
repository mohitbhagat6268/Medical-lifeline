import { useState } from 'react';
import { Phone, Truck } from 'lucide-react';
import { toast } from 'sonner';

const INITIAL_FLEET = [
  { id: 'AMB-01', type: 'ICU Advanced Life Support', driver: 'Rakesh Verma', location: 'City General Hub', status: 'Available' },
  { id: 'AMB-04', type: 'Rapid Response Van', driver: 'Sunil Patil', location: 'Sector 4 Highway', status: 'Dispatched' },
  { id: 'AMB-07', type: 'Basic Life Support', driver: 'Manoj Tiwari', location: 'East Trauma Center', status: 'Available' },
  { id: 'AMB-09', type: 'Cardiac Care Unit', driver: 'Deepak Rao', location: 'Civil Lines Station', status: 'Maintenance' },
];

export default function AmbulancePage() {
  const [fleet, setFleet] = useState(INITIAL_FLEET);

  const toggleStatus = (id) => {
    setFleet((prev) =>
      prev.map((amb) =>
        amb.id === id
          ? { ...amb, status: amb.status === 'Available' ? 'Dispatched' : 'Available' }
          : amb
      )
    );
    toast.success(`Updated status for ${id}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Ambulance Fleet Management</h1>
        <p className="text-sm text-text-muted">Track vehicle readiness and dispatch assignments.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {fleet.map((amb) => (
          <div key={amb.id} className="bg-surface border border-border-subtle rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-base flex items-center gap-2">
                <Truck className="w-4 h-4 text-primary" /> {amb.id}
              </span>
              <span
                className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                  amb.status === 'Available'
                    ? 'bg-green-50 text-success'
                    : amb.status === 'Dispatched'
                    ? 'bg-blue-50 text-primary'
                    : 'bg-slate-100 text-text-muted'
                }`}
              >
                {amb.status}
              </span>
            </div>

            <div className="text-xs text-text-muted space-y-1">
              <p className="font-medium text-text-main">{amb.type}</p>
              <p>Driver: {amb.driver}</p>
              <p>Station: {amb.location}</p>
            </div>

            <div className="pt-2 border-t border-border-subtle flex gap-2">
              <button
                onClick={() => toggleStatus(amb.id)}
                className="flex-1 py-1.5 rounded-lg bg-bg-app border border-border-subtle text-xs font-semibold hover:bg-primary/10 hover:text-primary"
              >
                Toggle Status
              </button>
              <button
                onClick={() => toast.info(`Connecting radio to ${amb.driver} (${amb.id})...`)}
                className="p-1.5 rounded-lg border border-border-subtle text-text-muted hover:text-primary"
              >
                <Phone className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}