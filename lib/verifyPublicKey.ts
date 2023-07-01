import { jwtClientPubKey, openAiPubKey } from '../constants'

export const verifyPublicKey = (publicSignals: string[], key: string) => {
  let currentKey: string[]
  switch (key) {
    case 'openai':
      currentKey = openAiPubKey
      break
    case 'jwt_client':
      currentKey = jwtClientPubKey
      break
    default:
      currentKey = []
      break
  }
  console.log('wtf')
  console.log(currentKey)
  console.log(key);
  for (var i = 0; i < 17; i++) {
    console.log(publicSignals[i])
    console.log(currentKey[i])
    if (publicSignals[i] != currentKey[i]) {
      return false
    }
  }
  return true
}
