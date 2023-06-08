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
  Spacer,
  Text,
  Textarea,
  Tooltip,
  useToast
} from '@chakra-ui/react'
import { Karla, Silkscreen } from '@next/font/google'
import { useEffect, useState } from 'react'
import useDomain from '../hooks/useDomain'
import localforage from 'localforage'

const font = Silkscreen({ subsets: ['latin'], weight: '400' })
const bodyFont = Karla({ subsets: ['latin'], weight: '400' })

const CreateModal = ({
  isOpen,
  onClose
}: {
  isOpen: boolean
  onClose: any
}) => {
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [enabled, setEnabled] = useState(false)
  const toast = useToast()
  const domain = useDomain()

  useEffect(() => {
    if (!enabled) setEnabled(true)
  }, [enabled])

  const handleCreatePost = async () => {
    // call /api/write to write to the database
    const storedProof = JSON.parse((await localforage.getItem('proof')) || '{}')
    const storedPublicSignals = await localforage.getItem('publicSignals')
    await fetch('/api/write', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        message,
        address: '',
        domain,
        company: 'Apple',
        signature: '',
        id: Date.now().toString(),
        proof: storedProof,
        publicSignals: storedPublicSignals
      })
    })

    toast({
      title: 'Post created',
      description: 'Your post has been created',
      status: 'success',
      duration: 5000,
      position: 'bottom-right',
      isClosable: true
    })
    onClose()

    // if (!address || !domain || !signer) return
    // const signedMessage = await signer.signMessage(message)
    // const uniqueId = formattedAddr + Date.now().toString()
    // await createPost({
    //   title,
    //   id: uniqueId,
    //   company: domain,
    //   message,
    //   address,
    //   signature: signedMessage
    // }).then(res => {
    //   console.log(res)
    //   toast({
    //     title: 'Post created',
    //     description: 'Your post has been created',
    //     status: 'success',
    //     duration: 5000,
    //     position: 'bottom-right',
    //     isClosable: true
    //   })
    //   onClose()
    // })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay backdropFilter="blur(8px)" />
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
                className={bodyFont.className}
              />
            </>
          </Flex>
        </ModalBody>

        <ModalFooter>
          <div>
            <Flex alignItems="flex-end" gap="1">
              <Text className={bodyFont.className}>
                You&apos;re posting from
              </Text>
              <Text className={font.className}>{domain}</Text>
            </Flex>
            <Tooltip
              placement="top"
              openDelay={500}
              maxW={230}
              textAlign="center"
              label="You'll sign your message with your key, so that users can verify that it came from you. This does not cost you any gas."
            >
              <Text
                className={bodyFont.className}
                color="whiteAlpha.600"
                fontSize="sm"
              >
                Why does my wallet pop up?
              </Text>
            </Tooltip>
          </div>
          <Spacer />
          <Button backgroundColor="#4C82FB" onClick={handleCreatePost}>
            Post
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default CreateModal
