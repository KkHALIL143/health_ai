import { Link } from "@tanstack/react-router";
import { MapPin, Star, Clock, Video, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface Doctor {
  id: string;
  full_name: string;
  specialization: string;
  city: string;
  hospital_name: string;
  consultation_type: string;
  available_timings: string;
  experience_years: number;
  rating: number;
  bio: string | null;
  profile_image: string | null;
  is_available: boolean;
}

export function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <div className="group flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card sm:flex-row sm:items-start">
      <img
        src={doctor.profile_image || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400"}
        alt={doctor.full_name}
        className="h-20 w-20 flex-shrink-0 rounded-xl object-cover ring-1 ring-border"
        loading="lazy"
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="text-base font-semibold tracking-tight">{doctor.full_name}</h3>
            <p className="text-sm text-primary">{doctor.specialization}</p>
          </div>
          {doctor.is_available ? (
            <Badge className="bg-success text-success-foreground hover:bg-success">Available</Badge>
          ) : (
            <Badge variant="secondary">Busy</Badge>
          )}
        </div>
        <div className="mt-3 grid gap-1.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" />{doctor.hospital_name}</div>
          <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{doctor.city}</div>
          <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{doctor.available_timings}</div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
          <span className="flex items-center gap-1 font-medium text-foreground">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            {doctor.rating}
          </span>
          <span className="text-muted-foreground">{doctor.experience_years} yrs exp</span>
          {doctor.consultation_type !== "physical" && (
            <span className="flex items-center gap-1 text-muted-foreground">
              <Video className="h-3.5 w-3.5" /> Online
            </span>
          )}
        </div>
      </div>
      <div className="flex sm:flex-col sm:items-end sm:justify-between">
        <Link to="/doctor/$id" params={{ id: doctor.id }}>
          <Button size="sm">View profile</Button>
        </Link>
      </div>
    </div>
  );
}
