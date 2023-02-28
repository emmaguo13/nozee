import { useAccount, useContractRead } from 'wagmi'
import { abi } from '../constants'

function useDomain() {
  const { address } = useAccount()
  const formattedAddress = address ? address : '0x'
  const { data } = useContractRead({
    address: '0xAD6aab5161C5DC3f20210b2e4B4d01196737F1EF',
    abi,
    functionName: 'get',
    args: [formattedAddress],
    staleTime: 2_000,
    watch: true,
    cacheOnBlock: true,
    cacheTime: 2_000
  })
  return data
}

export default useDomain
