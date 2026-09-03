import { createIcs } from "@/lib/calendar";

export async function GET() {
  return new Response(createIcs(), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="juan-alexander-wild-one.ics"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
