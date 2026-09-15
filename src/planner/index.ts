import type { Recherche, RequetePlanification, ResultatPlanification } from './types';
import { checkNecessaryConditions } from './diagnostics';
import { InformationInsuffisante, ModeleNonPrisEnCharge, prepareModel, RefusConnu } from './model';
import { search, toPlan } from './search';

export type * from './types';

/** Searches a predicted world built solely from the supplied beliefs and available rights. */
export function planifier(request: RequetePlanification): ResultatPlanification {
  const initial: Recherche = { exhaustive: false, etatsExplores: 0, transitionsExaminees: 0, arret: 'informationInsuffisante' };
  try {
    const model = prepareModel(request);
    checkNecessaryConditions(model);
    const { best, recherche } = search(model);
    if (best) return { statut: 'plan', plan: toPlan(model, best), garantie: recherche.exhaustive ? 'optimalSelonCroyances' : 'meilleurTrouve', recherche };
    if (!recherche.exhaustive) return { statut: 'incomplet', message: 'Aucune solution trouvee avant epuisement du budget ; aucune impossibilite prouvee', recherche };
    if (model.incertain) return { statut: 'incomplet', message: 'Aucun plan dans les croyances retenues ; une nouvelle observation est necessaire avant de conclure', recherche: { ...recherche, arret: 'informationInsuffisante' } };
    return { statut: 'refuse', raisons: [{ code: 'echeanceImpossible', message: 'Les receptions exigees ne peuvent pas respecter simultanement leurs echeances avec les acces et ressources de ces croyances' }], recherche };
  } catch (error) {
    if (error instanceof RefusConnu) return { statut: 'refuse', raisons: [error.raison], recherche: { ...initial, exhaustive: true, arret: 'terminee' } };
    if (error instanceof InformationInsuffisante) return { statut: 'incomplet', message: error.message, recherche: initial };
    if (error instanceof ModeleNonPrisEnCharge) return { statut: 'incomplet', message: error.message, recherche: { ...initial, arret: 'modeleNonPrisEnCharge' } };
    throw error;
  }
}
