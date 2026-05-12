import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { SearchBar } from "@/components/SearchBar";
import { DoctorCard, type Doctor } from "@/components/DoctorCard";
import { suggestSpecialization, SPECIALIZATIONS } from "@/lib/symptom-mapping";
import { Loader2, SearchX } from "lucide-react";

const searchSchema = z.object({
  q: z.string().optional(),
  city: z.string().optional(),
});

export const Route = createFileRoute("/search")({
  validateSearch: searchSchema,
  component: SearchPage,
  head: () => ({
    meta: [
      { title: "Search doctors — SmartDoctor AI" },
      { name: "description", content: "Find available doctors by symptoms, specialization, and city." },
    ],
  }),
});

function SearchPage() {
  const { q, city } = Route.useSearch();
  const query = (q ?? "").trim();

  // Determine specialization: exact match from list, else mapped from symptoms
  const lower = query.toLowerCase();
  const exactSpec = SPECIALIZATIONS.find((s) => s.toLowerCase() === lower || lower.includes(s.toLowerCase()));
  const mappedSpec = exactSpec ?? suggestSpecialization(query);

  const { data, isLoading } = useQuery({
    queryKey: ["doctors", mappedSpec, city, query],
    queryFn: async () => {
      let req = supabase.from("doctors").select("*");
      if (mappedSpec) req = req.eq("specialization", mappedSpec);
      if (city) req = req.eq("city", city);
      const { data, error } = await req
        .order("is_available", { ascending: false })
        .order("rating", { ascending: false })
        .limit(20);
      if (error) throw error;
      return (data ?? []) as Doctor[];
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6">
          <SearchBar initial={{ q: query, city }} />
        </div>

        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            {mappedSpec ? `${mappedSpec}s` : "All doctors"}
            {city ? ` in ${city}` : ""}
          </h1>
          {query && mappedSpec && (
            <p className="text-sm text-muted-foreground">
              Matched "<span className="font-medium text-foreground">{query}</span>" → {mappedSpec}
            </p>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : !data || data.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card py-20 text-center">
            <SearchX className="h-8 w-8 text-muted-foreground" />
            <h3 className="text-lg font-semibold">No doctors found</h3>
            <p className="max-w-sm text-sm text-muted-foreground">
              Try a different symptom, specialization, or city.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {data.map((d) => <DoctorCard key={d.id} doctor={d} />)}
          </div>
        )}
      </div>
    </div>
  );
}
