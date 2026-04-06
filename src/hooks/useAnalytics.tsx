import { useCallback } from 'react';
import { logEvent } from '@/lib/firebase';

export function useAnalytics() {
  const trackEvent = useCallback((eventName: string, eventParams?: Record<string, unknown>) => {
    logEvent(eventName, eventParams);
  }, []);

  const trackFeatureAccess = useCallback((featureName: string) => {
    logEvent('feature_access', { feature_name: featureName });
  }, []);

  const trackAction = useCallback((actionName: string, category: string, label?: string) => {
    logEvent('user_action', { 
      action: actionName, 
      category, 
      label 
    });
  }, []);

  return {
    trackEvent,
    trackFeatureAccess,
    trackAction,
  };
}
