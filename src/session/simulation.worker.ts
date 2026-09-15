import { createSimulation } from '../sim';
import { catalogueSession, jouable } from '../scenarios/jouable';
import { createSessionController } from './controller';
import { cartesInitiales } from './types';
import type { SessionRequest, SessionResponse } from './protocol';
import { defi } from '../scenarios/defi';
import { challengeFrame } from './challenge';
import type { Scenario, Simulation } from '../sim';

let session: ReturnType<typeof createSessionController> | undefined;
let challenge: { scenario: Scenario; final: Simulation['getFinalReport'] } | undefined;
const send = (message: SessionResponse) => postMessage(message);
onmessage = (event: MessageEvent<SessionRequest>) => {
  try {
    const request = event.data;
    if (request.type === 'init') {
      const situation = request.situation ?? 'atelier'; const scenario = situation === 'defi' ? defi() : jouable(situation);
      const engine = createSimulation(scenario, 17);
      challenge = situation === 'defi' ? { scenario, final: engine.getFinalReport } : undefined;
      session = createSessionController({ getPlayerView: engine.getPlayerView, submitOrders: engine.submitOrders, advance: engine.advance, configureMission: engine.configureMission }, catalogueSession(scenario, situation));
    } else if (session) {
      if (request.type === 'prepare') session.prepare(request.intention);
      else if (request.type === 'cancel') session.cancel();
      else if (request.type === 'suspend') session.suspend(request.robot);
      else if (request.type === 'resume') session.resume(request.robot);
      else if (request.type === 'advance') {
        if (request.observer) session.prepare({ robot: 'R2', action: 'observer', destination: 'C', cartes: cartesInitiales });
        session.advance();
      }
    }
    if (session) {
      const frame = session.frame();
      send({ type: 'view', ...frame, ...(challenge ? { defi: challengeFrame(challenge.scenario, frame.view.impulsion, challenge.final()) } : {}) });
    }
  } catch {
    send({ type: 'error', message: 'Cette commande ne peut pas être préparée. Le poste reste en pause.' });
  }
};
