import React, { useState, useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { RotateCcw, ChevronDown } from 'lucide-react';
import { useI18n } from './i18n';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useChartTheme } from '@/hooks/useChartTheme';

const SECTOR_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#d1d5db', '#e5e7eb'];

const chartData = [
  { name: '1', amount: 52000, fee: 1800, count: 1250 },
  { name: '2', amount: 48000, fee: 1600, count: 1100 },
  { name: '3', amount: 93000, fee: 2100, count: 1500 },
  { name: '4', amount: 48000, fee: 1600, count: 1100 },
  { name: '5', amount: 77000, fee: 1400, count: 980 },
  { name: '6', amount: 52000, fee: 1800, count: 1250 },
  { name: '7', amount: 82000, fee: 1900, count: 1400 },
  { name: '8', amount: 48000, fee: 1600, count: 1100 },
  { name: '9', amount: 62000, fee: 1500, count: 1050 },
  { name: '10', amount: 62000, fee: 1500, count: 1050 },
  { name: '11', amount: 93000, fee: 2100, count: 1500 },
  { name: '12', amount: 82000, fee: 1900, count: 1400 },
  { name: '13', amount: 52000, fee: 1800, count: 1250 },
  { name: '14', amount: 82000, fee: 1900, count: 1400 },
  { name: '15', amount: 62000, fee: 1500, count: 1050 },
  { name: '16', amount: 62000, fee: 1500, count: 1050 },
  { name: '17', amount: 93000, fee: 2100, count: 1500 },
  { name: '18', amount: 82000, fee: 1900, count: 1400 },
  { name: '19', amount: 52000, fee: 1800, count: 1250 },
  { name: '20', amount: 82000, fee: 1900, count: 1400 },
  { name: '21', amount: 48000, fee: 1600, count: 1100 },
  { name: '22', amount: 62000, fee: 1500, count: 1050 },
  { name: '23', amount: 52000, fee: 1800, count: 1250 },
  { name: '24', amount: 93000, fee: 2100, count: 1500 },
  { name: '25', amount: 82000, fee: 1900, count: 1400 },
  { name: '26', amount: 62000, fee: 1500, count: 1050 },
  { name: '27', amount: 82000, fee: 1900, count: 1400 },
  { name: '28', amount: 93000, fee: 2100, count: 1500 },
  { name: '29', amount: 52000, fee: 1800, count: 1250 },
  { name: '30', amount: 82000, fee: 1900, count: 1400 },
];

