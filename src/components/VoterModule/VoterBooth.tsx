import React, { useState } from 'react';
import { CANDIDATE_LISTS } from '../../data/electionData';
import { CandidateList, VoteSelection } from '../../types/election';
import { AccessibilityControls } from './AccessibilityControls';
import { playSound, speakText, stopSpeaking, SoundType } from '../../utils/audioService';
import {
  CheckCircle2,
  AlertCircle,
  Undo2,
  Printer,
  QrCode,
  ShieldCheck,
  ArrowRight,
  HelpCircle,
  FileCheck,
  CreditCard,
  Vote,
  Volume2,
  Sparkles,
} from 'lucide-react';

interface VoterBoothProps {
  onVoteCast: (selection: VoteSelection) => void;
  highContrast: boolean;
  onToggleContrast: () => void;
  fontSize: 'normal' | 'large' | 'xlarge';
  onChangeFontSize: (size: 'normal' | 'large' | 'xlarge') => void;
}

type VoterStep =
  | 'welcome'
  | 'mode_selection'
  | 'category_intendente'
  | 'category_concejales'
  | 'category_tribunal'
  | 'review_confirmation'
  | 'printing'
  | 'verify_rfid'
  | 'completed';

export const VoterBooth: React.FC<VoterBoothProps> = ({
  onVoteCast,
  highContrast,
  onToggleContrast,
  fontSize,
  onChangeFontSize,
}) => {
  const [step, setStep] = useState<VoterStep>('welcome');
  const [votingMode, setVotingMode] = useState<'lista_completa' | 'por_categoria'>('lista_completa');
  const [selectedIntendente, setSelectedIntendente] = useState<string>(''); // list number or 'blanco'
  const [selectedConcejales, setSelectedConcejales] = useState<string>('');
  const [selectedTribunal, setSelectedTribunal] = useState<string>('');

  // Audio Assistance State (Exclusively reserved for Voter Booth)
  const [audioAssistance, setAudioAssistance] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpeechText, setCurrentSpeechText] = useState('');
  const [speechRate, setSpeechRate] = useState(1.0);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const [isVerifyingRfid, setIsVerifyingRfid] = useState(false);
  const [rfidVerified, setRfidVerified] = useState(false);

  // Voice utterance wrapper
  const speak = (text: string, sound?: SoundType) => {
    if (sound) {
      playSound(sound);
    }
    setCurrentSpeechText(text);

    if (audioAssistance) {
      setIsSpeaking(true);
      speakText(text, {
        rate: speechRate,
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    }
  };

  // Announce on hover when audio assistance is active
  const handleItemHover = (hoverText: string) => {
    if (audioAssistance && !isSpeaking) {
      speakText(hoverText, {
        rate: speechRate * 1.1,
      });
    }
  };

  const handleToggleContrast = () => {
    onToggleContrast();
    speak(
      !highContrast ? 'Modo de alto contraste activado.' : 'Modo de alto contraste desactivado.',
      'click'
    );
  };

  const handleChangeFontSize = (size: 'normal' | 'large' | 'xlarge') => {
    onChangeFontSize(size);
    const label = size === 'normal' ? 'estándar' : size === 'large' ? 'grande' : 'extra grande';
    speak(`Tamaño de texto cambiado a ${label}.`, 'click');
  };

  const handleToggleAudio = () => {
    const next = !audioAssistance;
    setAudioAssistance(next);
    if (next) {
      playSound('select');
      setCurrentSpeechText('Asistencia por voz activada. En cada pantalla escuchará las opciones e instrucciones para emitir su voto.');
      setIsSpeaking(true);
      speakText(
        'Asistencia por voz activada. En cada pantalla escuchará las opciones disponibles e instrucciones para emitir su voto.',
        {
          rate: speechRate,
          onStart: () => setIsSpeaking(true),
          onEnd: () => setIsSpeaking(false),
        }
      );
    } else {
      stopSpeaking();
      setIsSpeaking(false);
      setCurrentSpeechText('');
      playSound('click');
    }
  };

  const handleRepeatSpeech = () => {
    if (currentSpeechText) {
      speak(currentSpeechText, 'click');
    }
  };

  const handleStopSpeech = () => {
    stopSpeaking();
    setIsSpeaking(false);
  };

  const handleChangeSpeechRate = (rate: number) => {
    setSpeechRate(rate);
    speak(`Velocidad de voz ajustada a ${rate} por.`, 'click');
  };

  // Electoral flow handlers
  const handleStartVoting = () => {
    setStep('mode_selection');
    speak(
      'Boleta insertada correctamente. Seleccione si desea votar por Lista Completa de un partido o por Categoría independiente.',
      'select'
    );
  };

  const handleSelectMode = (mode: 'lista_completa' | 'por_categoria') => {
    setVotingMode(mode);
    if (mode === 'lista_completa') {
      setStep('category_intendente');
      speak(
        'Modo Lista Completa seleccionado. Elija la lista electoral de su preferencia para todos los cargos.',
        'select'
      );
    } else {
      setStep('category_intendente');
      speak(
        'Modo Por Categoría seleccionado. Paso 1 de 3: Elija candidato a Intendente Municipal.',
        'select'
      );
    }
  };

  const handleChooseFullList = (listNumber: string) => {
    setSelectedIntendente(listNumber);
    setSelectedConcejales(listNumber);
    setSelectedTribunal(listNumber);
    setStep('review_confirmation');
    const party = CANDIDATE_LISTS.find((l) => l.listNumber === listNumber);
    speak(
      listNumber === 'blanco'
        ? 'Ha seleccionado voto en blanco para todas las categorías. Por favor revise su selección antes de imprimir.'
        : `Ha seleccionado la Lista ${listNumber}, ${party?.partyName}, con el candidato a intendente ${party?.mayorCandidate}. Revise su selección en pantalla.`,
      'select'
    );
  };

  const handleChooseIntendente = (listNumber: string) => {
    setSelectedIntendente(listNumber);
    if (votingMode === 'lista_completa') {
      handleChooseFullList(listNumber);
    } else {
      setStep('category_concejales');
      const party = CANDIDATE_LISTS.find((l) => l.listNumber === listNumber);
      speak(
        listNumber === 'blanco'
          ? 'Intendente: Voto en blanco registrado. Paso 2 de 3: Seleccione ahora los Concejales Municipales.'
          : `Intendente: ${party?.mayorCandidate} registrado. Paso 2 de 3: Seleccione ahora los Concejales Municipales.`,
        'select'
      );
    }
  };

  const handleChooseConcejales = (listNumber: string) => {
    setSelectedConcejales(listNumber);
    setStep('category_tribunal');
    const party = CANDIDATE_LISTS.find((l) => l.listNumber === listNumber);
    speak(
      listNumber === 'blanco'
        ? 'Concejales: Voto en blanco registrado. Paso 3 de 3: Seleccione ahora el Tribunal de Cuentas.'
        : `Concejales: Lista ${listNumber} registrada. Paso 3 de 3: Seleccione ahora el Tribunal de Cuentas.`,
      'select'
    );
  };

  const handleChooseTribunal = (listNumber: string) => {
    setSelectedTribunal(listNumber);
    setStep('review_confirmation');
    speak(
      'Ha completado la selección de todas las categorías. Por favor revise su voto en pantalla. Puede presionar el botón Modificar en cualquier categoría para cambiarla.',
      'select'
    );
  };

  const handleReadFullBallotAloud = () => {
    const mayor =
      selectedIntendente === 'blanco'
        ? 'Voto en Blanco'
        : `Lista ${selectedIntendente}, ${getCandidateByList(selectedIntendente)?.partyName}, candidato ${getCandidateByList(selectedIntendente)?.mayorCandidate}`;
    const councilors =
      selectedConcejales === 'blanco'
        ? 'Voto en Blanco'
        : `Lista ${selectedConcejales}, ${getCandidateByList(selectedConcejales)?.partyName}, encabezada por ${getCandidateByList(selectedConcejales)?.councilorLead}`;
    const auditors =
      selectedTribunal === 'blanco'
        ? 'Voto en Blanco'
        : `Lista ${selectedTribunal}, ${getCandidateByList(selectedTribunal)?.partyName}, encabezada por ${getCandidateByList(selectedTribunal)?.auditorLead}`;

    const textToRead = `Resumen oficial de su voto: Para Intendente Municipal: ${mayor}. Para Concejales Municipales: ${councilors}. Para Tribunal de Cuentas: ${auditors}. Si está de acuerdo, presione el botón Confirmar e Imprimir Boleta.`;
    speak(textToRead, 'click');
  };

  const handleConfirmAndPrint = () => {
    setStep('printing');
    playSound('print');
    speak(
      'Imprimiendo su Boleta Única Electrónica y grabando el chip de seguridad. Por favor aguarde un instante.',
      'print'
    );

    const finalVote: VoteSelection = {
      mode: votingMode,
      intendente: selectedIntendente,
      concejales: selectedConcejales,
      tribunal_cuentas: selectedTribunal,
      timestamp: new Date().toLocaleTimeString('es-AR'),
      qrToken: `BUE-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      hash: 'SHA256:' + Math.random().toString(16).substring(2, 10).toUpperCase(),
    };

    setTimeout(() => {
      onVoteCast(finalVote);
      setStep('verify_rfid');
      speak(
        'Boleta impresa y expulsada por la ranura. Acerque el chip de su boleta al verificador de la pantalla para constatar que coincide con lo impreso.',
        'confirm'
      );
    }, 2200);
  };

  const handleVerifyScan = () => {
    setIsVerifyingRfid(true);
    playSound('select');
    setTimeout(() => {
      setIsVerifyingRfid(false);
      setRfidVerified(true);
      speak(
        'Verificación exitosa. Los datos registrados en el chip de seguridad coinciden exactamente con la impresión en papel. Su voto es íntegro y secreto.',
        'confirm'
      );
    }, 1200);
  };

  const handleFinishAndReset = () => {
    setStep('completed');
    speak(
      'Muchas gracias por emitir su voto. Doble la boleta por la línea de puntos, corte el troquel ante la autoridad de mesa y deposítela en la urna.',
      'confirm'
    );
    setTimeout(() => {
      setSelectedIntendente('');
      setSelectedConcejales('');
      setSelectedTribunal('');
      setRfidVerified(false);
      setStep('welcome');
    }, 4500);
  };

  const getCandidateByList = (listNumber: string): CandidateList | undefined => {
    return CANDIDATE_LISTS.find((l) => l.listNumber === listNumber);
  };

  // Font size class mapping
  const fontSizeClass =
    fontSize === 'xlarge'
      ? 'font-size-xlarge'
      : fontSize === 'large'
      ? 'font-size-large'
      : 'font-size-normal';

  return (
    <div
      className={`min-h-[calc(100vh-65px)] flex flex-col bg-slate-50 transition-colors ${
        highContrast ? 'high-contrast' : ''
      } ${fontSizeClass}`}
    >
      {/* Top Accessibility Bar with Audio Assistance specifically in the Cabina Votante */}
      <AccessibilityControls
        highContrast={highContrast}
        onToggleContrast={handleToggleContrast}
        fontSize={fontSize}
        onChangeFontSize={handleChangeFontSize}
        audioAssistance={audioAssistance}
        onToggleAudio={handleToggleAudio}
        isSpeaking={isSpeaking}
        currentSpeechText={currentSpeechText}
        speechRate={speechRate}
        onChangeSpeechRate={handleChangeSpeechRate}
        onRepeatSpeech={handleRepeatSpeech}
        onStopSpeech={handleStopSpeech}
        onShowHelp={() => {
          setShowHelpModal(true);
          speak(
            'Instructivo oficial para el elector abierto. Aquí puede consultar cómo funciona la Boleta Única Electrónica y sus derechos cívicos.',
            'click'
          );
        }}
      />

      {/* Main Terminal Frame */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-center">
        {/* STEP 0: WELCOME & INSERT BALLOT */}
        {step === 'welcome' && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-12 text-center max-w-3xl mx-auto shadow-xs">
            <div className="w-20 h-20 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center mx-auto mb-6 border border-sky-100">
              <CreditCard className="w-10 h-10" />
            </div>

            <h1 className={`font-bold text-slate-900 mb-3 tracking-tight ${
              fontSize === 'xlarge' ? 'text-3xl sm:text-4xl' : fontSize === 'large' ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
            }`}>
              Cabina de Boleta Única Electrónica (BUE)
            </h1>
            <p className={`text-slate-600 mb-2 leading-relaxed ${
              fontSize === 'xlarge' ? 'text-xl' : fontSize === 'large' ? 'text-base' : 'text-sm'
            }`}>
              Elección General de Intendente y Concejales Municipales
            </p>
            <p className={`text-slate-500 mb-8 ${
              fontSize === 'xlarge' ? 'text-base' : fontSize === 'large' ? 'text-sm' : 'text-xs'
            }`}>
              Mesa N° 0412 · Circuito 03A · Escuela N° 12 "D. F. Sarmiento"
            </p>

            {/* DYNAMIC SCALABLE VOTER INSTRUCTIONS BOX */}
            <div
              className={`border rounded-xl text-left transition-all ${
                highContrast ? 'bg-black border-yellow-400' : 'bg-slate-50 border-slate-200'
              } ${
                fontSize === 'xlarge'
                  ? 'p-8 mb-10 space-y-4'
                  : fontSize === 'large'
                  ? 'p-6 mb-8 space-y-3'
                  : 'p-5 mb-8 space-y-2'
              }`}
            >
              <h2
                className={`font-bold uppercase tracking-wider ${
                  highContrast ? 'text-yellow-400' : 'text-slate-800'
                } ${
                  fontSize === 'xlarge'
                    ? 'text-2xl font-black'
                    : fontSize === 'large'
                    ? 'text-lg font-extrabold'
                    : 'text-sm font-bold'
                }`}
              >
                Instrucciones para el elector (Ley 19.945)
              </h2>
              <ol
                className={`list-decimal pl-6 leading-relaxed ${
                  highContrast ? 'text-white' : 'text-slate-700'
                } ${
                  fontSize === 'xlarge'
                    ? 'text-xl sm:text-2xl space-y-4 font-medium'
                    : fontSize === 'large'
                    ? 'text-base sm:text-lg space-y-3'
                    : 'text-xs sm:text-sm space-y-2'
                }`}
              >
                <li>
                  Inserte la boleta blanca entregada por el presidente de mesa en la ranura con la flecha hacia adelante.
                </li>
                <li>
                  Elija en pantalla a sus candidatos favoritos tocando su fotografía o nombre.
                </li>
                <li>
                  Revise su selección antes de imprimir. Puede modificar cualquier cargo si se equivocó.
                </li>
                <li>
                  Verifique el chip en pantalla y deposite la boleta en la urna.
                </li>
              </ol>
            </div>

            <button
              onClick={handleStartVoting}
              onMouseEnter={() =>
                handleItemHover('Botón para simular la inserción de la boleta en la ranura y comenzar a votar.')
              }
              className={`w-full sm:w-auto font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-3 mx-auto cursor-pointer ${
                fontSize === 'xlarge'
                  ? 'px-10 py-6 text-2xl'
                  : fontSize === 'large'
                  ? 'px-9 py-5 text-lg'
                  : 'px-8 py-4 text-base'
              } ${
                highContrast
                  ? 'bg-yellow-400 text-black hover:bg-white'
                  : 'bg-sky-700 hover:bg-sky-800 text-white'
              }`}
            >
              <Vote className={fontSize === 'xlarge' ? 'w-8 h-8' : fontSize === 'large' ? 'w-6 h-6' : 'w-5 h-5'} />
              <span>Simular Inserción de Boleta en la Ranura</span>
            </button>
          </div>
        )}

        {/* STEP 1: MODE SELECTION (LISTA COMPLETA VS CATEGORÍA) */}
        {step === 'mode_selection' && (
          <div className="max-w-4xl mx-auto w-full">
            <div className="text-center mb-8">
              <div className="text-xs font-semibold text-sky-700 uppercase tracking-wider mb-1">
                Paso 1 de 3 · Modalidad de Sufragio
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                ¿Cómo desea votar?
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                Puede elegir la lista completa de un partido o seleccionar cargo por cargo
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Option 1: Lista Completa */}
              <button
                onClick={() => handleSelectMode('lista_completa')}
                onMouseEnter={() =>
                  handleItemHover('Opción uno: Votar por Lista Completa. Elige un partido para todos los cargos en un solo toque.')
                }
                className="bg-white border-2 border-slate-200 hover:border-sky-600 rounded-xl p-8 text-left transition-all hover:shadow-md group flex flex-col justify-between min-h-[220px] cursor-pointer"
              >
                <div>
                  <div className="w-12 h-12 rounded-lg bg-sky-50 group-hover:bg-sky-100 text-sky-700 flex items-center justify-center mb-4 transition-colors">
                    <Vote className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mb-2">
                    Votar por Lista Completa
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Elija un partido político y su voto se computará para todos los cargos (Intendente, Concejales y Tribunal de Cuentas) con un solo toque.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-sky-700">
                  <span>Recomendado para votar rápido (menos de 20 seg)</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Option 2: Por Categoría */}
              <button
                onClick={() => handleSelectMode('por_categoria')}
                onMouseEnter={() =>
                  handleItemHover('Opción dos: Votar por Categoría. Permite cortar boleta y elegir distintos partidos para cada cargo.')
                }
                className="bg-white border-2 border-slate-200 hover:border-sky-600 rounded-xl p-8 text-left transition-all hover:shadow-md group flex flex-col justify-between min-h-[220px] cursor-pointer"
              >
                <div>
                  <div className="w-12 h-12 rounded-lg bg-emerald-50 group-hover:bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 transition-colors">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mb-2">
                    Votar por Categoría (Corte de Boleta)
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Elija de manera independiente el Intendente, los Concejales y el Tribunal de Cuentas, pudiendo combinar distintos partidos políticos.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-slate-700 group-hover:text-sky-700">
                  <span>Elegir cargo por cargo</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>

            <div className="mt-8 flex justify-between items-center text-xs text-slate-500">
              <button
                onClick={() => {
                  playSound('undo');
                  setStep('welcome');
                  speak('Operación cancelada. Extrayendo boleta en blanco de la ranura.');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 hover:text-slate-800 cursor-pointer"
              >
                <Undo2 className="w-4 h-4" />
                <span>Cancelar y extraer boleta</span>
              </button>
              <span>Terminal de Voto Municipal BUE v4.2</span>
            </div>
          </div>
        )}

        {/* STEP 2A/B: CANDIDATE SELECTION GRID */}
        {(step === 'category_intendente' ||
          step === 'category_concejales' ||
          step === 'category_tribunal') && (
          <div className="max-w-5xl mx-auto w-full">
            {/* Header with category info & breadcrumb */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
              <div>
                <div className="text-xs font-semibold text-sky-700 uppercase tracking-wider mb-1">
                  {votingMode === 'lista_completa'
                    ? 'Lista Completa · Todas las Categorías'
                    : step === 'category_intendente'
                    ? 'Paso 1 de 3 · Cargo a Elegir'
                    : step === 'category_concejales'
                    ? 'Paso 2 de 3 · Cargo a Elegir'
                    : 'Paso 3 de 3 · Cargo a Elegir'}
                </div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {votingMode === 'lista_completa'
                    ? 'Seleccione su Lista Electoral'
                    : step === 'category_intendente'
                    ? 'Intendente Municipal'
                    : step === 'category_concejales'
                    ? 'Concejales Municipales (Lista de Concejales)'
                    : 'Tribunal de Cuentas Municipal'}
                </h1>
              </div>

              {/* Steps indicator in category mode */}
              {votingMode === 'por_categoria' && (
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className={`px-2.5 py-1 rounded font-medium ${
                      step === 'category_intendente'
                        ? 'bg-sky-700 text-white'
                        : selectedIntendente
                        ? 'bg-sky-100 text-sky-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    1. Intendente
                  </span>
                  <span className="text-slate-400">/</span>
                  <span
                    className={`px-2.5 py-1 rounded font-medium ${
                      step === 'category_concejales'
                        ? 'bg-sky-700 text-white'
                        : selectedConcejales
                        ? 'bg-sky-100 text-sky-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    2. Concejales
                  </span>
                  <span className="text-slate-400">/</span>
                  <span
                    className={`px-2.5 py-1 rounded font-medium ${
                      step === 'category_tribunal'
                        ? 'bg-sky-700 text-white'
                        : selectedTribunal
                        ? 'bg-sky-100 text-sky-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    3. Trib. Cuentas
                  </span>
                </div>
              )}
            </div>

            {/* Candidates Grid (Responsive, big touch buttons >= 90px) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {CANDIDATE_LISTS.map((cand) => {
                const isSelected =
                  votingMode === 'lista_completa'
                    ? selectedIntendente === cand.listNumber
                    : step === 'category_intendente'
                    ? selectedIntendente === cand.listNumber
                    : step === 'category_concejales'
                    ? selectedConcejales === cand.listNumber
                    : selectedTribunal === cand.listNumber;

                return (
                  <button
                    key={cand.id}
                    onClick={() => {
                      if (votingMode === 'lista_completa') {
                        handleChooseFullList(cand.listNumber);
                      } else if (step === 'category_intendente') {
                        handleChooseIntendente(cand.listNumber);
                      } else if (step === 'category_concejales') {
                        handleChooseConcejales(cand.listNumber);
                      } else {
                        handleChooseTribunal(cand.listNumber);
                      }
                    }}
                    onMouseEnter={() =>
                      handleItemHover(
                        `Lista ${cand.listNumber}, ${cand.partyName}, candidato ${cand.mayorCandidate}.`
                      )
                    }
                    className={`relative bg-white border-2 rounded-xl p-4 sm:p-5 text-left transition-all hover:shadow-md cursor-pointer flex gap-4 items-center min-h-[120px] ${
                      isSelected
                        ? 'border-sky-600 ring-2 ring-sky-500/20 bg-sky-50/30'
                        : 'border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    {/* Official Candidate Photo with resilient fallback */}
                    <div className="relative shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                      <img
                        src={cand.photoUrl}
                        alt={`Fotografía oficial de ${cand.mayorCandidate}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>

                    {/* Candidate Details */}
                    <div className="flex-1 min-w-0">
                      {/* Top list number and party */}
                      <div className="flex items-center gap-2 text-xs font-semibold mb-1 text-slate-700">
                        <span
                          className="px-2 py-0.5 rounded text-white font-mono font-bold"
                          style={{ backgroundColor: cand.colorHex }}
                        >
                          LISTA {cand.listNumber}
                        </span>
                        <span className="truncate">{cand.partyName}</span>
                      </div>

                      {/* Main Candidate name */}
                      <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                        {step === 'category_concejales'
                          ? cand.councilorLead
                          : step === 'category_tribunal'
                          ? cand.auditorLead
                          : cand.mayorCandidate}
                      </h2>

                      {/* Secondary leads */}
                      <p className="text-xs text-slate-500 mt-0.5 truncate">
                        {step === 'category_intendente' || votingMode === 'lista_completa'
                          ? cand.councilorLead
                          : cand.sublema}
                      </p>

                      {/* Clean 1-bullet highlight */}
                      <p className="text-xs text-slate-600 mt-2 line-clamp-1 italic">
                        "{cand.proposals[0]}"
                      </p>
                    </div>

                    {/* Radio/Check indicator */}
                    <div className="shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors">
                      {isSelected ? (
                        <div className="w-3 h-3 rounded-full bg-sky-600" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-transparent" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Voto en Blanco Button */}
            <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={() => {
                  if (votingMode === 'lista_completa') {
                    handleChooseFullList('blanco');
                  } else if (step === 'category_intendente') {
                    handleChooseIntendente('blanco');
                  } else if (step === 'category_concejales') {
                    handleChooseConcejales('blanco');
                  } else {
                    handleChooseTribunal('blanco');
                  }
                }}
                onMouseEnter={() =>
                  handleItemHover('Botón para votar en blanco en esta categoría.')
                }
                className="w-full sm:w-auto px-6 py-3.5 bg-white border-2 border-dashed border-slate-300 hover:border-slate-500 rounded-xl text-slate-700 font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <div className="w-4 h-4 rounded border border-slate-400 bg-white" />
                <span>Votar en Blanco en esta categoría</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    playSound('undo');
                    if (step === 'category_concejales') {
                      setStep('category_intendente');
                      speak('Volviendo a la selección de Intendente Municipal.');
                    } else if (step === 'category_tribunal') {
                      setStep('category_concejales');
                      speak('Volviendo a la selección de Concejales Municipales.');
                    } else {
                      setStep('mode_selection');
                      speak('Volviendo a la selección de modalidad de voto.');
                    }
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
                >
                  <Undo2 className="w-4 h-4" />
                  <span>Volver al paso anterior</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: REVIEW & CONFIRMATION (CRITICAL FOR USER CONTROL & FREEDOM) */}
        {step === 'review_confirmation' && (
          <div className="max-w-4xl mx-auto w-full">
            <div className="text-center mb-6">
              <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Paso Final · Verifique su Elección</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Revise su voto antes de imprimir
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm mt-1">
                Si desea cambiar alguna opción, presione el botón <strong>"Modificar"</strong> correspondiente.
              </p>

              {/* Dedicated Audio Assistance button for reviewing ballot aloud */}
              <div className="mt-3 flex justify-center">
                <button
                  onClick={handleReadFullBallotAloud}
                  className="px-4 py-1.5 bg-sky-100 hover:bg-sky-200 text-sky-800 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Escuchar locución completa de los candidatos elegidos"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Escuchar resumen completo de mi voto en audio</span>
                </button>
              </div>
            </div>

            {/* Category breakdown review cards */}
            <div className="space-y-3 mb-6">
              {/* Category 1: Intendente */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 flex items-center justify-between gap-4 shadow-xs">
                <div className="flex items-center gap-4">
                  {selectedIntendente === 'blanco' ? (
                    <div className="w-14 h-14 rounded-lg bg-slate-100 border border-slate-300 flex items-center justify-center text-xs font-bold text-slate-500">
                      BLANCO
                    </div>
                  ) : (
                    <img
                      src={getCandidateByList(selectedIntendente)?.photoUrl}
                      alt="Foto candidato"
                      className="w-14 h-14 rounded-lg object-cover object-top border border-slate-200"
                    />
                  )}
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase">
                      Intendente Municipal
                    </div>
                    <div className="text-base sm:text-lg font-bold text-slate-900">
                      {selectedIntendente === 'blanco'
                        ? 'Voto en Blanco'
                        : getCandidateByList(selectedIntendente)?.mayorCandidate}
                    </div>
                    {selectedIntendente !== 'blanco' && (
                      <div className="text-xs text-slate-600">
                        Lista {selectedIntendente} · {getCandidateByList(selectedIntendente)?.partyName}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    playSound('undo');
                    setVotingMode('por_categoria');
                    setStep('category_intendente');
                    speak('Volviendo a modificar candidato a Intendente Municipal.');
                  }}
                  onMouseEnter={() =>
                    handleItemHover('Botón Modificar Intendente Municipal.')
                  }
                  className="px-3.5 py-1.5 text-xs font-semibold text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
                  title="Cambiar candidato a intendente"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                  <span>Modificar</span>
                </button>
              </div>

              {/* Category 2: Concejales */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 flex items-center justify-between gap-4 shadow-xs">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-lg bg-slate-100 border border-slate-300 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">
                    {selectedConcejales === 'blanco' ? 'BLANCO' : `L-${selectedConcejales}`}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase">
                      Concejales Municipales
                    </div>
                    <div className="text-base sm:text-lg font-bold text-slate-900">
                      {selectedConcejales === 'blanco'
                        ? 'Voto en Blanco'
                        : getCandidateByList(selectedConcejales)?.councilorLead}
                    </div>
                    {selectedConcejales !== 'blanco' && (
                      <div className="text-xs text-slate-600">
                        Lista {selectedConcejales} · {getCandidateByList(selectedConcejales)?.partyName}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    playSound('undo');
                    setVotingMode('por_categoria');
                    setStep('category_concejales');
                    speak('Volviendo a modificar lista de Concejales Municipales.');
                  }}
                  onMouseEnter={() =>
                    handleItemHover('Botón Modificar Concejales Municipales.')
                  }
                  className="px-3.5 py-1.5 text-xs font-semibold text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
                  title="Cambiar lista de concejales"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                  <span>Modificar</span>
                </button>
              </div>

              {/* Category 3: Tribunal de Cuentas */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 flex items-center justify-between gap-4 shadow-xs">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-lg bg-slate-100 border border-slate-300 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">
                    {selectedTribunal === 'blanco' ? 'BLANCO' : `L-${selectedTribunal}`}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase">
                      Tribunal de Cuentas Municipal
                    </div>
                    <div className="text-base sm:text-lg font-bold text-slate-900">
                      {selectedTribunal === 'blanco'
                        ? 'Voto en Blanco'
                        : getCandidateByList(selectedTribunal)?.auditorLead}
                    </div>
                    {selectedTribunal !== 'blanco' && (
                      <div className="text-xs text-slate-600">
                        Lista {selectedTribunal} · {getCandidateByList(selectedTribunal)?.partyName}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    playSound('undo');
                    setVotingMode('por_categoria');
                    setStep('category_tribunal');
                    speak('Volviendo a modificar lista para Tribunal de Cuentas.');
                  }}
                  onMouseEnter={() =>
                    handleItemHover('Botón Modificar Tribunal de Cuentas.')
                  }
                  className="px-3.5 py-1.5 text-xs font-semibold text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
                  title="Cambiar lista de tribunal de cuentas"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                  <span>Modificar</span>
                </button>
              </div>
            </div>

            {/* Bottom action bar */}
            <div className="bg-slate-900 text-white rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={() => {
                  playSound('undo');
                  setSelectedIntendente('');
                  setSelectedConcejales('');
                  setSelectedTribunal('');
                  setStep('mode_selection');
                  speak('Toda la selección ha sido reiniciada. Elija nuevamente su modalidad de voto.');
                }}
                className="w-full sm:w-auto px-5 py-3 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Undo2 className="w-4 h-4" />
                <span>Reiniciar Toda la Selección</span>
              </button>

              <button
                onClick={handleConfirmAndPrint}
                onMouseEnter={() =>
                  handleItemHover('Botón Confirmar e Imprimir Boleta. Presione para imprimir su boleta oficial.')
                }
                className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base rounded-xl transition-colors shadow-md flex items-center justify-center gap-3 cursor-pointer"
              >
                <Printer className="w-5 h-5" />
                <span>Confirmar e Imprimir Boleta</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: PRINTING ANIMATION SIMULATION */}
        {step === 'printing' && (
          <div className="bg-white border border-slate-200 rounded-xl p-10 max-w-lg mx-auto text-center shadow-xs">
            <div className="w-16 h-16 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Printer className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              Imprimiendo Boleta Única Electrónica
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mb-6">
              Grabando su voto en el chip de seguridad interno e imprimiendo el dorso en papel térmico homologado.
            </p>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-sky-600 h-full w-full animate-[shimmer_2s_infinite]" />
            </div>
          </div>
        )}

        {/* STEP 5: VERIFY RFID CHIP WITH SCREEN SENSOR */}
        {step === 'verify_rfid' && (
          <div className="max-w-2xl mx-auto w-full bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-3">
                <QrCode className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">
                Comprobación de Seguridad del Votante
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                La Boleta Única Electrónica ya ha salido de la ranura. Acerque el chip al verificador de la pantalla para constatar que coincide exactamente con lo impreso.
              </p>
            </div>

            {/* Printed Ballot Replica Preview */}
            <div className="border-2 border-slate-800 rounded-lg p-5 bg-white font-mono text-xs mb-6 shadow-inner relative">
              <div className="flex justify-between items-center border-b border-slate-300 pb-2 mb-3">
                <span className="font-bold">BOLETA ÚNICA ELECTRÓNICA</span>
                <span>MESA 0412</span>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-slate-600">INTENDENTE:</span>
                  <span className="font-bold text-slate-900">
                    {selectedIntendente === 'blanco'
                      ? 'VOTO EN BLANCO'
                      : `L-${selectedIntendente} · ${getCandidateByList(selectedIntendente)?.mayorCandidate}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">CONCEJALES:</span>
                  <span className="font-bold text-slate-900">
                    {selectedConcejales === 'blanco'
                      ? 'VOTO EN BLANCO'
                      : `L-${selectedConcejales} · ${getCandidateByList(selectedConcejales)?.councilorLead}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">TRIB. CUENTAS:</span>
                  <span className="font-bold text-slate-900">
                    {selectedTribunal === 'blanco'
                      ? 'VOTO EN BLANCO'
                      : `L-${selectedTribunal} · ${getCandidateByList(selectedTribunal)?.auditorLead}`}
                  </span>
                </div>
              </div>
              <div className="pt-2 border-t border-dashed border-slate-300 flex items-center justify-between text-[11px] text-slate-500">
                <span>CHIP RFID #BUE-412-8902</span>
                <span>TROQUEL N° 00412-44</span>
              </div>
            </div>

            {/* RFID Scanner Button */}
            {!rfidVerified ? (
              <div className="text-center">
                <button
                  onClick={handleVerifyScan}
                  disabled={isVerifyingRfid}
                  className="w-full py-4 bg-sky-700 hover:bg-sky-800 disabled:bg-slate-300 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-3 shadow-sm text-sm cursor-pointer"
                >
                  <QrCode className="w-5 h-5" />
                  <span>
                    {isVerifyingRfid
                      ? 'Leyendo chip de seguridad...'
                      : 'Acercar Boleta al Lector RFID de la Pantalla'}
                  </span>
                </button>
                <button
                  onClick={handleFinishAndReset}
                  className="mt-3 text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
                >
                  Omitir verificación y depositar directamente en urna
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-emerald-900 text-xs flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-sm block mb-0.5">
                      ¡Verificación Exitosa de Integridad!
                    </span>
                    <span>
                      Los datos registrados en el chip RFID corresponden exactamente a los impresos en el papel. El secreto de su voto queda resguardado.
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleFinishAndReset}
                  className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-3 text-sm shadow-md cursor-pointer"
                >
                  <FileCheck className="w-5 h-5" />
                  <span>Doble la Boleta y Deposítela en la Urna</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 6: SUFRAGIO COMPLETADO */}
        {step === 'completed' && (
          <div className="bg-white border border-slate-200 rounded-xl p-8 sm:p-12 text-center max-w-lg mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              ¡Sufragio Completado!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
              Doble su boleta por la línea de puntos antes de salir de la cabina. Muestre el troquel al presidente de mesa para que verifique el número, córtelo y deposite la boleta en la urna. No olvide firmar el padrón y retirar su constancia de votación.
            </p>
            <div className="text-xs text-slate-400">
              Reiniciando cabina automáticamente para el próximo elector...
            </div>
          </div>
        )}
      </main>

      {/* Help Modal (Principle 10: Help and documentation) */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-sky-700" />
                <h3 className="font-bold text-slate-900 text-base">
                  Instructivo Oficial para el Elector
                </h3>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-semibold cursor-pointer"
              >
                ✕ Cerrar
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-700 leading-relaxed max-h-[70vh] overflow-y-auto pr-1">
              <div>
                <h4 className="font-bold text-slate-900 mb-1">
                  1. ¿Qué es la Boleta Única Electrónica (BUE)?
                </h4>
                <p>
                  Es un sistema donde el voto se imprime en una boleta de papel que además posee un chip RFID. La máquina no almacena ningún dato del votante ni del resultado: sólo actúa como una impresora y lectora. Su voto se cuenta al abrir la urna y contar las boletas de papel y sus chips.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">
                  2. ¿Puedo cambiar mi voto si me equivoqué?
                </h4>
                <p>
                  <strong>SÍ, en cualquier momento antes de imprimir.</strong> En la pantalla de revisión puede presionar el botón "Modificar" tantas veces como desee. Si la boleta ya fue impresa y tiene un error, debe comunicárselo al presidente de mesa para anularla y recibir una nueva boleta en blanco.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">
                  3. ¿Cómo se garantiza el secreto del voto?
                </h4>
                <p>
                  El sistema no guarda registro de quién emite cada voto. Al retirar la boleta impresa, el chip está oculto y nadie puede ver lo que eligió hasta el escrutinio oficial.
                </p>
              </div>

              <div className="bg-sky-50 p-3 rounded-lg border border-sky-100 text-sky-900">
                <span className="font-semibold block mb-0.5">Normativa aplicable:</span>
                Ley 19.945 Código Electoral Nacional y Ley 26.653 de Accesibilidad Web.
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-200 text-right">
              <button
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white font-semibold text-xs rounded-lg cursor-pointer"
              >
                Entendido, volver a la votación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
