import { Container, Flex, Box, Button, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { getPosts, getPostsFilterDomain } from '../firebase'
import { Karla, Silkscreen } from '@next/font/google'

const font = Silkscreen({ subsets: ['latin'], weight: '400' })
const bodyFont = Karla({ subsets: ['latin'], weight: '400' })  

const FullPost = () => {
  const router = useRouter() 

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
      >
        <Flex justifyContent="space-between" w="100%">
          <Box
            backgroundColor="#4C82FB"
            className={font.className}
            borderRadius="4"
            px="3"
            style={{ textTransform: 'capitalize' }}
          >
            {router.query.company}
          </Box>
          {/* <Text className={bodyFont.className}>
            Signature:{' '}
            {`${signature?.substring(0, 5)}...${signature?.substring(
              signature.length - 5
            )}`}
          </Text> */}
          {/* <Button onClick={verifySig} className={font.className} variant="link">
            Verify
          </Button> */}
        </Flex>
        <Text
          alignContent="start"
          display="block"
          className={bodyFont.className}
          color="#F5F5F4"
          fontSize="16"
          overflow="hidden"
        >
          {router.query.msg}
        </Text>
      </Flex>
    </>
  )
}

export default FullPost
