import axios from 'axios'
import localforage from 'localforage'
import { createContext, useContext, useEffect, useRef, useState } from 'react'

type Status = 'not downloaded' | 'downloading' | 'downloaded' | 'error'

interface AppContextValue {
  downloadStatus: Status
  downloadProgress?: number
}

const AppContext = createContext<AppContextValue | undefined>(undefined)

function AppProvider({ children }: { children?: React.ReactNode }) {
  const [downloadStatus, setDownloadStatus] = useState<Status>('not downloaded')
  const [downloadProgress, setDownloadProgress] = useState<number>(0)
  const first = useRef(true)
  useEffect(() => {
    const fetchZkey = async () => {
      if (!first.current) return
      first.current = false
      await localforage
        .getItem('jwt_single-real.zkey')
        .then(res => {
          if (res) {
            console.log('zkey already exists')
            setDownloadStatus('downloaded')
          } else {
            setDownloadStatus('downloading')
            return axios.get(
              'https://zkjwt-zkey-chunks.s3.amazonaws.com/jwt_single-real.zkey',
              {
                responseType: 'arraybuffer',
                onDownloadProgress: progressEvent => {
                  const percentage = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total!
                  )
                  setDownloadProgress(percentage)
                }
              }
            )
          }
        })
        .then(res => {
          if (!res) return
          localforage.setItem('jwt_single-real.zkey', res.data).then(res => {
            setDownloadStatus('downloaded')
          })
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
