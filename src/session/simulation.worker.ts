import { createSimulation, type Simulation } from '../sim';
import { quai17 } from '../scenarios/quai17';
import type { SessionRequest, SessionResponse } from './protocol';

let simulation: Simulation | undefined;
const send = (message: SessionResponse) => postMessage(message);
onmessage = (event: MessageEvent<SessionRequest>) => {
  try {
    const request = event.data;
    if (request.type === 'init') simulation = createSimulation(quai17(false, 'H'), 17);
    else if (simulation) {
      if (request.observer) simulation.submitOrders([{ robot: 'R2', canal: 'direct', destination: 'C', activite: 'observationFixe' }]);
      simulation.advance();
    }
    if (simulation) send({ type: 'view', view: simulation.getPlayerView() });
  } catch {
    // A physical diagnosis is never sent through the worker's error channel.
    send({ type: 'error', message: 'Cette impulsion ne peut pas être exécutée.' });
  }
};
