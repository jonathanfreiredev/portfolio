import { Form } from "@/components/contact/form";
import CalEmbed from "../cal-embed";
import { Reveal } from "../motion/reveal";

export function Content() {
  return (
    <section className="w-full flex flex-col gap-10">
      <div className="grid w-full grid-cols-1 gap-10 xl:grid-cols-5 xl:gap-3">
        <div className="xl:col-span-2">
          <Form />
        </div>
        <div className="xl:col-span-3">
          <Reveal
            y={30}
            className="relative flex h-full w-full flex-col gap-10 bg-neutral-100 dark:bg-neutral-900 p-6 md:p-8"
          >
            <CalEmbed />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
