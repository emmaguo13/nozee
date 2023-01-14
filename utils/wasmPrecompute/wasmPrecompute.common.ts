import BN from "bn.js";

import { PointPreComputes } from "../../types/zk";
import { SECP256K1_N } from "../config";
import { splitToRegisters, EIP712Value, eip712MsgHash } from "../utils";

const elliptic = require("elliptic");
const ec = new elliptic.ec("secp256k1");
export const getPointPreComputes = async (
  pointHex: string,
  initWasm: any,
  compute_powers: any,
  isClient: boolean = true
): Promise<PointPreComputes> => {
  if (isClient) {
    await initWasm();
  }

  const result = compute_powers(pointHex);
  const preComputes: PointPreComputes = JSON.parse(result).powers.map(
    (limbs: any) =>
      limbs.map((coordinates: any) =>
        coordinates.map((registers: any) =>
          registers.map((register: any) => BigInt(register))
        )
      )
  );

  return preComputes;
};

// NOTE: data from which signature public signals are generated
export interface PublicSignatureData {
  r: string;
  isRYOdd: number;
  eip712Value: EIP712Value;
  initWasm?: any;
  compute_powers?: any;
}

export async function getSigPublicSignals(
  { r, isRYOdd, eip712Value, initWasm, compute_powers }: PublicSignatureData,
  isClient: boolean = true
) {
  const rPoint = ec.keyFromPublic(
    ec.curve.pointFromX(new BN(r.substring(2), 16), isRYOdd).encode("hex"),
    "hex"
  );
  // Get the group element: -(m * r^−1 * G)
  const rInv = new BN(r.substring(2), 16).invm(SECP256K1_N);

  // w = -(r^-1 * msg)
  const w = rInv
    .mul(new BN(eip712MsgHash(eip712Value).substring(2), 16))
    .neg()
    .umod(SECP256K1_N);
  // U = -(w * G) = -(r^-1 * msg * G)
  const U = ec.curve.g.mul(w);

  // T = r^-1 * R
  const T = rPoint.getPublic().mul(rInv);
  const TPreComputes = await getPointPreComputes(
    T.encode("hex"),
    initWasm,
    compute_powers,
    isClient
  );

  return {
    TPreComputes,
    U: [splitToRegisters(U.x) as bigint[], splitToRegisters(U.y) as bigint[]],
  };
}
