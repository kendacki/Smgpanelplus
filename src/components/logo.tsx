import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <Image
        src="/logo.jpg"
        alt="SMG Panel"
        width={compact ? 360 : 480}
        height={compact ? 110 : 148}
        className={compact ? "h-24 w-auto object-contain md:h-28" : "h-28 w-auto object-contain md:h-32"}
        priority
      />
    </Link>
  );
}
