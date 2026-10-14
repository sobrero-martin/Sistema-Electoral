import React, { useState } from 'react';
import { MesaState } from '../../types/election';
import {
  ShieldAlert,
  Scale,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Search,
  Activity,
  FileCheck,
  Server,
  Layers,
  Building,
  BookOpen,
} from 'lucide-react';
import { RoleAccessibilityBar } from '../common/RoleAccessibilityBar';

interface TribunalDashboardProps {
  mesaState: MesaState;
  highContrast: boolean;
  onToggleContrast: () => void;
  fontSize: 'normal' | 'large' | 'xlarge';
  onChangeFontSize: (size: 'normal' | 'large' | 'xlarge') => void;
}

export const TribunalDashboard: React.FC<TribunalDashboardProps> = ({
  mesaState,
  highContrast,
  onToggleContrast,
  fontSize,
  onChangeFontSize,
}) => {
  const [showTribunalHelp, setShowTribunalHelp] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'integridad' | 'audiencia' | 'registro'>('integridad');

  // Contested ballots pending adjudication in Tribunal
  const [contestedBallots, setContestedBallots] = useState([
    {
      id: 'REC-0412-01',
      mesa: 412,
      school: 'Escuela N° 12 "D. F. Sarmiento"',
      circuit: '03A',
      electorDni: '24.912.871',
      electorName: 'Gutiérrez, Alberto Daniel',
      reason: 'Fiscal de Lista 503 impugnó identidad alegando diferencia en firma del padrón',
      evidence: 'El elector exhibió DNI tarjeta Ejemplar C original y coincide fecha de nacimiento',
      provisionalBallot: 'Voto a Intendente: Lista 501 (Frente Cívico Municipal)',
      status: 'pendiente' as 'pendiente' | 'admitido' | 'anulado',
      resolutionNote: '',
    },
    {
      id: 'REC-0389-02',
      mesa: 389,
      school: 'Colegio Nacional N° 1',
      circuit: '01B',
      electorDni: '31.902.114',
      electorName: 'Navarro, Claudia Beatriz',
      reason: 'Boleta ingresada con rotura en el ángulo superior del troquel',
      evidence: 'El chip RFID interno permanece íntegro y legible por el scanner oficial',
      provisionalBallot: 'Voto a Intendente: Lista 502 (Unión Vecinal Progresista)',
      status: 'admitido' as 'pendiente' | 'admitido' | 'anulado',
      resolutionNote: 'Se admitió por unanimidad: el daño en el papel no afecta el chip ni la voluntad del elector.',
    },
  ]);

  const handleResolveContested = (id: string, decision: 'admitido' | 'anulado') => {
    setContestedBallots((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status: decision,
            resolutionNote:
              decision === 'admitido'
                ? 'Acordada del Tribunal: Se convalida el sufragio por acreditación positiva de identidad.'
                : 'Acordada del Tribunal: Se declara nulo por defecto formal insubsanable.',
          };
        }
        return item;
      })
    );
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* Role Dedicated Accessibility Bar (Without legislative text) */}
      <RoleAccessibilityBar
        roleTitle="Junta Electoral Municipal"
        roleSubtitle="Monitoreo de Integridad y Escrutinio Definitivo"
        highContrast={highContrast}
        onToggleContrast={onToggleContrast}
        fontSize={fontSize}
        onChangeFontSize={onChangeFontSize}
        onShowHelp={() => setShowTribunalHelp(true)}
        helpButtonLabel="Instructivo del Tribunal"
      />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 w-full space-y-6">
        {/* Header: Tribunal Electoral Municipal */}
      <div className="bg-slate-900 text-white rounded-xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 uppercase tracking-wider mb-1">
            <Scale className="w-4 h-4" />
            <span>Junta Electoral Municipal</span>
            <span>·</span>
            <span>Monitoreo Oficial de Comicios</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Panel de Integridad y Control del Escrutinio
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Jurisdicción Municipal · Ciudad de Elección 2026 · Sala de Acuerdos
          </p>
        </div>

        {/* System Health Indicators */}
        <div className="flex items-center gap-3 text-xs">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-2.5 min-w-[110px] text-center">
            <span className="text-[11px] text-slate-400 block">Mesas Ingeridas</span>
            <span className="text-base font-bold text-white tabular-nums">87 / 110 (79%)</span>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-2.5 min-w-[110px] text-center">
            <span className="text-[11px] text-slate-400 block">Participación</span>
            <span className="text-base font-bold text-emerald-400 tabular-nums">76.5%</span>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-2.5 min-w-[110px] text-center">
            <span className="text-[11px] text-slate-400 block">Integridad Hash</span>
            <span className="text-xs font-bold text-sky-400 uppercase mt-0.5 block">100% Válido</span>
          </div>
        </div>
      </div>

      {/* Tribunal Subtabs */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveSubTab('integridad')}
          className={`pb-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeSubTab === 'integridad'
              ? 'border-sky-800 text-sky-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>1. Monitor de Integridad y Detección de Anomalías</span>
        </button>
        <button
          onClick={() => setActiveSubTab('audiencia')}
          className={`pb-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeSubTab === 'audiencia'
              ? 'border-sky-800 text-sky-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>2. Sala de Audiencia: Votos Recurridos ({contestedBallots.filter(b => b.status === 'pendiente').length})</span>
        </button>
        <button
          onClick={() => setActiveSubTab('registro')}
          className={`pb-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeSubTab === 'registro'
              ? 'border-sky-800 text-sky-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>3. Registro Criptográfico Inmutable</span>
        </button>
      </div>

      {/* SUBTAB 1: INTEGRITY SCANNER & ANOMALY DETECTION */}
      {activeSubTab === 'integridad' && (
        <div className="space-y-6">
          {/* Integrity Checklist Grid (Nielsen Heuristic 5: Error Prevention) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Consistencia Aritmética</span>
              </div>
              <div className="text-xl font-bold text-slate-900">0 Inconsistencias</div>
              <p className="text-[11px] text-slate-500 mt-1">
                Todas las mesas recibidas cuadran al 100%: votos emitidos = boletas escrutadas.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Auditoría de Sobregiro</span>
              </div>
              <div className="text-xl font-bold text-slate-900">0 Mesas &gt; 100%</div>
              <p className="text-[11px] text-slate-500 mt-1">
                Ninguna mesa superó el límite legal de electores habilitados en el padrón oficial.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Firmas Digitales</span>
              </div>
              <div className="text-xl font-bold text-slate-900">87 / 87 Certificadas</div>
              <p className="text-[11px] text-slate-500 mt-1">
                Todos los telegramas cuentan con la firma digital válida del presidente de mesa.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 mb-1">
                <AlertTriangle className="w-4 h-4" />
                <span>Votos Observados</span>
              </div>
              <div className="text-xl font-bold text-slate-900">3 Votos Observados</div>
              <p className="text-[11px] text-slate-500 mt-1">
                Remitidos a sobre lacrado para resolución en Sala de Audiencia del Tribunal.
              </p>
            </div>
          </div>

          {/* Circuit Breakdown Status */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
              Avance por Circuito Electoral Municipal
            </h2>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-800">Circuito 01 (Norte - 28 mesas)</span>
                  <span className="tabular-nums font-bold text-sky-800">24 mesas recibidas (85.7%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-sky-600 h-full rounded-full" style={{ width: '85.7%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-800">Circuito 02 (Sur - 32 mesas)</span>
                  <span className="tabular-nums font-bold text-sky-800">25 mesas recibidas (78.1%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-sky-600 h-full rounded-full" style={{ width: '78.1%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-800">Circuito 03A (Centro - 30 mesas - Incluye Mesa 412)</span>
                  <span className="tabular-nums font-bold text-emerald-700">26 mesas recibidas (86.6%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: '86.6%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-800">Circuito 04 (Oeste - 20 mesas)</span>
                  <span className="tabular-nums font-bold text-sky-800">12 mesas recibidas (60.0%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-sky-600 h-full rounded-full" style={{ width: '60%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: SALA DE AUDIENCIA - VOTOS RECURRIDOS */}
      {activeSubTab === 'audiencia' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs max-w-4xl mx-auto space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Resolución Judicial de Votos Recurridos e Impugnados
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Conforme al Código Electoral Nacional Ley 19.945 Art. 101 bis y 103: Apertura en presencia de apoderados partidarios
            </p>
          </div>

          <div className="space-y-4">
            {contestedBallots.map((ballot) => (
              <div
                key={ballot.id}
                className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-3 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sky-800 text-sm">{ballot.id}</span>
                    <span className="text-slate-400">·</span>
                    <span className="font-semibold text-slate-900">Mesa N° 0{ballot.mesa}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-600">{ballot.school}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded font-semibold text-[11px] self-start sm:self-auto ${
                      ballot.status === 'pendiente'
                        ? 'bg-amber-100 text-amber-900'
                        : ballot.status === 'admitido'
                        ? 'bg-emerald-100 text-emerald-900'
                        : 'bg-rose-100 text-rose-900'
                    }`}
                  >
                    Estado: {ballot.status.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-500 font-semibold block text-[11px]">
                      Elector y Causal del Recurso
                    </label>
                    <div className="font-bold text-slate-900">
                      {ballot.electorName} (DNI {ballot.electorDni})
                    </div>
                    <p className="text-slate-600 mt-1">{ballot.reason}</p>
                  </div>

                  <div>
                    <label className="text-slate-500 font-semibold block text-[11px]">
                      Prueba Producida e Inspección
                    </label>
                    <p className="text-slate-700 bg-white p-2.5 rounded border border-slate-200">
                      {ballot.evidence}
                    </p>
                    <div className="mt-1 font-mono text-slate-800 font-semibold text-[11px]">
                      {ballot.provisionalBallot}
                    </div>
                  </div>
                </div>

                {ballot.resolutionNote && (
                  <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg text-emerald-900 text-xs">
                    <strong>Resolución del Tribunal:</strong> {ballot.resolutionNote}
                  </div>
                )}

                {ballot.status === 'pendiente' && (
                  <div className="pt-2 border-t border-slate-200 flex flex-wrap justify-end gap-2">
                    <button
                      onClick={() => handleResolveContested(ballot.id, 'anulado')}
                      className="px-4 py-2 border border-rose-300 text-rose-800 hover:bg-rose-50 font-semibold rounded-lg text-xs transition-colors"
                    >
                      Rechazar y Anular Voto
                    </button>
                    <button
                      onClick={() => handleResolveContested(ballot.id, 'admitido')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors shadow-xs"
                    >
                      Admitir Voto e Incorporar al Cómputo
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: IMMUTABLE AUDIT LOG TABLE */}
      {activeSubTab === 'registro' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex justify-between items-center pb-3 border-b border-slate-200 mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Libro Mayor de Transmisión de Telegramas Electorales
              </h2>
              <p className="text-xs text-slate-500">
                Cada telegrama es sellado criptográficamente con algoritmo SHA-256 e incorporado a la cadena inmutable.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg text-xs font-mono">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Hora</th>
                  <th className="py-2.5 px-3">Mesa</th>
                  <th className="py-2.5 px-3">Circuito</th>
                  <th className="py-2.5 px-3">Votos</th>
                  <th className="py-2.5 px-3">Hash Checksum (SHA-256)</th>
                  <th className="py-2.5 px-3 text-right">Verificación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 tabular-nums">
                <tr className="bg-sky-50/50">
                  <td className="py-2 px-3 text-slate-600">18:52:14</td>
                  <td className="py-2 px-3 font-bold text-sky-900">Mesa 0412</td>
                  <td className="py-2 px-3 text-slate-600">03A (Centro)</td>
                  <td className="py-2 px-3 font-bold text-slate-800">268</td>
                  <td className="py-2 px-3 text-slate-600 truncate max-w-xs">
                    SHA256:4C8F92BA71E300A5210998CD2009
                  </td>
                  <td className="py-2 px-3 text-right text-emerald-700 font-bold">
                    ✓ VÁLIDO
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-slate-600">18:50:33</td>
                  <td className="py-2 px-3 font-bold text-slate-900">Mesa 0411</td>
                  <td className="py-2 px-3 text-slate-600">03A (Centro)</td>
                  <td className="py-2 px-3 text-slate-800">271</td>
                  <td className="py-2 px-3 text-slate-600 truncate max-w-xs">
                    SHA256:88B12C1109FA9844A89123891002
                  </td>
                  <td className="py-2 px-3 text-right text-emerald-700 font-bold">
                    ✓ VÁLIDO
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-slate-600">18:49:10</td>
                  <td className="py-2 px-3 font-bold text-slate-900">Mesa 0410</td>
                  <td className="py-2 px-3 text-slate-600">03A (Centro)</td>
                  <td className="py-2 px-3 text-slate-800">265</td>
                  <td className="py-2 px-3 text-slate-600 truncate max-w-xs">
                    SHA256:19A440938EF11182746193710291
                  </td>
                  <td className="py-2 px-3 text-right text-emerald-700 font-bold">
                    ✓ VÁLIDO
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-slate-600">18:48:02</td>
                  <td className="py-2 px-3 font-bold text-slate-900">Mesa 0409</td>
                  <td className="py-2 px-3 text-slate-600">03A (Centro)</td>
                  <td className="py-2 px-3 text-slate-800">280</td>
                  <td className="py-2 px-3 text-slate-600 truncate max-w-xs">
                    SHA256:65E1094892408103719461947192
                  </td>
                  <td className="py-2 px-3 text-right text-emerald-700 font-bold">
                    ✓ VÁLIDO
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
      </div>

      {/* Instructivo Modal for Tribunal Electoral */}
      {showTribunalHelp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 text-xs text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-sky-800" />
                <h3 className="font-bold text-slate-900 text-base">
                  Manual de Procedimientos y Acuerdos de la Junta Electoral Municipal
                </h3>
              </div>
              <button
                onClick={() => setShowTribunalHelp(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-semibold cursor-pointer"
              >
                ✕ Cerrar
              </button>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1 leading-relaxed">
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">
                  1. Monitoreo de Integridad y Detección de Inconsistencias
                </h4>
                <p className="text-slate-600">
                  El Tribunal audita en tiempo real las 110 mesas electorales del municipio. El panel analiza automáticamente la consistencia aritmética de cada mesa (concordancia estricta entre votantes efectivos en padrón y boletas contabilizadas en urna).
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">
                  2. Verificación de Transmisiones Criptográficas Inmutables (SHA-256)
                </h4>
                <p className="text-slate-600">
                  Cada telegrama recibido cuenta con una firma digital hash SHA-256 generada en la terminal BUE de la mesa. Cualquier alteración de datos durante el transporte telemático generará una discrepancia de hash y una alerta roja inmediata.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">
                  3. Sala de Audiencia y Sustanciación de Votos Recurridos
                </h4>
                <p className="text-slate-600">
                  Los magistrados del Tribunal evalúan los votos impugnados o recurridos por los fiscales (cuestiones de identidad, boletas dañadas con chip legible, etc.). La Junta delibera y resuelve mediante acordada fundada, admitiendo o convalidando/anulando cada sufragio.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">
                  4. Escrutinio Definitivo, Aplicación D'Hondt y Proclamación
                </h4>
                <p className="text-slate-600">
                  Una vez resueltas todas las mesas e incidencias, el Tribunal emite el Acta Oficial de Cierre Definitivo, realiza el cálculo del sistema D'Hondt para la distribución de concejalías y proclama formalmente al Intendente y Concejales electos.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowTribunalHelp(false)}
                className="px-4 py-2 bg-sky-800 hover:bg-sky-900 text-white font-bold rounded-lg text-xs cursor-pointer"
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
