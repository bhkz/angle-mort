export type Impulsion = number;
export type Id = string;
export type Position3D = Readonly<{ x: number; y: number; z: number }>;
export interface Sommet {
  readonly id: Id;
  readonly position: Position3D;
  readonly niveau: string;
  readonly roles: readonly ('depot' | 'transfert' | 'reception' | 'passage' | 'observation' | 'casier')[];
  readonly capaciteRobots: 1;
}
export interface Arete {
  readonly id: Id;
  readonly extremites: readonly [Id, Id];
  readonly bidirectionnelle: true;
  readonly duree: 1;
  readonly controlePar: readonly Id[];
  readonly coutEnergie: number;
}
export interface Graphe {
  readonly sommets: readonly Sommet[];
  readonly aretes: readonly Arete[];
}
export type Cible = Readonly<{ type: 'sommet' | 'arete' | 'robot' | 'colis' | 'equipement' | 'service'; id: Id }>;
export type LocalisationColis =
  | Readonly<{ type: 'auSol'; sommet: Id }>
  | Readonly<{ type: 'porte'; robot: Id }>
  | Readonly<{ type: 'recu'; sommet: Id; impulsion: Impulsion }>;
export interface Colis {
  readonly id: Id;
  readonly nature: 'commercial' | 'medical' | 'batterie' | 'fourniture';
  readonly destination: Id;
  readonly disponibleDepuis: Impulsion;
  readonly localisation: LocalisationColis;
  readonly besoin: Id | null;
}
export interface Robot {
  readonly id: Id;
  readonly sommet: Id;
  readonly capaciteColis: 2;
  readonly activite: 'disponible' | 'transport' | 'observationFixe';
  readonly energie: Readonly<{ type: 'nonModelisee' }> | Readonly<{ type: 'limitee'; restante: number }>;
  readonly sourceLocale: Id;
  readonly mission: Id | null;
  readonly canal: string;
}
type EquipementBase = Readonly<{ id: Id; cible: Cible }>;
export type Equipement = EquipementBase & (
  | Readonly<{ nature: 'porte'; etat: 'ouverte' | 'bloquee' }>
  | Readonly<{ nature: 'passerelle'; etat: 'abaissee' | 'relevee' }>
  | Readonly<{ nature: 'pompe'; etat: 'operationnelle' | 'arretee' | 'reparationExterieureRequise' }>
  | Readonly<{ nature: 'camera'; etat: 'disponible' | 'maintenance' }>
  | Readonly<{ nature: 'alimentation' | 'lecteurTransfert'; etat: 'disponible' | 'indisponible' }>
);
export type EtatEquipement = Equipement['etat'];
export interface ConditionEquipement {
  readonly equipement: Id;
  readonly etat: EtatEquipement;
}
export interface Service {
  readonly id: Id;
  readonly nature: 'pompage' | 'traversee' | 'fournitures';
  readonly dependances: readonly ConditionEquipement[];
}
export interface Fenetre { readonly debutExclu: Impulsion; readonly finIncluse: Impulsion }
export type ConditionBesoin =
  | Readonly<{ type: 'reception'; colis: Id; destination: Id }>
  | Readonly<{ type: 'traversee'; evenement: Id; horaire: Impulsion }>
  | Readonly<{ type: 'operationnel'; controle: Impulsion }>
  | Readonly<{ type: 'chargeInitiale'; controle: Impulsion; equipement: Id; etatRequis: EtatEquipement }>;
export interface Besoin {
  readonly id: Id;
  readonly service: Id;
  readonly phase: 1 | 2 | 3 | 4;
  readonly fenetre: Fenetre;
  readonly condition: ConditionBesoin;
  readonly points: 100;
  readonly operationnelALaCloture: boolean;
  readonly revelation: Impulsion;
}
export type ResultatBesoin =
  | Readonly<{ etat: 'enAttente' }>
  | Readonly<{ etat: 'satisfait'; impulsion: Impulsion; preuve: Id }>
  | Readonly<{ etat: 'expire' }>;
