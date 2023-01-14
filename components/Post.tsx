import { Box, Button, Flex, Text, Tooltip, useToast } from '@chakra-ui/react'
import { Karla, Silkscreen } from '@next/font/google'
import { ethers } from 'ethers'
import { useContract, useSigner } from 'wagmi'
import { abi } from '../constants/abi'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const font = Silkscreen({ subsets: ['latin'], weight: '400' })
const bodyFont = Karla({ subsets: ['latin'], weight: '400' })

const Post = ({
  k,
  msg,
  signature,
  company
}: {
  k: any
  msg: string
  signature: string
  company: string
}) => {
  const { data: signer } = useSigner()
  const blind = useContract({
    address: '0xAD6aab5161C5DC3f20210b2e4B4d01196737F1EF',
    abi,
    signerOrProvider: signer
  })
  const toast = useToast()

  const router = useRouter()
  const cutMsg = msg.substring(0, 575) + (msg.length > 575 ? '...' : '')

  const sig = ethers.utils.splitSignature(signature as any)
  const signingAddr = ethers.utils.verifyMessage(msg, sig)
  async function verifySig() {
    if (!blind || !signingAddr) return
    const domain = await blind.get(signingAddr as `0x${string}`)
    if (domain) {
      toast({
        title: 'Message verified.',
        description: "We've verified the sender's signature for you",
        status: 'success',
        duration: 9000,
        isClosable: true
      })
    } else {
      toast({
        title: 'Message not verified.',
        description: 'This signer is not a valid poster.',
        status: 'error',
        duration: 9000,
        isClosable: true
      })
    }
    // verify that the signingaddr is the same as the addr we want
  }
  return (
    <>
      <Flex
        direction="column"
        backgroundColor="#1E1E38"
        alignItems="center"
        padding="8"
        // paddingTop="8"
        // paddingBottom="8"
        gap="4"
        borderRadius="10"
        minW="800px"
        // maxW="800px"
        // maxH="190px"
        _hover={{
          cursor: 'pointer',
          backgroundColor: '#262645',
          boxShadow:
            '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
        }}
        onClick={() =>
          router.push({
            pathname: '/post/[pid]',
            query: { pid: k }
          })
        }
      >
        <Flex justifyContent="space-between" w="100%">
          <Box
            backgroundColor="#4C82FB"
            className={font.className}
            borderRadius="4"
            px="3"
            style={{ textTransform: 'capitalize' }}
          >
            {company}
          </Box>
          {/* <Text className={bodyFont.className}>
            Signature:{' '}
            {`${signature?.substring(0, 5)}...${signature?.substring(
              signature.length - 5
            )}`}
          </Text> */}
          <Tooltip
            placement="top"
            openDelay={500}
            maxW={230}
            textAlign="center"
            label="Verify message was signed by authenticated user"
          >
            <Button
              onClick={verifySig}
              className={font.className}
              variant="link"
            >
              Verify
            </Button>
          </Tooltip>
        </Flex>
        <Text
          display="block"
          className={bodyFont.className}
          color="#F5F5F4"
          fontSize="16"
          overflow="hidden"
          lineHeight={1.5}
        >
          {cutMsg}
        </Text>
      </Flex>
    </>
  )
}

export default Post
