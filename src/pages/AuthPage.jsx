import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Activity, ArrowLeft } from 'lucide-react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { auth, db } from '../services/firebase';
import { useEmergency } from '../context/EmergencyContext';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState('patient');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setRole } = useEmergency();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || password.length < 6) {
      toast.error('Enter a valid email and a password of at least 6 characters.');
      return;
    }
    if (!isLogin && !fullName.trim()) {
      toast.error('Please enter your full name.');
      return;
    }

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', cred.user.uid), {
          patientId: `PT-${cred.user.uid.slice(0, 4).toUpperCase()}`,
          name: fullName.trim(),
          role: selectedRole,
          bloodGroup: 'O+',
          allergies: 'None',
          conditions: 'None',
          emergencyContact: '+91 98111 22334',
        });
      }
      setRole(selectedRole);
      toast.success(`Signed in as ${selectedRole}`);
      navigate(`/${selectedRole}`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-bg-app flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface border border-border-subtle rounded-2xl p-8 shadow-xs">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-main mb-6">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>

        <div className="flex items-center gap-2 font-display font-bold text-xl text-primary mb-1">
          <Activity className="w-6 h-6" /> Medical Lifeline
        </div>
        <p className="text-sm text-text-muted mb-6">
          {isLogin ? 'Sign in to access your emergency portal.' : 'Create your Medical Lifeline account.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5">Select Role</label>
            <div className="grid grid-cols-3 gap-2">
              {['patient', 'volunteer', 'hospital'].map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setSelectedRole(r)}
                  className={`py-2 rounded-lg text-xs font-semibold capitalize border transition-colors ${
                    selectedRole === r
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'bg-bg-app border-border-subtle text-text-muted'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-3.5 py-2.5 rounded-lg border border-border-subtle text-sm focus:outline-none focus:border-primary"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-text-muted mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@hospital.org"
              className="w-full px-3.5 py-2.5 rounded-lg border border-border-subtle text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-text-muted mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-lg border border-border-subtle text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="w-full mt-5 text-xs text-text-muted hover:text-primary text-center"
        >
          {isLogin ? "Don't have an account? Register" : 'Already have an account? Sign In'}
        </button>
      </div>
    </div>
  );
}