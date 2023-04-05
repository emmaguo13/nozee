export const uncompressedZkey =
  'https://zkjwt-zkey-chunks.s3.amazonaws.com/jwt_single-real.zkey'
export const compressedZkey =
  'https://zkjwt-zkey-chunks.s3.amazonaws.com/jwt_single-real.zkey.gz'
export const isCompressed = true
export const localZkeyKey = 'jwt.zkey'

export const openAiPubKey = [
  '1039819274958841503552777425237411969',
  '2393925418941457468536305535389088567',
  '513505235307821578406185944870803528',
  '31648688809132041103725691608565945',
  '1118227280248002501343932784260195348',
  '1460752189656646928843376724380610733',
  '2494690879775849992239868627264129920',
  '499770848099786006855805824914661444',
  '117952129670880907578696311220260862',
  '594599095806595023021313781486031656',
  '1954215709028388479536967672374066621',
  '275858127917207716435784616531223795',
  '2192832134592444363563023272016397664',
  '1951765503135207318741689711604628857',
  '679054217888353607009053133437382225',
  '831007028401303788228965296099949363',
  '4456647917934998006260668783660427'
]

export const contractAddress = '0xAD6aab5161C5DC3f20210b2e4B4d01196737F1EF'
export const abi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_verifier',
        type: 'address'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    inputs: [
      {
        internalType: 'uint256[2]',
        name: 'a',
        type: 'uint256[2]'
      },
      {
        internalType: 'uint256[2][2]',
        name: 'b',
        type: 'uint256[2][2]'
      },
      {
        internalType: 'uint256[2]',
        name: 'c',
        type: 'uint256[2]'
      },
      {
        internalType: 'uint256[48]',
        name: 'input',
        type: 'uint256[48]'
      }
    ],
    name: 'add',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    name: 'companies',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'addr',
        type: 'address'
      }
    ],
    name: 'get',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'verifier',
    outputs: [
      {
        internalType: 'contract Verifier',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
] as const
