export type Comment = {
  epoch: string
  comment: string
  company: string
}

export type Post = {
  title: string
  company: string
  msg: string
  pubkey: string
  signature: string
  id: string
  comments: Comment[]
}
