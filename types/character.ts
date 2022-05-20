import { Member } from './member';

export interface Character {
  id: string
  member?: Member
  name: string
  avatar?: string
  description?: string
  rawData?: object
  created?: number
  updated?: number
  relationship?: CharacterRelationship
}

export interface CharacterRelationship {
  isOwner?: boolean
}
