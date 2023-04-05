import { openAiPubKey } from '../constants'

type publicKey = 'openai'
export const verifyPublicKey = (publicSignals: string[], key: publicKey) => {
  let currentKey: string[]
  switch (key) {
    case 'openai':
      currentKey = openAiPubKey
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
