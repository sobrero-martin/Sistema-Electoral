export type UserRole = 'votante' | 'autoridad' | 'candidato' | 'tribunal';

export type ElectoralCategory = 'intendente' | 'concejales' | 'tribunal_cuentas';

export interface CandidateList {
  id: string;
  listNumber: string;
  partyName: string;
  sublema?: string;
  colorHex: string;
  badgeBg: string;
  mayorCandidate: string;
  mayorTitle: string;
  councilorLead: string;
  auditorLead: string;
  photoUrl: string;
  proposals: string[];
}

export interface VoteSelection {
  mode: 'lista_completa' | 'por_categoria';
  intendente: string; // party list number or 'blanco'
  concejales: string; // party list number or 'blanco'
  tribunal_cuentas: string; // party list number or 'blanco'
  timestamp?: string;
  qrToken?: string;
  hash?: string;
}

export interface VoterRecord {
  id: string;
  dni: string;
  lastName: string;
  firstName: string;
  orderNumber: number;
  exemplar: 'A' | 'B' | 'C' | 'D';
  address: string;
  status: 'pendiente' | 'voto_emitido' | 'observado';
  votedAt?: string;
  stubCode?: string;
}

export interface MesaState {
  mesaNumber: number;
  school: string;
  circuit: string;
  seccion: string;
  electoresHabilitados: number;
  estado: 'cerrada' | 'abierta' | 'en_escrutinio' | 'transmitida';
  aperturaTimestamp: string | null;
  cierreTimestamp: string | null;
  totalVotantesEfectivos: number;
  escrutinio: {
    intendente: Record<string, number>;
    concejales: Record<string, number>;
    tribunal_cuentas: Record<string, number>;
    blancos: number;
    nulos: number;
    recurridos: number;
    impugnados: number;
  };
  hashCertificado: string | null;
  telegramaId: string | null;
}

export interface HeuristicRule {
  number: number;
  name: string;
  principleDescription: string;
  complianceSummary: string;
  profileAnalysis: {
    votantes: string;
    candidatos: string;
    trabajadores: string;
    tribunal: string;
  };
  argentineLaw: string;
  interfaceFigures: {
    figId: string;
    title: string;
    description: string;
    moduleKey: UserRole;
  }[];
}
