export const MEDICAL_KNOWLEDGE = [
  // --- EMERGENCIES & BITES ---
  {
    keywords: ['dog bite', 'dog', 'animal bite', 'rabies', 'arv', 'rabies injection', 'puppy bite'],
    title: 'Dog / Animal Bite & Rabies Protocol',
    steps: [
      'Wash the wound immediately under running tap water with soap for at least 15 minutes.',
      'Apply an antiseptic like Povidone-Iodine (Betadine) or surgical spirit.',
      'Do NOT tightly bandage, stitch, or apply turmeric/chili/oil to the wound.',
      'Visit a hospital or clinic the same day for vaccination.',
    ],
    medicines: 'Antiseptic: Povidone-Iodine (Betadine). Pain/Swelling: Paracetamol. Doctor may prescribe Amoxicillin-Clavulanate for infection.',
    injections: 'Anti-Rabies Vaccine (ARV — Day 0, 3, 7, 14, 28 schedule), Tetanus Toxoid (TT) if not taken in last 5 years, and Rabies Immunoglobulin (RIG) for deep/bleeding bites.',
  },
  {
    keywords: ['snake bite', 'snake', 'venom', 'antivenom', 'asv'],
    title: 'Snake Bite Emergency',
    steps: [
      'Trigger SOS immediately and transport the patient to the nearest hospital.',
      'Keep the patient calm and completely still to slow venom spread.',
      'Immobilize the bitten limb below heart level and remove rings/watches/tight clothes.',
      'Do NOT cut the wound, suck out venom, apply ice, or tie a tight tourniquet.',
    ],
    medicines: 'No home medicine can neutralize snake venom. Avoid aspirin or NSAIDs.',
    injections: 'Polyvalent Anti-Snake Venom (ASV) administered intravenously by a doctor in a hospital, plus Tetanus Toxoid (TT).',
  },
  {
    keywords: ['tetanus', 'tt injection', 'rusty nail', 'iron cut', 'tetanus shot'],
    title: 'Tetanus Prevention & Injection (TT / Td)',
    steps: [
      'Clean the cut or puncture wound thoroughly with clean water and antiseptic.',
      'Check when the patient last received a Tetanus shot (protection lasts ~5–10 years).',
      'Get a booster within 24–48 hours for dirty, deep, or metal/rusty wounds.',
    ],
    medicines: 'Topical antibiotic ointment (Mupirocin or Neosporin) for minor surface cuts.',
    injections: 'Tetanus Toxoid (TT) or Td booster (0.5 mL intramuscular in the upper arm). Tetanus Immunoglobulin (TIG) for severe contaminated wounds.',
  },
  {
    keywords: ['burn', 'burns', 'fire', 'hot water', 'scald'],
    title: 'Burn First Aid',
    steps: [
      'Hold the burned area under cool (not ice-cold) running water for 10–20 minutes.',
      'Gently remove jewelry or tight clothing before swelling begins.',
      'Cover loosely with a sterile, non-stick dressing. Never pop blisters or apply toothpaste/butter.',
    ],
    medicines: 'Silver Sulfadiazine cream (for minor burns) or Aloe Vera gel. Paracetamol or Ibuprofen for pain.',
    injections: 'Tetanus booster (TT) if the burn is deep or blisters break; IV fluids in hospital for large burns.',
  },
  {
    keywords: ['bleeding', 'cut', 'wound', 'blood', 'injury'],
    title: 'Heavy Bleeding & Wound Control',
    steps: [
      'Apply firm, direct pressure with a clean cloth or sterile gauze for 10 minutes.',
      'Raise the injured arm or leg above heart level if no fracture is suspected.',
      'If blood soaks through, add more cloth on top—do not remove the first layer.',
    ],
    medicines: 'Antiseptic solution (Betadine or diluted Savlon) once bleeding stops.',
    injections: 'Tetanus Toxoid (TT) for deep cuts; Tranexamic Acid (TXA) or IV fluids administered by hospital staff for severe trauma.',
  },
  {
    keywords: ['heart attack', 'chest pain', 'cardiac', 'angina', 'cpr'],
    title: 'Cardiac Emergency / Chest Pain',
    steps: [
      'Trigger the red SOS button immediately.',
      'Seat the patient upright, keep them calm, and loosen tight clothing.',
      'If unconscious and not breathing normally, start chest compressions (CPR: 100–120/min).',
    ],
    medicines: 'Chewable Aspirin (300mg) if not allergic and advised by emergency responders. Prescribed Nitroglycerin (Sorbitrate) under the tongue for known heart patients.',
    injections: 'Hospital emergency care only: Thrombolytics (clot-busters), Heparin, or Morphine under cardiologist supervision.',
  },
  {
    keywords: ['allergy', 'anaphylaxis', 'bee sting', 'swelling', 'epipen', 'epinephrine', 'adrenaline'],
    title: 'Severe Allergic Reaction (Anaphylaxis)',
    steps: [
      'Trigger SOS immediately if there is throat swelling, wheezing, or dizziness.',
      'Lay the person flat and elevate their legs (unless they have trouble breathing).',
      'Remove the trigger (e.g., scrape out a bee stinger) if safe.',
    ],
    medicines: 'Mild allergy/hives: Cetirizine (10mg) or Loratadine.',
    injections: 'Severe anaphylaxis: Epinephrine (Adrenaline) auto-injector (EpiPen) into the outer mid-thigh, followed by hospital antihistamines/steroids.',
  },
  {
    keywords: ['fracture', 'broken bone', 'sprain', 'bone', 'dislocation'],
    title: 'Fracture & Sprain First Aid',
    steps: [
      'Do NOT try to straighten or push a broken bone back into place.',
      'Immobilize the limb using a splint or sling (RICE: Rest, Ice, Compression, Elevation for sprains).',
      'Apply an ice pack wrapped in cloth for 15–20 minutes to reduce swelling.',
    ],
    medicines: 'Pain relief: Paracetamol or Ibuprofen / Diclofenac gel (for sprains).',
    injections: 'Hospital pain management (e.g., Diclofenac or Ketorolac IM injection) if pain is severe, after X-ray.',
  },
  {
    keywords: ['seizure', 'fits', 'epilepsy', 'convulsion'],
    title: 'Seizure / Fits First Aid',
    steps: [
      'Clear hard or sharp objects away and place something soft under the person’s head.',
      'Turn the person gently onto their side (recovery position) to keep the airway clear.',
      'Do NOT hold them down or put anything (water, spoon, fingers) in their mouth.',
      'Trigger SOS if the seizure lasts more than 5 minutes.',
    ],
    medicines: 'Continue prescribed anti-epileptic medication only once fully awake.',
    injections: 'Hospital emergency only: IV/IM Midazolam or Lorazepam to stop prolonged seizures.',
  },
  {
    keywords: ['heatstroke', 'sunstroke', 'dehydration', 'ors', 'loose motion', 'diarrhea', 'vomiting'],
    title: 'Heatstroke, Dehydration & Diarrhea',
    steps: [
      'Move the person to a cool, shaded area and loosen tight clothing.',
      'Give small, frequent sips of Oral Rehydration Solution (ORS) or electrolyte water.',
      'Use cool wet cloths on the neck, armpits, and groin for heatstroke.',
    ],
    medicines: 'ORS packets (WHO formula), Zinc tablets (for diarrhea), Ondansetron (doctor-prescribed for severe vomiting).',
    injections: 'IV Fluids (Normal Saline / Ringer’s Lactate) at a clinic or hospital if the patient cannot keep fluids down.',
  },

  // --- COMMON MEDICINES & INJECTIONS REFERENCE ---
  {
    keywords: ['fever', 'paracetamol', 'dolo', 'crocin', 'temperature', 'headache', 'body pain'],
    title: 'Fever, Headache & Body Pain',
    steps: [
      'Rest and drink plenty of water or ORS.',
      'Use a lukewarm/cool damp cloth on the forehead.',
      'Consult a doctor if fever is above 103°F (39.4°C) or lasts more than 3 days.',
    ],
    medicines: 'Paracetamol (Acetaminophen 500mg–650mg every 6–8 hours, max 4g/day for adults) or Ibuprofen (after food).',
    injections: 'IV Paracetamol infusion is used in hospitals only for very high fever or when oral medicine cannot be taken.',
  },
  {
    keywords: ['acidity', 'gas', 'heartburn', 'stomach pain', 'antacid', 'pantoprazole'],
    title: 'Acidity, Gas & Heartburn',
    steps: [
      'Sit upright and avoid lying down for at least 2 hours after eating.',
      'Drink cold water or milk and avoid spicy, oily, or caffeinated foods.',
      'If upper stomach/chest pain feels crushing or spreads to the arm/jaw, treat as a cardiac emergency.',
    ],
    medicines: 'Antacid syrup/chewables (Digene / Gelusil) for quick relief; Pantoprazole (40mg) or Omeprazole before breakfast.',
    injections: 'IV Pantoprazole (Pan-40 IV) in hospital for severe acute gastritis or vomiting.',
  },
  {
    keywords: ['diabetes', 'insulin', 'low sugar', 'hypoglycemia', 'high sugar'],
    title: 'Diabetes & Insulin Emergency',
    steps: [
      'Low Blood Sugar (sweating, shaking, confusion): Give 15g fast sugar immediately (glucose water, fruit juice, or 3–4 sugar candies).',
      'Recheck blood sugar after 15 minutes.',
      'If unconscious, do NOT give anything by mouth—trigger SOS immediately.',
    ],
    medicines: 'Glucose tablets / oral glucose powder for mild low sugar.',
    injections: 'Insulin (subcutaneous, strictly as prescribed for high blood sugar). Glucagon injection or IV Dextrose (D25/D50) for severe unconscious hypoglycemia.',
  },
];