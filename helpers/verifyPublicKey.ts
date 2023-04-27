import { headspacePubKey, openAiPubKey } from '../constants'

export const verifyPublicKey = (publicSignals: string[], key: string) => {
  let currentKey: string[]
  switch (key) {
    case 'openai':
      currentKey = openAiPubKey
      break
    case 'headspace':
      currentKey = headspacePubKey
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
