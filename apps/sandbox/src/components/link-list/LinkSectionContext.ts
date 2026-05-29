import { createContext } from "react";

export interface LinkSectionContextValue {
  iconSlotReserved: boolean;
}

export const LinkSectionContext = createContext<LinkSectionContextValue | null>(null);
