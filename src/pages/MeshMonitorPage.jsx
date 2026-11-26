import { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { runMeshRelaySimulation } from '../services/meshSimulator';

const NODES = [
  { id: 'patient', label: 'Patient Device', x: 90, y: 150, defaultStatus: 'Connected' },
  { id: 'peer1', label: 'Nearby Peer #04', x: 260, y: 80, defaultStatus: 'Connected' },
  { id: 'volunteer', label: 'Volunteer #11', x: 260, y: 220, defaultStatus: 'Connected' },
  { id: 'gateway', label: 'Internet Gateway', x: 450, y: 150, defaultStatus: 'Gateway' },
  { id: 'hospital', label: 'Hospital Server', x: 640, y: 150, defaultStatus: 'Connected' },
];

const EDGES = [
  ['patient', 'peer1'],
  ['patient', 'volunteer'],
  ['peer1', 'gateway'],
  ['volunteer', 'gateway'],
  ['gateway', 'hospital'],
];

const STATUS_COLORS = {
  Connected: '#0D9488',
  'Relaying Signal': '#EF4444',
  Disconnected: '#94A3B8',
  Gateway: '#2563EB',
};

export default function MeshMonitorPage() {
  const [activeHop, setActiveHop] = useState(-1);
  const [logs, setLogs] = useState([]);

  const startDemo = () => {
    setLogs([]);
    setActiveHop(0);
    runMeshRelaySimulation((update) => {
      setActiveHop(update.stepIndex);
      setLogs((prev) => [update, ...prev]);
    });
  };

  const getNodeStatus = (id, idx) => {
    if (activeHop >= idx && activeHop !== -1) return 'Relaying Signal';
    return NODES.find((n) => n.id === id).defaultStatus;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Bluetooth Mesh Network Monitor</h1>
          <p className="text-sm text-text-muted">
            Interactive P2P hop visualizer (simulated demo data — not live BLE hardware).
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={startDemo}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90"
          >
            <Play className="w-4 h-4" /> Simulate SOS Relay
          </button>
          <button
            onClick={() => { setActiveHop(-1); setLogs([]); }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface border border-border-subtle text-sm font-medium hover:bg-bg-app"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>
      </div>

      {/* Topology Canvas */}
      <div className="bg-surface border border-border-subtle rounded-xl p-6 overflow-x-auto">
        <svg viewBox="0 0 740 300" className="w-full min-w-[600px] h-72">
          {EDGES.map(([fromId, toId]) => {
            const from = NODES.find((n) => n.id === fromId);
            const to = NODES.find((n) => n.id === toId);
            const isRelaying = activeHop >= 1;
            return (
              <line
                key={`${fromId}-${toId}`}
                x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                stroke={isRelaying ? '#2563EB' : '#CBD5E1'}
                strokeWidth={isRelaying ? 3 : 2}
                strokeDasharray={isRelaying ? '6 4' : 'none'}
              />
            );
          })}

          {NODES.map((node, idx) => {
            const status = getNodeStatus(node.id, idx);
            const color = STATUS_COLORS[status];
            return (
              <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                <circle r="24" fill="#FFFFFF" stroke={color} strokeWidth="3" />
                <circle r="8" fill={color} />
                <text y="42" textAnchor="middle" className="text-xs font-semibold fill-slate-900">
                  {node.label}
                </text>
                <text y="58" textAnchor="middle" className="text-[11px] fill-slate-500">
                  {status}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Transmission Log */}
      <div className="bg-surface border border-border-subtle rounded-xl p-6">
        <h2 className="font-display font-semibold mb-3">Signal Transmission Log</h2>
        {logs.length === 0 ? (
          <p className="text-sm text-text-muted">Click "Simulate SOS Relay" to inspect packet hops.</p>
        ) : (
          <ul className="divide-y divide-border-subtle text-sm">
            {logs.map((log) => (
              <li key={log.id} className="py-2.5 flex justify-between">
                <span><strong>{log.label}</strong> — {log.node}</span>
                <span className="text-text-muted">{log.timestamp}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}