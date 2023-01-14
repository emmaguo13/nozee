importScripts('./snarkjs.min.js')
self.addEventListener('message', async evt => {
  console.log('web worker recieved message')
  const [proof, publicSignals] = evt.data
  console.log('🚀 ~ self.addEventListener ~ proof', proof)
  console.log('🚀 ~ self.addEventListener ~ publicSignals', publicSignals)
  
  console.log('🚀 ~ publicSignals', publicSignals.data.length)
  const rawCallData = await snarkjs.groth16.exportSolidityCallData(
    proof.data,
    publicSignals.data
  )
  console.log('🚀 ~ rawCallData', typeof rawCallData)
  postMessage(rawCallData)
})

