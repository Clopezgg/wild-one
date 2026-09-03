import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Juan Alexander — Wild One",
    short_name: "Juan Wild One",
    description: "Invitación safari para celebrar el primer cumpleaños de Juan Alexander.",
    start_url: "/",
    display: "standalone",
    background_color: "#c8ddca",
    theme_color: "#183f2d",
    orientation: "portrait-primary",
    icons: [{ src: "/icon", sizes: "512x512", type: "image/png" }],
  };
}
