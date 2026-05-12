import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, MapPin, Star, Clock, Building2, Video, Stethoscope, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { BookingForm } from "@/components/BookingForm";
import { AIAssistant } from "@/components/AIAssistant";
import type { Doctor } from "@/components/DoctorCard";

export const Route = createFileRoute("/doctor/$id")({
  component: DoctorPage,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Doctor not found</h1>
        <Link to="/search" search={{}} className="mt-3 inline-block text-primary">Back to search</Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="p-10 text-center">
      <p className="text-destructive">{error.message}</p>
    </div>
  ),
});

function DoctorPage() {
  const { id } = Route.useParams();
  const { data: doctor, isLoading, error } = useQuery({
    queryKey: ["doctor", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("doctors").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      if (!data) throw notFound();
      return data as Doctor;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      </div>
    );
  }
  if (error || !doctor) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Link to="/search" search={{}} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to search
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_420px]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                <img
                  src={doctor.profile_image || ""}
                  alt={doctor.full_name}
                  className="h-28 w-28 rounded-2xl object-cover ring-1 ring-border"
                />
                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h1 className="text-2xl font-semibold tracking-tight">{doctor.full_name}</h1>
                      <p className="text-primary">{doctor.specialization}</p>
                    </div>
                    {doctor.is_available ? (
                      <Badge className="bg-success text-success-foreground hover:bg-success">Available today</Badge>
                    ) : (
                      <Badge variant="secondary">Unavailable</Badge>
                    )}
                  </div>
                  <div className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                    <div className="flex items-center gap-2"><Building2 className="h-4 w-4" />{doctor.hospital_name}</div>
                    <div className="flex items-center gap-2"><MapPin className="h-4 w-4" />{doctor.city}</div>
                    <div className="flex items-center gap-2"><Clock className="h-4 w-4" />{doctor.available_timings}</div>
                    <div className="flex items-center gap-2"><Stethoscope className="h-4 w-4" />{doctor.experience_years} years experience</div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                    <span className="flex items-center gap-1 font-medium">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />{doctor.rating}
                    </span>
                    {doctor.consultation_type !== "physical" && (
                      <Badge variant="secondary" className="gap-1"><Video className="h-3 w-3" /> Online</Badge>
                    )}
                    {doctor.consultation_type !== "online" && (
                      <Badge variant="secondary">In-person</Badge>
                    )}
                  </div>
                </div>
              </div>
              {doctor.bio && (
                <p className="mt-6 border-t border-border pt-5 text-sm leading-relaxed text-muted-foreground">{doctor.bio}</p>
              )}
            </div>

            {doctor.is_available && <BookingForm doctor={doctor} />}
          </div>

          <div className="space-y-6">
            <AIAssistant doctor={doctor} />
            {!doctor.is_available && (
              <div className="rounded-2xl border border-border bg-muted/30 p-5 text-sm text-muted-foreground">
                Direct booking is paused while the doctor is unavailable. Use the assistant to send an inquiry instead.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
