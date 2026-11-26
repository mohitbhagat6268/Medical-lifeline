import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { useEmergency } from '../context/EmergencyContext';

export default function PatientProfilePage() {
  const { patientProfile, updatePatientProfile } = useEmergency();
  const [form, setForm] = useState(patientProfile);

  useEffect(() => {
    setForm(patientProfile);
  }, [patientProfile]);

  const handleSave = async (e) => {
    e.preventDefault();
    await updatePatientProfile(form);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Patient Medical Profile</h1>
        <p className="text-sm text-text-muted">
          This compact medical record is attached to your emergency SOS beacon.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-surface border border-border-subtle rounded-xl p-6 shadow-xs space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1">Full Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-border-subtle text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1">Blood Group</label>
            <select
              value={form.bloodGroup}
              onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-border-subtle text-sm bg-surface"
            >
              {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-muted mb-1">Known Allergies</label>
          <input
            value={form.allergies}
            onChange={(e) => setForm({ ...form, allergies: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-border-subtle text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-muted mb-1">Medical Conditions</label>
          <textarea
            rows={3}
            value={form.conditions}
            onChange={(e) => setForm({ ...form, conditions: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-border-subtle text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-muted mb-1">Emergency Contact</label>
          <input
            value={form.emergencyContact}
            onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-border-subtle text-sm"
          />
        </div>

        <button
          type="submit"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90"
        >
          <Save className="w-4 h-4" /> Save Medical Profile
        </button>
      </form>
    </div>
  );
}