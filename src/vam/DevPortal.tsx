
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Zap, 
  RefreshCw, 
  ShieldCheck, 
  BrainCircuit,
  Code2,
  Send,
  Sparkles,
  Terminal,
  Activity,
  Globe,
  Lock,
  ArrowRight,
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
  FileText,
  X,
  Bug,
  Download,
  Eye,
  Search,
  ChevronRight,
  ShieldX,
  Cpu,
  Network,
  Database,
  FlaskConical,
  Stethoscope,
  Wind
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { SimulationEngine, PERSONAS, PersonaType } from './SimulationEngine';
import { DoznResilientClient, sdkUsageExample } from './resilient-sdk';

// --- AI Architect Chat Component ---

const AIArchitectChat = () => {
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: "Systems Architect online. How can I assist with your Bank XYZ integration today?" }
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
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: `You are the Bank XYZ Senior Solutions Architect. 
          You help developers integrate with the Zenith Banking VAM Control Plane using SNAP BI protocols.
          Be technical, helpful, and concise. Refer to Bank XYZ and its resilient SDK.`
        }
      });
      setMessages(prev => [...prev, { role: 'ai', text: response.text || "I'm processing that request..." }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', text: "Connection to Architect Brain lost. Please check your API key." }]);
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
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Active Session: Zenith-01</p>
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
  const [persona, setPersona] = useState<PersonaType>('PT_DOZN_INDONESIA');
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
        <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
              <FlaskConical size={24} />
            </div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Simulation Control</h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Persona</label>
              <div className="grid grid-cols-1 gap-2">
                {Object.values(PERSONAS).map(p => (
                  <button 
                    key={p.id}
                    onClick={() => setPersona(p.id)}
                    className={`p-4 rounded-2xl text-left transition-all border ${
                      persona === p.id 
                        ? 'bg-emerald-50 border-emerald-200 ring-2 ring-emerald-500/20' 
                        : 'bg-slate-50 border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <p className={`text-xs font-black ${persona === p.id ? 'text-emerald-700' : 'text-slate-700'}`}>{p.label}</p>
                    <p className="text-[10px] text-slate-400 mt-1 leading-tight">{p.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Entropy Level</label>
                <span className="text-[10px] font-mono font-bold text-emerald-600">{(entropy * 100).toFixed(0)}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.1" 
                value={entropy}
                onChange={(e) => setEntropy(parseFloat(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <div className="flex justify-between text-[8px] font-black text-slate-300 uppercase tracking-widest">
                <span>Deterministic</span>
                <span>Chaotic</span>
              </div>
            </div>

            <button 
              onClick={runSimulation}
              disabled={isSimulating}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-50 transition-all"
            >
              {isSimulating ? <RefreshCw className="animate-spin" size={16} /> : <Zap size={16} />}
              Generate Synthetic Stream
            </button>
          </div>
        </div>
      </div>

      <div className="lg:col-span-8">
        <div className="bg-slate-900 rounded-[40px] border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[650px]">
          <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
            <div className="flex items-center gap-3">
              <Terminal size={18} className="text-emerald-500" />
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Telemetry Stream</h3>
            </div>
            <button onClick={() => setLogs([])} className="text-[9px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors">Clear Buffer</button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 font-mono text-[10px] space-y-2 custom-scrollbar">
            {logs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-20 text-white">
                <Wind size={48} className="mb-4" />
                <p className="uppercase tracking-[0.3em]">Awaiting Stream Data...</p>
              </div>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="p-3 bg-slate-800/50 border border-slate-700/50 rounded-lg animate-in slide-in-from-right duration-300">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-slate-500">[{log.timestamp.split('T')[1].split('.')[0]}]</span>
                    <span className={`px-1.5 py-0.5 rounded-[4px] text-[8px] font-black ${
                      log.severity === 'CRITICAL' ? 'bg-rose-500 text-white' : 
                      log.severity === 'WARN' ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'
                    }`}>
                      {log.severity}
                    </span>
                    <span className="text-indigo-400 font-black">{log.service_module}</span>
                    <span className="text-slate-400">{log.protocol}</span>
                    <span className="ml-auto text-slate-500">{log.institution_id}</span>
                  </div>
                  <div className="text-slate-300 break-all">
                    {log.raw_payload}
                  </div>
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
        <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
              <Cpu size={24} />
            </div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">SDK Node Configuration</h3>
          </div>

          <div className="space-y-6">
            <div className="flex p-1 bg-slate-100 rounded-2xl">
              <button 
                onClick={() => setMode('sandbox')}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'sandbox' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
              >
                Sandbox
              </button>
              <button 
                onClick={() => setMode('production')}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'production' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-400'}`}
              >
                Production
              </button>
            </div>

            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
              <div className="flex items-center gap-2 text-indigo-600">
                <ShieldCheck size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Resilience Features</span>
              </div>
              <ul className="space-y-2">
                {['Auto Token Refresh', 'Clock Drift Correction', 'Antasena Compliance Guard', 'Idempotency Auto-Retry'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
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
                }`}>
                  {log}
                </div>
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
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze this SNAP BI JSON payload and suggest fixes for compliance.
        Payload: ${payload}
        Requirement: Must follow Bank Indonesia SNAP BI v2.0 schema.
        Return JSON with fields: status (CORRUPT/VALID), fixes (array of strings), healed_payload (stringified JSON).`,
        config: { responseMimeType: 'application/json' }
      });
      setSuggestion(JSON.parse(response.text || '{}'));
    } catch (e) {
      console.error(e);
    } finally {
      setIsHealing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div className="space-y-6">
        <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center">
              <Bug size={24} />
            </div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Payload Healer</h3>
          </div>
          <textarea 
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            className="w-full h-80 bg-slate-50 border border-slate-200 rounded-3xl p-6 font-mono text-xs outline-none focus:border-rose-500 transition-all"
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
                    <AlertTriangle size={14} className="text-amber-500 shrink-0" />
                    {f}
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
          <div className="h-full border-2 border-dashed border-slate-200 rounded-[40px] flex flex-col items-center justify-center text-center p-10 bg-slate-50/50">
            <Sparkles size={48} className="text-slate-300 mb-4 opacity-20" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Input corrupted JSON payload<br/>to trigger AI-assisted remediation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Infrastructure Ontology Component ---

const FeatureExplorer = () => {
  const nodes = [
    { id: 'CORE', label: 'Sampoerna Mobile Core', status: 'Healthy', icon: Database },
    { id: 'SNAP', label: 'SNAP BI Gateway', status: 'Healthy', icon: Globe },
    { id: 'BIFAST', label: 'BI-FAST Rail', status: 'Healthy', icon: Zap },
    { id: 'RTGS', label: 'RTGS Settlement', status: 'Healthy', icon: RefreshCw },
    { id: 'SDK', label: 'Resilient SDK v4', status: 'Active', icon: Cpu },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {nodes.map(node => (
        <div key={node.id} className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
          <div className="flex justify-between items-start mb-6">
            <div className={`w-14 h-14 rounded-[24px] flex items-center justify-center transition-colors ${
              node.status === 'Healthy' ? 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
            }`}>
              <node.icon size={28} />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">{node.status}</span>
            </div>
          </div>
          <h4 className="text-xl font-black text-slate-800 tracking-tight mb-2">{node.label}</h4>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{node.id} INFRASTRUCTURE NODE</p>
          <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400">Uptime: 99.99%</span>
            <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-900 transition-colors" />
          </div>
        </div>
      ))}
    </div>
  );
};

// --- Main DevPortal Module ---

export default function DevPortal() {
  const [activeTab, setActiveTab] = useState<'AI' | 'SDK' | 'SANDBOX' | 'HEALER' | 'INFRA'>('SANDBOX');

  const TABS = [
    { id: 'AI', label: 'AI Architect', icon: BrainCircuit },
    { id: 'SDK', label: 'SDK Node', icon: Cpu },
    { id: 'SANDBOX', label: 'Synthetic Sandbox', icon: FlaskConical },
    { id: 'HEALER', label: 'Payload Healer', icon: Stethoscope },
    { id: 'INFRA', label: 'Infrastructure', icon: Network },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Developer Ecosystem Active</div>
             <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Zenith Control Plane v4.0</div>
          </div>
          <h1 className="text-6xl font-black text-slate-800 tracking-tighter leading-none">Developer Portal</h1>
          <p className="text-slate-500 text-xl max-w-2xl font-medium leading-relaxed">High-fidelity simulation, AI-powered integration assistance, and resilient SDK orchestration for institutional banking partners.</p>
        </div>

        <div className="flex bg-white p-2 rounded-[40px] border border-slate-200 shadow-xl overflow-x-auto no-scrollbar">
          {TABS.map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id as any)} 
              className={`flex items-center gap-3 px-8 py-5 rounded-[30px] text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-200' : 'text-slate-400 hover:text-slate-800'}`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4">
        {activeTab === 'AI' && <AIArchitectChat />}
        {activeTab === 'SDK' && <SDKDemo />}
        {activeTab === 'SANDBOX' && <SyntheticSandbox />}
        {activeTab === 'HEALER' && <PayloadHealerUI />}
        {activeTab === 'INFRA' && <FeatureExplorer />}
      </div>
    </div>
  );
}
