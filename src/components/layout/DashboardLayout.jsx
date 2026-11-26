import FirstAidChatbot from '../common/FirstAidChatbot';
import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router';
import { signOut } from 'firebase/auth';
import { toast } from 'sonner';
import {
  Activity, AlertCircle, Bluetooth, Bell, Building2, CheckCheck,
  HeartPulse, LogOut, Menu, Network, Settings, Truck, User, Users, X
} from 'lucide-react';
import { auth } from '../../services/firebase';
import { useEmergency } from '../../context/EmergencyContext';

const NAV_ITEMS = [
  { to: '/patient', label: 'Patient Dashboard', icon: HeartPulse, roles: ['patient'] },
  { to: '/volunteer', label: 'Volunteer Dispatch', icon: Users, roles: ['volunteer'] },
  { to: '/hospital', label: 'Hospital Console', icon: Building2, roles: ['hospital'] },
  { to: '/ambulances', label: 'Ambulance Fleet', icon: Truck, roles: ['hospital'] },
  { to: '/mesh-monitor', label: 'BLE Mesh Monitor', icon: Network, roles: ['patient', 'volunteer', 'hospital'] },
  { to: '/profile', label: 'Medical Profile', icon: User, roles: ['patient'] },
  { to: '/settings', label: 'Settings', icon: Settings, roles: ['patient', 'volunteer', 'hospital'] },
];

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [readIds, setReadIds] = useState([]);

  const { role, patientProfile, requests } = useEmergency();
  const navigate = useNavigate();

  const visibleNavItems = NAV_ITEMS.filter((item) => item.roles.includes(role));

  // Build role-specific notifications from live Firestore emergencies
  const notifications = requests
    .filter((req) => {
      if (role === 'patient') return req.patientId === patientProfile.patientId;
      return req.status !== 'Resolved';
    })
    .slice(0, 8)
    .map((req) => {
      let title = `SOS Alert: ${req.type}`;
      let message = `${req.patientName} • ${req.location?.label || 'Unknown location'}`;
      let targetPath = `/${role}`;

      if (role === 'hospital') {
        title = `Incoming ${req.priority} SOS (${req.bloodGroup})`;
        message = `${req.patientName} — ${req.type} (${req.status})`;
        targetPath = `/emergencies/${req.id}`;
      } else if (role === 'volunteer') {
        title = `Nearby Emergency: ${req.type}`;
        message = `${req.location?.label || 'Nearby'} • Status: ${req.status}`;
        targetPath = '/volunteer';
      } else if (role === 'patient') {
        title = `Your SOS Status: ${req.status}`;
        message = req.assignedAmbulance
          ? `Ambulance ${req.assignedAmbulance} assigned to your location.`
          : `Signal relayed for ${req.type}.`;
        targetPath = '/patient';
      }

      return {
        id: `${req.id}-${req.status}`,
        title,
        message,
        time: req.receivedAt,
        targetPath,
        isUnread: !readIds.includes(`${req.id}-${req.status}`),
      };
    });

  const unreadCount = notifications.filter((n) => n.isUnread).length;

  const markAllRead = () => {
    setReadIds(notifications.map((n) => n.id));
  };

  const handleNotificationClick = (notif) => {
    if (!readIds.includes(notif.id)) {
      setReadIds((prev) => [...prev, notif.id]);
    }
    setNotifOpen(false);
    navigate(notif.targetPath);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Signed out successfully.');
      navigate('/auth');
    } catch (err) {
      toast.error('Failed to sign out.');
    }
  };

  return (
    <div className="min-h-screen bg-bg-app flex text-text-main">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-surface border-r border-border-subtle flex flex-col justify-between transform transition-transform lg:translate-x-0 lg:static ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          <div className="h-16 px-6 flex items-center justify-between border-b border-border-subtle">
            <div className="flex items-center gap-2.5 font-display font-bold text-lg text-primary">
              <Activity className="w-6 h-6" />
              <span>Medical Lifeline</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-text-muted">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-6 pt-4 pb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
              {role} Portal
            </span>
          </div>

          <nav className="p-4 pt-2 space-y-1">
            {visibleNavItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-text-muted hover:bg-bg-app hover:text-text-main'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom Sidebar: Prototype Note & Logout */}
        <div className="p-4 space-y-3 border-t border-border-subtle">
          <div className="p-3 rounded-xl bg-bg-app border border-border-subtle text-xs text-text-muted">
            <p className="font-semibold text-text-main mb-1">Prototype Mode</p>
            BLE Mesh hops are simulated in-browser.
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg border border-border-subtle text-sm font-medium text-emergency hover:bg-emergency/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-surface border-b border-border-subtle px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-text-muted">
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-medium">
            <Bluetooth className="w-3.5 h-3.5" />
            <span>Mesh Ready (Simulated) • 4 Peers Nearby</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Interactive Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen((prev) => !prev)}
                className="relative p-2 rounded-lg text-text-muted hover:bg-bg-app hover:text-text-main transition-colors cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emergency text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface border border-border-subtle rounded-xl shadow-lg z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-border-subtle flex items-center justify-between">
                    <span className="font-display font-semibold text-sm">Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline cursor-pointer"
                      >
                        <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-border-subtle">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-text-muted">
                        No notifications right now.
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <button
                          key={notif.id}
                          onClick={() => handleNotificationClick(notif)}
                          className={`w-full text-left p-4 flex items-start gap-3 hover:bg-bg-app transition-colors cursor-pointer ${
                            notif.isUnread ? 'bg-primary/5' : ''
                          }`}
                        >
                          <div className="mt-0.5 p-1.5 rounded-lg bg-emergency/10 text-emergency shrink-0">
                            <AlertCircle className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-xs font-semibold text-text-main truncate">
                                {notif.title}
                              </p>
                              <span className="text-[11px] text-text-muted shrink-0">
                                {notif.time}
                              </span>
                            </div>
                            <p className="text-xs text-text-muted mt-0.5 line-clamp-2">
                              {notif.message}
                            </p>
                          </div>
                          {notif.isUnread && (
                            <span className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                          )}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-xs flex items-center justify-center uppercase">
                {(patientProfile?.name || role).slice(0, 2)}
              </div>
              <span className="hidden sm:inline text-xs font-medium text-text-main">
                {patientProfile?.name || role}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
      <FirstAidChatbot />
    </div>
  );
}
