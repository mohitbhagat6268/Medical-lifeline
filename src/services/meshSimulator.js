export const MESH_STEPS = [
  { id: 1, label: 'SOS Created', node: 'Patient Device (BLE)', delay: 0 },
  { id: 2, label: 'Signal Broadcasting', node: 'Scanning 2.4GHz BLE Peers', delay: 1200 },
  { id: 3, label: 'Nearby Device Connected', node: 'Peer Node #04 (18m away)', delay: 2600 },
  { id: 4, label: 'Signal Relayed', node: 'Volunteer Node #11 -> Gateway #02', delay: 4200 },
  { id: 5, label: 'Hospital Notified', node: 'City General Triage Server', delay: 5800 },
  { id: 6, label: 'Assistance Dispatched', node: 'Ambulance AMB-04 En Route', delay: 7500 },
];

export function checkWebBluetoothSupport() {
  return typeof navigator !== 'undefined' && 'bluetooth' in navigator;
}

/**
 * Simulates multi-hop Bluetooth Mesh propagation for web demonstration.
 * Note: True background P2P BLE Mesh requires a native Android/iOS client.
 */
export function runMeshRelaySimulation(onStepUpdate) {
  const timers = MESH_STEPS.map((step, index) =>
    setTimeout(() => {
      onStepUpdate({
        stepIndex: index,
        ...step,
        timestamp: new Date().toLocaleTimeString(),
      });
    }, step.delay)
  );

  // Return cleanup function to cancel timers if unmounted
  return () => timers.forEach(clearTimeout);
}