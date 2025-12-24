"use client";

import { BrowserRouter } from "react-router-dom";
import App from "../../App";
import { HelmetProvider } from "../lib/react-helmet-async";
import { PartyProviderInitialState } from "../../types";

interface ClientRouterProps {
  initialState?: PartyProviderInitialState;
}

export default function ClientRouter({ initialState }: ClientRouterProps) {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <App initialState={initialState} />
      </BrowserRouter>
    </HelmetProvider>
  );
}
