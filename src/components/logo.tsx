import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <Image
        src="/logo.jpg"
        alt="SMG Panel"
        width={compact ? 260 : 360}
        height={compact ? 80 : 110}
        className={compact ? "h-16 w-auto object-contain md:h-20" : "h-20 w-auto object-contain md:h-24"}
        priority
      />
    </Link>
  );
}
