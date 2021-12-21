export interface Member {
  id: string
  name: string
  headline: string
  avatar: string
  created: number
}

export interface MemberExternalInfo {
  qq?: string
}

export interface Me extends Member {
  email: string
  avatarOriginal: string
  externalInfo?: MemberExternalInfo
}
