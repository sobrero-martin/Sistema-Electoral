import React, { useState } from 'react';
import { CANDIDATE_LISTS } from '../../data/electionData';
import { MesaState } from '../../types/election';
import { RoleAccessibilityBar } from '../common/RoleAccessibilityBar';
import {
  ShieldCheck,
  Search,
  FileText,
  AlertTriangle,
  Download,
  CheckCircle2,
  RefreshCw,
  Scale,
  Hash,
  Send,
  Building2,
  BookOpen,
} from 'lucide-react';

interface CandidateAuditorProps {
  mesaState: MesaState;
  highContrast: boolean;
  onToggleContrast: () => void;
  fontSize: 'normal' | 'large' | 'xlarge';
  onChangeFontSize: (size: 'normal' | 'large' | 'xlarge') => void;
}

export const CandidateAuditor: React.FC<CandidateAuditorProps> = ({
  mesaState,
  highContrast,
  onToggleContrast,
  fontSize,
  onChangeFontSize,
}) => {
  const [showFiscalHelp, setShowFiscalHelp] = useState(false);
  const [selectedMesaView, setSelectedMesaView] = useState<number>(412);
  const [fiscalHashInput, setFiscalHashInput] = useState('');
  const [hashVerificationResult, setHashVerificationResult] = useState<
    'idle' | 'match' | 'mismatch'
  >('idle');
  const [selectedPartyFilter, setSelectedPartyFilter] = useState<string>('todos');
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimCause, setClaimCause] = useState('diferencia_aritmética');
  const [claimDetails, setClaimDetails] = useState('');
  const [filedClaims, setFiledClaims] = useState<
    { id: string; mesa: number; party: string; cause: string; timestamp: string; status: string }[]
  >([
    {
      id: 'REC-2026-081',
      mesa: 398,
      party: 'Lista 502',
      cause: 'Diferencia de 1 voto en el telegrama respecto a certificado de fiscal',
      timestamp: '18:44 hs',
      status: 'En trámite ante Tribunal',
    },
  ]);

  // Aggregate simulated election totals across 87 tables
  const electionTotals = {
    '501': 9420,
    '502': 8650,
    '503': 6110,
    '504': 3240,
    blancos: 780,
    nulos: 250,
    totalValid: 27420,
  };

  // Check SHA-256 hash
  const handleVerifyHash = () => {
    const officialHash = 'SHA256:4C8F92BA71E300A5210998CD2009';
    if (fiscalHashInput.trim().toUpperCase() === officialHash) {
      setHashVerificationResult('match');
    } else {
      setHashVerificationResult('mismatch');
    }
  };

  const handleFileClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimDetails.trim()) return;
    const newClaim = {
      id: `REC-2026-${Math.floor(100 + Math.random() * 900)}`,
      mesa: selectedMesaView,
      party: 'Fiscalía General Partidaria',
      cause: claimDetails,
      timestamp: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) + ' hs',
      status: 'Ingresado - A la espera de audiencia',
    };
    setFiledClaims([newClaim, ...filedClaims]);
    setClaimDetails('');
    setShowClaimModal(false);
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* Role Dedicated Accessibility Bar (Without legislative text) */}
      <RoleAccessibilityBar
        roleTitle="Fiscalización y Control Partidario"
        roleSubtitle="Escrutinio Provisorio y Auditoría Criptográfica"
        highContrast={highContrast}
        onToggleContrast={onToggleContrast}
        fontSize={fontSize}
        onChangeFontSize={onChangeFontSize}
        onShowHelp={() => setShowFiscalHelp(true)}
        helpButtonLabel="Instructivo de Fiscales"
      />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 w-full space-y-6">
      {/* Top Banner: Candidate & Auditor Transparency */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 uppercase tracking-wider mb-1">
            <span>Portal de Fiscalización y Transparencia Partidaria</span>
            <span>·</span>
            <span>Escrutinio Provisorio</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Fiscalización Electoral en Tiempo Real
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cómputos provisorios auditables · 87 de 110 mesas computadas (79.09%) · Trazabilidad criptográfica SHA-256
          </p>
        </div>

        <button
          onClick={() => setShowClaimModal(true)}
          className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-2 shadow-xs shrink-0 self-start md:self-auto"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Presentar Reclamo de Fiscalización</span>
        </button>
      </div>

      {/* Main Results KPI Grid by Candidate List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CANDIDATE_LISTS.map((cand) => {
          const votes = electionTotals[cand.listNumber as keyof typeof electionTotals] || 0;
          const percentage = ((votes / electionTotals.totalValid) * 100).toFixed(2);

          return (
            <div
              key={cand.id}
              className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs relative overflow-hidden"
            >
              <div
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{ backgroundColor: cand.colorHex }}
              />

              <div className="flex items-center gap-3 mb-3">
                <img
                  src={cand.photoUrl}
                  alt={cand.mayorCandidate}
                  className="w-12 h-12 rounded-lg object-cover object-top border border-slate-200 shrink-0"
                />
                <div className="min-w-0">
                  <span
                    className="inline-block px-1.5 py-0.5 rounded text-[10px] text-white font-mono font-bold mb-0.5"
                    style={{ backgroundColor: cand.colorHex }}
                  >
                    LISTA {cand.listNumber}
                  </span>
                  <h2 className="text-xs font-bold text-slate-900 truncate">
                    {cand.mayorCandidate}
                  </h2>
                  <p className="text-[11px] text-slate-500 truncate">{cand.partyName}</p>
                </div>
              </div>

              <div className="flex items-baseline justify-between pt-2 border-t border-slate-100">
                <div>
                  <div className="text-2xl font-bold text-slate-900 tabular-nums">
                    {percentage}%
                  </div>
                  <div className="text-[11px] text-slate-500 tabular-nums">
                    {votes.toLocaleString('es-AR')} votos
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Concejales D'Hondt
                  </span>
                  <span className="text-sm font-bold text-slate-800">
                    {cand.listNumber === '501'
                      ? '5 bancas'
                      : cand.listNumber === '502'
                      ? '4 bancas'
                      : cand.listNumber === '503'
                      ? '2 bancas'
                      : '1 banca'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Audit Tool: Mesa Breakdown & Cryptographic Tally Sheet Verification */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List of Monitored Mesas */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Mesas Escrutadas del Circuito Centro
            </span>
            <span className="text-xs text-sky-700 font-semibold">Mesa 412 activa</span>
          </div>

          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 text-xs">
            {/* Mesa 412 (The currently interactive mesa) */}
            <div
              onClick={() => setSelectedMesaView(412)}
              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedMesaView === 412
                  ? 'border-sky-600 bg-sky-50/50'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-slate-900">Mesa N° 0412</span>
                <span className="text-emerald-700 font-semibold text-[11px] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Transmitida</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mb-1.5">
                Escuela N° 12 Sarmiento · 268 votos escrutados
              </p>
              <div className="font-mono text-[10px] text-slate-600 truncate">
                Hash: SHA256:4C8F92...2009
              </div>
            </div>

            {/* Other simulated mesas */}
            {[411, 410, 409, 408].map((num) => (
              <div
                key={num}
                onClick={() => setSelectedMesaView(num)}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedMesaView === num
                    ? 'border-sky-600 bg-sky-50/50'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-900">Mesa N° 0{num}</span>
                  <span className="text-emerald-700 font-semibold text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Transmitida</span>
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mb-1.5">
                  Escuela N° 12 Sarmiento · 271 votos escrutados
                </p>
                <div className="font-mono text-[10px] text-slate-400 truncate">
                  Hash: SHA256:88B12C...9811
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center/Right Column: Tally Sheet Details & Hash Auditor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Digitalized Tally Sheet Details */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 mb-4 gap-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Acta de Escrutinio y Telegrama Digital Oficial
                </span>
                <h2 className="text-lg font-bold text-slate-900">
                  Mesa Electoral N° 0{selectedMesaView} · Circuito 03A
                </h2>
              </div>

              <button
                onClick={() => alert(`Descargando copia certificada del Acta de Escrutinio Mesa 0${selectedMesaView} en PDF con firma digital...`)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar Acta Certificada</span>
              </button>
            </div>

            {/* Results Table for Selected Mesa */}
            <div className="border border-slate-200 rounded-lg overflow-hidden text-xs mb-4">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3">Agrupación / Lista</th>
                    <th className="py-2 px-3 text-right">Intendente</th>
                    <th className="py-2 px-3 text-right">Concejales</th>
                    <th className="py-2 px-3 text-right">% Votos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 tabular-nums">
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-900">
                      Lista 501 · Frente Cívico Municipal
                    </td>
                    <td className="py-2 px-3 text-right font-bold text-slate-800">98</td>
                    <td className="py-2 px-3 text-right text-slate-600">96</td>
                    <td className="py-2 px-3 text-right text-slate-600">36.56%</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-900">
                      Lista 502 · Unión Vecinal Progresista
                    </td>
                    <td className="py-2 px-3 text-right font-bold text-slate-800">84</td>
                    <td className="py-2 px-3 text-right text-slate-600">85</td>
                    <td className="py-2 px-3 text-right text-slate-600">31.34%</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-900">
                      Lista 503 · Alianza Republicana Federal
                    </td>
                    <td className="py-2 px-3 text-right font-bold text-slate-800">52</td>
                    <td className="py-2 px-3 text-right text-slate-600">51</td>
                    <td className="py-2 px-3 text-right text-slate-600">19.40%</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-900">
                      Lista 504 · Mov. Integración Ciudadana
                    </td>
                    <td className="py-2 px-3 text-right font-bold text-slate-800">24</td>
                    <td className="py-2 px-3 text-right text-slate-600">25</td>
                    <td className="py-2 px-3 text-right text-slate-600">8.95%</td>
                  </tr>
                  <tr className="bg-slate-50 font-bold text-slate-700">
                    <td className="py-2 px-3">Blancos, Nulos y Recurridos</td>
                    <td className="py-2 px-3 text-right">10</td>
                    <td className="py-2 px-3 text-right">11</td>
                    <td className="py-2 px-3 text-right">3.73%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Cryptographic Hash Audit Tool (Heuristic 5: Error Prevention & Fraud Immunity) */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-800">
                <Hash className="w-4 h-4 text-sky-700" />
                <span>Auditoría de Integridad: Comparador de Hash Criptográfico</span>
              </div>
              <p className="text-[11px] text-slate-600 mb-3">
                Para verificar que el telegrama transmitido no sufrió alteraciones durante la transmisión, ingrese el código SHA-256 impreso en el certificado de escrutinio entregado en mano a su fiscal de mesa:
              </p>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Pegue aquí el hash (ej. SHA256:4C8F92BA71E300A5210998CD2009)"
                  value={fiscalHashInput}
                  onChange={(e) => {
                    setFiscalHashInput(e.target.value);
                    setHashVerificationResult('idle');
                  }}
                  className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <button
                  onClick={handleVerifyHash}
                  className="px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white font-semibold text-xs rounded-lg transition-colors shrink-0"
                >
                  Cotejar Hash
                </button>
                <button
                  onClick={() => {
                    setFiscalHashInput('SHA256:4C8F92BA71E300A5210998CD2009');
                    setHashVerificationResult('idle');
                  }}
                  className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs rounded-lg transition-colors shrink-0"
                >
                  Probar Hash Oficial
                </button>
              </div>

              {hashVerificationResult === 'match' && (
                <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>¡INTEGRIDAD 100% CONFIRMADA!</strong> El certificado físico del fiscal coincide bit a bit con el telegrama oficial del Tribunal.
                  </span>
                </div>
              )}

              {hashVerificationResult === 'mismatch' && (
                <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-900 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>
                    <strong>DISCORDANCIA DETECTADA:</strong> El hash ingresado no coincide con el telegrama recibido. Puede iniciar un reclamo formal ante el Tribunal Electoral.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Filed Claims Table */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Reclamos Registrados por Apoderados ({filedClaims.length})
              </span>
              <span className="text-[11px] text-slate-500">Ley 19.945 Art. 104</span>
            </div>

            <div className="space-y-2">
              {filedClaims.map((claim) => (
                <div
                  key={claim.id}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-800">{claim.id}</span>
                      <span className="text-slate-400">·</span>
                      <span className="font-bold text-sky-800">Mesa #{claim.mesa}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-500">{claim.timestamp}</span>
                    </div>
                    <p className="text-slate-600 mt-1">{claim.cause}</p>
                  </div>
                  <span className="px-2 py-1 bg-amber-100 text-amber-900 rounded font-semibold text-[11px] shrink-0 self-start sm:self-auto">
                    {claim.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reclamo Modal */}
      {showClaimModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  Presentar Reclamo Formal de Mesa
                </h3>
              </div>
              <button
                onClick={() => setShowClaimModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-semibold"
              >
                ✕ Cerrar
              </button>
            </div>

            <form onSubmit={handleFileClaim} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Mesa Objeto del Reclamo
                </label>
                <input
                  type="number"
                  value={selectedMesaView}
                  onChange={(e) => setSelectedMesaView(parseInt(e.target.value) || 412)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Causal Legal (Código Electoral Nacional Art. 104)
                </label>
                <select
                  value={claimCause}
                  onChange={(e) => setClaimCause(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="diferencia_aritmética">
                    Diferencia entre certificado de fiscal y telegrama transmitido
                  </option>
                  <option value="voto_recurrido">
                    Votos recurridos indebidamente computados como nulos
                  </option>
                  <option value="fiscal_excluido">
                    Impedimento ilegítimo al fiscal de presenciar el escrutinio
                  </option>
                  <option value="rotura_precinto">
                    Falta o alteración de precinto de seguridad en urna
                  </option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Fundamentación y Detalle de Hechos
                </label>
                <textarea
                  rows={3}
                  value={claimDetails}
                  onChange={(e) => setClaimDetails(e.target.value)}
                  placeholder="Describa con precisión los hechos ocurridos, número de votos objetados y adjunte referencia de firma..."
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowClaimModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-lg cursor-pointer"
                >
                  Registrar Reclamo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Instructivo Modal for Candidatos y Fiscales Partidarios */}
      {showFiscalHelp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 text-xs text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-violet-700" />
                <h3 className="font-bold text-slate-900 text-base">
                  Instructivo Oficial de Fiscalización y Control Partidario
                </h3>
              </div>
              <button
                onClick={() => setShowFiscalHelp(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-semibold cursor-pointer"
              >
                ✕ Cerrar
              </button>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1 leading-relaxed">
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">
                  1. Misión y Atribuciones del Fiscal (Ley 19.945 Art. 55-60)
                </h4>
                <p className="text-slate-600">
                  Los fiscales representan a su agrupación política para custodiar la pureza del acto electoral. Tienen derecho a presenciar la apertura de la mesa, el control de los cuartos oscuros, la verificación de identidad del elector y el recuento de votos.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">
                  2. Certificado de Escrutinio con Validez Legal
                </h4>
                <p className="text-slate-600">
                  Al finalizar el escrutinio de mesa, el presidente tiene la <strong>obligación legal</strong> de entregar a cada fiscal una copia del Certificado de Escrutinio debidamente firmada. Este certificado contiene el código Hash SHA-256 de seguridad.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">
                  3. Auditoría de Integridad Criptográfica (Cotejo de Hash)
                </h4>
                <p className="text-slate-600">
                  En este portal, utilice el comparador de Hash ingresando la clave SHA-256 de su certificado físico. Si el resultado indica "¡INTEGRIDAD 100% CONFIRMADA!", se garantiza que el telegrama oficial transmitido no fue alterado ni manipulado en tránsito.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">
                  4. Presentación de Reclamos e Impugnaciones (Art. 104 CEN)
                </h4>
                <p className="text-slate-600">
                  Si detecta discrepancias numéricas entre su certificado y el telegrama, o si su fiscal fue indebidamente apartado, presione "Presentar Reclamo de Fiscalización" para generar un expediente electrónico directo ante el Tribunal Electoral.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowFiscalHelp(false)}
                className="px-4 py-2 bg-violet-700 hover:bg-violet-800 text-white font-bold rounded-lg text-xs cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};
