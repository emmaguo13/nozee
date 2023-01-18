import { useToast } from '@chakra-ui/react'
import { utils } from 'ethers'
import { useContract, useSigner } from 'wagmi'
import { abi } from '../constants'

function useVerify(message?: string, signature?: string) {
  const toast = useToast()
  const { data: signer } = useSigner()
  const blind = useContract({
    address: '0xAD6aab5161C5DC3f20210b2e4B4d01196737F1EF',
    abi,
    signerOrProvider: signer
  })

  const handleVerify = async () => {
    if (!blind || !message || !signature) return

    const fullSig = utils.splitSignature(signature)
    const signingAddr = utils.verifyMessage(message, fullSig)
    const domain = await blind.get(signingAddr as `0x${string}`)

    if (domain) {
      toast({
        title: 'Message verified.',
        description: "We've verified the sender's signature for you",
        status: 'success',
        duration: 9000,
        isClosable: true,
        position: 'bottom-right'
      })
    } else {
      toast({
        title: 'Message not verified.',
        description: 'This signer is not a valid poster.',
        status: 'error',
        duration: 9000,
        isClosable: true,
        position: 'bottom-right'
      })
    }
  }

  return handleVerify
}

export default useVerify
