import { Member } from './member';

export interface Room {
  id: string
  name: string
  description: string
  owner: Member
  avatar?: string
  created: number
  updated: number
  memberCount?: number
  hasRunningCampaign?: boolean
}
