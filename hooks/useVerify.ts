import { useToast } from '@chakra-ui/react'
import { utils } from 'ethers'
import useDomain from './useDomain'

function useVerify(message: string, signature: string) {
  const fullSig = utils.splitSignature(signature)
  const signingAddr = utils.verifyMessage(message, fullSig)
  const domain = useDomain(signingAddr as `0x${string}`)

  const toast = useToast()

  const handleVerify = async () => {
    // TODO: should check if domain matches post domain
    if (domain) {
      toast({
        title: 'Message verified.',
        description: `This post was signed by someone from ${domain.toUpperCase()}.`,
        status: 'success',
        duration: 9000,
        isClosable: true,
        position: 'bottom-right'
      })
    } else {
      toast({
        title: 'Message not verified.',
        description: `The post's signature could not be verified.`,
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
