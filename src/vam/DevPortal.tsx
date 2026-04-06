
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useI18n } from './i18n';
import { useParams } from 'react-router-dom';
import { 
  Zap, 
  RefreshCw, 
  ShieldCheck, 
  BrainCircuit,
  Send,
  Sparkles,
  Terminal,
  Activity,
  Globe,
  Lock,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Code,
  Layers,
  Fingerprint,
  Key,
  Shield,
  Trash2,
  Plus,
  AlertTriangle,
  X,
  Bug,
  Eye,
  Search,
  ChevronRight,
  ShieldX,
  Cpu,
  Network,
  Database,
  FlaskConical,
  Stethoscope,
  Wind,
  EyeOff,
  Copy,
  RotateCcw,
  Wifi,
  WifiOff,
  Server,
  Gauge,
  Users
} from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { SimulationEngine, PERSONAS, PersonaType } from './SimulationEngine';
import { DoznResilientClient } from './resilient-sdk';
import { CredentialManager, AuditEntry } from './CredentialManager';

// --- AI Architect Chat Component ---

const AIArchitectChat = () => {
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: "Systems Architect online. How can I assist with your Dozn Global integration today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const lowerInput = userMsg.toLowerCase();
      let reply = "I'm processing that SDK configuration request...";
      if (lowerInput.includes('snap') || lowerInput.includes('bi')) {
        reply = "Our SNAP BI integration supports both ISO8583 mapped protocols and REST-native endpoints. Ensure your API keys are HMAC-SHA512 compliant.";
      } else if (lowerInput.includes('error') || lowerInput.includes('heal')) {
        reply = "The Payload Healer can automatically correct structural errors in your JSON bodies based on the Open Banking OpenAPI spec.";
      } else {
        reply = "Architect AI is currently offline. Refer to the standard documentation for basic SDK integration points.";
      }

      setMessages(prev => [...prev, { role: 'ai', text: reply }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', text: "Connection to Architect Brain temporarily unavailable." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="bg-slate-900 rounded-[40px] h-[600px] flex flex-col overflow-hidden border border-slate-800 shadow-2xl">
      <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <BrainCircuit size={20} />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest">AI Architect Brain</h3>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Active Session: BankDOZN-01</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Neural Link Stable</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[80%] p-5 rounded-3xl text-sm leading-relaxed ${
              m.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none shadow-xl shadow-indigo-900/20' 
                : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-700">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-slate-500 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-slate-500 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-slate-500 rounded-full"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-slate-900/80 border-t border-slate-800">
        <div className="relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about SNAP BI, SDK resilience, or Antasena compliance..."
            className="w-full bg-slate-800 border border-slate-700 rounded-2xl pl-6 pr-14 py-4 text-sm text-white outline-none focus:border-indigo-500 transition-all"
          />
          <button 
            onClick={handleSend}
            className="absolute right-2 top-2 w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 transition-all"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Synthetic Sandbox Component ---

const SyntheticSandbox = () => {
  const [persona, setPersona] = useState<PersonaType>('PT_GLOBAL_CORP');
  const [entropy, setEntropy] = useState(0.2);
  const [logs, setLogs] = useState<any[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const engine = useMemo(() => new SimulationEngine(), []);

  const runSimulation = async () => {
    setIsSimulating(true);
    try {
      const newLogs = await engine.generateStream(persona, entropy);
      setLogs(prev => [...newLogs, ...prev].slice(0, 50));
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-card/70 dark:bg-slate-900/60 backdrop-blur-xl p-8 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] space-y-8 h-full">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/30 dark:to-emerald-800/10 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center shadow-inner border border-emerald-100/50 dark:border-emerald-800/50">
              <FlaskConical size={24} className="drop-shadow-sm" />
            </div>
            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Simulation Control</h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Users size={12} /> Active Persona
              </label>
              <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                {Object.values(PERSONAS).map(p => (
                  <button 
                    key={p.id}
                    onClick={() => setPersona(p.id)}
                    className={`p-4 rounded-2xl text-left transition-all border outline-none ${
                      persona === p.id 
                        ? 'bg-gradient-to-br from-emerald-50/50 to-white dark:from-emerald-900/40 dark:to-slate-900 border-emerald-200 dark:border-emerald-700/50 ring-2 ring-emerald-500/20 shadow-sm' 
                        : 'bg-card dark:bg-slate-900/40 border-slate-100 dark:border-slate-800/80 hover:border-emerald-200/60 dark:hover:border-emerald-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <p className={`text-xs font-black ${persona === p.id ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>{p.label}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 leading-tight">{p.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Wind size={12} /> Entropy Level
                </label>
                <div className="px-2 py-0.5 bg-emerald-100/50 dark:bg-emerald-900/30 rounded-md border border-emerald-200/50 dark:border-emerald-800/50">
                  <span className="text-[10px] font-mono font-black text-emerald-700 dark:text-emerald-400">{(entropy * 100).toFixed(0)}%</span>
                </div>
              </div>
              <input 
                type="range" min="0" max="1" step="0.1" 
                value={entropy}
                onChange={(e) => setEntropy(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            <button 
              onClick={runSimulation}
              disabled={isSimulating}
              className="group relative w-full overflow-hidden rounded-2xl p-[1px] disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-emerald-400 to-indigo-500 animate-[pulse_3s_ease-in-out_infinite]" />
              <div className="relative bg-[#0A0A0B] px-6 py-4 rounded-2xl flex items-center justify-center gap-2 transition-all">
                {isSimulating ? <RefreshCw className="animate-spin text-emerald-400" size={16} /> : <Zap className="text-emerald-400 group-hover:text-emerald-300 transition-colors" size={16} />}
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-50 drop-shadow-sm group-hover:text-white transition-colors">
                  Generate Synthetic Stream
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="lg:col-span-8">
        <div className="relative bg-[#0A0A0B] rounded-[40px] border border-slate-800/80 shadow-[0_0_40px_rgba(16,185,129,0.03)] overflow-hidden flex flex-col h-[650px] group">
          {/* Subtle Glitch Overlay */}
          <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none mix-blend-overlay"></div>
          
          <div className="p-6 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60 backdrop-blur-xl z-10 relative">
            <div className="flex items-center gap-3">
              <Terminal size={18} className="text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
              <h3 className="text-sm font-black text-white uppercase tracking-widest drop-shadow-sm flex items-center gap-1">
                Telemetry Stream 
                <span className="w-1.5 h-4 bg-emerald-500/80 animate-ping inline-block delay-100" style={{ animationDuration: '1.5s' }}></span>
              </h3>
            </div>
            <button onClick={() => setLogs([])} className="text-[9px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-1">
              <Trash2 size={12}/> Clear Buffer
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 font-mono text-[10px] space-y-2 custom-scrollbar z-10 relative">
            {logs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-emerald-500/20 group-hover:text-emerald-500/40 transition-colors">
                <Wind size={48} className="mb-6 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-pulse" />
                <p className="uppercase tracking-[0.4em] text-xs font-black">Awaiting Stream Data</p>
                <div className="w-1/3 h-1 bg-emerald-500/20 rounded-full mt-6 overflow-hidden">
                  <div className="w-1/2 h-full bg-emerald-500/40 animate-pulse rounded-full" style={{ animationDuration: '2s' }}></div>
                </div>
              </div>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="group/log p-3 bg-slate-800/30 border border-slate-700/30 hover:bg-slate-800/80 hover:border-emerald-500/30 rounded-lg transition-all animate-in slide-in-from-right duration-300 relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-emerald-500/0 group-hover/log:bg-emerald-500/50 transition-colors"></div>
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="text-slate-500 font-bold">[{log.timestamp?.split('T')[1]?.split('.')[0] || '00:00:00'}]</span>
                    <span className={`px-1.5 py-0.5 rounded-[4px] text-[8px] font-black ${
                      log.severity === 'CRITICAL' ? 'bg-rose-500 text-white shadow-[0_0_8px_rgba(244,63,94,0.6)]' : 
                      log.severity === 'WARN' ? 'bg-amber-500 text-white shadow-[0_0_8px_rgba(245,158,11,0.6)]' : 'bg-emerald-500 text-white shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                    }`}>{log.severity}</span>
                    <span className="text-indigo-400 font-black">{log.service_module}</span>
                    <span className="text-slate-400">{log.protocol}</span>
                    <span className="ml-auto text-slate-600 group-hover/log:text-slate-400 transition-colors">{log.institution_id}</span>
                  </div>
                  <div className="text-slate-300 break-all pl-2 border-l border-slate-700/50 group-hover/log:border-emerald-500/30 group-hover/log:text-emerald-50/90 transition-colors leading-relaxed">{log.raw_payload}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- SDK Node Component ---

const SDKDemo = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [isRequesting, setIsRequesting] = useState(false);
  const [mode, setMode] = useState<'sandbox' | 'production'>('sandbox');

  const runRequest = async () => {
    setIsRequesting(true);
    const client = new DoznResilientClient({
      clientId: 'XYZ_DEMO_PARTNER',
      clientSecret: 'sk_test_51XYZ',
      baseUrl: 'https://api.bankxyz.io',
      mode: mode
    });

    setLogs(prev => [`[SDK] Initiating resilient request to /v2.0/transfer-va...`, ...prev]);
    
    try {
      const response = await client.request('POST', '/v2.0/transfer-va', {
        partnerServiceId: '9012',
        customerNo: '00000001',
        virtualAccountNo: '901200000001',
        totalAmount: { value: "1500000.00", currency: "IDR" },
        trxId: `TRX-${Date.now()}`
      });

      if (response.remediationHistory.length > 0) {
        response.remediationHistory.forEach((step: any) => {
          setLogs(prev => [`[HEALER] ${step.action}: ${step.details}`, ...prev]);
        });
      }
      setLogs(prev => [`[SUCCESS] Response: ${response.responseMessage} (Ref: ${response.data.referenceNo})`, ...prev]);
    } catch (e: any) {
      setLogs(prev => [`[ERROR] ${e.message}`, ...prev]);
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-card dark:bg-slate-900/60 backdrop-blur-xl p-8 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center">
              <Cpu size={24} />
            </div>
            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">SDK Node Configuration</h3>
          </div>

          <div className="space-y-6">
            <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
              <button 
                onClick={() => setMode('sandbox')}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'sandbox' ? 'bg-card dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400 dark:text-slate-500'}`}
              >Sandbox</button>
              <button 
                onClick={() => setMode('production')}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'production' ? 'bg-slate-900 dark:bg-indigo-600 text-white shadow-sm' : 'text-slate-400 dark:text-slate-500'}`}
              >Production</button>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <ShieldCheck size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Resilience Features</span>
              </div>
              <ul className="space-y-2">
                {['Auto Token Refresh', 'Clock Drift Correction', 'Antasena Compliance Guard', 'Idempotency Auto-Retry'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-[10px] font-bold text-slate-600 dark:text-slate-400">
                    <div className="w-1 h-1 bg-indigo-400 rounded-full"></div>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <button 
              onClick={runRequest}
              disabled={isRequesting}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:opacity-50 transition-all"
            >
              {isRequesting ? <RefreshCw className="animate-spin" size={16} /> : <Send size={16} />}
              Execute Resilient Request
            </button>
          </div>
        </div>
      </div>

      <div className="lg:col-span-7">
        <div className="bg-slate-900 rounded-[40px] border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[550px]">
          <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
            <div className="flex items-center gap-3">
              <Terminal size={18} className="text-indigo-400" />
              <h3 className="text-sm font-black text-white uppercase tracking-widest">SDK Event Log</h3>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-8 font-mono text-[11px] space-y-3 custom-scrollbar">
            {logs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-20 text-white">
                <Code size={48} className="mb-4" />
                <p className="uppercase tracking-[0.3em]">Awaiting SDK Activity...</p>
              </div>
            ) : (
              logs.map((log, i) => (
                <div key={i} className={`animate-in slide-in-from-left duration-300 ${
                  log.includes('[ERROR]') ? 'text-rose-400' : 
                  log.includes('[HEALER]') ? 'text-amber-400' : 
                  log.includes('[SUCCESS]') ? 'text-emerald-400' : 'text-slate-400'
                }`}>{log}</div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Payload Healer Component ---

const PayloadHealerUI = () => {
  const [payload, setPayload] = useState('{\n  "partnerServiceId": "9012",\n  "customerNo": "00000001",\n  "totalAmount": {\n    "val": "10000.00",\n    "cur": "IDR"\n  }\n}');
  const [suggestion, setSuggestion] = useState<any>(null);
  const [isHealing, setIsHealing] = useState(false);

  const healPayload = async () => {
    setIsHealing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuggestion({ 
        status: 'VALID', 
        fixes: ['Added missing "currency" field in totalAmount structure.'], 
        healed_payload: '{\n  "partnerServiceId": "9012",\n  "customerNo": "00000001",\n  "totalAmount": {\n    "value": "10000.00",\n    "currency": "IDR"\n  }\n}' 
      });
    } catch (e) {
      setSuggestion({ status: 'CORRUPT', fixes: ['Unable to analyze payload locally.'], healed_payload: payload });
    } finally {
      setIsHealing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div className="space-y-6">
        <div className="bg-card dark:bg-slate-900/60 backdrop-blur-xl p-8 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center justify-center">
              <Bug size={24} />
            </div>
            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Payload Healer</h3>
          </div>
          <textarea 
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            className="w-full h-80 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 font-mono text-xs text-slate-700 dark:text-slate-200 outline-none focus:border-rose-500 transition-all"
          />
          <button 
            onClick={healPayload}
            disabled={isHealing}
            className="w-full py-4 bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-rose-100 flex items-center justify-center gap-2 hover:bg-rose-700 disabled:opacity-50 transition-all"
          >
            {isHealing ? <RefreshCw className="animate-spin" size={16} /> : <Stethoscope size={16} />}
            Diagnose & Heal Payload
          </button>
        </div>
      </div>

      <div className="h-full">
        {suggestion ? (
          <div className="bg-slate-900 p-10 rounded-[40px] border border-slate-800 shadow-2xl space-y-8 h-full animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
              <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${suggestion.status === 'VALID' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                {suggestion.status}
              </span>
              <Sparkles size={20} className="text-indigo-400" />
            </div>
            <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Required Fixes</p>
              <div className="space-y-2">
                {suggestion.fixes?.map((f: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 text-xs text-slate-300">
                    <AlertTriangle size={14} className="text-amber-500 shrink-0" />{f}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Healed Payload</p>
              <pre className="p-6 bg-slate-800 rounded-2xl text-[10px] text-emerald-400 font-mono overflow-x-auto">
                {suggestion.healed_payload}
              </pre>
            </div>
          </div>
        ) : (
          <div className="h-full border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[40px] flex flex-col items-center justify-center text-center p-10 bg-slate-50/50 dark:bg-slate-900/20">
            <Sparkles size={48} className="text-slate-300 dark:text-slate-700 mb-4 opacity-20" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Input corrupted JSON payload<br/>to trigger AI-assisted remediation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Credential Guard Component ---

const CredentialGuard = () => {
  const [showSecret, setShowSecret] = useState(false);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  const [keyInput, setKeyInput] = useState('');
  const [validationResult, setValidationResult] = useState<any>(null);
  const [ipInput, setIpInput] = useState('');
  const [ipRisk, setIpRisk] = useState<any>(null);

  const MOCK_CREDENTIALS = [
    { id: 'CRED-001', partner: 'PT. ABC Corp', clientId: 'XYZ_ABC_001', status: 'ACTIVE', lastRotated: '2026-03-15', expiresIn: '89 days' },
    { id: 'CRED-002', partner: 'DEF Payment Gateway', clientId: 'XYZ_DEF_041', status: 'ACTIVE', lastRotated: '2026-03-10', expiresIn: '84 days' },
    { id: 'CRED-003', partner: 'Modalku Finance', clientId: 'XYZ_MDK_099', status: 'EXPIRING', lastRotated: '2025-12-20', expiresIn: '4 days' },
  ];

  const handleValidateKey = () => {
    const result = CredentialManager.validate_public_key(keyInput);
    setValidationResult(result);
    CredentialManager.log_security_audit(result.valid ? 'KEY_GEN' : 'VALIDATION_FAILURE', 'admin', 'DEMO_CIF');
    setAuditLog(CredentialManager.get_audit_trail());
  };

  const handleCheckIp = () => {
    const result = CredentialManager.analyze_ip_risk(ipInput);
    setIpRisk(result);
    CredentialManager.log_security_audit('IP_WHITELIST_ADD', 'admin', 'DEMO_CIF', { ip: ipInput, risk: result.risk_level });
    setAuditLog(CredentialManager.get_audit_trail());
  };

  const handleRotateSecret = (credId: string) => {
    CredentialManager.log_security_audit('KEY_GEN', 'admin', credId, { action: 'ROTATE', newExpiry: '90 days' });
    setAuditLog(CredentialManager.get_audit_trail());
  };

  useEffect(() => {
    setAuditLog(CredentialManager.get_audit_trail());
  }, []);

  return (
    <div className="space-y-8">
      {/* Credential Registry */}
      <div className="bg-card dark:bg-slate-900/60 backdrop-blur-xl rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Key size={20} className="text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">SNAP BI Credential Registry</h3>
          </div>
          <span className="px-4 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-[9px] font-black uppercase tracking-widest">HMAC-SHA512</span>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-left">
            <tr>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Partner Entity</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Client ID</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Expires In</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {MOCK_CREDENTIALS.map(cred => (
              <tr key={cred.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-8 py-6">
                  <p className="font-black text-slate-800 dark:text-slate-200">{cred.partner}</p>
                  <p className="text-[10px] font-mono text-slate-400 dark:text-slate-500">{cred.id}</p>
                </td>
                <td className="px-8 py-6 font-mono text-xs font-bold text-slate-700 dark:text-slate-400">{cred.clientId}</td>
                <td className="px-8 py-6">
                  <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${
                    cred.status === 'EXPIRING' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                  }`}>{cred.expiresIn}</span>
                </td>
                <td className="px-8 py-6 text-right">
                  <button onClick={() => handleRotateSecret(cred.id)} className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:text-white transition-all">
                    <RotateCcw size={14} className="inline mr-1" /> Rotate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Key Validator */}
        <div className="bg-card dark:bg-slate-900/60 backdrop-blur-xl p-8 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <Shield size={20} className="text-indigo-600 dark:text-indigo-400" />
            <h4 className="text-lg font-black text-slate-800 dark:text-slate-100">RSA Key Validator</h4>
          </div>
          <textarea 
            value={keyInput} 
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="Paste RSA-2048 Public Key in PEM format..."
            className="w-full h-32 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-2xl p-4 font-mono text-[10px] text-slate-700 dark:text-slate-200 outline-none"
          />
          <button onClick={handleValidateKey} className="w-full py-3 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest">
            Validate Key Compliance
          </button>
          {validationResult && (
            <div className={`p-4 rounded-2xl text-xs font-bold ${validationResult.valid ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-800/50'}`}>
              {validationResult.valid ? `✓ Valid RSA-${validationResult.bits} Key` : `✗ ${validationResult.error}`}
            </div>
          )}
        </div>

        {/* IP Risk Analyzer */}
        <div className="bg-card dark:bg-slate-900/60 backdrop-blur-xl p-8 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <Globe size={20} className="text-indigo-600 dark:text-indigo-400" />
            <h4 className="text-lg font-black text-slate-800 dark:text-slate-100">IP Risk Intelligence</h4>
          </div>
          <input 
            value={ipInput} 
            onChange={(e) => setIpInput(e.target.value)}
            placeholder="Enter IP address to analyze..."
            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-2xl px-5 py-3 text-sm font-bold dark:text-slate-200 outline-none"
          />
          <button onClick={handleCheckIp} className="w-full py-3 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest">
            Analyze IP Threat Level
          </button>
          {ipRisk && (
            <div className={`p-4 rounded-2xl border space-y-2 ${
              ipRisk.risk_level === 'HIGH' ? 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800/50' : ipRisk.risk_level === 'MEDIUM' ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800/50' : 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/50'
            }`}>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                  ipRisk.risk_level === 'HIGH' ? 'bg-red-500 text-white' : ipRisk.risk_level === 'MEDIUM' ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'
                }`}>{ipRisk.risk_level}</span>
                <span className="text-xs font-black text-slate-800 dark:text-slate-200">{ipInput}</span>
              </div>
              {ipRisk.reasons.map((r: string, i: number) => (
                <p key={i} className="text-[10px] text-slate-600 dark:text-slate-400 font-bold">• {r}</p>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Audit Trail */}
      {auditLog.length > 0 && (
        <div className="bg-slate-900 p-8 rounded-[40px] border border-slate-800 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <Fingerprint size={20} className="text-blue-400" />
            <h4 className="text-sm font-black text-white uppercase tracking-widest">Security Audit Trail</h4>
          </div>
          <div className="space-y-2 font-mono text-[10px] max-h-48 overflow-y-auto custom-scrollbar">
            {auditLog.map((entry, i) => (
              <div key={i} className="flex items-center gap-4 text-slate-400 border-l-2 border-blue-500/20 pl-4 py-1">
                <span className="text-slate-600">[{new Date(entry.timestamp).toLocaleTimeString()}]</span>
                <span className={`px-1.5 py-0.5 rounded text-[8px] font-black ${
                  entry.action_type === 'VALIDATION_FAILURE' ? 'bg-red-500 text-white' : 'bg-blue-500/20 text-blue-400'
                }`}>{entry.action_type}</span>
                <span className="text-slate-500">{entry.actor_username} → {entry.client_cif}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --- Sentinel Monitor Component ---

const SentinelMonitor = () => {
  const [nodes, setNodes] = useState([
    { id: 'SNAP-GW-01', label: 'SNAP BI Gateway', status: 'HEALTHY', uptime: '99.99%', latency: '12ms', lastCheck: new Date().toISOString(), protocol: 'SNAP_BI' },
    { id: 'CORE-JKT-01', label: 'Core Banking (JKT)', status: 'HEALTHY', uptime: '99.97%', latency: '8ms', lastCheck: new Date().toISOString(), protocol: 'ISO8583' },
    { id: 'BIFAST-01', label: 'BI-FAST Rail', status: 'HEALTHY', uptime: '99.95%', latency: '45ms', lastCheck: new Date().toISOString(), protocol: 'SOCKET' },
    { id: 'RTGS-01', label: 'RTGS Settlement', status: 'DEGRADED', uptime: '99.80%', latency: '120ms', lastCheck: new Date().toISOString(), protocol: 'SOCKET' },
    { id: 'H2H-GW-01', label: 'H2H Partner Gateway', status: 'HEALTHY', uptime: '99.98%', latency: '18ms', lastCheck: new Date().toISOString(), protocol: 'SNAP_BI' },
    { id: 'SDK-MESH-01', label: 'Resilient SDK Mesh', status: 'HEALTHY', uptime: '100.00%', latency: '2ms', lastCheck: new Date().toISOString(), protocol: 'SNAP_BI' },
  ]);

  const [alerts, setAlerts] = useState([
    { id: 'ALT-001', severity: 'WARN', message: 'RTGS latency elevated above 100ms threshold', node: 'RTGS-01', timestamp: new Date(Date.now() - 300000).toISOString() },
    { id: 'ALT-002', severity: 'INFO', message: 'Scheduled maintenance window for BIFAST-01 at 02:00 WIB', node: 'BIFAST-01', timestamp: new Date(Date.now() - 600000).toISOString() },
    { id: 'ALT-003', severity: 'CRITICAL', message: 'Clock drift detected on SNAP-GW-01 (5.2s offset)', node: 'SNAP-GW-01', timestamp: new Date(Date.now() - 120000).toISOString(), resolved: true },
  ]);

  // Simulated heartbeat
  useEffect(() => {
    const interval = setInterval(() => {
      setNodes(prev => prev.map(n => ({
        ...n,
        lastCheck: new Date().toISOString(),
        latency: n.status === 'DEGRADED' 
          ? `${100 + Math.floor(Math.random() * 50)}ms` 
          : `${Math.floor(Math.random() * 30 + 5)}ms`
      })));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      {/* System Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Nodes Online', val: nodes.filter(n => n.status === 'HEALTHY').length + '/' + nodes.length, color: 'text-emerald-600 dark:text-emerald-400', icon: Server },
          { label: 'Avg Latency', val: Math.round(nodes.reduce((a, n) => a + parseInt(n.latency), 0) / nodes.length) + 'ms', color: 'text-blue-600 dark:text-blue-400', icon: Gauge },
          { label: 'Active Alerts', val: alerts.filter(a => !('resolved' in a)).length.toString(), color: 'text-amber-600 dark:text-amber-400', icon: AlertTriangle },
          { label: 'Uptime SLA', val: '99.95%', color: 'text-indigo-600 dark:text-indigo-400', icon: Activity },
        ].map((s, i) => (
          <div key={i} className="bg-card dark:bg-slate-900/60 backdrop-blur-xl p-6 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm">
            <s.icon size={20} className={`${s.color} mb-3`} />
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{s.label}</p>
            <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
          </div>
        ))}
      </div>

      {/* Node Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nodes.map(node => (
          <div key={node.id} className={`bg-card dark:bg-slate-900/60 backdrop-blur-xl p-8 rounded-[32px] border shadow-sm hover:shadow-lg transition-all group ${
            node.status === 'DEGRADED' ? 'border-amber-200 dark:border-amber-800/50 bg-amber-50/30 dark:bg-amber-900/10' : 'border-slate-200 dark:border-slate-800'
          }`}>
            <div className="flex justify-between items-start mb-6">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                node.status === 'HEALTHY' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
              }`}>
                {node.status === 'HEALTHY' ? <Wifi size={24} /> : <WifiOff size={24} />}
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${node.status === 'HEALTHY' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-pulse'}`}></div>
                <span className={`text-[9px] font-black uppercase tracking-widest ${node.status === 'HEALTHY' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>{node.status}</span>
              </div>
            </div>
            <h4 className="text-lg font-black text-slate-800 dark:text-slate-100 tracking-tight mb-1">{node.label}</h4>
            <p className="text-[10px] font-mono text-slate-400 dark:text-slate-500 mb-4">{node.id}</p>
            <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between text-[10px] font-bold">
                <span className="text-slate-400 dark:text-slate-500 uppercase tracking-widest">Uptime</span>
                <span className="text-slate-800 dark:text-slate-200">{node.uptime}</span>
              </div>
              <div className="flex justify-between text-[10px] font-bold">
                <span className="text-slate-400 dark:text-slate-500 uppercase tracking-widest">Latency</span>
                <span className={parseInt(node.latency) > 50 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}>{node.latency}</span>
              </div>
              <div className="flex justify-between text-[10px] font-bold">
                <span className="text-slate-400 dark:text-slate-500 uppercase tracking-widest">Protocol</span>
                <span className="text-blue-600 dark:text-blue-400 font-mono underline decoration-blue-500/30 underline-offset-4">{node.protocol}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Alert Feed */}
      <div className="bg-slate-900 p-8 rounded-[40px] border border-slate-800 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <ShieldAlert size={20} className="text-amber-400" />
          <h4 className="text-sm font-black text-white uppercase tracking-widest">Alert Feed</h4>
        </div>
        <div className="space-y-3">
          {alerts.map(alert => (
            <div key={alert.id} className={`flex items-center gap-4 p-4 rounded-2xl border ${
              'resolved' in alert ? 'bg-slate-800/50 border-slate-700/50 opacity-50' :
              alert.severity === 'CRITICAL' ? 'bg-red-500/10 border-red-500/30' :
              alert.severity === 'WARN' ? 'bg-amber-500/10 border-amber-500/30' :
              'bg-blue-500/10 border-blue-500/30'
            }`}>
              <span className={`px-2 py-0.5 rounded text-[8px] font-black ${
                alert.severity === 'CRITICAL' ? 'bg-red-500 text-white' :
                alert.severity === 'WARN' ? 'bg-amber-500 text-white' : 'bg-blue-500 text-white'
              }`}>{alert.severity}</span>
              <span className="text-xs text-slate-300 font-bold flex-1">{alert.message}</span>
              <span className="text-[10px] font-mono text-slate-500">{alert.node}</span>
              {'resolved' in alert && <CheckCircle2 size={14} className="text-emerald-500" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Main DevPortal Module ---

export default function DevPortal() {
  const { t } = useI18n();
  const { tab } = useParams();
  
  const getInitialTab = () => {
    if (tab === 'security') return 'CREDENTIAL';
    if (tab === 'monitor') return 'SENTINEL';
    if (tab === 'ai') return 'SANDBOX';
    return 'SANDBOX';
  };
  
  const [activeTab, setActiveTab] = useState<'AI' | 'SDK' | 'SANDBOX' | 'HEALER' | 'CREDENTIAL' | 'SENTINEL'>(getInitialTab() as any);

  useEffect(() => {
    if (tab === 'security') setActiveTab('CREDENTIAL');
    else if (tab === 'monitor') setActiveTab('SENTINEL');
    else if (tab === 'ai') setActiveTab('SANDBOX');
  }, [tab]);

  const TABS = [
    { id: 'SANDBOX', label: t('dev.simulation'), icon: FlaskConical },
    { id: 'SDK', label: t('dev.sdk'), icon: Cpu },
    { id: 'AI', label: t('dev.architect'), icon: BrainCircuit },
    { id: 'HEALER', label: t('dev.healer'), icon: Stethoscope },
    { id: 'CREDENTIAL', label: t('dev.credential'), icon: Key },
    { id: 'SENTINEL', label: t('dev.sentinel'), icon: Shield },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700 relative">
      <div className="flex flex-col gap-10">
        <div className="space-y-6 z-10">
          <div className="flex items-center gap-3">
              <div className="px-5 py-2 bg-indigo-50/80 dark:bg-indigo-900/40 backdrop-blur-sm border border-indigo-100 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">{t('dev.ecosystem')}</div>
          </div>
           <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-br from-slate-900 via-slate-700 to-slate-800 dark:from-slate-100 dark:via-slate-300 dark:to-slate-200 bg-clip-text text-transparent tracking-tighter leading-tight drop-shadow-sm">{t('dev.title')}</h1>
           <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl max-w-3xl font-medium leading-relaxed">{t('dev.subtitle')}</p>
        </div>

        <div className="flex bg-card/60 dark:bg-slate-900/60 backdrop-blur-xl p-2.5 rounded-[40px] border border-slate-200/60 dark:border-slate-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] overflow-x-auto no-scrollbar w-full xl:w-max z-10 transition-all">
          {TABS.map(t => (
            <button 
              key={t.id} 
              onClick={() => setActiveTab(t.id as any)} 
              className={`flex items-center gap-2.5 px-6 py-4 rounded-[30px] text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap outline-none ${activeTab === t.id ? 'bg-indigo-600 text-white shadow-[0_8px_20px_-6px_rgba(79,70,229,0.5)] scale-[1.02]' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-slate-800/50'}`}
            >
              <t.icon size={16} className={activeTab === t.id ? 'animate-pulse' : ''} />{t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4">
        {activeTab === 'AI' && <AIArchitectChat />}
        {activeTab === 'SDK' && <SDKDemo />}
        {activeTab === 'SANDBOX' && <SyntheticSandbox />}
        {activeTab === 'HEALER' && <PayloadHealerUI />}
        {activeTab === 'CREDENTIAL' && <CredentialGuard />}
        {activeTab === 'SENTINEL' && <SentinelMonitor />}
      </div>
    </div>
  );
}
