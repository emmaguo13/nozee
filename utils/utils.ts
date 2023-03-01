import { BigNumber } from 'ethers'
import localforage from 'localforage'

export async function downloadFromFilename() {
  const link = 'https://zkjwt-zkey-chunks.s3.amazonaws.com/jwt_single-real.zkey'
  try {
    const zkeyResp = await fetch(link, {
      method: 'GET'
    })
    const zkeyBuff = await zkeyResp.arrayBuffer()
    if (zkeyBuff.byteLength == 0) {
      console.log('Not saving file')
    } else {
      console.log('Got file', 'jwt_single-real.zkey')
    }
    await localforage.setItem('jwt_single-real.zkey', zkeyBuff)
    console.log(`Storage of jwt_single-real.zkey successful!`)
  } catch (e) {
    console.log(
      `Storage of jwt_single-real.zkey unsuccessful, make sure IndexedDB is enabled in your browser, or check CORS.`
    )
  }
}

export function formatSolidityCallData(data: any) {
  const tokens = data
    .replace(/["[\]\s]/g, '')
    .split(',')
    .map((x: any) => BigNumber.from(x).toHexString())
  const [a1, a2, b1, b2, b3, b4, c1, c2, ...inputs] = tokens
  const a = [a1, a2]
  const b = [
    [b1, b2],
    [b3, b4]
  ]
  const c = [c1, c2]
  return [a, b, c, inputs]
}
