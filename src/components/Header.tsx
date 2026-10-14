import React from 'react';
import { UserRole } from '../types/election';
import { RotateCcw } from 'lucide-react';
import { playSound } from '../utils/audioService';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onResetSimulation: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  onResetSimulation,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-4 sm:px-6 py-3 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark (Single text element wordmark in Plus Jakarta Sans) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-sky-700 text-white flex items-center justify-center font-bold text-sm tracking-tighter">
            AR
          </div>
          <span className="text-sm sm:text-base font-bold tracking-tight text-slate-900 whitespace-nowrap">
            Elecciones Municipales <span className="font-normal text-slate-500 hidden md:inline">· Voto BUE & Escrutinio</span>
          </span>
        </div>

        {/* Zone 2: Navigation Links (Single-line, clear, role-based tabs) */}
        <nav className="hidden lg:flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-600">
          <button
            onClick={() => {
              playSound('click');
              onRoleChange('votante');
            }}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentRole === 'votante'
                ? 'bg-white text-sky-800 shadow-xs font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            1. Cabina Votante
          </button>
          <button
            onClick={() => {
              playSound('click');
              onRoleChange('autoridad');
            }}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentRole === 'autoridad'
                ? 'bg-white text-sky-800 shadow-xs font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            2. Autoridad de Mesa
          </button>
          <button
            onClick={() => {
              playSound('click');
              onRoleChange('candidato');
            }}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentRole === 'candidato'
                ? 'bg-white text-sky-800 shadow-xs font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            3. Candidatos & Fiscales
          </button>
          <button
            onClick={() => {
              playSound('click');
              onRoleChange('tribunal');
            }}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentRole === 'tribunal'
                ? 'bg-white text-sky-800 shadow-xs font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            4. Tribunal Electoral
          </button>
        </nav>

        {/* Zone 3: Reset Action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              playSound('undo');
              onResetSimulation();
            }}
            title="Reiniciar todos los estados de la simulación electoral"
            className="flex px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reiniciar Datos</span>
          </button>
        </div>
      </div>

      {/* Mobile navigation row */}
      <div className="lg:hidden flex items-center gap-1 mt-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        <button
          onClick={() => {
            playSound('click');
            onRoleChange('votante');
          }}
          className={`px-3 py-1 rounded-md shrink-0 cursor-pointer ${
            currentRole === 'votante' ? 'bg-sky-700 text-white font-medium' : 'bg-slate-100 text-slate-700'
          }`}
        >
          1. Votante
        </button>
        <button
          onClick={() => {
            playSound('click');
            onRoleChange('autoridad');
          }}
          className={`px-3 py-1 rounded-md shrink-0 cursor-pointer ${
            currentRole === 'autoridad' ? 'bg-sky-700 text-white font-medium' : 'bg-slate-100 text-slate-700'
          }`}
        >
          2. Mesa
        </button>
        <button
          onClick={() => {
            playSound('click');
            onRoleChange('candidato');
          }}
          className={`px-3 py-1 rounded-md shrink-0 cursor-pointer ${
            currentRole === 'candidato' ? 'bg-sky-700 text-white font-medium' : 'bg-slate-100 text-slate-700'
          }`}
        >
          3. Fiscales
        </button>
        <button
          onClick={() => {
            playSound('click');
            onRoleChange('tribunal');
          }}
          className={`px-3 py-1 rounded-md shrink-0 cursor-pointer ${
            currentRole === 'tribunal' ? 'bg-sky-700 text-white font-medium' : 'bg-slate-100 text-slate-700'
          }`}
        >
          4. Tribunal
        </button>
      </div>
    </header>
  );
};
