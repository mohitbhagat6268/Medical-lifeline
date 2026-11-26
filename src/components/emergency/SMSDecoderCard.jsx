import { useState } from 'react';
import { MessageSquareCode, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';
import { decodeSOSPayload } from '../../services/payloadCodec';
import { useEmergency } from '../../context/EmergencyContext';

export default function SMSDecoderCard() {
  const { triggerSOS } = useEmergency();
  const [rawInput, setRawInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleDecodeAndLog = async (e) => {
    e.preventDefault();
    if (!rawInput.trim()) return;

    try {
      setSubmitting(true);
      const decoded = decodeSOSPayload(rawInput);
      await triggerSOS(decoded);
      toast.success(`Decoded SMS from ${decoded.patientId} and added to Triage Queue!`);
      setRawInput('');
    } catch (err) {
      toast.error(err.message || 'Could not decode SMS payload.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-surface border border-border-subtle rounded-xl p-5 shadow-xs">
      <div className="flex items-center gap-2 mb-2">
        <MessageSquareCode className="w-4 h-4 text-secondary" />
        <h2 className="font-display font-semibold text-sm">Offline SMS Payload Decoder</h2>
      </div>
      <p className="text-xs text-text-muted mb-3">
        Paste an incoming <code className="font-mono text-primary">ML1|...</code> emergency SMS string to decode GPS coordinates and log it directly into the live console.
      </p>

      <form onSubmit={handleDecodeAndLog} className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value)}
          placeholder="e.g. ML1|PT1024|B+|C1|21.1458,79.0882"
          className="flex-1 px-3 py-2 rounded-lg border border-border-subtle font-mono text-xs focus:outline-none focus:border-primary"
        />
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-secondary text-white text-xs font-semibold hover:bg-secondary/90 disabled:opacity-50 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{submitting ? 'Decoding...' : 'Decode & Log SOS'}</span>
        </button>
      </form>
    </div>
  );
}