import { Copy, MessageSquareWarning, Radio } from 'lucide-react';
import { toast } from 'sonner';
import { buildSmsUri, encodeSOSPayload, getByteSize } from '../../services/payloadCodec';

const EMERGENCY_GATEWAY_NUMBER = '+91108'; // Replace with your hospital SMS gateway number

export default function SMSFallbackCard({ patientProfile, activeSOS }) {
  const sourceData = {
    patientId: activeSOS?.patientId || patientProfile.patientId,
    bloodGroup: activeSOS?.bloodGroup || patientProfile.bloodGroup,
    type: activeSOS?.type || 'Cardiac Distress',
    location: activeSOS?.location || { lat: 21.1458, lng: 79.0882, label: 'Nagpur Sector 4' },
  };

  const compactPayload = encodeSOSPayload(sourceData);
  const compactBytes = getByteSize(compactPayload);
  const rawJsonBytes = getByteSize(JSON.stringify({ ...sourceData, ...patientProfile }));
  const savingsPct = Math.round(((rawJsonBytes - compactBytes) / rawJsonBytes) * 100);
  const smsLink = buildSmsUri(EMERGENCY_GATEWAY_NUMBER, compactPayload);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(compactPayload);
    toast.success('Compact SOS payload copied! Paste it into the Hospital SMS Decoder.');
  };

  return (
    <div className="bg-surface border border-border-subtle rounded-xl p-6 shadow-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-primary" />
          <h3 className="font-display font-semibold text-sm">Low-Bandwidth Packet & SMS Fallback</h3>
        </div>
        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-green-50 text-success border border-green-200">
          {compactBytes} bytes ({savingsPct}% smaller than JSON)
        </span>
      </div>

      <p className="text-xs text-text-muted">
        No internet or nearby BLE gateway? Send this ultra-compact packet over standard 2G SMS.
      </p>

      <div className="p-3 rounded-lg bg-bg-app border border-border-subtle font-mono text-xs text-text-main break-all flex items-center justify-between gap-2">
        <span>{compactPayload}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="p-1.5 rounded-md hover:bg-surface text-text-muted hover:text-primary shrink-0 cursor-pointer"
          title="Copy payload"
        >
          <Copy className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <a
          href={smsLink}
          className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-secondary text-white text-xs font-semibold hover:bg-secondary/90 transition-colors"
        >
          <MessageSquareWarning className="w-4 h-4" />
          <span>Send via Offline SMS</span>
        </a>
        <button
          type="button"
          onClick={handleCopy}
          className="px-4 py-2.5 rounded-lg border border-border-subtle text-xs font-semibold text-text-main hover:bg-bg-app cursor-pointer"
        >
          Copy Packet
        </button>
      </div>
    </div>
  );
}