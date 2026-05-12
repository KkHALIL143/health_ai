import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Calendar, MapPin, Video, Stethoscope, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Navbar } from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/appointments")({
  component: AppointmentsPage,
  head: () => ({ meta: [{ title: "My Appointments — SmartDoctor AI" }] }),
});

function AppointmentsPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  const { data, isLoading } = useQuery({
    enabled: !!user,
    queryKey: ["appointments", user?.id],
    queryFn: async () => {
      const { data: appts, error } = await supabase
        .from("appointments")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      if (!appts?.length) return [];
      const ids = [...new Set(appts.map((a) => a.doctor_id))];
      const { data: docs } = await supabase.from("doctors").select("id, full_name, specialization, hospital_name, city, profile_image").in("id", ids);
      const map = new Map((docs ?? []).map((d) => [d.id, d]));
      return appts.map((a) => ({ ...a, doctor: map.get(a.doctor_id) }));
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">My appointments</h1>
          <p className="mt-1 text-sm text-muted-foreground">All your bookings in one place.</p>
        </div>

        {isLoading || loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : !data || data.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card py-20 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Calendar className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold">No appointments yet</h3>
            <p className="max-w-sm text-sm text-muted-foreground">Find a doctor and book your first appointment.</p>
            <Link to="/search"><Button>Browse doctors</Button></Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {data.map((a: any) => (
              <div key={a.id} className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft sm:flex-row sm:items-center">
                <img
                  src={a.doctor?.profile_image || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400"}
                  alt={a.doctor?.full_name ?? "Doctor"}
                  className="h-16 w-16 flex-shrink-0 rounded-xl object-cover ring-1 ring-border"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-semibold tracking-tight">{a.doctor?.full_name ?? "Doctor"}</h3>
                      <p className="text-sm text-primary">{a.doctor?.specialization}</p>
                    </div>
                    <Badge className="bg-success text-success-foreground hover:bg-success capitalize">{a.status}</Badge>
                  </div>
                  <div className="mt-2 grid gap-1 text-sm text-muted-foreground sm:grid-cols-2">
                    <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{a.selected_slot}</div>
                    <div className="flex items-center gap-1.5">
                      {a.appointment_type === "online" ? <Video className="h-3.5 w-3.5" /> : <Stethoscope className="h-3.5 w-3.5" />}
                      <span className="capitalize">{a.appointment_type}</span>
                    </div>
                    {a.doctor?.hospital_name && (
                      <div className="flex items-center gap-1.5 sm:col-span-2"><MapPin className="h-3.5 w-3.5" />{a.doctor.hospital_name}, {a.doctor.city}</div>
                    )}
                  </div>
                </div>
                <Link to="/doctor/$id" params={{ id: a.doctor_id }}>
                  <Button variant="outline" size="sm">View doctor</Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
