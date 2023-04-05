import { openAiPubKey } from '../constants'

export const verifyPublicKey = (publicSignals: string[]) => {
  for (var i = 0; i < 17; i++) {
    if (publicSignals[i] != openAiPubKey[i]) {
      return false
    }
  }
  return true
}
