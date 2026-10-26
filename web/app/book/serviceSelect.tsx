"use client";
import { useSearchParams } from "next/navigation";

type Service = { id: string; title: string };

export default function ServiceSelect({ services }: { services: Service[] }) {
  const params = useSearchParams();
  const selected = params.get("service") ?? "";

  return (
    <select id="service" name="service" required defaultValue={selected}>
      <option value="">Choose a service</option>
      {services.map((s) => (
        <option key={s.id} value={s.id}>{s.title}</option>
      ))}
    </select>
  );
}