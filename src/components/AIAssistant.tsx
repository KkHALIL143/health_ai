import { useState } from "react";
import { Bot, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { suggestSpecialization } from "@/lib/symptom-mapping";
import type { Doctor } from "./DoctorCard";

type Step = "intro" | "name" | "contact" | "symptoms" | "done";

export function AIAssistant({ doctor }: { doctor: Doctor }) {
  const [step, setStep] = useState<Step>("intro");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!name.trim() || !contact.trim() || !symptoms.trim()) {
      toast.error("Please complete all fields");
      return;
    }
    setLoading(true);
    const suggested = suggestSpecialization(symptoms) || doctor.specialization;
    const { error } = await supabase.from("ai_inquiries").insert({
      patient_name: name.trim(),
      contact_info: contact.trim(),
      symptoms: symptoms.trim(),
      suggested_specialization: suggested,
      assigned_doctor: doctor.id,
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Inquiry sent", { description: `${doctor.full_name} will be notified.` });
    setStep("done");
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <Bot className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-semibold tracking-tight">Smart Assistant</h3>
          <p className="text-xs text-muted-foreground">
            {doctor.is_available ? "Got a question? Leave one and we'll get back to you." : "Doctor is currently unavailable. Leave your details and we'll follow up."}
          </p>
        </div>
      </div>

      {step === "intro" && (
        <div className="space-y-3">
          <div className="rounded-xl bg-muted p-3 text-sm">
            👋 Hi! I'm {doctor.full_name}'s assistant. I'll collect a few details and notify the doctor.
          </div>
          <Button onClick={() => setStep("name")} className="w-full">Start inquiry</Button>
        </div>
      )}

      {step === "name" && (
        <div className="space-y-3">
          <div className="rounded-xl bg-muted p-3 text-sm">What's your full name?</div>
          <Label htmlFor="ai-name" className="sr-only">Name</Label>
          <Input id="ai-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" />
          <Button onClick={() => name.trim() ? setStep("contact") : toast.error("Please enter your name")} className="w-full">Continue</Button>
        </div>
      )}

      {step === "contact" && (
        <div className="space-y-3">
          <div className="rounded-xl bg-muted p-3 text-sm">Thanks, {name}. How can we reach you?</div>
          <Input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Phone or email" />
          <Button onClick={() => contact.trim() ? setStep("symptoms") : toast.error("Please enter contact")} className="w-full">Continue</Button>
        </div>
      )}

      {step === "symptoms" && (
        <div className="space-y-3">
          <div className="rounded-xl bg-muted p-3 text-sm">Briefly describe your symptoms or concern.</div>
          <Textarea value={symptoms} onChange={(e) => setSymptoms(e.target.value)} placeholder="e.g. Persistent back pain for 2 weeks…" rows={3} />
          <Button onClick={submit} disabled={loading} className="w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send to doctor"}
          </Button>
        </div>
      )}

      {step === "done" && (
        <div className="flex flex-col items-center gap-2 py-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <p className="text-sm font-medium">Inquiry submitted</p>
          <p className="text-xs text-muted-foreground">{doctor.full_name} will respond at {contact}.</p>
        </div>
      )}
    </div>
  );
}
