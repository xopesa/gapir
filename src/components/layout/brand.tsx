import Image from "next/image";
import Link from "next/link";
import { cn } from "@/src/lib/utils";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className={cn("brand", compact && "brand-compact")} aria-label="Gapir — обучение">
      <span className="brand-mark">
        <Image
          src="/gapir-logo.png"
          alt=""
          width={56}
          height={56}
          priority
          unoptimized
          className="brand-logo-image"
        />
      </span>
      {!compact && <strong>Gapir</strong>}
    </Link>
  );
}
