import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CITIES } from "@/lib/symptom-mapping";

export function SearchBar({ initial }: { initial?: { q?: string; city?: string } }) {
  const navigate = useNavigate();
  const [q, setQ] = useState(initial?.q ?? "");
  const [city, setCity] = useState(initial?.city ?? "all");

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      to: "/search",
      search: { q: q || undefined, city: city !== "all" ? city : undefined },
    });
  };

  return (
    <form
      onSubmit={onSearch}
      className="flex w-full flex-col gap-2 rounded-2xl border border-border bg-card p-2 shadow-card sm:flex-row sm:items-center"
    >
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Symptom or specialization (e.g. back pain, dermatologist)"
          className="h-12 border-0 bg-transparent pl-9 text-base shadow-none focus-visible:ring-0"
        />
      </div>
      <Select value={city} onValueChange={setCity}>
        <SelectTrigger className="h-12 w-full border-0 bg-secondary sm:w-44">
          <SelectValue placeholder="City" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All cities</SelectItem>
          {CITIES.map((c) => (
            <SelectItem key={c} value={c}>{c}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="submit" size="lg" className="h-12 sm:w-32">
        Search
      </Button>
    </form>
  );
}
