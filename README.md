# Medical Lifeline 🚑

**An offline-resilient, low-bandwidth emergency response platform** designed to bridge zero-internet dead zones, automate mass-casualty triage, and route ambulances to hospitals with verified ICU beds and matching blood-bank stock.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Auth_%26_Firestore-FFCA28?logo=firebase&logoColor=black)
![Leaflet](https://img.shields.io/badge/Leaflet-Maps-199900?logo=leaflet&logoColor=white)

---

## 🎯 Problem & Solution

**The Problem:** Standard emergency apps fail in rural or disaster dead zones without mobile data, overwhelm hospitals with unprioritized alerts, and dispatch ambulances blindly without checking live ICU capacity or blood-group availability.

**The Solution:** Medical Lifeline compresses critical SOS data into sub-35-byte BLE/SMS payloads, automatically prioritizes incoming emergencies using a **Red / Yellow / Green** triage engine, and matches patients to the closest *capable* hospital in real time.

---

## ✨ Key Features

### 📡 Low-Bandwidth & Offline Resilience
* **Compact Payload Encoder (`ML1` Protocol):** Packs Patient ID, blood group, emergency code, and GPS coordinates into a ~30-byte plain-ASCII string (e.g., `ML1|PT1024|B+|C1|21.1458,79.0882`)—over 85% smaller than raw JSON and sized for legacy 31-byte BLE advertising packets.
* **Simulated BLE Mesh Relay:** Visualizes peer-to-peer multi-hop signal delivery across nearby nodes and gateways with a live 6-stage delivery timeline.
* **Offline 2G SMS Fallback Bridge:** Generates cross-platform `sms:` URIs on the Patient Dashboard and includes an **SMS Payload Decoder** on the Hospital Console to parse incoming text packets directly onto the live Leaflet map.

### 🏥 Smart Clinical Triage & Hospital Routing
* **Automated START-Inspired Triage Engine:** Evaluates quick vitals toggles (*Conscious, Breathing, Heavy Bleeding*) and emergency type to classify cases as **Red (Immediate)**, **Yellow (Urgent)**, or **Green (Minor)**, auto-sorting the Hospital Console queue by severity.
* **Smart Hospital Matcher:** Ranks hospitals using Haversine GPS distance, live Firestore ICU bed availability, exact blood-group stock, and specialty match—with one-click **Route & Reserve** that atomically decrements ICU beds.
* **Live Inventory Controls:** Real-time `+ / -` controls for hospital staff to update ICU beds and blood-bank units.

### 🎙️ Hands-Free Accessibility & Self-Learning AI
* **Voice-Activated SOS:** Uses the Web Speech API (`SpeechRecognition`) to detect spoken emergencies (e.g., *"Emergency cardiac arrest"*), calculate triage, speak a confirmation, and broadcast SOS hands-free.
* **Self-Learning First-Aid & Medicine AI:** Pre-trained offline on 13+ emergency, medicine, and injection/vaccine protocols (dog bites, snake bites, tetanus, cardiac, burns, etc.) with **Spoken Playback** (`speechSynthesis`) and a **Teach Mode** that permanently saves new topics to Firestore.

### 🔐 Role-Based Portals & Real-Time Sync
* **Strict Role Separation:** Dedicated portals and route guards for **Patients**, **Volunteers**, and **Hospitals**.
* **Dynamic Medical Profiles & Notifications:** Firestore-backed patient records and a role-aware top-bar Notification Center with unread indicators.

### 🔗 Deployed Link 
* **Link:** https://medicallifeline.vercel.app/

---

## 🏗️ System Architecture

```text
┌───────────────────────────┐
│      Patient Portal       │
│  • One-Tap / Voice SOS    │
│  • Triage Assessment      │
│  • First-Aid AI (Voice)   │
└─────────────┬─────────────┘
              │
    ┌─────────┴──────────┐
    ▼                    ▼
[Online / Mesh]    [Zero-Internet Fallback]
Simulated BLE      ML1 Compact Encoder (~30B)
Multi-Hop Relay    ──► Native 2G SMS (sms:)
    │                    │
    ▼                    ▼
┌─────────────────────────────────────────┐
│        Firebase Cloud Firestore         │
│  • emergencies   • hospitals            │
│  • users         • chatbot_knowledge    │
└─────────────────────┬───────────────────┘
                      │ Real-time onSnapshot
                      ▼
┌─────────────────────────────────────────┐
│       Hospital & Volunteer Consoles     │
│  • Auto-Sorted Red/Yellow/Green Queue   │
│  • SMS Payload Decoder + Leaflet Map    │
│  • Smart Hospital Matcher & ICU Reserve │
└─────────────────────────────────────────┘
