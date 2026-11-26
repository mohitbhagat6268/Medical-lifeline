import SMSFallbackCard from '../components/emergency/SMSFallbackCard';
import { useEffect, useRef, useState } from 'react';
import {
  AlertCircle, Bluetooth, Droplet, MapPin, Phone, ShieldAlert, Smartphone
} from 'lucide-react';
import { useEmergency } from '../context/EmergencyContext';
import { checkWebBluetoothSupport, runMeshRelaySimulation } from '../services/meshSimulator';
import SOSModal from '../components/emergency/SOSModal';
import SOSTimeline from '../components/emergency/SOSTimeline';
import { Mic, MicOff } from 'lucide-react';
import { toast } from 'sonner';
import { calculateTriage } from '../services/triageEngine';
import {
  detectEmergencyFromSpeech,
  isVoiceRecognitionSupported,
  speakText,
  startVoiceListener,
} from '../services/voiceService';

const NEARBY_DEVICES = [
  { id: 'NODE-04', name: 'Peer Smartphone #04', distance: '12m', rssi: '-58 dBm', role: 'Relay' },
  { id: 'NODE-11', name: 'Volunteer Device #11', distance: '24m', rssi: '-66 dBm', role: 'Responder' },
  { id: 'GW-02', name: 'Community Gateway #02', distance: '45m', rssi: '-74 dBm', role: 'Internet Gateway' },
];

