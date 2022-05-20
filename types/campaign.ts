import { Character } from './character';
import { Member } from './member';
import { Combat } from './combat';

export interface MyCampaignsListResponse {
  data: Campaign[]
}

export interface Campaign {
  id: string
  roomId: string
  name: string
  description: string
  owner: Member
  state: string
  created: number
  updated: number
  characters?: Character[]
  relationship?: CampaignRelationship
  runningCombat?: Combat
}

export interface CampaignRelationship {
  isGm?: boolean
  isPlayer?: boolean
  usingCharacter?: Character
}
