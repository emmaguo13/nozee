importScripts('./snarkjs.min.js')
self.addEventListener('message', async ({ data }) => {
  const fn = data[0]
  switch (fn) {
    case 'fullProve':
      const [_, input, zkeyFastFile] = data
      const result = await snarkjs.groth16.fullProve(
        input,
        '/jwt.wasm',
        zkeyFastFile
      )
      postMessage(result)
      break
    case 'exportSolidityCallData':
      const [__, proof, publicSignals] = data
      const rawCallData = await snarkjs.groth16.exportSolidityCallData(
        proof.data,
        publicSignals.data
      )
      postMessage(rawCallData)
      break
    // case 'verify':
    //   const [___, vkey, proof, publicSignals] = data
    //   const proofVerified = await snarkjs.groth16.verify(
    //     vkey,
    //     publicSignals.data,
    //     proof.data
    //   )
    //   postMessage(proofVerified)
    //   break
    default:
      break
  }
})
