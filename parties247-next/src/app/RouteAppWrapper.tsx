"use client";

import { MemoryRouter } from "react-router-dom";
import App from "../../../App";
import { HelmetProvider } from "../lib/react-helmet-async";
import { PartyProviderInitialState } from "../../../types";

interface RouteAppWrapperProps {
  initialPath: string;
  initialState?: PartyProviderInitialState;
}

export default function RouteAppWrapper({ initialPath, initialState }: RouteAppWrapperProps) {
  return (
    <HelmetProvider>
      <MemoryRouter initialEntries={[initialPath]}>
        <App initialState={initialState} />
      </MemoryRouter>
    </HelmetProvider>
  );
}
