import { createFileRoute, Link } from "@tanstack/react-router";
import { Stethoscope, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { SearchBar } from "@/components/SearchBar";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "SmartDoctor AI — Find the right doctor in Pakistan" },
      { name: "description", content: "Search by symptoms or specialization, book appointments, and get instant doctor recommendations across Karachi, Lahore and Islamabad." },
    ],
  }),
});

const SYMPTOMS = ["Back pain", "Skin allergy", "Chest pain", "Fever", "Headache", "Sore throat"];

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary-soft via-background to-background" />
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-16 sm:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-soft">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Smart symptom-to-doctor matching
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Find the right doctor
              <span className="block text-primary">in seconds.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              Describe your symptoms or pick a specialization. We match you with verified doctors near you — and book instantly.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-3xl">
            <SearchBar />
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {SYMPTOMS.map((s) => (
                <Link
                  key={s}
                  to="/search"
                  search={{ q: s }}
                  className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground transition hover:border-primary hover:text-primary"
                >
                  {s}
                </Link>
              ))}
            </div>
          </div>

          <div className="mx-auto mt-20 grid max-w-4xl gap-4 sm:grid-cols-3">
            {[
              { icon: Sparkles, title: "Smart matching", desc: "Rule-based symptom → specialization mapping." },
              { icon: ShieldCheck, title: "Verified doctors", desc: "Trusted hospitals across major cities." },
              { icon: Stethoscope, title: "Online or in-person", desc: "Book the consultation type you prefer." },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-16 flex max-w-3xl flex-col items-center gap-3 rounded-2xl border border-border bg-card p-8 text-center shadow-soft">
            <h2 className="text-xl font-semibold tracking-tight">Browse all available doctors</h2>
            <p className="text-sm text-muted-foreground">12+ specialists across Pakistan ready to consult today.</p>
            <Link to="/search" search={{}}>
              <Button size="lg" className="mt-2">
                Explore doctors <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
