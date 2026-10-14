import React, { useState } from 'react';
import { INITIAL_VOTERS, CANDIDATE_LISTS } from '../../data/electionData';
import { VoterRecord, MesaState } from '../../types/election';
import { RoleAccessibilityBar } from '../common/RoleAccessibilityBar';
import {
  Users,
  Search,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Send,
  FileText,
  Printer,
  ShieldAlert,
  ClipboardList,
  Check,
  Undo2,
  HelpCircle,
  Clock,
  BookOpen,
} from 'lucide-react';

interface TableWorkerDeskProps {
  mesaState: MesaState;
  onUpdateMesaState: (newState: MesaState) => void;
  highContrast: boolean;
  onToggleContrast: () => void;
  fontSize: 'normal' | 'large' | 'xlarge';
  onChangeFontSize: (size: 'normal' | 'large' | 'xlarge') => void;
}

export const TableWorkerDesk: React.FC<TableWorkerDeskProps> = ({
  mesaState,
  onUpdateMesaState,
  highContrast,
  onToggleContrast,
  fontSize,
  onChangeFontSize,
}) => {
  const [showManualModal, setShowManualModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'padron' | 'apertura' | 'escrutinio' | 'incidencias'>('padron');
  const [voters, setVoters] = useState<VoterRecord[]>(INITIAL_VOTERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'pendiente' | 'voto_emitido' | 'observado'>('todos');
  const [selectedVoter, setSelectedVoter] = useState<VoterRecord | null>(null);

  // Escrutinio state (counts per list)
  const [escrutinioCounts, setEscrutinioCounts] = useState({
    '501': 98,
    '502': 84,
    '503': 52,
    '504': 24,
    blancos: 6,
    nulos: 1,
    recurridos: 3,
    impugnados: 0,
  });

  const [transmittedTelegram, setTransmittedTelegram] = useState(false);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [incidentDescription, setIncidentDescription] = useState('');

  // Filtering voters
  const filteredVoters = voters.filter((v) => {
    const matchesSearch =
      v.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.dni.includes(searchQuery) ||
      v.orderNumber.toString() === searchQuery;

    if (statusFilter === 'todos') return matchesSearch;
    return matchesSearch && v.status === statusFilter;
  });

  // Calculate total counts for math balance validation (Principle 5: Error Prevention)
  const totalVotesCounted =
    Object.values(escrutinioCounts).reduce((acc, val) => acc + (Number(val) || 0), 0);
  const targetBallotsInUrn = 268;
  const countDifference = totalVotesCounted - targetBallotsInUrn;
  const isPerfectBalance = countDifference === 0;

  // Handle voter status update
  const handleMarkVoted = (voterId: string) => {
    const updated = voters.map((v) => {
      if (v.id === voterId) {
        return {
          ...v,
          status: 'voto_emitido' as const,
          votedAt: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) + ' hs',
          stubCode: `TRQ-${v.orderNumber.toString().padStart(3, '0')}-X9`,
        };
      }
      return v;
    });
    setVoters(updated);
    setSelectedVoter(null);
  };

  const handleMarkObserved = (voterId: string) => {
    const updated = voters.map((v) => {
      if (v.id === voterId) {
        return {
          ...v,
          status: 'observado' as const,
          votedAt: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) + ' hs',
          stubCode: `TRQ-${v.orderNumber.toString().padStart(3, '0')}-OBS`,
        };
      }
      return v;
    });
    setVoters(updated);
    setSelectedVoter(null);
  };

  const handleTransmitEscrutinio = () => {
    if (!isPerfectBalance) {
      alert('Error: La suma de votos debe coincidir exactamente con los 268 sobres en la urna antes de transmitir.');
      return;
    }
    setIsTransmitting(true);
    setTimeout(() => {
      setIsTransmitting(false);
      setTransmittedTelegram(true);
      const hash = 'SHA256:4C8F92BA71E300A5210998CD2009';
      onUpdateMesaState({
        ...mesaState,
        estado: 'transmitida',
        hashCertificado: hash,
        telegramaId: 'TEL-0412-2026',
        totalVotantesEfectivos: targetBallotsInUrn,
        escrutinio: {
          intendente: {
            '501': escrutinioCounts['501'],
            '502': escrutinioCounts['502'],
            '503': escrutinioCounts['503'],
            '504': escrutinioCounts['504'],
          },
          concejales: {
            '501': escrutinioCounts['501'],
            '502': escrutinioCounts['502'],
            '503': escrutinioCounts['503'],
            '504': escrutinioCounts['504'],
          },
          tribunal_cuentas: {
            '501': escrutinioCounts['501'],
            '502': escrutinioCounts['502'],
            '503': escrutinioCounts['503'],
            '504': escrutinioCounts['504'],
          },
          blancos: escrutinioCounts.blancos,
          nulos: escrutinioCounts.nulos,
          recurridos: escrutinioCounts.recurridos,
          impugnados: escrutinioCounts.impugnados,
        },
      });
    }, 1800);
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* Role Dedicated Accessibility Bar (Without legislative text) */}
      <RoleAccessibilityBar
        roleTitle="Mesa Electoral N° 0412"
        roleSubtitle="Circuito 03A · Escuela N° 12 D. F. Sarmiento"
        highContrast={highContrast}
        onToggleContrast={onToggleContrast}
        fontSize={fontSize}
        onChangeFontSize={onChangeFontSize}
        onShowHelp={() => setShowManualModal(true)}
        helpButtonLabel="Instructivo de Mesa"
      />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 w-full">
      {/* Top Mesa Identity Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 mb-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 uppercase tracking-wider mb-1">
            <span>Justicia Electoral Municipal</span>
            <span>·</span>
            <span>Comicios 2026</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Mesa Electoral N° 0412 · Escuela N° 12 "D. F. Sarmiento"
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Circuito 03A (Centro) · Presidente: Prof. Ricardo Morales · Vocal: Laura Soria
          </p>
        </div>

        {/* Operational Indicators */}
        <div className="flex items-center gap-4 text-xs">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-center min-w-[100px]">
            <div className="text-slate-500 text-[11px] font-medium">Padrón Total</div>
            <div className="text-base font-bold text-slate-900 tabular-nums">350</div>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-center min-w-[100px]">
            <div className="text-slate-500 text-[11px] font-medium">Votos Emitidos</div>
            <div className="text-base font-bold text-emerald-700 tabular-nums">268 (76.5%)</div>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-center min-w-[100px]">
            <div className="text-slate-500 text-[11px] font-medium">Estado Mesa</div>
            <div className="text-xs font-bold text-sky-800 uppercase mt-0.5">
              {mesaState.estado === 'transmitida' ? 'Transmitida' : 'Abierta'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation (Flexibility & Efficiency of Use) */}
      <div className="flex border-b border-slate-200 mb-6 gap-2">
        <button
          onClick={() => setActiveTab('padron')}
          className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'padron'
              ? 'border-sky-700 text-sky-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>1. Gestión de Padrón y Electores</span>
        </button>
        <button
          onClick={() => setActiveTab('escrutinio')}
          className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'escrutinio'
              ? 'border-sky-700 text-sky-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>2. Cierre y Escrutinio Provisorio</span>
          {mesaState.estado === 'transmitida' && (
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
              Transmitido
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('apertura')}
          className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'apertura'
              ? 'border-sky-700 text-sky-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>3. Acta de Apertura y Precintos</span>
        </button>
      </div>

      {/* TAB 1: PADRÓN ELECTORAL (SEARCH & VERIFICATION) */}
      {activeTab === 'padron' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Search & Filter List */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por DNI, Apellido o N° de Orden..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
              </div>

              {/* Status Segmented Control */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
                <button
                  onClick={() => setStatusFilter('todos')}
                  className={`px-2.5 py-1 rounded font-medium transition-colors ${
                    statusFilter === 'todos' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Todos ({voters.length})
                </button>
                <button
                  onClick={() => setStatusFilter('pendiente')}
                  className={`px-2.5 py-1 rounded font-medium transition-colors ${
                    statusFilter === 'pendiente' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Pendientes ({voters.filter((v) => v.status === 'pendiente').length})
                </button>
                <button
                  onClick={() => setStatusFilter('voto_emitido')}
                  className={`px-2.5 py-1 rounded font-medium transition-colors ${
                    statusFilter === 'voto_emitido' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Votaron ({voters.filter((v) => v.status === 'voto_emitido').length})
                </button>
              </div>
            </div>

            {/* Voters Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Orden</th>
                    <th className="py-2.5 px-3">Elector</th>
                    <th className="py-2.5 px-3">DNI / Ejemplar</th>
                    <th className="py-2.5 px-3">Estado</th>
                    <th className="py-2.5 px-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredVoters.map((voter) => (
                    <tr
                      key={voter.id}
                      onClick={() => setSelectedVoter(voter)}
                      className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                        selectedVoter?.id === voter.id ? 'bg-sky-50/60' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-700 tabular-nums">
                        #{voter.orderNumber.toString().padStart(3, '0')}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-slate-900">
                          {voter.lastName}, {voter.firstName}
                        </div>
                        <div className="text-[11px] text-slate-500">{voter.address}</div>
                      </td>
                      <td className="py-2.5 px-3 font-mono tabular-nums text-slate-700">
                        {voter.dni} (Ej. {voter.exemplar})
                      </td>
                      <td className="py-2.5 px-3">
                        {voter.status === 'voto_emitido' ? (
                          <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>Votó ({voter.votedAt})</span>
                          </span>
                        ) : voter.status === 'observado' ? (
                          <span className="text-amber-700 font-semibold flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Observado</span>
                          </span>
                        ) : (
                          <span className="text-slate-500">Pendiente</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedVoter(voter);
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-sky-50 text-sky-800 rounded font-medium text-xs transition-colors"
                        >
                          Verificar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column: Elector Verification & Action Panel */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
            {selectedVoter ? (
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                  <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                    Verificación de Identidad
                  </span>
                  <span className="font-mono text-xs font-bold text-sky-700">
                    Orden #{selectedVoter.orderNumber}
                  </span>
                </div>

                <div className="space-y-3 mb-6 text-xs">
                  <div>
                    <label className="text-slate-500 block text-[11px]">Apellido y Nombre</label>
                    <div className="text-base font-bold text-slate-900">
                      {selectedVoter.lastName}, {selectedVoter.firstName}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-500 block text-[11px]">DNI Registrado</label>
                      <div className="font-mono font-bold text-slate-800">{selectedVoter.dni}</div>
                    </div>
                    <div>
                      <label className="text-slate-500 block text-[11px]">Ejemplar en Padrón</label>
                      <div className="font-mono font-bold text-sky-800">
                        Ejemplar {selectedVoter.exemplar}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-500 block text-[11px]">Domicilio Electoral</label>
                    <div className="text-slate-700">{selectedVoter.address}</div>
                  </div>

                  {/* Argentine Legal Rule Prompt */}
                  <div className="bg-sky-50 p-3 rounded-lg border border-sky-100 text-sky-950 text-[11px] leading-relaxed">
                    <span className="font-bold block mb-1">Criterio CNE (Ley 19.945 Art. 86):</span>
                    El ciudadano puede votar únicamente si exhibe documento igual o posterior al que figura en el padrón. Nunca anterior.
                  </div>

                  {selectedVoter.status === 'voto_emitido' && (
                    <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200 text-emerald-900 text-xs">
                      <span className="font-bold block">Sufragio Ya Registrado</span>
                      <span>Troquel emitido: {selectedVoter.stubCode} a las {selectedVoter.votedAt}</span>
                    </div>
                  )}
                </div>

                {/* Verification Actions */}
                {selectedVoter.status === 'pendiente' && (
                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <button
                      onClick={() => handleMarkVoted(selectedVoter.id)}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
                    >
                      <Check className="w-4 h-4" />
                      <span>Habilitar Cabina y Entregar Boleta BUE</span>
                    </button>
                    <button
                      onClick={() => handleMarkObserved(selectedVoter.id)}
                      className="w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 border border-amber-200"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Registrar Voto Recurrido / Impugnado</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 my-auto">
                <Users className="w-12 h-12 mx-auto mb-2 stroke-1" />
                <p className="text-xs font-medium">
                  Seleccione un elector de la tabla o use el buscador para validar su DNI y autorizar la emisión de boleta.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ESCRUTINIO PROVISORIO (GUIDED COUNTING WITH MATH VALIDATION) */}
      {activeTab === 'escrutinio' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 mb-6 gap-3">
            <div>
              <div className="text-xs font-semibold text-sky-700 uppercase tracking-wider mb-1">
                Escrutinio Provisorio de Mesa · 18:00 hs
              </div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Recuento de Boletas Únicas de la Urna
              </h2>
            </div>

            {/* Mathematical Balance Status Badge (Nielsen Principle 5 & 9) */}
            <div
              className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
                isPerfectBalance
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-rose-50 border-rose-300 text-rose-900'
              }`}
            >
              {isPerfectBalance ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="block font-bold">Balance Aritmético Exacto (0 discrepancias)</span>
                    <span className="text-[11px] text-emerald-700">Total votos {totalVotesCounted} = 268 sobres en urna</span>
                  </div>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <div>
                    <span className="block font-bold">
                      Discrepancia detectada: {countDifference > 0 ? `+${countDifference}` : countDifference} votos
                    </span>
                    <span className="text-[11px] text-rose-700">
                      Total ingresado {totalVotesCounted} ≠ {targetBallotsInUrn} sobres de la urna
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Counts Input Table */}
          <div className="space-y-3 mb-6">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Votos por Agrupación Política (Categoría Intendente)
            </div>

            {CANDIDATE_LISTS.map((cand) => (
              <div
                key={cand.id}
                className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-slate-300 bg-slate-50/50"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: cand.colorHex }}
                  />
                  <div>
                    <span className="font-bold text-xs text-slate-900">
                      LISTA {cand.listNumber} · {cand.partyName}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      Candidato: {cand.mayorCandidate}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="350"
                    disabled={transmittedTelegram}
                    value={escrutinioCounts[cand.listNumber as keyof typeof escrutinioCounts]}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      setEscrutinioCounts({
                        ...escrutinioCounts,
                        [cand.listNumber]: val,
                      });
                    }}
                    className="w-20 text-center font-mono font-bold text-base py-1.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-sky-500 bg-white"
                  />
                  <span className="text-xs text-slate-400">votos</span>
                </div>
              </div>
            ))}

            {/* Special Votes (Blancos, Nulos, Recurridos) */}
            <div className="pt-3 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 border border-slate-200 rounded-lg bg-white">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Votos en Blanco
                </label>
                <input
                  type="number"
                  min="0"
                  disabled={transmittedTelegram}
                  value={escrutinioCounts.blancos}
                  onChange={(e) =>
                    setEscrutinioCounts({
                      ...escrutinioCounts,
                      blancos: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full text-center font-mono font-bold text-base py-1.5 border border-slate-300 rounded-md"
                />
              </div>

              <div className="p-3 border border-slate-200 rounded-lg bg-white">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Votos Nulos
                </label>
                <input
                  type="number"
                  min="0"
                  disabled={transmittedTelegram}
                  value={escrutinioCounts.nulos}
                  onChange={(e) =>
                    setEscrutinioCounts({
                      ...escrutinioCounts,
                      nulos: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full text-center font-mono font-bold text-base py-1.5 border border-slate-300 rounded-md"
                />
              </div>

              <div className="p-3 border border-slate-200 rounded-lg bg-white">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Votos Recurridos / Imp.
                </label>
                <input
                  type="number"
                  min="0"
                  disabled={transmittedTelegram}
                  value={escrutinioCounts.recurridos}
                  onChange={(e) =>
                    setEscrutinioCounts({
                      ...escrutinioCounts,
                      recurridos: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full text-center font-mono font-bold text-base py-1.5 border border-slate-300 rounded-md"
                />
              </div>
            </div>
          </div>

          {/* Action and Transmission */}
          <div className="bg-slate-900 text-white rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                Certificación y Transmisión Oficial
              </span>
              <span className="text-xs text-slate-300">
                Se generará el Acta de Escrutinio, Telegrama digital con Hash SHA-256 y copias para fiscales.
              </span>
            </div>

            {!transmittedTelegram ? (
              <button
                onClick={handleTransmitEscrutinio}
                disabled={!isPerfectBalance || isTransmitting}
                className="w-full sm:w-auto px-6 py-3 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm shrink-0"
              >
                <Send className="w-4 h-4" />
                <span>
                  {isTransmitting
                    ? 'Transmitiendo telegrama al Tribunal...'
                    : 'Firmar y Transmitir Escrutinio'}
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-400 block">
                    ✓ Transmisión Confirmada
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    HASH: 4C8F92...2009
                  </span>
                </div>
                <button
                  onClick={() => alert('Imprimiendo 4 Certificados de Escrutinio para los Fiscales Partidarios...')}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir Certificados Fiscales</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: ACTA DE APERTURA & PRESTACIONES */}
      {activeTab === 'apertura' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs max-w-3xl mx-auto text-xs space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-base font-bold text-slate-900">
              Acta Oficial de Apertura de Comicios (08:00 hs)
            </h2>
            <p className="text-slate-500">
              Cumplimiento de la Ley 19.945 Art. 83 y Protocolo de Seguridad Electoral
            </p>
          </div>

          <div className="space-y-3 text-slate-700">
            <div className="flex items-center gap-3 p-3 bg-emerald-50 text-emerald-900 rounded-lg border border-emerald-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold block">Verificación de Urna Vacía y Precintos</span>
                <span>Precinto de Apertura N° 1042-A colocado a las 07:45 hs en presencia de fiscales.</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-emerald-50 text-emerald-900 rounded-lg border border-emerald-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold block">Prueba de Inicialización Terminal BUE</span>
                <span>Terminal iniciada con tarjeta de presidente de mesa. Impresión de acta cero realizada con éxito.</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-emerald-50 text-emerald-900 rounded-lg border border-emerald-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold block">Acreditación de Fiscales Partidarios</span>
                <span>Fiscales acreditados con poder legal de las listas 501, 502, 503 y 504.</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-slate-500">
            <span>Firma digital: Ricardo Morales (Presidente de Mesa DNI 28.190.223)</span>
            <button
              onClick={() => alert('Acta de apertura reimpresa en papel oficial.')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir Copia de Acta</span>
            </button>
          </div>
        </div>
      )}
      </div>

      {/* Instructivo Modal for Autoridades de Mesa */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 text-xs text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-sky-700" />
                <h3 className="font-bold text-slate-900 text-base">
                  Manual de Procedimientos para la Autoridad de Mesa
                </h3>
              </div>
              <button
                onClick={() => setShowManualModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-semibold cursor-pointer"
              >
                ✕ Cerrar
              </button>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1 leading-relaxed">
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">
                  1. Apertura de la Mesa Electoral (07:30 a 08:00 hs)
                </h4>
                <p className="text-slate-600">
                  Verifique que la urna esté vacía ante los fiscales acreditados. Coloque el precinto de apertura. Inicialice la terminal BUE con su tarjeta de autoridad de mesa e imprima el Acta Cero.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">
                  2. Recepción del Sufragio y Control de Identidad
                </h4>
                <p className="text-slate-600">
                  Busque al elector en el padrón por DNI o apellido. Corrobore que el documento presentado sea <strong>igual o posterior</strong> al que figura en el padrón (Ley 19.945 Art. 86). Entregue la boleta BUE con el troquel correspondiente.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">
                  3. Emisión de Constancia y Firma del Padrón
                </h4>
                <p className="text-slate-600">
                  Cuando el elector salga de la cabina, solicítele que corte el troquel en su presencia tras cotejar el número. Deposite la boleta en la urna, haga firmar el padrón y entregue la constancia de emisión de voto con su firma.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">
                  4. Cierre y Escrutinio Provisorio (18:00 hs)
                </h4>
                <p className="text-slate-600">
                  Abra la urna y cuente las boletas. El sistema exige un <strong>balance aritmético obligatorio</strong>: la suma de votos de cada agrupación, blancos, nulos y recurridos debe ser exactamente igual al total de sobres.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">
                  5. Transmisión del Telegrama Oficial
                </h4>
                <p className="text-slate-600">
                  Una vez cuadrado el escrutinio, presione "Firmar y Transmitir". Se emitirá el telegrama con código criptográfico SHA-256 hacia el Tribunal Electoral e imprima los certificados de escrutinio para los fiscales de cada partido.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowManualModal(false)}
                className="px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white font-bold rounded-lg text-xs cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
