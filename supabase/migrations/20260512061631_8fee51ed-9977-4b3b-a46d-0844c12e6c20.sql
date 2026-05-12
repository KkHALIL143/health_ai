
-- Doctors table (public, readable by all)
CREATE TABLE public.doctors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  specialization TEXT NOT NULL,
  city TEXT NOT NULL,
  hospital_name TEXT NOT NULL,
  consultation_type TEXT NOT NULL DEFAULT 'both',
  available_timings TEXT NOT NULL,
  experience_years INT NOT NULL DEFAULT 0,
  rating NUMERIC(2,1) NOT NULL DEFAULT 4.5,
  bio TEXT,
  profile_image TEXT,
  email TEXT NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Doctors are viewable by everyone" ON public.doctors FOR SELECT USING (true);

-- Appointments
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  patient_name TEXT NOT NULL,
  patient_contact TEXT NOT NULL,
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  symptoms TEXT,
  appointment_type TEXT NOT NULL DEFAULT 'physical',
  selected_slot TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (doctor_id, selected_slot)
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view their appointments" ON public.appointments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone authenticated can create appointment" ON public.appointments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- AI Inquiries
CREATE TABLE public.ai_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  patient_name TEXT NOT NULL,
  contact_info TEXT NOT NULL,
  symptoms TEXT NOT NULL,
  suggested_specialization TEXT,
  assigned_doctor UUID REFERENCES public.doctors(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit inquiry" ON public.ai_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Users view their inquiries" ON public.ai_inquiries FOR SELECT USING (auth.uid() = user_id);
