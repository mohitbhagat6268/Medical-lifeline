import { useState } from 'react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [autoRelay, setAutoRelay] = useState(true);
  const [shareGps, setShareGps] = useState(true);
  const [fcmAlerts, setFcmAlerts] = useState(true);

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Platform Settings</h1>
        <p className="text-sm text-text-muted">Configure mesh relay preferences and emergency notifications.</p>
      </div>

      <div className="bg-surface border border-border-subtle rounded-xl divide-y divide-border-subtle shadow-xs">
        {[
          {
            title: 'Auto-Relay Nearby SOS Packets (Simulated)',
            desc: 'Allow this device to act as a passive Bluetooth Mesh hop for nearby patients.',
            checked: autoRelay,
            onChange: () => { setAutoRelay(!autoRelay); toast.success('Relay preference updated.'); },
          },
          {
            title: 'Automatic GPS Location Capture',
            desc: 'Attach last known coordinates when triggering an emergency SOS.',
            checked: shareGps,
            onChange: () => { setShareGps(!shareGps); toast.success('GPS preference updated.'); },
          },
          {
            title: 'Push Notifications (FCM)',
            desc: 'Receive instant triage updates when an ambulance is dispatched.',
            checked: fcmAlerts,
            onChange: () => { setFcmAlerts(!fcmAlerts); toast.success('Notification preference updated.'); },
          },
        ].map((item) => (
          <div key={item.title} className="p-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-text-main">{item.title}</p>
              <p className="text-xs text-text-muted mt-0.5">{item.desc}</p>
            </div>
            <input
              type="checkbox"
              checked={item.checked}
              onChange={item.onChange}
              className="w-4 h-4 accent-primary cursor-pointer"
            />
          </div>
        ))}
      </div>
    </div>
  );
}