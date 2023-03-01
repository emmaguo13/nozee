import { useAccount } from 'wagmi'
import { contractAddress } from '../constants'
import { useBlindGet } from '../generated'

function useDomain(account?: `0x${string}`) {
  const { address } = useAccount()
  const formattedAddress = account ? account : address ? address : '0x'
  const { data } = useBlindGet({
    address: contractAddress,
    args: [formattedAddress],
    staleTime: 2_000,
    watch: true,
    cacheOnBlock: true,
    cacheTime: 2_000
  })
  return data
}

export default useDomain
