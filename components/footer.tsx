import { Box } from "@chakra-ui/react"
import { Silkscreen } from '@next/font/google'

const font = Silkscreen({ subsets: ['latin'], weight: '400' })
export const Footer = () => {

    return (
        <Box 
        position='fixed'
        bottom='0'
        bg='black' 
        w='100%' 
        p={8} 
        color='white'
        className={font.className}
        textAlign='center'
        >
        ZK-blind
        <>
        </>
    </Box>
    )
}
