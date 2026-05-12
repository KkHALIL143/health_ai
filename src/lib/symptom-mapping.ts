// Rule-based symptom → specialization mapping
const RULES: Array<{ keywords: string[]; specialization: string }> = [
  { keywords: ["back pain", "joint", "bone", "fracture", "knee", "shoulder", "spine"], specialization: "Orthopedic" },
  { keywords: ["skin", "rash", "acne", "allergy", "eczema", "itch"], specialization: "Dermatologist" },
  { keywords: ["chest pain", "heart", "palpitation", "blood pressure", "hypertension"], specialization: "Cardiologist" },
  { keywords: ["headache", "migraine", "seizure", "numbness", "stroke", "dizziness"], specialization: "Neurologist" },
  { keywords: ["child", "kid", "baby", "infant", "vaccination", "pediatric"], specialization: "Pediatrician" },
  { keywords: ["pregnancy", "gyne", "menstrual", "period", "women health"], specialization: "Gynecologist" },
  { keywords: ["ear", "nose", "throat", "sinus", "tonsil", "sore throat"], specialization: "ENT Specialist" },
  { keywords: ["fever", "cold", "flu", "cough", "infection", "general", "checkup"], specialization: "General Physician" },
];

export function suggestSpecialization(input: string): string | null {
  const q = input.toLowerCase().trim();
  if (!q) return null;
  for (const rule of RULES) {
    if (rule.keywords.some((k) => q.includes(k))) return rule.specialization;
  }
  return null;
}

export const SPECIALIZATIONS = [
  "General Physician",
  "Dermatologist",
  "Orthopedic",
  "Cardiologist",
  "Neurologist",
  "Pediatrician",
  "Gynecologist",
  "ENT Specialist",
];

export const CITIES = ["Karachi", "Lahore", "Islamabad"];
