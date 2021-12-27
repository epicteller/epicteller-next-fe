export interface Character {
  id: string
  name: string
  avatar?: string
}

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

export enum CombatState {
  INITIATING = 'initiating',
  RUNNING = 'running',
  ENDED = 'ended',
}

export interface Combat {
  id: string
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
