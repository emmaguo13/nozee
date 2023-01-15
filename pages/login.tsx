import { ArrowForwardIcon } from '@chakra-ui/icons'
import {
  Button,
  Container,
  Flex,
  Heading,
  Spacer,
  Spinner,
  Text,
  Textarea,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useToast,
  Box
} from '@chakra-ui/react'
import { Karla, Silkscreen } from '@next/font/google'
import localforage from 'localforage'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import Confetti from 'react-confetti'
import { useWindowSize } from 'usehooks-ts'
import {
  useAccount,
  useContractRead,
  useWaitForTransaction,
  useSigner,
  useContract
} from 'wagmi'
import { abi } from '../constants/abi'
import { generate_inputs } from '../helpers/generate_input'
import vkey from '../utils/verification_key.json'
import { BigNumber } from 'ethers'
import { ConnectButton } from '@rainbow-me/rainbowkit'

const font = Silkscreen({ subsets: ['latin'], weight: '400' })
const bodyFont = Karla({ subsets: ['latin'], weight: '400' })

export default function Home() {
  const { address } = useAccount()
  const router = useRouter()
  const [domain, setDomain] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGenerated, setIsGenerated] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [proof, setProof] = useState('')
  const [publicSignals, setPublicSignals] = useState<string[]>([])
  const [token, setToken] = useState('')
  const { height, width } = useWindowSize()
  const [hash, setHash] = useState<`0x${string}`>()
  const toast = useToast()
  const [isDownloaded, setIsDownloaded] = useState(false)
  console.log('🚀 ~ Home ~ isDownloaded', isDownloaded)
  const { isSuccess: txSuccess } = useWaitForTransaction({
    // confirmations: 5,
    hash: hash,
    enabled: !!hash
  })

  const formattedAddr = address ? address : '0x'

  const { data: signer } = useSigner()

  const blind = useContract({
    address: '0xAD6aab5161C5DC3f20210b2e4B4d01196737F1EF',
    abi,
    signerOrProvider: signer
  })

  const { data: domainStr } = useContractRead({
    address: '0xAD6aab5161C5DC3f20210b2e4B4d01196737F1EF',
    abi,
    functionName: 'get',
    args: [formattedAddr],
    enabled: txSuccess,
    onSuccess: data => {
      console.log('in on success')
      if (data) {
        console.log(data)
        setIsVerified(true)
        setIsGenerated(true)
        setIsGenerating(false)
        setDomain(`${data}`)
      }
    }
  })

  const msg = router.query.msg

  useEffect(() => {
    if (txSuccess) {
    }
  }, [txSuccess])

  useEffect(() => {
    if (!token && msg) {
      setToken(msg.toString())
    }
  }, [msg, token])

  useEffect(() => {
    const fetchZkey = async () => {
      if (isDownloaded) return
      const zkeyDb = await localforage.getItem('jwt_single-real.zkey')
      if (zkeyDb) setIsDownloaded(true)
    }
    fetchZkey()
  }, [isDownloaded])

  const handleVerify = useCallback(async () => {
    setIsVerifying(true)
    const worker = new Worker('./worker-verify.js')
    const proofFastFile = { type: 'mem', data: proof }
    const publicSignalsFastFile = { type: 'mem', data: publicSignals }
    worker.postMessage([vkey, proofFastFile, publicSignalsFastFile])
    worker.onmessage = async function (e) {
      const isVerified = e.data
      console.log('PROOF SUCCESSFULLY VERIFIED: ', isVerified)
      setIsVerified(isVerified)
      setIsVerifying(false)
    }
  }, [proof, publicSignals])

  const handleVerifyContract = useCallback(async () => {
    setIsVerifying(true)
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
      const data = await blind
        ?.add(a as any, b as any, c as any, inputs, {
          gasLimit: 2000000 as any
        })
        .then(res => {
          setIsVerifying(false)
          return res
        })
      console.log('🚀 ~ data', data)
      if (data?.hash) {
        console.log('hash exists')
        setIsVerified(true)
        setHash(data?.hash as any)
        // const domain = await blind?.get(address as any)
        // console.log(domain)
        // setDomain(domain as string)
      }
    }

    // console.log('🚀 ~ data', data)
    // res.status(200).json({ hash: data.hash })

    // const res = await fetch('http://localhost:3000/api/contract', {
    //   method: 'POST',
    //   body: JSON.stringify({ proof, publicSignals })
    // }).then(res => {
    //   setIsVerifying(false)
    //   return res.json()
    // })
    // if (res.hash) {
    //   setIsVerified(true)
    //   setHash(res.hash)
    // }
  }, [blind, proof, publicSignals])

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true)
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
    console.log('🚀 ~ handleGenerate ~ splitToken', splitToken)
    const inputs = await generate_inputs(
      splitToken[2],
      splitToken[0] + '.' + splitToken[1],
      address
    )
    console.log('🚀 ~ handleGenerate ~ inputs', inputs)
    worker.postMessage([inputs, zkeyFastFile])
    worker.onmessage = async function (e) {
      const { proof, publicSignals } = e.data
      console.log('PROOF SUCCESSFULLY GENERATED: ', proof)
      setIsGenerated(true)
      setIsGenerating(false)
      setProof(proof)
      setPublicSignals(publicSignals)
    }
  }, [address, token])

  const handleLogin = async () => {
    // Generate proofs and public inputs
    setIsGenerating(true)
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
    console.log('🚀 ~ handleGenerate ~ splitToken', splitToken)
    const inputs = await generate_inputs(
      splitToken[2],
      splitToken[0] + '.' + splitToken[1],
      address
    )
    console.log('🚀 ~ handleGenerate ~ inputs', inputs)
    worker.postMessage([inputs, zkeyFastFile])
    worker.onmessage = async function (e) {
      const { proof, publicSignals } = e.data
      console.log('PROOF SUCCESSFULLY GENERATED: ', proof)

      setProof(proof)
      setPublicSignals(publicSignals)
      // Verify proofs
      setIsVerifying(true)
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
        const data = await blind
          ?.add(a as any, b as any, c as any, inputs, {
            gasLimit: 2000000 as any
          })
          .then(res => {
            setIsVerifying(false)
            return res
          })
        console.log('🚀 ~ data', data)
        if (data?.hash) {
          console.log('hash exists')
          setHash(data?.hash as any)
        }

        // setIsVerified(true)
        // setIsGenerated(true)
        // setIsGenerating(false)
      }
    }
  }

  return (
    <>
      <Head>
        <title>nozee</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {isVerified && <Confetti width={width} height={height} />}
        <Heading className={font.className} textAlign="center">
          Sign in
        </Heading>
        <Spacer />
        <Flex
          margin="0 auto"
          flexDirection="row"
          // gap="6"
          justifyContent="space-evenly"
          // minW="100%"
          // width="100%"
          width="1200px"
        >
          <Flex
            direction="column"
            gap="4"
            borderRadius="10"
            justifyContent="center"
          >
            <Spacer />
            <ConnectButton />
            <Textarea
              value={token}
              onChange={e => setToken(e.target.value)}
              size="lg"
              placeholder="Paste your JWT here"
              _placeholder={{ color: '#992870' }}
            />
            <Button
              // onClick={handleGenerate}
              variant="solid"
              isLoading={isGenerating}
              loadingText="Generating"
              isDisabled={isGenerated}
            >
              Download extension
            </Button>
            {!isDownloaded ? (
              <Flex gap="4">
                <Text>Downloading .zkey</Text>
                <Spinner />
              </Flex>
            ) : null}
            <Button
              onClick={handleLogin}
              variant="solid"
              // isLoading={isGenerating}
              // loadingText="Generating"
              // isDisabled={isGenerated}
            >
              Login
            </Button>
            {isGenerated && isVerified && (
              <>
                <p>Authenticated with domain: {domain}</p>
                <Button
                  className={font.className}
                  rightIcon={<ArrowForwardIcon />}
                  onClick={() => router.push('/')}
                >
                  nozee
                </Button>
              </>
            )}
          </Flex>
          <Flex
            direction="column"
            // alignItems="center"
            // padding="8"
            gap="4"
            borderRadius="10"
            justifyContent="center"
          >
            <Accordion maxW="300px">
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box as="span" flex="1" textAlign="left">
                      1. Download JWT extension
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  {`a) “Manage Extensions —> Switch on Develop Mode in upper-right corner”`}

                  {`b) “Press load unpacked —> select JWT Extension file from downloads”`}
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box as="span" flex="1" textAlign="left">
                      Grab JWT from OpenAI ChatGPT
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  *before*: “Before you go, make sure you are signed into OpenAI
                  with your work email. Open your developer tools and select
                  “JWT”. You might have to refresh or send a prompt to activate
                  your JWT. Press ‘Go to ZK Blind’ button to login.”
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box as="span" flex="1" textAlign="left">
                      Download zkeys
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  *before*: “Before you go, make sure you are signed into OpenAI
                  with your work email. Open your developer tools and select
                  “JWT”. You might have to refresh or send a prompt to activate
                  your JWT. Press ‘Go to ZK Blind’ button to login.”
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Flex>
        </Flex>
      </main>
    </>
  )
}
