// src/context/LoaderContext.tsx
import React, { createContext, useState, ReactNode } from 'react';

type LoaderContextType = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

export const LoaderContext = createContext<LoaderContextType>({
  loading: false,
  setLoading: () => {}, // No-op function as default
});

export const LoaderProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);

  return (
    <LoaderContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoaderContext.Provider>
  );
};
