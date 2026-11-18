import type { Metadata } from "next";
import { OfflineApp } from "@/src/features/offline/offline-app";

export const metadata: Metadata = { title: "Offline" };

// Served by the service worker whenever a page can't load without a network.
// No server data here: everything comes from the package stored on the device.
export default function OfflinePage() {
  return <OfflineApp />;
}
