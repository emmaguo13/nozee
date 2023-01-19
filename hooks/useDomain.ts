import { useAccount, useContractRead } from 'wagmi'
import { abi } from '../constants'

function useDomain(enabled?: boolean) {
  const { address } = useAccount()
  const formattedAddress = address ? address : '0x'
  const { data } = useContractRead({
    address: enabled
      ? '0xAD6aab5161C5DC3f20210b2e4B4d01196737F1EF'
      : '0x0000000000000000000000000000000000000000',
    abi,
    functionName: 'get',
    args: [formattedAddress],
    enabled
  })
  return data
}

export default useDomain
