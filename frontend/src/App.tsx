import React, { useState, useEffect } from 'react';
import { Bot, Search, FileText, Bell, Send, User, ChevronRight, Activity, ShieldCheck, AlertTriangle, Home, BarChart3, Network, FolderLock, Shield, Settings, FileBarChart, Gamepad2, PlayCircle, Loader2, Users } from 'lucide-react';
import { fetchTransactions, createIncident } from './api';
import { store, USERS } from './store';
import AgentConsole from './components/AgentConsole';
import HomeView from './components/HomeView';
import TransactionsView from './components/TransactionsView';
import InsightsView from './components/InsightsView';
import IncidentsView from './components/IncidentsView';
import AgentNetworkView from './components/AgentNetworkView';
import EvidenceView from './components/EvidenceView';
import SecurityView from './components/SecurityView';
import ReportsView from './components/ReportsView';
import SimulatorView from './components/SimulatorView';
import FloatingCompanion from './components/FloatingCompanion';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [activeIncident, setActiveIncident] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>('USER-RAHUL-001');
  const [showSelector, setShowSelector] = useState<boolean>(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [incidents, setIncidents] = useState<any[]>([]);
  
  // Demo State
  const [demoState, setDemoState] = useState({
    isRunning: false,
    step: 0,
    agentStatus: 'IDLE',
    currentTask: '',
    transactionState: 'TIMEOUT',
    agentMessages: [] as any[],
    evidence: null as any,
    policyDecision: null as any,
    autonomousActions: [] as string[],
    resolutionStatus: 'PENDING',
    escalationStatus: 'NONE'
  });

  useEffect(() => {
    const updateState = () => {
      setTransactions(store.getTransactions(currentUserId));
      setIncidents(store.getIncidents(currentUserId));
    };
    updateState(); // Initial load
    return store.subscribe(updateState);
  }, [currentUserId]);

  const runDemo = () => {
    navigate('home');
    setDemoState({
      isRunning: true,
      step: 1,
      agentStatus: 'DETECTING',
      currentTask: 'Resolving TXN-VYR-5001',
      transactionState: 'UNCERTAIN',
      agentMessages: [],
      evidence: null,
      policyDecision: null,
      autonomousActions: ['Transaction identified automatically'],
      resolutionStatus: 'PENDING',
      escalationStatus: 'NONE'
    });

    const steps = [
      () => setDemoState(s => ({ ...s, step: 2, agentStatus: 'INVESTIGATING' })),
      () => setDemoState(s => ({ ...s, step: 3, agentStatus: 'INVESTIGATING', autonomousActions: [...s.autonomousActions, 'Context checked automatically'] })),
      () => setDemoState(s => ({ ...s, step: 4, agentMessages: [...s.agentMessages, { sender: 'AGENT 1', text: 'Verify recipient status for TXN-VYR-5001.' }] })),
      () => setDemoState(s => ({ ...s, step: 5, agentStatus: 'VERIFYING', agentMessages: [...s.agentMessages, { sender: 'AGENT BUS', text: 'Scoped request accepted.' }] })),
      () => setDemoState(s => ({ ...s, step: 6, evidence: { receipt: 'NOT RECEIVED', settlement: 'NOT COMPLETED' }, agentMessages: [...s.agentMessages, { sender: 'AGENT 2', text: 'Transaction not found.' }, { sender: 'AGENT 2', text: 'Receipt not received.' }, { sender: 'AGENT BUS', text: 'Minimum required evidence returned.' }] })),
      () => setDemoState(s => ({ ...s, step: 7, autonomousActions: [...s.autonomousActions, 'Evidence compared automatically'] })),
      () => setDemoState(s => ({ ...s, step: 8, agentStatus: 'DECIDING', policyDecision: { recommendation: 'Do not retry.', policy: 'Previous payment has not reached a final state.', action: 'RECONCILIATION + MONITORING' } })),
      () => setDemoState(s => ({ ...s, step: 9, agentStatus: 'ACTING', autonomousActions: [...s.autonomousActions, 'Duplicate retry blocked automatically'] })),
      () => setDemoState(s => ({ ...s, step: 10, resolutionStatus: 'RECONCILING', autonomousActions: [...s.autonomousActions, 'Reconciliation initiated automatically'] })),
      () => setDemoState(s => ({ ...s, step: 11, agentStatus: 'MONITORING' })),
      () => {
        setDemoState(s => ({ ...s, step: 12, agentStatus: 'RESOLVED', transactionState: 'VERIFIED', resolutionStatus: 'RESOLVED', autonomousActions: [...s.autonomousActions, 'Final state verified automatically'] }));
        store.updateTransactionState('TXN-VYR-5001', { gatewayStatus: 'SUCCESS', recipientStatus: 'RECEIVED', settlementStatus: 'COMPLETED', risk: 'LOW', resolutionStatus: 'RESOLVED', type: 'STANDARD' });
        store.updateIncidentState('INC-VYR-5001', { status: 'RESOLVED', resolution: 'RECONCILED + VERIFIED' });
      },
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current < steps.length) {
        steps[current]();
        current++;
      } else {
        clearInterval(interval);
      }
    }, 2500); // 2.5 seconds per step
  };

  const runEscalationDemo = () => {
    navigate('home');
    setDemoState({
      isRunning: true,
      step: 1,
      agentStatus: 'DETECTING',
      currentTask: 'Resolving TXN-VYR-9999',
      transactionState: 'UNCERTAIN',
      agentMessages: [],
      evidence: null,
      policyDecision: null,
      autonomousActions: ['Transaction identified automatically'],
      resolutionStatus: 'PENDING',
      escalationStatus: 'NONE'
    });

    const steps = [
      () => setDemoState(s => ({ ...s, step: 2, agentStatus: 'INVESTIGATING' })),
      () => setDemoState(s => ({ ...s, step: 3, agentStatus: 'INVESTIGATING', autonomousActions: [...s.autonomousActions, 'Context checked automatically'] })),
      () => setDemoState(s => ({ ...s, step: 4, agentMessages: [...s.agentMessages, { sender: 'AGENT 1', text: 'Verify recipient status for TXN-VYR-9999.' }] })),
      () => setDemoState(s => ({ ...s, step: 5, agentStatus: 'VERIFYING', agentMessages: [...s.agentMessages, { sender: 'AGENT BUS', text: 'Scoped request accepted.' }] })),
      () => setDemoState(s => ({ ...s, step: 6, evidence: { receipt: 'UNKNOWN', settlement: 'UNKNOWN' }, agentMessages: [...s.agentMessages, { sender: 'AGENT 2', text: 'Cannot determine status.' }, { sender: 'AGENT BUS', text: 'Minimum required evidence returned.' }] })),
      () => setDemoState(s => ({ ...s, step: 7, autonomousActions: [...s.autonomousActions, 'Evidence compared automatically'] })),
      () => setDemoState(s => ({ ...s, step: 8, agentStatus: 'DECIDING', policyDecision: { recommendation: 'Escalate to human review.', policy: 'Evidence is insufficient to safely resolve this transaction.', action: 'HUMAN ESCALATION REQUIRED' } })),
      () => setDemoState(s => ({ ...s, step: 9, agentStatus: 'ESCALATED', escalationStatus: 'ESCALATED', autonomousActions: [...s.autonomousActions, 'Escalated to human review team'] })),
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current < steps.length) {
        steps[current]();
        current++;
      } else {
        clearInterval(interval);
      }
    }, 2500);
  };

  const navigate = (view: string) => {
    setActiveIncident(null);
    setCurrentView(view);
  };

  const handleOpenIncident = (id: string) => {
    setActiveIncident(id);
  };

  const renderView = () => {
    if (activeIncident) {
      return <AgentConsole incidentId={activeIncident} onBack={() => setActiveIncident(null)} demoContext={demoState} />;
    }
    switch (currentView) {
      case 'home': return <HomeView transactions={transactions} incidents={incidents} currentUser={USERS[currentUserId === 'USER-RAHUL-001' ? 'RAHUL' : 'ABC']} onOpenIncident={handleOpenIncident} onNavigate={navigate} demoContext={demoState} />;
      case 'agent': return <AgentConsole incidentId="demo" onBack={() => navigate('home')} demoContext={demoState} />;
      case 'transactions': return <TransactionsView transactions={transactions} currentUser={USERS[currentUserId === 'USER-RAHUL-001' ? 'RAHUL' : 'ABC']} onOpenIncident={handleOpenIncident} />;
      case 'insights': return <InsightsView transactions={transactions} currentUser={USERS[currentUserId === 'USER-RAHUL-001' ? 'RAHUL' : 'ABC']} />;
      case 'incidents': return <IncidentsView incidents={incidents} currentUser={USERS[currentUserId === 'USER-RAHUL-001' ? 'RAHUL' : 'ABC']} onOpenIncident={handleOpenIncident} demoContext={demoState} />;
      case 'network': return <AgentNetworkView transactions={store.transactions} currentUser={USERS[currentUserId === 'USER-RAHUL-001' ? 'RAHUL' : 'ABC']} demoContext={demoState} />;
      case 'evidence': return <EvidenceView demoContext={demoState} currentUser={USERS[currentUserId === 'USER-RAHUL-001' ? 'RAHUL' : 'ABC']} />;
      case 'security': return <SecurityView currentUser={USERS[currentUserId === 'USER-RAHUL-001' ? 'RAHUL' : 'ABC']} />;
      case 'reports': return <ReportsView currentUser={USERS[currentUserId === 'USER-RAHUL-001' ? 'RAHUL' : 'ABC']} transactions={transactions} incidents={incidents} />;
      case 'simulator': return <SimulatorView onRefresh={() => {}} />;
      default: return <HomeView transactions={transactions} incidents={incidents} currentUser={USERS[currentUserId === 'USER-RAHUL-001' ? 'RAHUL' : 'ABC']} onOpenIncident={handleOpenIncident} onNavigate={navigate} demoContext={demoState} />;
    }
  };

  const NavItem = ({ id, icon: Icon, label, section = false }: any) => {
    if (section) return <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-6 mb-2 px-4">{label}</div>;
    const active = currentView === id && !activeIncident;
    return (
      <button 
        onClick={() => navigate(id)}
        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium ${active ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}>
        <Icon className="w-5 h-5" />
        <span className="hidden md:block">{label}</span>
      </button>
    );
  };

  if (showSelector) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800/40 via-slate-900 to-slate-950 overflow-y-auto">
        <div className="flex flex-col items-center mb-12 text-center animate-in slide-in-from-bottom-5 fade-in duration-500">
          <div className="flex items-center justify-center bg-slate-900 p-4 rounded-2xl border border-primary/30 shadow-2xl shadow-primary/20 mb-6">
            <ShieldCheck className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">VIYORA</h1>
          <p className="text-lg text-slate-400 max-w-lg font-light tracking-wide">
            Agent-to-Agent Financial Resolution Network
          </p>
          <div className="mt-8 px-6 py-2 bg-slate-800/50 rounded-full border border-slate-700/50 text-sm font-medium text-slate-300">
            Choose a participant to enter their VIYORA workspace.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl animate-in slide-in-from-bottom-10 fade-in duration-700 delay-150">
          {/* Card 1: Rahul */}
          <div 
            onClick={() => { setCurrentUserId('USER-RAHUL-001'); navigate('home'); setShowSelector(false); }}
            className="group relative bg-slate-800/40 hover:bg-slate-800 border border-slate-700 hover:border-primary/50 p-8 rounded-3xl cursor-pointer transition-all duration-300 shadow-xl hover:shadow-primary/10 overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex justify-between items-start mb-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary group-hover:scale-110 transition-transform duration-300">
                <User className="w-8 h-8" />
              </div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-900 px-3 py-1 rounded-full border border-slate-700 shadow-inner">Customer</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Rahul</h2>
            <p className="text-slate-400 mb-8 font-light">Personal Financial Workspace</p>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-sm font-medium text-primary flex items-center gap-2">
                Open Rahul's VIYORA <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>

          {/* Card 2: ABC Electronics */}
          <div 
            onClick={() => { setCurrentUserId('USER-ABC-001'); navigate('home'); setShowSelector(false); }}
            className="group relative bg-slate-800/40 hover:bg-slate-800 border border-slate-700 hover:border-warning/50 p-8 rounded-3xl cursor-pointer transition-all duration-300 shadow-xl hover:shadow-warning/10 overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-warning to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex justify-between items-start mb-6">
              <div className="w-16 h-16 rounded-2xl bg-warning/10 flex items-center justify-center border border-warning/20 text-warning group-hover:scale-110 transition-transform duration-300">
                <Home className="w-8 h-8" />
              </div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-900 px-3 py-1 rounded-full border border-slate-700 shadow-inner">Merchant</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">ABC Electronics</h2>
            <p className="text-slate-400 mb-8 font-light">Merchant Financial Workspace</p>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-sm font-medium text-warning flex items-center gap-2">
                Open ABC's VIYORA <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-900 text-slate-200 font-sans overflow-hidden">
      {/* Sidebar */}
      <div className="w-20 md:w-64 glass border-r border-slate-700/50 flex flex-col z-20 flex-shrink-0">
        <div className="p-4 md:p-6 flex items-center justify-center md:justify-start gap-3 text-primary border-b border-slate-700/50">
          <ShieldCheck className="w-8 h-8 flex-shrink-0" />
          <div className="hidden md:block">
            <h1 className="text-xl font-bold tracking-wider leading-none">VIYORA</h1>
            <p className="text-[10px] text-slate-400 mt-1">{USERS[currentUserId === 'USER-RAHUL-001' ? 'RAHUL' : 'ABC'].name}'s Agent</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          <div className="space-y-1 px-2">
            <NavItem id="home" icon={Home} label="Home" />
            <NavItem id="agent" icon={Bot} label="AI Agent" />
            <NavItem id="transactions" icon={Activity} label="Transactions" />
            <NavItem id="insights" icon={BarChart3} label="Insights" />

            <NavItem section label="Operations" />
            <NavItem id="incidents" icon={AlertTriangle} label="Incidents" />
            <NavItem id="network" icon={Network} label="Agent Network" />
            <NavItem id="evidence" icon={FolderLock} label="Evidence Vault" />

            <NavItem section label="Security" />
            <NavItem id="security" icon={Shield} label="Security & Privacy" />

            <NavItem section label="System" />
            <NavItem id="reports" icon={FileBarChart} label="Reports" />
            <NavItem id="simulator" icon={Gamepad2} label="Simulator" />
          </div>
        </div>

        <div className="p-4 border-t border-slate-700/50">
          <div className="hidden md:block p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-warning animate-pulse"></div>
              <span className="text-xs font-bold text-warning">SIMULATION MODE</span>
            </div>
            <p className="text-[9px] text-slate-400 mt-1">Transactions are simulated. No real money is moved or controlled.</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative z-10 overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-800/20 via-slate-900 to-slate-900">
        {/* Header */}
        <header className="h-16 glass border-b border-slate-700/50 flex items-center justify-between px-6 shrink-0 z-30 relative">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-bold text-slate-300 capitalize">{activeIncident ? 'Incident Investigation' : currentView.replace('-', ' ')}</h2>
            
            {/* USER SWITCHER */}
            <div className="hidden md:flex items-center ml-8 bg-slate-800/80 rounded-lg p-1 border border-slate-700">
               <button 
                 onClick={() => { setShowSelector(true); }}
                 className="px-4 py-1.5 flex items-center gap-2 text-xs font-bold rounded-md transition-colors text-slate-300 hover:text-white hover:bg-slate-700">
                 <Users className="w-3.5 h-3.5" />
                 Switch Participant
               </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 bg-danger/20 text-danger px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-danger/30 transition-colors"
              onClick={runEscalationDemo}>
              {demoState.isRunning && demoState.escalationStatus === 'ESCALATED' ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlertTriangle className="w-4 h-4" />} 
              ESCALATE
            </button>
            <button className="flex items-center gap-2 bg-primary/20 text-primary px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-primary/30 transition-colors"
              onClick={runDemo}>
              {demoState.isRunning && demoState.step < 12 && demoState.escalationStatus !== 'ESCALATED' ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlayCircle className="w-4 h-4" />} 
              {demoState.isRunning && demoState.step < 12 && demoState.escalationStatus !== 'ESCALATED' ? 'RUNNING DEMO...' : 'RUN DEMO'}
            </button>
            <Bell className="w-5 h-5 text-slate-400 cursor-pointer hover:text-white" />
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-300 font-medium hidden sm:block">{USERS[currentUserId === 'USER-RAHUL-001' ? 'RAHUL' : 'ABC'].name}</span>
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold border border-slate-600">
                {(USERS[currentUserId === 'USER-RAHUL-001' ? 'RAHUL' : 'ABC'].name).charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic View */}
        <main className="flex-1 overflow-hidden flex flex-col relative">
          {renderView()}
        </main>
      </div>

      {/* Persistent Floating AI Companion */}
      <FloatingCompanion transactions={transactions} currentUser={USERS[currentUserId === 'USER-RAHUL-001' ? 'RAHUL' : 'ABC']} onNavigate={navigate} onOpenIncident={handleOpenIncident} demoContext={demoState} />
    </div>
  );
}
