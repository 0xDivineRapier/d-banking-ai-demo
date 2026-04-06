import React, { useEffect, createContext, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { logEvent } from '@/lib/firebase';

interface AnalyticsContextType {
  initialized: boolean;
}

const AnalyticsContext = createContext<AnalyticsContextType>({ initialized: false });

export const useAnalyticsContext = () => useContext(AnalyticsContext);

/**
 * Component that tracks page views automatically on route changes.
 */
const PageViewTracker: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Standard Firebase page view event
    logEvent('page_view', {
      page_path: location.pathname,
      page_search: location.search,
      page_title: document.title,
    });
    
    if (import.meta.env.DEV) {
      console.log(`[Analytics] Page View: ${location.pathname}`);
    }
  }, [location]);

  return null;
};

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  return (
    <AnalyticsContext.Provider value={{ initialized: true }}>
      <PageViewTracker />
      {children}
    </AnalyticsContext.Provider>
  );
};
