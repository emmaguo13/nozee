import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea
} from '@chakra-ui/react'
import { Silkscreen } from '@next/font/google'
import { useEffect, useState } from 'react'
import { useAccount, useConnect, useSigner } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import useDomain from '../hooks/useDomain'
import { createPost } from '../utils/firebase'

const font = Silkscreen({ subsets: ['latin'], weight: '400' })

const CreateModal = ({
  isOpen,
  onClose
}: {
  isOpen: boolean
  onClose: any
}) => {
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const { address } = useAccount()
  const formattedAddr = address ? address : '0x'
  const [enabled, setEnabled] = useState(false)
  const domain = useDomain()

  useEffect(() => {
    if (!enabled) setEnabled(true)
  }, [enabled])

  const { connect } = useConnect({
    connector: new InjectedConnector()
  })

  const { data: signer } = useSigner()

  async function handleCreateModalModalPost() {
    if (!address || !domain || !signer) return
    const signedMessage = await signer.signMessage(message)
    const uniqueId = formattedAddr + Date.now().toString()
    const post = await createPost({
      title,
      id: uniqueId,
      company: domain,
      message,
      address,
      signature: signedMessage
    })
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay backdropBlur="10px" />
      <ModalContent backgroundColor="#1E1E38" maxW="600px">
        <ModalHeader className={font.className}>Create Post</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex direction="column" gap="2" borderRadius="10">
            <>
              <Textarea
                backgroundColor="#2C2C54"
                onChange={e => setMessage(e.target.value)}
                value={message}
              />
            </>
          </Flex>
        </ModalBody>

        <ModalFooter>
          <Button onClick={handleCreateModalModalPost}>Post</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default CreateModal
