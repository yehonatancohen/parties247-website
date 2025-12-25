"use client";

import React from "react";
import { PartyProvider } from "@/hooks/useParties"; // adjust path/export name to match your code

export default function Providers({ children }: { children: React.ReactNode }) {
  return <PartyProvider>{children}</PartyProvider>;
}