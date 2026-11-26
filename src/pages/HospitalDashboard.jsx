import { getTriageLevel, TRIAGE_STYLES } from '../services/triageEngine';
import SMSDecoderCard from '../components/emergency/SMSDecoderCard';
import { useState } from 'react';
import { Link } from 'react-router';
import {
  Activity, AlertCircle, Clock, Eye, Search, Truck
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { useEmergency } from '../context/EmergencyContext';
import HospitalInventoryCard from '../components/emergency/HospitalInventoryCard';
const HOURLY_DATA = [
  { time: '06:00', alerts: 2 },
  { time: '08:00', alerts: 5 },
  { time: '10:00', alerts: 8 },
  { time: '12:00', alerts: 6 },
  { time: '14:00', alerts: 11 },
  { time: '16:00', alerts: 7 },
  { time: '18:00', alerts: 9 },
];

const STATUS_BADGE = {
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  Relaying: 'bg-red-50 text-emergency border-red-200',
  'Hospital Notified': 'bg-blue-50 text-primary border-blue-200',
  Dispatched: 'bg-teal-50 text-secondary border-teal-200',
  'Volunteer En Route': 'bg-teal-50 text-secondary border-teal-200',
  Resolved: 'bg-green-50 text-success border-green-200',
};

export default function HospitalDashboard() {
  const { requests } = useEmergency();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const totalCases = requests.length;
  const activeSOS = requests.filter((r) => r.status !== 'Resolved').length;
  const pendingCount = requests.filter((r) => r.status === 'Pending' || r.status === 'Relaying').length;
  const dispatchedCount = requests.filter((r) => r.assignedAmbulance).length;
  const ambulancesAvailable = Math.max(0, 8 - dispatchedCount);

 const filteredRequests = requests
  .filter((req) => {
    const matchesStatus = statusFilter === 'All' || req.status === statusFilter;
    const query = search.toLowerCase();
    const matchesSearch =
      req.patientId.toLowerCase().includes(query) ||
      req.type.toLowerCase().includes(query) ||
      req.location.label.toLowerCase().includes(query) ||
      req.bloodGroup.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  })
  .sort((a, b) => {
    if (a.status === 'Resolved' && b.status !== 'Resolved') return 1;
    if (a.status !== 'Resolved' && b.status === 'Resolved') return -1;
    const scoreA = TRIAGE_STYLES[getTriageLevel(a)].score;
    const scoreB = TRIAGE_STYLES[getTriageLevel(b)].score;
    return scoreB - scoreA;
  });

  const kpis = [
    { label: 'Total Emergency Cases', value: totalCases, icon: Activity, color: 'text-primary bg-primary/10' },
    { label: 'Active SOS Alerts', value: activeSOS, icon: AlertCircle, color: 'text-emergency bg-emergency/10' },
    { label: 'Pending Requests', value: pendingCount, icon: Clock, color: 'text-amber-600 bg-amber-100' },
    { label: 'Ambulances Available', value: `${ambulancesAvailable} / 8`, icon: Truck, color: 'text-secondary bg-secondary/10' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Hospital Triage Console</h1>
        <p className="text-sm text-text-muted">
          Monitor incoming Bluetooth Mesh SOS alerts, assign ambulances, and coordinate responders.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-surface border border-border-subtle rounded-xl p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-text-muted">{label}</p>
              <p className="font-display text-2xl font-bold mt-1">{value}</p>
            </div>
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Chart */}
      <div className="bg-surface border border-border-subtle rounded-xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display font-semibold text-base">Incoming SOS Signal Volume</h2>
            <p className="text-xs text-text-muted">Illustrative hourly mesh gateway alerts</p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-bg-app border border-border-subtle text-text-muted">
            Demo Data
          </span>
        </div>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={HOURLY_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="time" tick={{ fontSize: 12, fill: '#64748B' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="alerts"
                stroke="#2563EB"
                strokeWidth={2}
                fill="#2563EB"
                fillOpacity={0.12}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <HospitalInventoryCard />
      <SMSDecoderCard />
      {/* Emergency Requests Table */}
      <div className="bg-surface border border-border-subtle rounded-xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="font-display font-semibold text-base">Recent Emergency Requests</h2>

          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search ID, type, location..."
                className="pl-9 pr-3 py-2 rounded-lg border border-border-subtle text-xs focus:outline-none focus:border-primary w-56"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-border-subtle text-xs bg-surface focus:outline-none focus:border-primary"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Relaying">Relaying</option>
              <option value="Hospital Notified">Hospital Notified</option>
              <option value="Dispatched">Dispatched</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-bg-app text-text-muted border-b border-border-subtle uppercase">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Patient ID</th>
                <th className="px-5 py-3.5 font-semibold">Emergency Type</th>
                <th className="px-5 py-3.5 font-semibold">Location</th>
                <th className="px-5 py-3.5 font-semibold">Blood</th>
                <th className="px-5 py-3.5 font-semibold">Priority</th>
                <th className="px-5 py-3.5 font-semibold">Received</th>
                <th className="px-5 py-3.5 font-semibold">Status</th>
                <th className="px-5 py-3.5 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-5 py-8 text-center text-text-muted">
                    No emergency requests match your search or filter.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-bg-app/60 transition-colors">
                    <td className="px-5 py-4">
  {(() => {
    const level = getTriageLevel(req);
    const style = TRIAGE_STYLES[level];
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border font-semibold ${style.badge}`}>
        <span className={`w-2 h-2 rounded-full ${style.dot}`} />
        {level} ({req.priority})
      </span>
    );
  })()}
</td>
                    <td className="px-5 py-4 font-medium">{req.type}</td>
                    <td className="px-5 py-4 text-text-muted">{req.location.label}</td>
                    <td className="px-5 py-4 font-bold text-emergency">{req.bloodGroup}</td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-0.5 rounded-full bg-emergency/10 text-emergency font-semibold">
                        {req.priority}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-text-muted">{req.receivedAt}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full border font-medium ${STATUS_BADGE[req.status] || 'bg-bg-app text-text-muted border-border-subtle'}`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        to={`/emergencies/${req.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white font-medium hover:bg-primary/90"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Details
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}