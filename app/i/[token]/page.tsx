import type { Metadata } from "next";
import Page from "../page";

export const metadata: Metadata = {
  title: "C — Una Noche",
  robots: { index: false, follow: false, nocache: true }
};

export default function InvitationTokenPage() {
  return <Page />;
}
