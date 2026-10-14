import React from 'react';
import { Eye, HelpCircle } from 'lucide-react';
import { playSound } from '../../utils/audioService';

interface RoleAccessibilityBarProps {
  roleTitle: string;
  roleSubtitle?: string;
  highContrast: boolean;
  onToggleContrast: () => void;
  fontSize: 'normal' | 'large' | 'xlarge';
  onChangeFontSize: (size: 'normal' | 'large' | 'xlarge') => void;
  onShowHelp: () => void;
  helpButtonLabel?: string;
}

export const RoleAccessibilityBar: React.FC<RoleAccessibilityBarProps> = ({
  roleTitle,
  roleSubtitle,
  highContrast,
  onToggleContrast,
  fontSize,
  onChangeFontSize,
  onShowHelp,
  helpButtonLabel = 'Instructivo',
}) => {
  return (
    <div className="bg-slate-900 text-white border-b border-slate-800 select-none accessibility-bar transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left Side: Role Identity & Subtitle (Without legislative citation) */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-sky-400">{roleTitle}</span>
          {roleSubtitle && (
            <>
              <span className="text-slate-500">·</span>
              <span className="text-slate-300">{roleSubtitle}</span>
            </>
          )}
        </div>

        {/* Right Side: Contrast, Font Size and Role Instructivo */}
        <div className="flex flex-wrap items-center gap-2">
          {/* High Contrast Toggle Button */}
          <button
            onClick={() => {
              playSound('click');
              onToggleContrast();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer ${
              highContrast
                ? 'bg-amber-400 text-black ring-2 ring-white hover:bg-amber-300'
                : 'bg-slate-800 text-slate-100 hover:bg-slate-700 hover:text-white border border-slate-700'
            }`}
            title="Alternar modo de alto contraste para baja visión (fondo negro puro y texto amarillo/blanco)"
            aria-pressed={highContrast}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{highContrast ? 'Alto Contraste: ACTIVADO' : 'Alto Contraste'}</span>
          </button>

          {/* Font Size Selector (A / A+ / A++) */}
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

          {/* Role Instructivo Modal Trigger */}
          <button
            onClick={() => {
              playSound('click');
              onShowHelp();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700 transition-colors cursor-pointer text-xs font-medium"
            title={`Abrir ${helpButtonLabel}`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
            <span>{helpButtonLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
