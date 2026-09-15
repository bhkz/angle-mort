import type { Colis, ContratMission, Droit, Equipement, EtatEquipement, Graphe, LocalisationColis, Ordre, Reception, Robot } from '../sim/types';

export type Connaissance<T> =
  | Readonly<{ etat: 'inconnu' }>
  | Readonly<{ etat: 'maintenant' | 'datee'; valeur: T; source: string; impulsion: number }>;

export interface RobotConnu {
  readonly id: string;
  readonly position: Connaissance<string>;
  readonly energie: Connaissance<Robot['energie']>;
  readonly activite: Connaissance<Robot['activite']>;
  readonly capaciteColis: 2;
  readonly canal: string;
}
export interface ColisConnu {
  readonly id: string;
  readonly nature: Colis['nature'];
  readonly destination: string;
  readonly disponibleDepuis: number;
  readonly localisation: Connaissance<LocalisationColis>;
}
export interface EquipementConnu {
  readonly id: string;
  readonly nature: Equipement['nature'];
  readonly etat: Connaissance<EtatEquipement>;
}
export type Annonce = Readonly<{ id: string; impulsion: number; source: string }> & (
  | Readonly<{ type: 'equipement'; equipement: string; etat: EtatEquipement }>
  | Readonly<{ type: 'revoquerDroit'; droit: string }>
);
/** Only received facts and public, announced rules. Never an author snapshot. */
export interface CroyancesPlanificateur {
  readonly impulsion: number;
  readonly graphe: Graphe;
  readonly robots: readonly RobotConnu[];
  readonly colis: readonly ColisConnu[];
  readonly equipements: readonly EquipementConnu[];
  readonly cloturesConnues: readonly string[];
  readonly annonces: readonly Annonce[];
}
export interface RequetePlanification {
  readonly croyances: CroyancesPlanificateur;
  readonly mission: ContratMission;
  readonly ancetres: readonly ContratMission[];
  readonly droitsDisponibles: readonly Droit[];
  readonly horizon: number;
  readonly budget: Readonly<{ maxEtats: number; maxTransitions: number }>;
  readonly politique: Readonly<{
    inconnue: 'bloquer' | 'supposerPassable';
    datee: 'bloquer' | 'utiliserDerniere';
  }>;
  /** Free initial depot loading only at t0, before the simulation is constructed. */
  readonly chargementInitial: boolean;
}
export interface EtapePlan { readonly impulsion: number; readonly ordres: readonly Ordre[] }
export interface Plan {
  readonly chargementInitial: readonly Readonly<{ robot: string; colis: readonly string[] }>[];
  readonly etapes: readonly EtapePlan[];
  readonly J: number;
  readonly deplacements: number;
  readonly cloturesPrevues: readonly string[];
  readonly receptionsPrevues: readonly Reception[];
  readonly hypotheses: readonly string[];
}
export type CodeRefus = 'accesAbsent' | 'echeanceImpossible' | 'conflitMateriel';
export interface RaisonRefus {
  readonly code: CodeRefus;
  readonly message: string;
}
export interface Recherche {
  readonly exhaustive: boolean;
  readonly etatsExplores: number;
  readonly transitionsExaminees: number;
  readonly arret: 'terminee' | 'budgetEpuise' | 'informationInsuffisante' | 'modeleNonPrisEnCharge';
}
export type ResultatPlanification =
  | Readonly<{ statut: 'plan'; plan: Plan; garantie: 'optimalSelonCroyances' | 'meilleurTrouve'; recherche: Recherche }>
  | Readonly<{ statut: 'refuse'; raisons: readonly RaisonRefus[]; recherche: Recherche }>
  | Readonly<{ statut: 'incomplet'; message: string; recherche: Recherche }>;
