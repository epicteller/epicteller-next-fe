import { Character } from './character';

export type MessageType = 'text' | 'image' | 'dice';

export type DiceType = 'scalar' | 'array' | 'check';

export interface TextMessageContent {
  text: string
}

export interface ImageMessageContent {
  image: string
}

export interface DiceMessageContent {
  diceType: DiceType
  reason?: string
  expression: string
  detail: string
  value: number[] | number
}

export interface MessageRelationship {
  isOwner?: boolean
}

export interface Message {
  id: string
  type: string
  campaignId: string
  episodeId: string
  character?: Character
  isRemoved?: boolean
  isGm: boolean
  messageType: MessageType
  content: TextMessageContent | ImageMessageContent | DiceMessageContent
  created: number
  updated: number
  relationship?: MessageRelationship
}

export interface MessagesPagingInfo {
  isEnd: boolean
  next?: string
  previous?: string
  total?: string
}

export interface MessagesResponse {
  data: Message[]
  paging: MessagesPagingInfo
}
