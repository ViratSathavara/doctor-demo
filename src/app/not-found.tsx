import Link from "@site/lib/navigation";
import { buttonClass, Container, h2Class, leadClass } from "@site/components/common/ui";

export default function NotFound() {
  return (
    <main className="py-19 text-center md:py-26">
      <Container className="flex animate-rise flex-col items-center gap-[18px]">
        <h1 className={h2Class()}>Page not found</h1>
        <p className={leadClass}>The page you are looking for doesn&apos;t exist or has moved.</p>
        <Link href="/" className={buttonClass("primary")}>
          Back to home
        </Link>
      </Container>
    </main>
  );
}
