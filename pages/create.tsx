import {
  Button,
  Container,
  Flex,
  Input,
  Text,
  Textarea
} from '@chakra-ui/react'
import { Silkscreen } from '@next/font/google'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useEffect, useState } from 'react'
import {
  useAccount,
  useContractRead,
  useConnect,
  useSigner,
  useContract
} from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { abi } from '../constants/abi'
import { createPost, getPosts } from './firebase'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton
} from '@chakra-ui/react'

import {ethers} from 'ethers'

const font = Silkscreen({ subsets: ['latin'], weight: '400' })


const Create = ({ isOpen, onClose }: { isOpen: boolean; onClose: any }) => {
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const { address } = useAccount()
  const formattedAddr = address ? address : '0x'
  const [enabled, setEnabled] = useState(false)
  const { data: domainStr } = useContractRead({
    address: enabled ? '0x13e4E0a14729d9b7017E77ebbDEad05cb8ad1540' : '0x',
    abi,
    functionName: 'get',
    args: [formattedAddr]
  })

  useEffect(() => {
    if (!enabled) setEnabled(true)
  }, [enabled])

  const { connect } = useConnect({
    connector: new InjectedConnector()
  })

  const { data: signer } = useSigner()

  // const blindContract = useContract({
  //   address: "0x13e4E0a14729d9b7017E77ebbDEad05cb8ad1540",
  //   abi: blind["abi"],
  //   signerOrProvider: signer,
  // });

  async function handleCreatePost() {
    // sign message
    if (!domainStr) return
    const signedMessage = await signer?.signMessage(message)

    // const post = await createPost(company, message, address as any, sig as any);
    const uniqueId = formattedAddr + Date.now().toString()
    const post = await createPost(
      uniqueId,
      domainStr,
      message,
      address as string,
      signedMessage as string,
      title as string
    )
    // }
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay backdropBlur='10px'/>
      <ModalContent backgroundColor='#1E1E38' maxW ='600px'>
        <ModalHeader className={font.className}>Create Post</ModalHeader>
        <ModalCloseButton />
        <ModalBody >
          <Flex
            direction="column"
            gap="2"
            borderRadius="10"
          >
            {/* <> // taking out title for now
              <Text>Title</Text>
              <Input onChange={e => setTitle(e.target.value)} value={title} />
            </> */}
            <>
              <Textarea
              backgroundColor='#2C2C54'
                onChange={e => setMessage(e.target.value)}
                value={message}
              />
            </>
            {/* <div className={font.className}>Committed to {domainStr}</div> */}
          </Flex>
        </ModalBody>

        <ModalFooter>
          {/* <Button mr={3} onClick={onClose}>
            Close // backgroundColor="#4C82FB" 
          </Button> */}
          <Button onClick={handleCreatePost}>Post</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default Create
