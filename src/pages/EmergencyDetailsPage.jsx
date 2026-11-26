import HospitalMatcherCard from '../components/emergency/HospitalMatcherCard';
import { useState } from 'react';
import { Link, useParams } from 'react-router';
import {
  ArrowLeft, CheckCircle2, Droplet, Phone, Radio, ShieldAlert, Truck, UserCheck
} from 'lucide-react';
import { toast } from 'sonner';
import { useEmergency } from '../context/EmergencyContext';
import LiveLocationMap from '../components/maps/LiveLocationMap';

const AMBULANCES = ['AMB-01 (ICU Van)', 'AMB-04 (Rapid Response)', 'AMB-07 (Basic Life Support)'];
const RESPONDERS = ['Dr. Meera Kulkarni', 'Paramedic Vikram Joshi', 'Volunteer Arjun Nair'];

export default function EmergencyDetailsPage() {
  const { id } = useParams();
  const { requests, updateCaseStatus } = useEmergency();
  const emergency = requests.find((r) => r.id === id);

  const [ambulance, setAmbulance] = useState(emergency?.assignedAmbulance || AMBULANCES[0]);
  const [responder, setResponder] = useState(emergency?.responder || RESPONDERS[0]);

  if (!emergency) {
    return (
      <div className="bg-surface border border-border-subtle rounded-xl p-8 text-center">
        <p className="font-display font-semibold">Emergency case "{id}" not found.</p>
        <Link to="/hospital" className="text-sm text-primary hover:underline mt-2 inline-block">
          Return to Hospital Console
        </Link>
      </div>
    );
  }

  const handleAssign = () => {
    updateCaseStatus(emergency.id, {
      status: 'Dispatched',
      assignedAmbulance: ambulance,
      responder,
    });
  };

  const handleAccept = () => {
    updateCaseStatus(emergency.id, { status: 'Hospital Notified' });
  };

  const handleResolve = () => {
    updateCaseStatus(emergency.id, { status: 'Resolved' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link to="/hospital" className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-main mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Hospital Console
          </Link>
          <h1 className="font-display text-2xl font-bold flex items-center gap-3">
            <span>Case {emergency.id} — {emergency.type}</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emergency/10 text-emergency font-semibold">
              {emergency.status}
            </span>
          </h1>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleAccept}
            className="px-4 py-2 rounded-lg bg-surface border border-border-subtle text-xs font-semibold hover:bg-bg-app"
          >
            Accept Request
          </button>
          <button
            onClick={handleResolve}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-success text-white text-xs font-semibold hover:bg-success/90"
          >
            <CheckCircle2 className="w-4 h-4" /> Mark Resolved
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Patient Info & Dispatch Controls */}
        <div className="space-y-6">
          <div className="bg-surface border border-border-subtle rounded-xl p-6 shadow-xs space-y-3 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <div>
                <p className="font-display font-bold text-base">{emergency.patientName}</p>
                <p className="text-text-muted">Patient ID: {emergency.patientId}</p>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emergency/10 text-emergency font-bold">
                <Droplet className="w-3.5 h-3.5" /> {emergency.bloodGroup}
              </span>
            </div>

            <div className="flex items-start gap-2 text-text-muted">
              <ShieldAlert className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
              <span><strong className="text-text-main">Medical Notes:</strong> {emergency.medicalNotes}</span>
            </div>
            <div className="flex items-center gap-2 text-text-muted">
              <Phone className="w-4 h-4 text-primary shrink-0" />
              <span><strong className="text-text-main">Emergency Contact:</strong> {emergency.emergencyContact}</span>
            </div>
          </div>

          {/* Dispatch Assignment Card */}
          <div className="bg-surface border border-border-subtle rounded-xl p-6 shadow-xs space-y-4">
            <h2 className="font-display font-semibold text-sm">Dispatch & Assignment</h2>

            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Assign Ambulance</label>
              <select
                value={ambulance}
                onChange={(e) => setAmbulance(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border-subtle text-xs bg-surface"
              >
                {AMBULANCES.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Assign Medical Responder</label>
              <select
                value={responder}
                onChange={(e) => setResponder(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border-subtle text-xs bg-surface"
              >
                {RESPONDERS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={handleAssign}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90"
              >
                <Truck className="w-4 h-4" /> Assign & Dispatch
              </button>
              <button
                onClick={() => toast.info(`Calling ${responder} via emergency dispatch channel...`)}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg border border-border-subtle text-xs font-semibold hover:bg-bg-app"
              >
                <UserCheck className="w-4 h-4 text-secondary" /> Contact
              </button>
            </div>
          </div>
        </div>

        {/* Right: Map & Signal Transmission History */}
        <div className="lg:col-span-2 space-y-6">
            <HospitalMatcherCard emergency={emergency} />
          <div className="bg-surface border border-border-subtle rounded-xl p-6 shadow-xs">
            <h2 className="font-display font-semibold text-sm mb-3">
              Emergency Location — {emergency.location.label}
            </h2>
            <LiveLocationMap
              lat={emergency.location.lat}
              lng={emergency.location.lng}
              label={`${emergency.patientName} (${emergency.type})`}
            />
          </div>

          <div className="bg-surface border border-border-subtle rounded-xl p-6 shadow-xs">
            <h2 className="font-display font-semibold text-sm mb-4">Signal Transmission History (Simulated BLE Mesh)</h2>
            <ul className="space-y-3 text-xs">
              {[
                { hop: 'Origin', node: `Patient Device (${emergency.patientId})`, detail: 'SOS packet encrypted & broadcast' },
                { hop: 'Hop 1', node: 'Peer Device #04 (-58 dBm)', detail: 'Relayed via Bluetooth Mesh' },
                { hop: 'Hop 2', node: 'Community Gateway #02', detail: 'Forwarded to Hospital Cloud API' },
                { hop: 'Received', node: 'Hospital Triage Console', detail: `Logged at ${emergency.receivedAt}` },
              ].map((item) => (
                <li key={item.hop} className="flex items-center justify-between p-3 rounded-lg bg-bg-app border border-border-subtle">
                  <div className="flex items-center gap-2.5">
                    <Radio className="w-4 h-4 text-primary" />
                    <div>
                      <p className="font-semibold text-text-main">{item.hop}: {item.node}</p>
                      <p className="text-text-muted">{item.detail}</p>
                    </div>
                  </div>
                  <span className="text-success font-medium">Verified</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}