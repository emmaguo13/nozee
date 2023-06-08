export interface NavItem {
  title: string
  href?: string
  disabled?: boolean
  external?: boolean
}

export type Comment = {
  epoch: string
  comment: string
  company: string
}

export type Post = {
  title: string
  domain: string
  body: string
  id: string
  timestamp: string
}
