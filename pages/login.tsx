import { ArrowForwardIcon } from '@chakra-ui/icons'
import { Button, Container, Flex, Textarea, useToast } from '@chakra-ui/react'
import { Silkscreen } from '@next/font/google'
import { ConnectButton } from '@rainbow-me/rainbowkit'
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

const font = Silkscreen({ subsets: ['latin'], weight: '400' })

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
  }, [proof, publicSignals])

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

  console.log(hash)
  console.log(!!hash)

  return (
    <>
      <Head>
        <title>zk blind</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {isVerified && <Confetti width={width} height={height} />}
        <Container
          as={Flex}
          centerContent
          gap="6"
          justifyContent="center"
          minH="100vh"
        >
          <Flex
            direction="column"
            alignItems="center"
            backgroundColor="#241520"
            padding="8"
            gap="4"
            borderRadius="10"
          >
            <ConnectButton />
            <Textarea
              value={token}
              onChange={e => setToken(e.target.value)}
              size="lg"
              placeholder="Paste your JWT here"
              _placeholder={{ color: '#992870' }}
            />
            <Button
              backgroundColor="#992870"
              onClick={handleGenerate}
              variant="solid"
              isLoading={isGenerating}
              loadingText="Generating"
              isDisabled={isGenerated}
            >
              {isGenerated ? 'Generated' : 'Generate Proof and Inputs'}
            </Button>
            <Textarea
              value={!!proof ? JSON.stringify(proof) : ''}
              size="lg"
              placeholder="Waiting for proof generation"
              _placeholder={{ color: '#992870' }}
            />
            <Textarea
              value={publicSignals.toString()}
              size="lg"
              placeholder="Waiting for public input generation"
              _placeholder={{ color: '#992870' }}
            />
            <Button
              backgroundColor="#992870"
              //   onClick={handleVerify}
              onClick={handleVerifyContract}
              variant="solid"
              isLoading={isVerifying}
              loadingText="Verifying"
              //   isDisabled={!isGenerated || isVerified}
            >
              Verify
            </Button>
            {isGenerated && isVerified && (
              <>
                <p>{isGenerated && isVerified && 'Proof and Inputs Valid!'}</p>
                <p>
                  {isGenerated &&
                    isVerified &&
                    `Proved you belong domain: ${domainStr}`}
                </p>
                <Button
                  className={font.className}
                  rightIcon={<ArrowForwardIcon />}
                  onClick={() => router.push('/')}
                >
                  ZKBlind
                </Button>
              </>
            )}
          </Flex>
        </Container>
      </main>
    </>
  )
}
