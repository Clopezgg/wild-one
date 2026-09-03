import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Alexis Alessandro — Wild One",
    short_name: "Wild One",
    description: "A living safari invitation for Alexis Alessandro.",
    start_url: "/",
    display: "standalone",
    background_color: "#c7ddcc",
    theme_color: "#173b2c",
    orientation: "portrait-primary",
    icons: [{ src: "/icon", sizes: "512x512", type: "image/png" }],
  };
}
