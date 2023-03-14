import { Button, Flex, Icon, Text, Tooltip } from '@chakra-ui/react'
import { Karla, Silkscreen } from '@next/font/google'
import { useRouter } from 'next/router'
import { FiBriefcase } from 'react-icons/fi'
import useVerify from '../hooks/useVerify'

const font = Silkscreen({ subsets: ['latin'], weight: '400' })
const bodyFont = Karla({ subsets: ['latin'], weight: '400' })

const PostCard = ({
  id,
  message,
  signature,
  company,
  truncate = false
}: {
  id: string
  message: string
  signature: string
  company: string
  truncate?: boolean
}) => {
  const router = useRouter()
  const cutMsg = message.substring(0, 575) + (message.length > 575 ? '...' : '')
  // const handleVerify = useVerify(message, signature)
  const msg = truncate ? cutMsg : message

  return (
    <>
      <Flex
        alignItems="flex-start"
        backgroundColor="#1E1E38"
        borderRadius="10"
        direction="column"
        gap="4"
        padding="8"
        minW="800px"
        _hover={{
          cursor: 'pointer',
          backgroundColor: '#262645',
          boxShadow:
            '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
        }}
      >
        <Flex justifyContent="space-between" w="100%">
          <Flex
            alignItems="center"
            // backgroundColor="#4C82FB"
            border="1px solid #4C82FB"
            className={font.className}
            borderRadius="6"
            px="3"
            gap="2"
            style={{ textTransform: 'capitalize' }}
          >
            <Icon as={FiBriefcase} />
            {company}
          </Flex>
          <Tooltip
            placement="top"
            openDelay={500}
            maxW={230}
            textAlign="center"
            label="Verify message was signed by authenticated user"
          >
            {/* <Button
              // onClick={handleVerify}
              className={font.className}
              variant="link"
            >
              Verify
            </Button> */}
          </Tooltip>
        </Flex>
        <Flex
          justifyContent="flex-start"
          onClick={() => router.push(`/post/${id}`)}
        >
          <Text
            display="block"
            className={bodyFont.className}
            color="#F5F5F4"
            fontSize="16"
            overflow="hidden"
            lineHeight={1.5}
            align="left"
          >
            {msg}
          </Text>
        </Flex>
      </Flex>
    </>
  )
}

export default PostCard
