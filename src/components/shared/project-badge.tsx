import { Badge } from '@/components/ui/badge';

export function ProjectBadge() {
  return (
    <Badge
      variant="outline"
      className="bg-background/80 text-muted-foreground rounded-full px-3 py-1 text-xs font-medium tracking-[0.18em] uppercase backdrop-blur"
    >
      Lello
    </Badge>
  );
}
