import { Link } from 'react-router';
import {
  Activity, AlertCircle, ArrowRight, Bluetooth, Building2,
  HeartPulse, Lock, MapPin, Network, Radio, ShieldCheck, Users, WifiOff
} from 'lucide-react';

const STEPS = [
  { num: '01', title: 'Patient Triggers SOS', desc: 'One-tap emergency alert works with zero cellular or Wi-Fi signal.' },
  { num: '02', title: 'Nearby Devices Receive', desc: 'Surrounding smartphones pick up the encrypted Bluetooth beacon.' },
  { num: '03', title: 'P2P Mesh Relay', desc: 'The packet hops device-to-device across the local mesh network.' },
  { num: '04', title: 'Gateway Forwards Alert', desc: 'The first internet-connected peer uploads the payload to the server.' },
  { num: '05', title: 'Hospital & Responders Act', desc: 'Triage staff dispatch ambulances and alert nearby verified volunteers.' },
];

const FEATURES = [
  { icon: WifiOff, title: 'Offline Emergency SOS', desc: 'Trigger critical medical alerts in dead zones, basements, or disaster areas.' },
  { icon: Bluetooth, title: 'P2P Bluetooth Mesh', desc: 'Decentralized multi-hop relay between nearby devices without cell towers.' },
  { icon: Activity, title: 'Real-Time Tracking', desc: 'Live 6-stage signal delivery timeline from broadcast to ambulance dispatch.' },
  { icon: Building2, title: 'Hospital Notification', desc: 'Instant triage alerts with blood group, priority level, and medical history.' },
  { icon: Users, title: 'Nearby Volunteer Assist', desc: 'Certified first-aid volunteers within range receive immediate distance alerts.' },
  { icon: Radio, title: 'Low-Bandwidth Payload', desc: 'Compact vital and GPS packets engineered for constrained connections.' },
  { icon: MapPin, title: 'Emergency Location', desc: 'Automatic coordinate capture with interactive map routing for responders.' },
  { icon: Lock, title: 'Secure Patient Data', desc: 'Role-based access ensures volunteers only see authorized emergency details.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-app text-text-main">
      {/* Navbar */}
      <header className="sticky top-0 z-30 bg-surface/95 backdrop-blur border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg text-primary">
            <Activity className="w-6 h-6" />
            <span>Medical Lifeline</span>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-text-muted">
            <a href="#how-it-works" className="hover:text-text-main transition-colors">How It Works</a>
            <a href="#features" className="hover:text-text-main transition-colors">Features</a>
            <Link to="/hospital" className="hover:text-text-main transition-colors">Hospitals</Link>
            <Link to="/mesh-monitor" className="hover:text-text-main transition-colors">Mesh Monitor</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/auth" className="text-sm font-medium text-text-muted hover:text-text-main px-3 py-2">
              Login / Register
            </Link>
            <Link
              to="/patient"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emergency text-white text-sm font-semibold hover:bg-emergency/90 transition-colors"
            >
              <AlertCircle className="w-4 h-4" />
              Emergency SOS
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-5">
            <Bluetooth className="w-3.5 h-3.5" /> Decentralized P2P Emergency Network
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-text-main leading-tight">
            Emergency Help, Even Without Internet.
          </h1>
          <p className="mt-5 text-lg text-text-muted leading-relaxed">
            Connecting patients, volunteers, ambulances, and hospitals through decentralized Bluetooth Mesh communication.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/patient"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-emergency text-white font-semibold text-sm hover:bg-emergency/90 transition-colors shadow-xs"
            >
              Request Emergency Help <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-surface border border-border-subtle text-text-main font-semibold text-sm hover:bg-bg-app transition-colors"
            >
              Explore How It Works
            </a>
          </div>
        </div>

        {/* Clean Mesh Illustration Card */}
        <div className="bg-surface border border-border-subtle rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">P2P Mesh Relay Architecture</span>
            <span className="text-xs font-medium text-secondary bg-secondary/10 px-2.5 py-1 rounded-full">Zero-Internet Ready</span>
          </div>
          <svg viewBox="0 0 500 260" className="w-full h-60">
            <line x1="75" y1="130" x2="195" y2="65" stroke="#2563EB" strokeWidth="2.5" strokeDasharray="5 4" />
            <line x1="75" y1="130" x2="195" y2="195" stroke="#0D9488" strokeWidth="2.5" strokeDasharray="5 4" />
            <line x1="195" y1="65" x2="325" y2="130" stroke="#2563EB" strokeWidth="2.5" />
            <line x1="195" y1="195" x2="325" y2="130" stroke="#0D9488" strokeWidth="2.5" />
            <line x1="325" y1="130" x2="435" y2="130" stroke="#16A34A" strokeWidth="3" />

            {[
              { x: 75, y: 130, label: 'Patient SOS', color: '#EF4444' },
              { x: 195, y: 65, label: 'Peer Device', color: '#2563EB' },
              { x: 195, y: 195, label: 'Volunteer', color: '#0D9488' },
              { x: 325, y: 130, label: 'Gateway', color: '#2563EB' },
              { x: 435, y: 130, label: 'Hospital', color: '#16A34A' },
            ].map((n) => (
              <g key={n.label} transform={`translate(${n.x}, ${n.y})`}>
                <circle r="22" fill="#FFFFFF" stroke={n.color} strokeWidth="3" />
                <circle r="7" fill={n.color} />
                <text y="38" textAnchor="middle" className="text-[11px] font-semibold fill-slate-800">{n.label}</text>
              </g>
            ))}
          </svg>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-surface border-y border-border-subtle py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-center">How It Works</h2>
          <p className="text-text-muted text-center mt-2 max-w-2xl mx-auto text-sm">
            Five automated stages move an SOS alert from an offline patient to an emergency dispatch desk.
          </p>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {STEPS.map((s) => (
              <div key={s.num} className="p-5 rounded-xl bg-bg-app border border-border-subtle">
                <span className="text-xs font-bold text-primary">{s.num}</span>
                <h3 className="font-display font-semibold text-sm mt-2">{s.title}</h3>
                <p className="text-xs text-text-muted mt-1.5 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-center">Core Platform Capabilities</h2>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-5 rounded-xl bg-surface border border-border-subtle hover:border-primary/40 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-display font-semibold text-sm">{title}</h3>
              <p className="text-xs text-text-muted mt-1.5 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Illustrative Statistics */}
      <section className="bg-surface border-y border-border-subtle py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-8">
            <h2 className="font-display text-xl font-bold">Network Readiness Overview</h2>
            <span className="text-xs text-text-muted bg-bg-app border border-border-subtle px-3 py-1 rounded-full">
              Illustrative Demo Metrics
            </span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { value: '< 8 sec', label: 'Simulated 3-Hop Relay Time' },
              { value: '120+', label: 'Demo Mesh Nodes Active' },
              { value: '24/7', label: 'Hospital Triage Monitoring' },
              { value: '0 KB/s', label: 'Internet Needed at Patient End' },
            ].map((stat) => (
              <div key={stat.label} className="p-5 rounded-xl bg-bg-app border border-border-subtle">
                <p className="font-display text-2xl font-bold text-primary">{stat.value}</p>
                <p className="text-xs text-text-muted mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-sm text-text-muted flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-display font-bold text-text-main">
          <HeartPulse className="w-5 h-5 text-primary" />
          <span>Medical Lifeline</span>
        </div>
        <div className="flex flex-wrap gap-6 text-xs">
          <a href="#how-it-works" className="hover:text-text-main">About</a>
          <a href="#features" className="hover:text-text-main">Emergency Info</a>
          <Link to="/auth" className="hover:text-text-main">Privacy Policy</Link>
          <Link to="/hospital" className="hover:text-text-main">Contact</Link>
        </div>
        <p className="text-xs">© 2026 Medical Lifeline Prototype</p>
      </footer>
    </div>
  );
}