import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Calendar, Video, Stethoscope, Bell, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  RadioGroup, RadioGroupItem,
} from "@/components/ui/radio-group";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import type { Doctor } from "./DoctorCard";

function generateSlots(timings: string) {
  // simple demo slots based on next 5 days
  const slots: string[] = [];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const times = ["10:00 AM", "12:00 PM", "3:00 PM", "5:00 PM"];
  for (const d of days) for (const t of times) slots.push(`${d} ${t}`);
  return slots;
}

export function BookingForm({ doctor }: { doctor: Doctor }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [slot, setSlot] = useState("");
  const [type, setType] = useState(doctor.consultation_type === "online" ? "online" : "physical");
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState<null | { name: string; contact: string; slot: string; type: string }>(null);

  const slots = generateSlots(doctor.available_timings);

  const notifyBrowser = (title: string, body: string) => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    const show = () => new Notification(title, { body, icon: "/favicon.ico" });
    if (Notification.permission === "granted") show();
    else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((p) => { if (p === "granted") show(); });
    }
  };

  const onBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to book an appointment");
      navigate({ to: "/auth" });
      return;
    }
    if (!name.trim() || !contact.trim() || !slot) {
      toast.error("Please fill all required fields");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("appointments").insert({
      user_id: user.id,
      patient_name: name.trim(),
      patient_contact: contact.trim(),
      doctor_id: doctor.id,
      symptoms: symptoms.trim() || null,
      appointment_type: type,
      selected_slot: slot,
      status: "confirmed",
    });
    setLoading(false);
    if (error) {
      if (error.code === "23505") toast.error("This slot is already booked. Pick another.");
      else toast.error(error.message);
      return;
    }
    const booked = { name: name.trim(), contact: contact.trim(), slot, type };
    toast.success("✅ Appointment confirmed!", {
      description: `${doctor.full_name} · ${slot}`,
    });
    notifyBrowser("SmartDoctor — Appointment confirmed", `${doctor.full_name} · ${slot}`);
    setConfirmed(booked);
    setName(""); setContact(""); setSymptoms(""); setSlot("");
  };

  if (confirmed) {
    return (
      <div className="space-y-4 rounded-2xl border border-success/30 bg-card p-6 shadow-soft">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 text-success">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold tracking-tight">Appointment confirmed!</h3>
            <p className="text-sm text-muted-foreground">Confirmation sent to {confirmed.contact}</p>
          </div>
        </div>
        <div className="grid gap-3 rounded-xl bg-muted/40 p-4 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Patient</span><span className="font-medium">{confirmed.name}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Doctor</span><span className="font-medium">{doctor.full_name}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Specialization</span><span className="font-medium">{doctor.specialization}</span></div>
          <div className="flex justify-between items-center"><span className="text-muted-foreground">Slot</span><span className="font-medium inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{confirmed.slot}</span></div>
          <div className="flex justify-between items-center"><span className="text-muted-foreground">Type</span><span className="font-medium inline-flex items-center gap-1 capitalize">{confirmed.type === "online" ? <Video className="h-3.5 w-3.5" /> : <Stethoscope className="h-3.5 w-3.5" />}{confirmed.type}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Location</span><span className="font-medium text-right">{doctor.hospital_name}, {doctor.city}</span></div>
        </div>
        <div className="flex items-start gap-2 rounded-xl bg-primary-soft/50 p-3 text-xs text-foreground">
          <Bell className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
          <span>You'll get a real-time reminder before your appointment. Track all your bookings under <strong>My Appointments</strong>.</span>
        </div>
        <Button type="button" variant="outline" className="w-full" onClick={() => setConfirmed(null)}>Book another slot</Button>
      </div>
    );
  }

  return (
    <form onSubmit={onBook} className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-soft">
      <div>
        <h3 className="text-lg font-semibold tracking-tight">Book an appointment</h3>
        <p className="text-sm text-muted-foreground">Pick a slot and confirm in seconds.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Patient name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" required />
        </div>
        <div>
          <Label htmlFor="contact">Contact</Label>
          <Input id="contact" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Phone or email" required />
        </div>
      </div>
      <div>
        <Label htmlFor="symptoms">Symptoms (optional)</Label>
        <Textarea id="symptoms" value={symptoms} onChange={(e) => setSymptoms(e.target.value)} placeholder="Briefly describe your concern" rows={2} />
      </div>
      {doctor.consultation_type === "both" && (
        <div>
          <Label>Consultation type</Label>
          <RadioGroup value={type} onValueChange={setType} className="mt-2 flex gap-4">
            <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="physical" /> In-person</label>
            <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="online" /> Online</label>
          </RadioGroup>
        </div>
      )}
      <div>
        <Label>Available slots</Label>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {slots.map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => setSlot(s)}
              className={`rounded-lg border px-3 py-2 text-sm transition ${
                slot === s
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground hover:border-primary/40"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm appointment"}
      </Button>
    </form>
  );
}