export interface IntervalleValidite { readonly debutInclus: Impulsion; readonly finIncluse: Impulsion }
export type ActionAutorisee = 'traverser' | 'charger' | 'reprendreTransfert' | 'deposerTransfert' | 'livrer' | 'observer';
export interface Droit {
  readonly id: Id;
  readonly beneficiaire: Readonly<{ type: 'robot' | 'mission'; id: Id }>;
  readonly action: ActionAutorisee;
  readonly cibles: readonly Cible[];
  readonly validite: IntervalleValidite;
  readonly canal: string;
}
export interface ContratMission {
  readonly id: Id;
  readonly parent: Id | null;
  readonly objectif: Readonly<{
    mesure: 'receptionDestination' | 'transfertOuReception' | 'disponibiliteEquipement';
    priorites: Readonly<Record<string, number>>;
    receptionsExigees: readonly Readonly<{ colis: Id; avantOuA: Impulsion }>[];
  }>;
  readonly zone: readonly Id[];
  readonly duree: IntervalleValidite;
  readonly acces: readonly Id[];
  readonly ressources: Readonly<{ robots: readonly Id[]; colis: readonly Id[]; equipements: readonly Id[] }>;
}
export type ProprieteObservee =
  | Readonly<{ type: 'equipement'; id: Id; champ: 'etat' }>
  | Readonly<{ type: 'robot'; id: Id; champ: 'sommet' | 'chargement' | 'energie' | 'activite' }>
  | Readonly<{ type: 'son'; id: Id; champ: 'emission' }>
  | Readonly<{ type: 'colis'; id: Id; champ: 'localisation' }>
  | Readonly<{ type: 'service'; id: Id; champ: 'operationnel' }>
  | Readonly<{ type: 'consequences'; champ: 'stock' | 'atelier' }>;
export type SonPerçu = Readonly<{ type: 'son'; son: string; position: Position3D }>;
export type ValeurObservee = string | boolean | readonly string[] | LocalisationColis | Robot['energie'] | SonPerçu | null;
export interface VolumeObservation {
  readonly portee: number;
  readonly offset: Position3D;
  readonly direction: Position3D;
  readonly angleDeg: number;
}
export interface ObstacleObservation {
  readonly id: Id;
  readonly min: Position3D;
  readonly max: Position3D;
  readonly actifSi: readonly ConditionEquipement[];
  readonly cible?: Cible;
}
export interface EmissionSonore {
  readonly id: Id;
  readonly origine: Cible;
  readonly son: string;
  readonly conditions: readonly ConditionEquipement[];
}
export interface SourceObservation {
  readonly id: Id;
  readonly nature?: 'telemetrie' | 'cameraFixe' | 'robotEnPoste' | 'capteurFranchissement' | 'microphone';
  readonly support: Readonly<{ type: 'robot'; id: Id }> | Readonly<{ type: 'fixe'; sommet: Id }>;
  readonly equipementsRequis: readonly ConditionEquipement[];
  readonly couverture: readonly Readonly<{
    propriete: ProprieteObservee;
    depuis: readonly Id[];
    posteFixe: boolean;
    perception?: Readonly<{ type: 'vision' | 'audio'; volume: VolumeObservation; ancrage?: Position3D }>;
  }>[];
  readonly capteurFranchissement?: Readonly<{ aretes: readonly Id[]; identifieRobot: boolean }>;
  readonly destinataires: readonly ('joueur' | 'eva')[];
  readonly origineCommune: Id | null;
  readonly transmetRefus: boolean;
}
export interface FaitObserve {
  readonly propriete: ProprieteObservee;
  readonly valeur: ValeurObservee;
  readonly source: Id;
  readonly capture: Readonly<{ impulsion: Impulsion; etape: 'observations' }>;
  readonly reception: Impulsion;
}
export type Observation =
  | Readonly<{ etat: 'inconnu'; propriete: ProprieteObservee; source: Id; age: null }>
  | Readonly<{ etat: 'maintenant' | 'datee'; fait: FaitObserve; age: number }>;
