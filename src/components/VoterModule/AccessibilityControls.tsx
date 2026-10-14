import React from 'react';
import {
  Eye,
  Volume2,
  VolumeX,
  RotateCcw,
  Square,
  Play,
  HelpCircle,
  Radio,
  Gauge,
} from 'lucide-react';
import { playSound } from '../../utils/audioService';

interface AccessibilityControlsProps {
  highContrast: boolean;
  onToggleContrast: () => void;
  fontSize: 'normal' | 'large' | 'xlarge';
  onChangeFontSize: (size: 'normal' | 'large' | 'xlarge') => void;
  audioAssistance: boolean;
  onToggleAudio: () => void;
  isSpeaking: boolean;
  currentSpeechText: string;
  speechRate: number;
  onChangeSpeechRate: (rate: number) => void;
  onRepeatSpeech: () => void;
  onStopSpeech: () => void;
  onShowHelp: () => void;
}

export const AccessibilityControls: React.FC<AccessibilityControlsProps> = ({
  highContrast,
  onToggleContrast,
  fontSize,
  onChangeFontSize,
  audioAssistance,
  onToggleAudio,
  isSpeaking,
  currentSpeechText,
  speechRate,
  onChangeSpeechRate,
  onRepeatSpeech,
  onStopSpeech,
  onShowHelp,
}) => {
  return (
    <div className="bg-slate-900 text-white border-b border-slate-800 transition-all select-none accessibility-bar">
      {/* Primary Accessibility Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Legislative Badge */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-sky-400">Accesibilidad Electoral</span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-400">Ley Nacional 26.653</span>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 1. High Contrast Button */}
          <button
            onClick={() => {
              playSound('click');
              onToggleContrast();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all shadow-xs cursor-pointer ${
              highContrast
                ? 'bg-amber-400 text-black ring-2 ring-white hover:bg-amber-300'
                : 'bg-slate-800 text-slate-100 hover:bg-slate-700 hover:text-white border border-slate-700'
            }`}
            title="Alternar modo de alto contraste para baja visión (fondo negro puro y texto amarillo/blanco)"
            aria-pressed={highContrast}
          >
            <Eye className="w-4 h-4" />
            <span>{highContrast ? 'Alto Contraste: ACTIVADO' : 'Alto Contraste'}</span>
          </button>

          {/* 2. Font Size Scaling (Normal / A+ / A++) */}
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
            <span className="px-2 text-[11px] text-slate-400 font-medium">Tamaño:</span>
            <button
              onClick={() => {
                playSound('click');
                onChangeFontSize('normal');
              }}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                fontSize === 'normal'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
              title="Tamaño de texto estándar (100%)"
              aria-label="Tamaño de texto estándar (100%)"
            >
              A
            </button>
            <button
              onClick={() => {
                playSound('click');
                onChangeFontSize('large');
              }}
              className={`px-2.5 py-1 rounded-md text-sm font-bold transition-colors cursor-pointer ${
                fontSize === 'large'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
              title="Tamaño de texto grande (+25%)"
              aria-label="Tamaño de texto grande (+25%)"
            >
              A+
            </button>
            <button
              onClick={() => {
                playSound('click');
                onChangeFontSize('xlarge');
              }}
              className={`px-2.5 py-1 rounded-md text-base font-extrabold transition-colors cursor-pointer ${
                fontSize === 'xlarge'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
              title="Tamaño de texto extra grande (+50%)"
              aria-label="Tamaño de texto extra grande (+50%)"
            >
              A++
            </button>
          </div>

          {/* 3. Audio Voice Assistance Toggle */}
          <button
            onClick={() => {
              playSound('click');
              onToggleAudio();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all shadow-xs cursor-pointer ${
              audioAssistance
                ? 'bg-emerald-600 text-white ring-2 ring-emerald-300 hover:bg-emerald-500'
                : 'bg-slate-800 text-slate-100 hover:bg-slate-700 hover:text-white border border-slate-700'
            }`}
            title="Activar/desactivar locución de voz y asistencia sonora para no videntes o visión reducida"
            aria-pressed={audioAssistance}
          >
            {audioAssistance ? (
              <Volume2 className="w-4 h-4 animate-pulse" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
            <span>{audioAssistance ? 'Voz Asistida: ACTIVA' : 'Asistencia Sonora'}</span>
          </button>

          {/* 4. Help / Instructivo */}
          <button
            onClick={() => {
              playSound('click');
              onShowHelp();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700 transition-colors cursor-pointer"
            title="Abrir instructivo de votación paso a paso"
          >
            <HelpCircle className="w-4 h-4 text-sky-400" />
            <span>Instructivo</span>
          </button>
        </div>
      </div>

      {/* Expanded Audio Assistance Dashboard when Active */}
      {audioAssistance && (
        <div className="bg-slate-950 border-t border-slate-800 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3">
          {/* Active Audio Wave and Current Text */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="flex items-center gap-1 text-emerald-400 shrink-0">
              {isSpeaking ? (
                <div className="flex items-end gap-0.5 h-4">
                  <span className="w-1 bg-emerald-400 h-2 animate-bounce" />
                  <span className="w-1 bg-emerald-400 h-4 animate-bounce [animation-delay:0.15s]" />
                  <span className="w-1 bg-emerald-400 h-3 animate-bounce [animation-delay:0.3s]" />
                  <span className="w-1 bg-emerald-400 h-1 animate-bounce [animation-delay:0.45s]" />
                </div>
              ) : (
                <Radio className="w-4 h-4 text-slate-500" />
              )}
              <span className="font-semibold text-[11px] uppercase tracking-wider">
                {isSpeaking ? 'Hablando ahora:' : 'En espera:'}
              </span>
            </div>

            <p className="text-slate-300 italic truncate text-[11px]" title={currentSpeechText}>
              "{currentSpeechText || 'Haga clic o sitúe el cursor sobre cualquier elemento para escucharlo.'}"
            </p>
          </div>

          {/* Audio Controls (Repeat, Stop, Speed Rate) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Speed Rate Control */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-[11px]">
              <Gauge className="w-3 h-3 text-slate-400" />
              <button
                onClick={() => onChangeSpeechRate(0.8)}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  speechRate === 0.8 ? 'bg-sky-700 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="Velocidad pausada (0.8x)"
              >
                0.8x
              </button>
              <button
                onClick={() => onChangeSpeechRate(1.0)}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  speechRate === 1.0 ? 'bg-sky-700 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="Velocidad normal (1.0x)"
              >
                1.0x
              </button>
              <button
                onClick={() => onChangeSpeechRate(1.2)}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  speechRate === 1.2 ? 'bg-sky-700 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="Velocidad rápida (1.2x)"
              >
                1.2x
              </button>
            </div>

            {/* Repeat Audio Button */}
            <button
              onClick={onRepeatSpeech}
              className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-medium transition-colors"
              title="Repetir la locución actual"
            >
              <RotateCcw className="w-3 h-3 text-sky-400" />
              <span>Repetir</span>
            </button>

            {/* Stop Audio Button */}
            {isSpeaking && (
              <button
                onClick={onStopSpeech}
                className="flex items-center gap-1 px-2.5 py-1 bg-rose-900/60 hover:bg-rose-900 text-rose-200 rounded text-[11px] font-medium transition-colors"
                title="Detener voz actual"
              >
                <Square className="w-3 h-3 text-rose-400 fill-current" />
                <span>Detener</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
