import axios from 'axios'
import localforage from 'localforage'
import pako from 'pako'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { downloadFile } from '../utils/firebase'

type Status = 'not downloaded' | 'downloading' | 'downloaded' | 'error'

interface AppContextValue {
  downloadStatus: Status
  downloadProgress?: number
}

const AppContext = createContext<AppContextValue | undefined>(undefined)

const uncompressedZkey =
  'https://zkjwt-zkey-chunks.s3.amazonaws.com/jwt_single-real.zkey'
const isCompressed = true
const localKey = 'jwt_single-real.zkey'

function AppProvider({ children }: { children?: React.ReactNode }) {
  const [downloadStatus, setDownloadStatus] = useState<Status>('not downloaded')
  const [downloadProgress, setDownloadProgress] = useState<number>(0)
  const first = useRef(true)
  useEffect(() => {
    const fetchZkey = async () => {
      if (!first.current) return
      first.current = false
      // change this to s3 bucket
      // const compressedZkey = await downloadFile('jwt_single-real.zkey.gz')
      await localforage
        .getItem(localKey)
        .then(res => {
          if (res) {
            console.log('🚀 ~ fetchZkey ~ res:', res)
            console.log('zkey already exists')
            setDownloadStatus('downloaded')
            return
          } else {
            console.log('bad')
            setDownloadStatus('downloading')
            return axios.get(isCompressed ? compressedZkey : uncompressedZkey, {
              responseType: 'arraybuffer',
              onDownloadProgress: progressEvent => {
                const percentage = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total!
                )
                setDownloadProgress(percentage)
              }
            })
          }
        })
        .then(res => {
          if (!res) return
          if (isCompressed) {
            const arrayBuffer = new Uint8Array(res.data)
            const output = pako.ungzip(arrayBuffer)
            const buff = output.buffer
            localforage.setItem(localKey, buff)
          } else {
            localforage.setItem(localKey, res.data)
          }
          setDownloadStatus('downloaded')
        })
    }
    fetchZkey()
  }, [])

  return (
    <AppContext.Provider
      value={{
        downloadProgress,
        downloadStatus
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within a AppProvider')
  }
  return context
}

export { AppProvider, useApp }
