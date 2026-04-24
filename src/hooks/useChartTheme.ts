import { useMemo } from 'react';
import { useTheme } from '@/components/ThemeProvider';

export interface ChartTheme {
  isDark: boolean;
  gridColor: string;
  axisColor: string;
  secondaryAxisColor: string;
  tooltipStyle: {
    backgroundColor: string;
    border: string;
    color: string;
    borderRadius: string;
    fontWeight: string;
    boxShadow: string;
  };
}

export function useChartTheme(): ChartTheme {
  const { theme } = useTheme();

  return useMemo(() => {
    const isDark =
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    const tooltipBg = isDark ? '#0f172a' : '#ffffff';
    const tooltipBorder = isDark ? '#1e293b' : '#e2e8f0';
    const tooltipText = isDark ? '#f1f5f9' : '#0f172a';

    return {
      isDark,
      gridColor: isDark ? '#1e293b' : '#f1f5f9',
      axisColor: isDark ? '#94a3b8' : '#64748b',
      secondaryAxisColor: isDark ? '#475569' : '#94a3b8',
      tooltipStyle: {
        backgroundColor: tooltipBg,
        border: `1px solid ${tooltipBorder}`,
        color: tooltipText,
        borderRadius: '12px',
        fontWeight: 'bold',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      },
    };
  }, [theme]);
}
