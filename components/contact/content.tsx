import { InfoCard } from "@/components/contact/info-card";
import { Form } from "@/components/contact/form";
import CalEmbed from "../cal-embed";

export function Content() {
  return (
    <section className="w-full flex flex-col gap-10">
      <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3 md:gap-3">
        <div className="md:col-span-1">
          <InfoCard />
        </div>
        <div className="relative md:col-span-2">
          <CalEmbed />
        </div>
      </div>

      <Form />
    </section>
  );
}
