import { useAccount } from 'wagmi'

function useDomain(account?: `0x${string}`) {
  const { address } = useAccount()
  const formattedAddress = account ? account : address ? address : '0x'
  // TODO: fetch domain from circuit
  return ''
}

export default useDomain
