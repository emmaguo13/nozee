import { Flex, Text } from '@chakra-ui/react'
import { Silkscreen } from '@next/font/google'
import Link from 'next/link'

const font = Silkscreen({ subsets: ['latin'], weight: '700' })
const colors = ['#4C82FB', '#FF5D1F', '#FAD236', '#009965', '#EE404E']
export const TopBar = () => {
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
    >
      <Link href="/">
        <Flex>
          {['n', 'o', 'z', 'e', 'e'].map((letter, index) => (
            <Text
              key={index}
              letterSpacing={4}
              fontSize="xl"
              className={font.className}
              color="white"
              _hover={{
                color: colors[index]
              }}
            >
              {letter}
            </Text>
          ))}
        </Flex>
      </Link>
    </Flex>
  )
}