export default function OverviewModule() {
  const { t } = useI18n();
  const { trackAction } = useAnalytics();
  const { gridColor, axisColor, secondaryAxisColor, tooltipStyle } = useChartTheme();
  const [activeDate, setActiveDate] = useState('current');
  const [timeframe, setTimeframe] = useState<'day' | 'monthly' | 'total'>('day');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleDateChange = (date: string) => {
    setActiveDate(date);
    trackAction('change_date_filter', 'overview', date);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    trackAction('refresh_dashboard', 'overview');
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const pieDataTx = useMemo(() => [
    { name: t('ovw.tech'), value: 31 },
    { name: t('ovw.goods'), value: 26 },
    { name: t('ovw.health'), value: 19 },
    { name: t('ovw.industry'), value: 13 },
    { name: t('ovw.etc'), value: 8 },
  ], [t]);

  const pieDataFee = useMemo(() => [
    { name: t('ovw.tech'), value: 38 },
    { name: t('ovw.goods'), value: 20 },
    { name: t('ovw.health'), value: 17 },
    { name: t('ovw.industry'), value: 18 },
    { name: t('ovw.etc'), value: 5 },
  ], [t]);

  return (
    <div className="max-w-[1600px] mx-auto space-y-12 pb-10 relative">
      <div className="flex flex-col gap-10">
        <div className="space-y-6 z-10 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-3">
              <div className="px-5 py-2 bg-indigo-50/80 dark:bg-indigo-900/40 backdrop-blur-sm border border-indigo-100 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
                {t('ovw.dashboard')}
              </div>
          </div>
           <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-br from-slate-900 via-slate-700 to-slate-800 dark:from-slate-100 dark:via-slate-300 dark:to-slate-200 bg-clip-text text-transparent tracking-tighter leading-tight drop-shadow-sm">
             {t('ovw.title')}
           </h1>
           <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl max-w-3xl font-medium leading-relaxed">
             {t('ovw.subtitle')}
           </p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Top Card: Virtual Account Statistics */}
        <div className="relative bg-card/70 dark:bg-slate-900/60 backdrop-blur-xl rounded-[40px] border border-slate-200/60 dark:border-slate-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 hover:scale-[1.005] transition-all duration-300">
          
          {/* Card Header & Controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-8 py-6 border-b border-slate-100/60 dark:border-slate-800/50">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
              {t('ovw.va_stats')}
            </h2>
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                2026.03.27
              </span>
              <div className="flex rounded-full p-1 border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs font-semibold">
                <button 
                  onClick={() => handleDateChange('prev')}
                  className={`px-4 py-1.5 rounded-[30px] transition-all ${activeDate === 'prev' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {t('ovw.prev_day')}
                </button>
                <button 
                  onClick={() => handleDateChange('current')}
                  className={`px-4 py-1.5 rounded-[30px] transition-all ${activeDate === 'current' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {t('ovw.current_day')}
                </button>
              </div>
              <button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className={`w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 dark:border-slate-700 bg-card dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm group ${isRefreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <RotateCcw size={14} className={`text-slate-500 dark:text-slate-400 group-active:rotate-180 transition-transform duration-500 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Refresh Overlay */}
          {isRefreshing && (
            <div className="absolute inset-0 z-50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center animate-in fade-in duration-300">
               <div className="flex flex-col items-center gap-4 p-8 bg-card dark:bg-slate-800 rounded-[32px] shadow-2xl border border-slate-200 dark:border-slate-700 animate-in zoom-in duration-300">
                  <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">{t('ops.analyzing')}</p>
               </div>
            </div>
          )}

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x border-b border-slate-100/60 dark:border-slate-800/50 py-8">
            <div className="flex flex-col items-center justify-center py-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">{t('ovw.no_tx')}</span>
              <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">1,349</span>
              <span className="text-[11px] font-black text-rose-500 mt-2 flex items-center gap-1 bg-rose-50 dark:bg-rose-900/20 px-2 py-0.5 rounded-full">
                <span className="text-[9px]">▲</span> 65
              </span>
            </div>
            <div className="flex flex-col items-center justify-center py-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">{t('ovw.tx_amount')}</span>
              <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">Rp 348.000.000,00</span>
              <span className="text-[11px] font-black text-rose-500 mt-2 flex items-center gap-1 bg-rose-50 dark:bg-rose-900/20 px-2 py-0.5 rounded-full">
                <span className="text-[9px]">▲</span> Rp 23.000.000,00
              </span>
            </div>
            <div className="flex flex-col items-center justify-center py-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">{t('ovw.tx_fee')}</span>
              <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">Rp 3.480.000,00</span>
              <span className="text-[11px] font-black text-rose-500 mt-2 flex items-center gap-1 bg-rose-50 dark:bg-rose-900/20 px-2 py-0.5 rounded-full">
                <span className="text-[9px]">▲</span> Rp 230.000,00
              </span>
            </div>
          </div>

          {/* Donut Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 max-w-4xl mx-auto">
            {/* Donut 1 */}
            <div className="relative flex items-center justify-start gap-8 group/donut">
              <div className="w-[200px] h-[200px] relative shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieDataTx}
                      innerRadius={70}
                      outerRadius={95}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                      animationBegin={400}
                      animationDuration={1500}
                    >
                      {pieDataTx.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={SECTOR_COLORS[index % SECTOR_COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{t('ovw.no_tx')}</span>
                  <span className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-1">1,349</span>
                </div>
              </div>
              <div className="space-y-3 flex-1">
                {pieDataTx.map((d, i) => (
                  <div key={i} className="flex items-center justify-between text-xs font-semibold group-hover/donut:translate-x-1 transition-transform duration-300" style={{ transitionDelay: `${i * 50}ms` }}>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: SECTOR_COLORS[i] }}></div>
                      <span className="text-slate-600 dark:text-slate-400">{d.name}</span>
                    </div>
                    <span className="text-slate-800 dark:text-slate-200 font-bold">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Donut 2 */}
            <div className="relative flex items-center justify-start gap-8 group/donut">
              <div className="w-[200px] h-[200px] relative shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieDataFee}
                      innerRadius={70}
                      outerRadius={95}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                      animationBegin={600}
                      animationDuration={1500}
                    >
                      {pieDataFee.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={SECTOR_COLORS[index % SECTOR_COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{t('ovw.tx_fee')}</span>
                  <span className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-1">Rp 3.48m</span>
                </div>
              </div>
              <div className="space-y-3 flex-1">
                {pieDataFee.map((d, i) => (
                  <div key={i} className="flex items-center justify-between text-xs font-semibold group-hover/donut:translate-x-1 transition-transform duration-300" style={{ transitionDelay: `${i * 50}ms` }}>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: SECTOR_COLORS[i] }}></div>
                      <span className="text-slate-600 dark:text-slate-400">{d.name}</span>
                    </div>
                    <span className="text-slate-800 dark:text-slate-200 font-bold">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Card: Transactions Chart */}
        <div className="bg-card/70 dark:bg-slate-900/60 backdrop-blur-xl rounded-[40px] border border-slate-200/60 dark:border-slate-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] overflow-hidden p-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-4">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
              {t('ovw.chart_title')}
            </h2>
            <div className="flex items-center gap-3 flex-wrap">
              {/* Selectors */}
              <div className="flex items-center border border-slate-200 dark:border-slate-700 bg-card dark:bg-slate-800 rounded-xl px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 shadow-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <span>{t('ovw.all_clients')}</span>
                <ChevronDown size={14} className="ml-2 text-slate-400" />
              </div>
              <div className="flex items-center border border-slate-200 dark:border-slate-700 bg-card dark:bg-slate-800 rounded-xl px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 shadow-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <span>2026</span>
                <ChevronDown size={14} className="ml-2 text-slate-400" />
              </div>
              <div className="flex items-center border border-slate-200 dark:border-slate-700 bg-card dark:bg-slate-800 rounded-xl px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 shadow-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <span>03</span>
                <ChevronDown size={14} className="ml-2 text-slate-400" />
              </div>
              {/* Toggle Day/Monthly/Total */}
              <div className="flex rounded-full p-1 ml-2 border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs font-bold shadow-inner">
                <button 
                  onClick={() => setTimeframe('day')}
                  className={`px-5 py-2 rounded-[30px] transition-all ${timeframe === 'day' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
                >
                  {t('ovw.daily')}
                </button>
                <button 
                  onClick={() => setTimeframe('monthly')}
                  className={`px-5 py-2 rounded-[30px] transition-all ${timeframe === 'monthly' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
                >
                  {t('ovw.monthly')}
                </button>
                <button 
                  onClick={() => setTimeframe('total')}
                  className={`px-5 py-2 rounded-[30px] transition-all ${timeframe === 'total' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
                >
                  {t('ovw.all_clients')}
                </button>
              </div>
            </div>
          </div>

          <div className="h-[350px] w-full text-xs font-semibold px-2">
            {/* Legend above the chart */}
            <div className="flex justify-center items-center gap-8 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                <span className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">{t('ovw.amount')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                <span className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">{t('ovw.fee')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                <span className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">{t('ovw.count')}</span>
              </div>
            </div>

            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                
                {/* X Axis: 1 to 30 */}
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: axisColor, fontSize: 10, fontWeight: 600 }}
                  dy={15}
                />
                
                {/* Y Axis Left: Amount */}
                <YAxis 
                  yAxisId="left" 
                  orientation="left" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: secondaryAxisColor, fontSize: 10, fontWeight: 600 }}
                  label={{ value: '(Rp)', position: 'top', offset: -15, fill: secondaryAxisColor, fontSize: 10, fontWeight: 600 }}
                  dx={-15}
                />
                
                {/* Y Axis Right: Count */}
                <YAxis 
                  yAxisId="right" 
                  orientation="right" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: secondaryAxisColor, fontSize: 10, fontWeight: 600 }}
                  label={{ value: '(Cnt)', position: 'top', offset: -15, fill: secondaryAxisColor, fontSize: 10, fontWeight: 600 }}
                  dx={15}
                />
                
                <Tooltip
                  contentStyle={tooltipStyle}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                
                {/* Bar for Amount */}
                <Bar yAxisId="left" dataKey="amount" fill="#6366f1" barSize={10} radius={[6, 6, 0, 0]} animationBegin={800} animationDuration={1200} />
                {/* Bar for Fee */}
                <Bar yAxisId="left" dataKey="fee" fill="#10b981" barSize={10} radius={[6, 6, 0, 0]} animationBegin={1000} animationDuration={1200} />
                
                {/* Line for Count */}
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#f59e0b" 
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#ffffff', stroke: '#f59e0b', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#f59e0b' }}
                  animationBegin={1200}
                  animationDuration={1500}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
