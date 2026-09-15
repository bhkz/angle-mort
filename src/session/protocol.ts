import type { Intention, SessionFrame, Situation } from './types';
export type SessionRequest =
  | { readonly type: 'init'; readonly situation?: Situation }
  | { readonly type: 'prepare'; readonly intention: Intention }
  | { readonly type: 'cancel' }
  | { readonly type: 'suspend' | 'resume'; readonly robot: string }
  | { readonly type: 'advance'; readonly observer?: boolean };
export type SessionResponse = ({ readonly type: 'view' } & SessionFrame) | { readonly type: 'error'; readonly message: string };
