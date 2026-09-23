import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  compact = false,
  size = "default",
}: {
  className?: string;
  compact?: boolean;
  size?: "default" | "header";
}) {
  const header = size === "header";

  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <Image
        src="/logo.jpg"
        alt="SMG Panel"
        width={header ? 720 : compact ? 360 : 480}
        height={header ? 220 : compact ? 110 : 148}
        className={
          header
            ? "h-48 w-auto object-contain md:h-56"
            : compact
              ? "h-24 w-auto object-contain md:h-28"
              : "h-28 w-auto object-contain md:h-32"
        }
        priority
      />
    </Link>
  );
}
