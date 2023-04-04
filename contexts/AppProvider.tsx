import axios from 'axios'
import localforage from 'localforage'
import pako from 'pako'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import {
  compressedZkey,
  isCompressed,
  localZkeyKey,
  uncompressedZkey
} from '../constants'

export enum Status {
  NOT_DOWNLOADED = 'Not downloaded',
  DOWNLOADING = 'Downloading',
  DOWNLOADED = 'Downloaded',
  ERROR = 'Error'
}

interface AppContextValue {
  downloadStatus: Status
  downloadProgress?: number
  zkey: ArrayBuffer | undefined
}

const AppContext = createContext<AppContextValue | undefined>(undefined)

function AppProvider({ children }: { children?: React.ReactNode }) {
  const [downloadStatus, setDownloadStatus] = useState<Status>(
    Status.NOT_DOWNLOADED
  )
  const [downloadProgress, setDownloadProgress] = useState<number>(0)
  const [zkey, setZkey] = useState<ArrayBuffer>()
  const first = useRef(true)

  const fetchZkey = async () => {
    if (!first.current) return
    first.current = false
    await localforage.getItem(localZkeyKey).then(res => {
      if (res) {
        // zkey exists in localstorage
        console.log('zkey already exists')
        setDownloadStatus(Status.DOWNLOADED)
        return
      } else {
        // zkey does not exist in localstorage and needs to be downloaded
        setDownloadStatus(Status.DOWNLOADING)
        return axios
          .get(isCompressed ? compressedZkey : uncompressedZkey, {
            responseType: 'arraybuffer',
            onDownloadProgress: progressEvent => {
              const percentage = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total!
              )
              setDownloadProgress(percentage)
            }
          })
          .then(res => {
            // if zkey is compressed, uncompress it and store it in localstorage, otherwise just store it
            if (isCompressed) {
              const arrayBuffer = new Uint8Array(res.data)
              const output = pako.ungzip(arrayBuffer)
              const buff = output.buffer
              localforage.setItem(localZkeyKey, buff)
              setZkey(new Uint8Array(buff))
            } else {
              localforage.setItem(localZkeyKey, res.data)
              setZkey(new Uint8Array(res.data))
            }
            setDownloadStatus(Status.DOWNLOADED)
          })
      }
    })
  }

  useEffect(() => {
    fetchZkey()
  }, [])

  // fetch zkey from localstorage if it exists
  useEffect(() => {
    if (zkey || downloadStatus > Status.DOWNLOADING) return
    const fetchZkey = async () => {
      await localforage.getItem(localZkeyKey).then(res => {
        const zkey = new Uint8Array(res as any)
        setZkey(zkey)
      })
    }
    fetchZkey()
  }, [downloadStatus, zkey])

  return (
    <AppContext.Provider
      value={{
        downloadProgress,
        downloadStatus,
        zkey
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