export interface OperationLocale { readonly type: 'charger' | 'deposer' | 'livrer'; readonly colis: Id }
export interface Ordre {
  readonly robot: Id;
  readonly canal: string;
  readonly destination?: Id;
  readonly activite?: Robot['activite'];
  readonly operations?: readonly OperationLocale[];
  readonly mission?: Id;
}
export type EvenementProgramme = Readonly<{ id: Id; impulsion: Impulsion }> & (
  | Readonly<{ type: 'equipement'; equipement: Id; etat: EtatEquipement }>
  | Readonly<{ type: 'traversee'; service: Id; conditions: readonly ConditionEquipement[] }>
  | Readonly<{ type: 'revoquerDroit'; droit: Id }>
);
export interface DernierPassage {
  readonly batterie: Id;
  readonly pompe: Id;
  readonly seuilStock: Impulsion;
  readonly seuilPompe: Impulsion;
}
export interface Scenario {
  readonly id: string;
  readonly version: string;
  readonly debut: Impulsion;
  readonly fin: Impulsion;
  readonly graphe: Graphe;
  readonly robots: readonly Robot[];
  readonly colis: readonly Colis[];
  readonly equipements: readonly Equipement[];
  readonly services: readonly Service[];
  readonly besoins: readonly Besoin[];
  readonly droits: readonly Droit[];
  readonly missions: readonly ContratMission[];
  readonly sources: readonly SourceObservation[];
  readonly obstaclesObservation?: readonly ObstacleObservation[];
  readonly emissionsSonores?: readonly EmissionSonore[];
  readonly evenements: readonly EvenementProgramme[];
  readonly observationsInitiales: readonly FaitObserve[];
  readonly besoinsImportes: readonly Readonly<{ besoin: Id; impulsion: Impulsion; preuve: string }>[];
  readonly dernierPassage?: DernierPassage;
  readonly variantes?: readonly Readonly<{ id: Id; equipement: Id; etats: readonly EtatEquipement[] }>[];
}
export interface Reception { readonly colis: Id; readonly sommet: Id; readonly impulsion: Impulsion }
export interface Franchissement {
  readonly robot: Id;
  readonly arete: Id;
  readonly depuis: Id;
  readonly vers: Id;
  readonly impulsion: Impulsion;
}
export type FranchissementObserve = Omit<Franchissement, 'robot'> & Readonly<{ robot: Id | null; source: Id }>;
export interface Refus {
  readonly impulsion: Impulsion;
  readonly robot: Id;
  readonly source: Id;
  readonly canal: string;
  readonly action: string;
  readonly motif: 'passage' | 'occupation' | 'droit' | 'energie' | 'manutention' | 'activite';
}
export interface ConstatLocal {
  readonly impulsion: Impulsion;
  readonly robot: Id;
  readonly source: Id;
  readonly action: string;
  readonly resultat: 'refuse';
}
export interface EtatReel {
  readonly impulsion: Impulsion;
  readonly scenario: string;
  readonly version: string;
  readonly graine: number;
  readonly rng: Readonly<{ algorithme: 'mulberry32-v1'; etat: number }>;
  readonly robots: Readonly<Record<Id, Robot>>;
  readonly colis: Readonly<Record<Id, Colis>>;
  readonly equipements: Readonly<Record<Id, Equipement>>;
  readonly droitsRevoques: readonly Id[];
  readonly receptions: readonly Reception[];
  readonly traversees: readonly Readonly<{ evenement: Id; service: Id; impulsion: Impulsion }>[];
  readonly clotures: readonly Readonly<{ mission: Id; colis: Id; impulsion: Impulsion }>[];
  readonly resultats: Readonly<Record<Id, ResultatBesoin>>;
  readonly consequences: Readonly<{ stock: 'utilisable' | 'perduPourLePoste'; atelier: 'intact' | 'repriseLimitee' | 'ferme' }>;
  readonly score: number;
  readonly refus: readonly Refus[];
  readonly observations: readonly FaitObserve[];
  readonly constats: readonly ConstatLocal[];
  readonly franchissements: readonly Franchissement[];
  readonly franchissementsObserves: readonly FranchissementObserve[];
  readonly journal: readonly Readonly<{ impulsion: Impulsion; ordres: readonly Ordre[] }>[];
  readonly ordresEnAttente: readonly Ordre[];
}
export interface VueJoueur {
  readonly impulsion: Impulsion;
  readonly sources: readonly Readonly<{ id: Id; origineCommune: Id | null }>[];
  readonly geometrie: Readonly<{
    sommets: readonly Sommet[];
    aretes: readonly Readonly<{ id: Id; extremites: readonly [Id, Id] }>[];
    obstacles: readonly Readonly<{ id: Id; min: Position3D; max: Position3D }>[];
  }>;
  readonly observations: readonly Observation[];
  readonly constats: readonly ConstatLocal[];
  readonly franchissements: readonly FranchissementObserve[];
  /** One report per source: conflicting reports are never silently merged. */
  readonly silhouettes: readonly Readonly<{ robot: Id; source: Id; sommet: Id; age: number; capture: FaitObserve['capture'] }>[];
  readonly sons: readonly Readonly<{ source: Id; emission: Id; valeur: SonPerçu; capture: FaitObserve['capture'] }>[];
  readonly apercusTrajet: readonly ApercuTrajet[];
}
export interface IntentionTrajet { readonly id: Id; readonly robot: Id; readonly chemin: readonly Id[] }
export interface ApercuTrajet {
  readonly intention: IntentionTrajet;
  readonly cout: Readonly<{ impulsions: number; energie: number }> | null;
  readonly segments: readonly Readonly<{ depuis: Id; vers: Id; etat: 'inconnu' | 'date' | 'ouvertObserve' | 'bloqueObserve' | 'contradictoire' | 'horsGraphe' }>[];
  readonly nature: 'estimationDepuisObservations';
}
