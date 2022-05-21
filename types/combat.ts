import { Character } from './character';

export interface CombatToken {
  name: string
  initiative?: number
  character?: Character
}

export interface CombatOrder {
  order: Array<CombatToken>
  currentToken?: CombatToken
  roundCount: number
}

export type CombatState = 'initiating' | 'running' | 'ended';

export interface Combat {
  id: string
  campaignId?: string
  state: CombatState
  isRemoved: boolean
  tokens: { [tokenName: string]: CombatToken }
  order: CombatOrder
  data: object
  startedAt: number
  endedAt?: number
  created: number
  updated: number
}

export interface AddCombatTokenResponse {
  combat: Combat
  token: CombatToken
  rank: number
}

export interface WebSocketMsg {
  type: string
}

export interface Action {
  action: string
}

export interface CombatMsg extends WebSocketMsg {
  action: Action
  combat: Combat
}

export function isCombatMsg(msg: any): msg is CombatMsg {
  return msg?.type && msg?.action && msg?.combat;
}

export interface PingMsg extends WebSocketMsg {
}

export function isPingMsg(msg: any): msg is WebSocketMsg {
  return msg?.type === 'ping';
}
