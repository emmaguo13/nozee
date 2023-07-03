import { jwtClientPubKey, openAiPubKey } from "../constants"

export const verifyPublicKey = (publicSignals: string[], key: string) => {
  let currentKey: string[]
  switch (key) {
    case "openai":
      currentKey = openAiPubKey
      break
    case "vercel":
      currentKey = jwtClientPubKey
      break
    default:
      currentKey = []
      break
  }
  for (var i = 0; i < 17; i++) {
    if (publicSignals[i] != currentKey[i]) {
      return false
    }
  }
  return true
}
