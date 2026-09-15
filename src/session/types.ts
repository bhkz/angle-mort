import type { Colis, ContratMission, Droit, Equipement, Graphe, VueJoueur } from '../sim/types';
import type { Annonce, ResultatPlanification } from '../planner/types';

export type Situation = 'atelier' | 'dernierPassage';
export interface CartesMission {
  readonly mesure: 'receptionDestination' | 'transfertOuReception';
  readonly priorite: 'toutes' | 'medical';
  readonly limite: 'quai' | 'critique' | 'expiration';
}
export type Intention = Readonly<{ robot: string; action: 'livrer' | 'tournee' | 'deplacer' | 'observer'; destination: string; cartes: CartesMission }>;
export const cartesInitiales: CartesMission = { mesure: 'receptionDestination', priorite: 'toutes', limite: 'quai' };
export interface CatalogueSession {
  readonly situation: Situation;
  readonly debut: number;
  readonly fin: number;
  readonly graphe: Graphe;
  readonly colis: readonly Omit<Colis, 'localisation' | 'besoin'>[];
  readonly robots: readonly Readonly<{ id: string; canal: string; capaciteColis: 2 }>[];
  readonly equipements: readonly Readonly<{ id: string; nature: Equipement['nature'] }>[];
  readonly droits: readonly Droit[];
  readonly missions: readonly ContratMission[];
  readonly annonces: readonly Annonce[];
  readonly critique: Readonly<{ colis: string; avantOuA: number; label: string }>;
}
export interface MissionSession {
  readonly intention: Intention;
  readonly statut: 'preparee' | 'active' | 'suspendue' | 'terminee' | 'refusee';
  readonly resultat?: ResultatPlanification;
  readonly motif?: string;
  readonly colis?: readonly string[];
  readonly echeance?: number;
}
export interface SessionFrame {
  readonly view: VueJoueur;
  readonly catalogue: CatalogueSession;
  readonly missions: readonly MissionSession[];
  readonly preparation: boolean;
  readonly niveau: 1 | 2 | 3;
  readonly fin: boolean;
}
