export interface NavItem {
  title: string
  href?: string
  disabled?: boolean
  external?: boolean
}

export type Comment = {
  // epoch: string
  comment: string
  domain: string
  pubkey: string
  timestamp: string
  upvotes: string[]
  id: string
}

export type Post = {
  title: string
  domain: string
  body: string
  id: string
  timestamp: string
  comments: Comment[]
  upvotes: string[] // string of public keys
  pubkey: string
}
