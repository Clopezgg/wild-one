import type { AnimalKey } from "@/lib/safariRoles";

export function AnimalGlyph({ animal, title }: { animal: AnimalKey; title?: string }) {
  const extras: Record<AnimalKey, React.ReactNode> = {
    lion: <path d="M14 20c-7-3-8-13-2-17 6-4 15-1 16 6 1 6-4 12-11 12" />,
    elephant: <path d="M24 15c0 7-2 12-6 12-2 0-3-2-2-4 1-3 1-6-1-8M8 9C3 8 2 17 8 18" />,
    giraffe: <path d="M12 16V5c0-3 2-4 5-3l4 2M11 3 9 1M19 3l2-2" />,
    monkey: <path d="M9 9C3 7 2 17 8 19M23 9c6-2 7 8 1 10" />,
    parrot: <path d="M20 12c7-1 8 5 3 7M11 24l-4 6M16 24l2 6" />,
    zebra: <path d="m9 8 4 3m-5 3 5 3m5-11 5 4m-5 2 6 4" />,
    leopard: <><circle cx="10" cy="10" r="1" /><circle cx="22" cy="11" r="1" /><circle cx="13" cy="19" r="1" /><circle cx="21" cy="21" r="1" /></>,
  };
  return (
    <svg viewBox="0 0 32 32" role={title ? "img" : undefined} aria-hidden={title ? undefined : true} className="animal-glyph">
      {title && <title>{title}</title>}
      <path d="M9 8c2-6 12-7 15-1 3 5 1 15-4 18-5 3-12-1-13-7-1-4 0-7 2-10Z" />
      <circle cx="12.5" cy="13" r="1.2" className="glyph-eye" /><circle cx="20.5" cy="13" r="1.2" className="glyph-eye" />
      {extras[animal]}
    </svg>
  );
}

