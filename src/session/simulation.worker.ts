import { createSimulation } from '../sim';
import { catalogueSession, jouable } from '../scenarios/jouable';
import { createSessionController } from './controller';
import { cartesInitiales } from './types';
import type { SessionRequest, SessionResponse } from './protocol';

let session: ReturnType<typeof createSessionController> | undefined;
const send = (message: SessionResponse) => postMessage(message);
onmessage = (event: MessageEvent<SessionRequest>) => {
  try {
    const request = event.data;
    if (request.type === 'init') {
      const situation = request.situation ?? 'atelier'; const scenario = jouable(situation);
      const engine = createSimulation(scenario, 17);
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
    if (session) send({ type: 'view', ...session.frame() });
  } catch {
    send({ type: 'error', message: 'Cette commande ne peut pas être préparée. Le poste reste en pause.' });
  }
};
