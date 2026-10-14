import React, { useState, useEffect } from 'react';
import { UserRole, MesaState, VoteSelection } from './types/election';
import { Header } from './components/Header';
import { VoterBooth } from './components/VoterModule/VoterBooth';
import { TableWorkerDesk } from './components/TableWorkerModule/TableWorkerDesk';
import { CandidateAuditor } from './components/CandidateModule/CandidateAuditor';
import { TribunalDashboard } from './components/TribunalModule/TribunalDashboard';
import { CheckCircle2 } from 'lucide-react';

const INITIAL_MESA_STATE: MesaState = {
  mesaNumber: 412,
  school: 'Escuela N° 12 "Domingo F. Sarmiento"',
  circuit: '03A (Centro)',
  seccion: 'Seccional 1ra',
  electoresHabilitados: 350,
  estado: 'abierta',
  aperturaTimestamp: '08:00 hs',
  cierreTimestamp: null,
  totalVotantesEfectivos: 268,
  escrutinio: {
    intendente: {
      '501': 98,
      '502': 84,
      '503': 52,
      '504': 24,
    },
    concejales: {
      '501': 96,
      '502': 85,
      '503': 51,
      '504': 25,
    },
    tribunal_cuentas: {
      '501': 95,
      '502': 86,
      '503': 50,
      '504': 26,
    },
    blancos: 6,
    nulos: 1,
    recurridos: 3,
    impugnados: 0,
  },
  hashCertificado: 'SHA256:4C8F92BA71E300A5210998CD2009',
  telegramaId: 'TEL-0412-2026',
};

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('votante');
  const [mesaState, setMesaState] = useState<MesaState>(INITIAL_MESA_STATE);
  const [notification, setNotification] = useState<string | null>(null);

  // Global Accessibility State (Ley 26.653 - Available across all 4 screens)
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');

  // Sync high-contrast class on document body
  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    return () => {
      document.body.classList.remove('high-contrast');
    };
  }, [highContrast]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleVoteCast = (vote: VoteSelection) => {
    showNotification('¡Voto emitido con éxito! La boleta BUE física ha sido impresa.');
  };

  const handleResetSimulation = () => {
    setMesaState(INITIAL_MESA_STATE);
    showNotification('Simulación electoral reiniciada a los valores iniciales.');
  };

  const fontSizeClass =
    fontSize === 'xlarge'
      ? 'font-size-xlarge'
      : fontSize === 'large'
      ? 'font-size-large'
      : 'font-size-normal';

  return (
    <div className={`min-h-screen bg-slate-50 flex flex-col text-slate-800 transition-colors ${highContrast ? 'high-contrast' : ''} ${fontSizeClass}`}>
      {/* Top Bar Navigation */}
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        onResetSimulation={handleResetSimulation}
      />

      {/* Floating Global Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg border border-slate-700 text-xs flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Content Area: 4 Stakeholder Roles */}
      <div className="flex-1">
        {currentRole === 'votante' && (
          <VoterBooth
            onVoteCast={handleVoteCast}
            highContrast={highContrast}
            onToggleContrast={() => setHighContrast(!highContrast)}
            fontSize={fontSize}
            onChangeFontSize={setFontSize}
          />
        )}
        {currentRole === 'autoridad' && (
          <TableWorkerDesk
            mesaState={mesaState}
            onUpdateMesaState={setMesaState}
            highContrast={highContrast}
            onToggleContrast={() => setHighContrast(!highContrast)}
            fontSize={fontSize}
            onChangeFontSize={setFontSize}
          />
        )}
        {currentRole === 'candidato' && (
          <CandidateAuditor
            mesaState={mesaState}
            highContrast={highContrast}
            onToggleContrast={() => setHighContrast(!highContrast)}
            fontSize={fontSize}
            onChangeFontSize={setFontSize}
          />
        )}
        {currentRole === 'tribunal' && (
          <TribunalDashboard
            mesaState={mesaState}
            highContrast={highContrast}
            onToggleContrast={() => setHighContrast(!highContrast)}
            fontSize={fontSize}
            onChangeFontSize={setFontSize}
          />
        )}
      </div>
    </div>
  );
}
