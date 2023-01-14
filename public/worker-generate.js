importScripts('./snarkjs.min.js')
self.addEventListener('message', async evt => {
  console.log('web worker recieved message')
  const [proof, publicSignals] = evt.data
  console.log('🚀 ~ self.addEventListener ~ proof', proof)
  console.log('🚀 ~ self.addEventListener ~ publicSignals', publicSignals)
  
  console.log('🚀 ~ publicSignals', publicSignals.length)
  const rawCallData = await snarkjs.groth16.exportSolidityCallData(
    proof,
    publicSignals
  )
  //   console.log('🚀 ~ rawCallData', typeof rawCallData)
  const tokens = rawCallData
    .replace(/["[\]\s]/g, '')
    .split(',')
    .map(x => BigNumber.from(x).toHexString())
  const [a1, a2, b1, b2, b3, b4, c1, c2, ...inputs] = tokens
  const a = [a1, a2]
  const b = [
    [b1, b2],
    [b3, b4]
  ] 
  const c = [c1, c2]
  postMessage({
    a,
    b,
    c,
    inputs
  })
})

