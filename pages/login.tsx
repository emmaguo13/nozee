import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons'
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Progress,
  Text
} from '@chakra-ui/react'
import { Karla, Silkscreen } from '@next/font/google'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { BigNumber } from 'ethers'
import localforage from 'localforage'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Confetti from 'react-confetti'
import { useWindowSize } from 'usehooks-ts'
import { useAccount, useContract, useSigner } from 'wagmi'
import { abi } from '../constants/abi'
import { useApp } from '../contexts/AppProvider'
import { generate_inputs } from '../helpers/generate_input'

const font = Silkscreen({ subsets: ['latin'], weight: '400' })
const bodyFont = Karla({ subsets: ['latin'], weight: '400' })

enum Steps {
  IDLE_DOWNLOADING,
  IDLE_DOWNLOADED,
  GENERATING,
  VERIFYING,
  AUTHENTICATED
}

const LoadingText = [
  'Downloading .zkey',
  '',
  'Generating Proofs',
  'Confirm in wallet to verify proof on chain',
  'Authenticated'
]

export default function Home() {
  const { address } = useAccount()
  const router = useRouter()
  const [token, setToken] = useState('')
  const { data: signer } = useSigner()
  const [status, setStatus] = useState<Steps>(Steps.IDLE_DOWNLOADING)
  const { height, width } = useWindowSize()

  const blind = useContract({
    address: '0xAD6aab5161C5DC3f20210b2e4B4d01196737F1EF',
    abi,
    signerOrProvider: signer
  })

  useEffect(() => {
    if (!token && router.query.msg) {
      setToken(router.query.msg.toString())
    }
  }, [router.query.msg, token])

  const handleLogin = async () => {
    // Generate proofs and public inputs
    setStatus(Steps.GENERATING)
    if (!address) {
      console.log('need address')
      return
    }
    const zkeyDb = await localforage.getItem('jwt_single-real.zkey')
    if (!zkeyDb) {
      throw new Error('zkey was not found in the database')
    }
    //@ts-ignore
    const zkeyRawData = new Uint8Array(zkeyDb)
    const zkeyFastFile = { type: 'mem', data: zkeyRawData }
    const worker = new Worker('./worker.js')
    const splitToken = token.split('.')
    const inputs = await generate_inputs(
      splitToken[2],
      splitToken[0] + '.' + splitToken[1],
      address
    )
    worker.postMessage([inputs, zkeyFastFile])
    worker.onmessage = async function (e) {
      const { proof, publicSignals } = e.data
      console.log('PROOF SUCCESSFULLY GENERATED: ', proof)
      setStatus(Steps.VERIFYING)
      console.log('before worker')
      const worker = new Worker('./worker-generate.js')
      const proofFastFile = { type: 'mem', data: proof }
      const publicSignalsFastFile = { type: 'mem', data: publicSignals }
      worker.postMessage([proofFastFile, publicSignalsFastFile])
      worker.onmessage = async function (e) {
        const tokens = e.data
          .replace(/["[\]\s]/g, '')
          .split(',')
          .map((x: any) => BigNumber.from(x).toHexString())
        const [a1, a2, b1, b2, b3, b4, c1, c2, ...inputs] = tokens
        const a = [a1, a2]
        const b = [
          [b1, b2],
          [b3, b4]
        ]
        const c = [c1, c2]

        console.log(a)
        console.log(b)
        console.log(c)
        console.log(inputs)
        await blind
          ?.add(a as any, b as any, c as any, inputs, {
            gasLimit: 2000000 as any
          })
          .then(res => {
            return res
          })
        setStatus(Steps.AUTHENTICATED)
      }
    }
  }
  const { downloadProgress, downloadStatus } = useApp()

  useEffect(() => {
    const fetchZkey = async () => {
      if (status > Steps.IDLE_DOWNLOADED) return
      if (downloadStatus === 'downloaded') {
        setStatus(Steps.IDLE_DOWNLOADED)
      }
    }
    fetchZkey()
  }, [downloadStatus, status])

  return (
    <>
      <Head>
        <title>login to nozee</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        style={{
          position: 'absolute',
          top: '-56px',
          left: 0,
          bottom: 0,
          right: 0
        }}
      >
        {status === Steps.AUTHENTICATED && (
          <Confetti width={width} height={height} />
        )}
      </div>
      <Flex
        as="main"
        direction="column"
        w="100%"
        // margin="0 auto"
        position="relative"
        minH="100vh"
        className={bodyFont.className}
        gap="6"
      >
        <Box h="56px" />
        <Text className={font.className} fontSize="50" textAlign="center">
          Sign in
        </Text>
        <Flex flex={1} placeContent="center">
          <Flex direction="column" gap="4">
            <Accordion w="400px" allowToggle>
              <AccordionItem
                _hover={{
                  cursor: 'pointer',
                  backgroundColor: '#0A0A12'
                }}
              >
                <h2>
                  <AccordionButton>
                    <Flex alignItems="center" gap="4" flex="1">
                      {token ? (
                        <>
                          <CheckCircleIcon color="green.200" />
                          JWT Loaded
                        </>
                      ) : (
                        <>
                          <WarningIcon />
                          No JWT Loaded
                        </>
                      )}
                    </Flex>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  Download the extension from
                  <Button
                    onClick={() =>
                      window.location.assign(
                        'https://zkjwt-zkey-chunks.s3.amazonaws.com/extension.zip'
                      )
                    }
                    variant="link"
                  >
                    here.
                  </Button>
                  Unzip the file. Then, go to Manage Extensions & switch on
                  Develop Mode in upper-right corner. Press load unpacked &
                  select JWT Extension file from downloads.
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem
                _hover={{
                  cursor: 'pointer',
                  backgroundColor: '#0A0A12'
                }}
              >
                <h2>
                  <AccordionButton>
                    <Flex alignItems="center" gap="4" flex="1">
                      {downloadStatus === 'downloaded' ? (
                        <>
                          <CheckCircleIcon color="green.200" />
                          .zkey Downloaded
                        </>
                      ) : (
                        <>
                          <WarningIcon />
                          Downloading .zkey
                        </>
                      )}
                    </Flex>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  Wait for zkeys to be downloaded and generate your
                  authentication proof — all client-side! We do not take or
                  store any data.
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem
                _hover={{
                  cursor: 'pointer',
                  backgroundColor: '#0A0A12'
                }}
              >
                <h2>
                  <AccordionButton>
                    <Flex alignItems="center" gap="4" flex="1">
                      {address ? (
                        <>
                          <CheckCircleIcon color="green.200" />
                          Wallet Connected
                        </>
                      ) : (
                        <>
                          <WarningIcon />
                          Connect Wallet
                        </>
                      )}
                    </Flex>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  You&apos;ll need to commit to your domain on chain by sending
                  a transaction.
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
            <Flex placeContent="center">
              <ConnectButton accountStatus="full" chainStatus="full" />
            </Flex>
            {status === Steps.AUTHENTICATED ? (
              <Button
                backgroundColor="#992870"
                className={font.className}
                onClick={() => router.push('/')}
              >
                NOZEE
              </Button>
            ) : (
              <Button
                backgroundColor="#4C82FB"
                isLoading={status > Steps.IDLE_DOWNLOADED}
                onClick={handleLogin}
                loadingText={LoadingText[status]}
              >
                Login
              </Button>
            )}
          </Flex>
        </Flex>
        <Box bottom="0" position="absolute" w="100%">
          <Text ml="1">{LoadingText[status]}</Text>
          <Progress
            value={
              downloadProgress || (status === Steps.AUTHENTICATED ? 100 : 0)
            }
            backgroundColor={
              status === Steps.AUTHENTICATED ? '#992870' : '#4C82FB'
            }
            isIndeterminate={
              status > Steps.IDLE_DOWNLOADED &&
              status !== Steps.AUTHENTICATED &&
              downloadStatus !== 'downloading'
            }
          />
        </Box>
      </Flex>
    </>
  )
}
