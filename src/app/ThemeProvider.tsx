'use client';

import React, { ReactNode } from 'react';
import { ThemeProvider as ThemeContextProvider } from '@/contexts/ThemeContext';

interface ThemeProviderProps {
  children: ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  return <ThemeContextProvider>{children}</ThemeContextProvider>;
}
