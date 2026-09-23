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
    <Link href="/" className={cn("flex shrink-0 items-center", className)}>
      <Image
        src="/logo.png"
        alt="SMG Panel"
        width={header ? 280 : compact ? 200 : 320}
        height={header ? 74 : compact ? 52 : 84}
        className={
          header
            ? "h-12 w-auto object-contain object-left md:h-14"
            : compact
              ? "h-9 w-auto object-contain md:h-10"
              : "h-16 w-auto object-contain md:h-20"
        }
        priority
      />
    </Link>
  );
}
