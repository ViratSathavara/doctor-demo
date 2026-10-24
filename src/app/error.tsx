"use client";

import { useEffect } from "react";
import { buttonClass, Container, h2Class } from "@site/components/common/ui";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="py-19 text-center md:py-26">
      <Container className="flex animate-rise flex-col items-center gap-[18px]">
        <h1 className={h2Class()}>Something went wrong</h1>
        <button type="button" onClick={() => retry()} className={buttonClass("primary")}>
          Try again
        </button>
      </Container>
    </main>
  );
}
