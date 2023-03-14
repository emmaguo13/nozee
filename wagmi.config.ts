import { defineConfig } from '@wagmi/cli'
import { abi } from './constants'
import { react } from '@wagmi/cli/plugins'

export default defineConfig({
  out: 'generated.ts',
  contracts: [
    {
      name: 'Blind',
      abi
    }
  ],
  plugins: [react()]
})
