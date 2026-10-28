import { createContext, useContext, type ReactNode } from 'react';
import { viniContent, type PortfolioContent } from './clientModel';

const PortfolioContext = createContext<PortfolioContent>(viniContent);

export function PortfolioProvider({ data, children }: { data: PortfolioContent; children: ReactNode }) {
  return <PortfolioContext.Provider value={data}>{children}</PortfolioContext.Provider>;
}

export function usePortfolio() {
  return useContext(PortfolioContext);
}
