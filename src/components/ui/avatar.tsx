import { cn } from "@/src/lib/utils";

interface AvatarProps {
  initials: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Avatar({ initials, size = "md", className }: AvatarProps) {
  return (
    <span className={cn("avatar", `avatar-${size}`, className)} aria-hidden="true">
      {initials}
    </span>
  );
}
