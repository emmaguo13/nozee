import { Flex } from '@chakra-ui/react'
import { Silkscreen } from '@next/font/google'

const font = Silkscreen({ subsets: ['latin'], weight: '400' })
export const Footer = () => {
  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      position="fixed"
      top="0"
      w="100%"
      color="white"
      className={font.className}
      textAlign="center"
      height="56px"
      backdropFilter="blur(10px)"
      zIndex={9}
    >
      nozee
    </Flex>
  )
}
