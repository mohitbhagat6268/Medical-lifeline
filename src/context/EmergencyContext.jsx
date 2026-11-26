import { createContext, useContext, useEffect, useState } from 'react';
import {
  addDoc, collection, doc, getDoc, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { toast } from 'sonner';
import { auth, db } from '../services/firebase';

const EmergencyContext = createContext();

const DEFAULT_PROFILE = {
  patientId: 'PT-1024',
  name: 'Guest Patient',
  bloodGroup: 'B+',
  allergies: 'None',
  conditions: 'No chronic conditions listed',
  emergencyContact: '+91 98111 22334',
};

export function EmergencyProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('patient');
  const [patientProfile, setPatientProfile] = useState(DEFAULT_PROFILE);
  const [requests, setRequests] = useState([]);
  const [activeSOS, setActiveSOS] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Track logged-in user and load their profile from Firestore
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          setPatientProfile(snap.data());
          if (snap.data().role) setRole(snap.data().role);
        } else {
          const fallbackName = currentUser.email ? currentUser.email.split('@')[0] : 'Patient';
          const initial = {
            ...DEFAULT_PROFILE,
            patientId: `PT-${currentUser.uid.slice(0, 4).toUpperCase()}`,
            name: fallbackName,
          };
          await setDoc(userRef, initial);
          setPatientProfile(initial);
        }
      } else {
        setPatientProfile(DEFAULT_PROFILE);
      }
    });
    return () => unsubAuth();
  }, []);

  // 2. Real-time listener for Firestore 'emergencies' collection
  useEffect(() => {
    const q = query(collection(db, 'emergencies'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setRequests(list);
        setLoading(false);
      },
      (error) => {
        console.error('Firestore listener error:', error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const updatePatientProfile = async (updatedFields) => {
    const merged = { ...patientProfile, ...updatedFields };
    setPatientProfile(merged);
    if (user) {
      await setDoc(doc(db, 'users', user.uid), merged, { merge: true });
    }
    toast.success('Patient profile updated.');
  };

  const triggerSOS = async (payload) => {
    const newCase = {
      patientId: patientProfile.patientId,
      patientName: payload.patientName || patientProfile.name,
      type: payload.type,
      location: payload.location,
      bloodGroup: payload.bloodGroup || patientProfile.bloodGroup,
      priority: payload.triage?.priority || 'Immediate',
      triageLevel: payload.triage?.level || 'Red',
      triageScore: payload.triage?.score || 3,
      receivedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Relaying',
      hops: 0,
      assignedAmbulance: null,
      responder: null,
      medicalNotes: payload.medicalNotes || `${patientProfile.conditions} | Allergies: ${patientProfile.allergies}`,
      emergencyContact: payload.emergencyContact || patientProfile.emergencyContact,
      createdAt: serverTimestamp(),
    };

    try {
      const docRef = await addDoc(collection(db, 'emergencies'), newCase);
      const savedCase = { id: docRef.id, ...newCase };
      setActiveSOS(savedCase);
      toast.error(`Emergency SOS (${docRef.id.slice(0, 6)}) broadcasting via simulated BLE Mesh`);
      return savedCase;
    } catch (err) {
      toast.error('Failed to write SOS to Firestore.');
      throw err;
    }
  };

  const updateCaseStatus = async (id, updates) => {
    try {
      await updateDoc(doc(db, 'emergencies', id), updates);
      toast.success(`Case updated to ${updates.status || 'modified'}`);
    } catch (err) {
      toast.error('Failed to update case status.');
    }
  };

  return (
    <EmergencyContext.Provider
      value={{
        user,
        role,
        setRole,
        patientProfile,
        updatePatientProfile,
        requests,
        activeSOS,
        setActiveSOS,
        loading,
        triggerSOS,
        updateCaseStatus,
      }}
    >
      {children}
    </EmergencyContext.Provider>
  );
}

export const useEmergency = () => useContext(EmergencyContext);