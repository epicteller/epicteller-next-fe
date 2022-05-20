export type EpisodeState = 'pending' | 'running' | 'paused' | 'ended';

export interface Episode {
  id: string
  type: string
  roomId: string
  campaignId: string
  title: string
  state: EpisodeState
  startedAt: number
  endedAt?: number
  created: number
  updated: number
}
