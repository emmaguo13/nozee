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
  for (var i = 31; i < 48; i++) {
    if (publicSignals[i] != currentKey[i - 31]) {
      return false
    }
  }
  return true
}
