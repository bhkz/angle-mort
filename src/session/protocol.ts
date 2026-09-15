import type { VueJoueur } from '../sim/types';
export type SessionRequest =
  | { readonly type: 'init' }
  | { readonly type: 'advance'; readonly observer: boolean };
export type SessionResponse = { readonly type: 'view'; readonly view: VueJoueur } | { readonly type: 'error'; readonly message: string };
