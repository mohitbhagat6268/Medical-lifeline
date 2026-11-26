import { useState } from 'react';
import {
  Bluetooth, Check, ExternalLink, MapPin, ShieldCheck, User, X
} from 'lucide-react';
import { toast } from 'sonner';
import { useEmergency } from '../context/EmergencyContext';

export default function VolunteerDashboard() {
  const { requests, updateCaseStatus } = useEmergency();
  const [rejectedIds, setRejectedIds] = useState([]);

  const activeAlerts = requests.filter(
    (r) => r.status !== 'Resolved' && !rejectedIds.includes(r.id)
  );

  const handleAccept = (id) => {
    updateCaseStatus(id, {
      status: 'Volunteer En Route',
      responder: 'Arjun Nair (Certified First-Aid)',
    });
  };

  const handleReject = (id) => {
    setRejectedIds((prev) => [...prev, id]);
    toast.info(`Alert ${id} dismissed from your local queue.`);
  };

  return (
    <div className="space-y-6">
      {/* Header & Volunteer Profile Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Volunteer Response Desk</h1>
          <p className="text-sm text-text-muted">
            Receive nearby P2P Bluetooth Mesh alerts and provide rapid first-aid assistance.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-surface border border-border-subtle rounded-xl px-4 py-2.5 shadow-xs">
          <div className="w-9 h-9 rounded-full bg-secondary/10 text-secondary flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <p className="font-semibold text-text-main flex items-center gap-1">
              Arjun Nair <ShieldCheck className="w-3.5 h-3.5 text-success" />
            </p>
            <p className="text-secondary flex items-center gap-1">
              <Bluetooth className="w-3 h-3" /> BLE Relay Active (Simulated)
            </p>
          </div>
        </div>
      </div>

      {/* Nearby Emergency Alerts */}
      {activeAlerts.length === 0 ? (
        <div className="bg-surface border border-border-subtle rounded-xl p-10 text-center">
          <p className="font-display font-semibold text-base">No Active Nearby Alerts</p>
          <p className="text-xs text-text-muted mt-1">
            Your device is standing by to relay or respond to nearby Bluetooth Mesh SOS signals.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {activeAlerts.map((alert, idx) => {
            const isAccepted = alert.status === 'Volunteer En Route';
            const navUrl = `https://www.google.com/maps/dir/?api=1&destination=${alert.location.lat},${alert.location.lng}`;

            return (
              <div key={alert.id} className="bg-surface border border-border-subtle rounded-xl p-6 shadow-xs flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emergency/10 text-emergency">
                      {alert.type}
                    </span>
                    <span className="text-xs font-semibold text-primary">
                      ~{(0.4 + idx * 0.6).toFixed(1)} km away
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 text-xs text-text-muted">
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary shrink-0" />
                      <strong className="text-text-main">{alert.location.label}</strong>
                    </p>
                    <p>
                      <strong className="text-text-main">Authorized Info Only:</strong> Blood Group{' '}
                      <span className="text-emergency font-bold">{alert.bloodGroup}</span> • Priority: {alert.priority}
                    </p>
                    <p>
                      <strong className="text-text-main">Status:</strong> {alert.status} • Received {alert.receivedAt}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-border-subtle flex flex-wrap gap-2">
                  {!isAccepted ? (
                    <>
                      <button
                        onClick={() => handleAccept(alert.id)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg bg-secondary text-white text-xs font-semibold hover:bg-secondary/90"
                      >
                        <Check className="w-4 h-4" /> Accept Request
                      </button>
                      <button
                        onClick={() => handleReject(alert.id)}
                        className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg border border-border-subtle text-xs font-medium text-text-muted hover:bg-bg-app"
                      >
                        <X className="w-4 h-4" /> Reject
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => updateCaseStatus(alert.id, { status: 'Resolved' })}
                      className="flex-1 py-2 rounded-lg bg-success text-white text-xs font-semibold hover:bg-success/90"
                    >
                      Mark Assistance Complete
                    </button>
                  )}

                  <a
                    href={navUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20"
                  >
                    Navigate <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}