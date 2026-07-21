import { InfoCard } from "@/components/contact/info-card";
import { Form } from "@/components/contact/form";

export function Content() {
  return (
    <section className="w-full">
      <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3 md:gap-2">
        <div className="md:col-span-1">
          <InfoCard />
        </div>
        <div className="md:col-span-2">
          <Form />
        </div>
      </div>
    </section>
  );
}
