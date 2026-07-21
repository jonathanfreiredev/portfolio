import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-4 px-5 py-16 text-center md:px-12 lg:px-20">
      <p className="text-eyebrow text-muted-foreground">404</p>
      <h1>Page not found</h1>
      <p className="max-w-md text-body-m text-muted-foreground">
        The page you are looking for does not exist or was moved.
      </p>
      <Button asChild>
        <Link href="/">Return Home</Link>
      </Button>
    </main>
  );
}