export default function PatientDashboard() {
  const { activeSOS, patientProfile, triggerSOS, updateCaseStatus } = useEmergency();
  const [modalOpen, setModalOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(-1);
  const [logs, setLogs] = useState([]);
  const [listening, setListening] = useState(false);
const [lastTranscript, setLastTranscript] = useState('');
const stopVoiceRef = useRef(null);

const handleVoiceSOS = () => {
  if (listening) {
    stopVoiceRef.current?.();
    setListening(false);
    return;
  }

  if (!isVoiceRecognitionSupported()) {
    toast.error('Voice SOS requires Chrome or Edge.');
    return;
  }

  setListening(true);
  setLastTranscript('');
  toast.info('Listening... Say e.g. "Emergency cardiac arrest" or "Road accident"');

  stopVoiceRef.current = startVoiceListener({
    onResult: (transcript) => {
      setLastTranscript(transcript);
      const detected = detectEmergencyFromSpeech(transcript);
      const triage = calculateTriage(detected);

      speakText(`Emergency S O S triggered for ${detected.type}. Broadcasting now.`);
      handleConfirmSOS({
        type: detected.type,
        location: { lat: 21.1458, lng: 79.0882, label: 'Voice SOS (Last Known GPS)' },
        triage,
      });
    },
    onError: (msg) => toast.error(msg),
    onEnd: () => setListening(false),
  });
};
  const cleanupRef = useRef(null);

  const webBleSupported = checkWebBluetoothSupport();

  useEffect(() => {
    return () => {
      if (cleanupRef.current) cleanupRef.current();
    };
  }, []);

  const handleConfirmSOS = async ({ type, location, triage }) => {
  const newCase = await triggerSOS({
    patientName: patientProfile.name,
    bloodGroup: patientProfile.bloodGroup,
    type,
    location,
    triage,
  });

    setLogs([]);
    setStepIndex(0);

    if (cleanupRef.current) cleanupRef.current();
    cleanupRef.current = runMeshRelaySimulation((update) => {
      setStepIndex(update.stepIndex);
      setLogs((prev) => [...prev, update]);

      if (update.id === 5) {
        updateCaseStatus(newCase.id, { status: 'Hospital Notified', hops: 3 });
      }
      if (update.id === 6) {
        updateCaseStatus(newCase.id, { status: 'Dispatched', assignedAmbulance: 'AMB-04' });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Patient Emergency Dashboard</h1>
          <p className="text-sm text-text-muted">
            Offline-capable SOS trigger with peer-to-peer Bluetooth Mesh relay.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface border border-border-subtle text-xs font-medium">
          <Bluetooth className="w-4 h-4 text-primary" />
          <span>
            Web Bluetooth: {webBleSupported ? 'Browser Supported' : 'Simulated Mode'}
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Medical Info & Nearby Mesh Peers */}
        <div className="space-y-6">
          <div className="bg-surface border border-border-subtle rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-semibold text-base">{patientProfile.name}</h2>
                <p className="text-xs text-text-muted">Patient ID: {patientProfile.patientId}</p>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emergency/10 text-emergency text-xs font-bold">
                <Droplet className="w-3.5 h-3.5" /> {patientProfile.bloodGroup}
              </span>
            </div>

            <div className="pt-3 border-t border-border-subtle space-y-2.5 text-xs">
              <div className="flex items-start gap-2 text-text-muted">
                <ShieldAlert className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <span><strong className="text-text-main">Conditions:</strong> {patientProfile.conditions}</span>
              </div>
              <div className="flex items-center gap-2 text-text-muted">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span><strong className="text-text-main">Emergency Contact:</strong> {patientProfile.emergencyContact}</span>
              </div>
              <div className="flex items-center gap-2 text-text-muted">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span><strong className="text-text-main">Location:</strong> Nagpur Sector 4</span>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-border-subtle rounded-xl p-6 shadow-xs">
            <h3 className="font-display font-semibold text-sm mb-3">Nearby Mesh Devices (Simulated)</h3>
            <ul className="space-y-3">
              {NEARBY_DEVICES.map((dev) => (
                <li key={dev.id} className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-bg-app border border-border-subtle">
                  <div className="flex items-center gap-2.5">
                    <Smartphone className="w-4 h-4 text-secondary" />
                    <div>
                      <p className="font-medium text-text-main">{dev.name}</p>
                      <p className="text-text-muted">{dev.role} • {dev.distance}</p>
                    </div>
                  </div>
                  <span className="font-mono text-[11px] text-success">{dev.rssi}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: SOS Trigger & Live Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface border border-border-subtle rounded-xl p-8 shadow-xs flex flex-col items-center text-center">
            <button
              onClick={() => setModalOpen(true)}
              className="w-40 h-40 rounded-full bg-emergency text-white font-display font-extrabold text-2xl shadow-lg hover:bg-emergency/90 active:scale-95 transition-all flex flex-col items-center justify-center gap-1.5 ring-8 ring-emergency/15 cursor-pointer"
            >
              <AlertCircle className="w-9 h-9" />
              <span>SOS</span>
            </button>

            <h2 className="font-display font-bold text-lg mt-5">
              {activeSOS ? `Active Alert: ${activeSOS.id} (${activeSOS.type})` : 'Press SOS for Immediate Medical Help'}
            </h2>
            <p className="text-xs text-text-muted max-w-md mt-1.5">
              Works without mobile data by relaying your encrypted emergency packet through nearby Bluetooth Mesh devices.
            </p>
            <button
  type="button"
  onClick={handleVoiceSOS}
  className={`mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
    listening
      ? 'bg-emergency/10 border-emergency text-emergency animate-pulse'
      : 'bg-bg-app border-border-subtle text-text-main hover:border-primary hover:text-primary'
  }`}
>
  {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
  <span>{listening ? 'Listening... Tap to Cancel' : 'Hands-Free Voice SOS'}</span>
</button>

{lastTranscript && (
  <p className="mt-2 text-[11px] text-text-muted">
    Heard: <span className="font-medium text-text-main">"{lastTranscript}"</span>
  </p>
)}
          </div>

          <SOSTimeline currentStepIndex={stepIndex} logs={logs} />
          <SMSFallbackCard patientProfile={patientProfile} activeSOS={activeSOS} />
        </div>
      </div>

      <SOSModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmSOS}
      />
    </div>
  );
}