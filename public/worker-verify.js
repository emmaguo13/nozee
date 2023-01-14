importScripts('./snarkjs.min.js')
self.addEventListener('message', async evt => {
  console.log('web worker recieved message')
  const [vkey, proof, publicSignals] = evt.data
  console.log('🚀 ~ self.addEventListener ~ vkey', vkey)
  console.log('🚀 ~ self.addEventListener ~ proof', proof)
  console.log('🚀 ~ self.addEventListener ~ publicSignals', publicSignals)
  const proofVerified = await snarkjs.groth16.verify(
    vkey,
    publicSignals.data,
    proof.data
  )
  console.log('🚀 ~ proofVerified', proofVerified)
  postMessage(proofVerified)
})
