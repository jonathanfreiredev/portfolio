import { InfoCard } from "@/components/contact/info-card";
import { Form } from "@/components/contact/form";
import CalEmbed from "../cal-embed";

export function Content() {
  return (
    <section className="w-full flex flex-col gap-10">
      <div className="grid w-full grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-3">
        <div className="lg:col-span-1">
          <InfoCard />
        </div>
        <div className="relative lg:col-span-2 flex flex-col gap-4">
          <h3 className="text-lead p-1">
            Prefer to talk? Pick a time that works for you.
          </h3>
          <CalEmbed />
        </div>
      </div>

      <Form />
    </section>
  );
}
