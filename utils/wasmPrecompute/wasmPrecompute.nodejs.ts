import {
  getPointPreComputes as _getPointPreComputes,
  PublicSignatureData,
  getSigPublicSignals as _getSigPublicSignals,
} from "./wasmPrecompute.common";
import { PointPreComputes } from "../../types/zk";
import initWasm from "../wasm/nodejs/getPrecomputesHelpers";
import { compute_powers } from "../wasm/nodejs/getPrecomputesHelpers";

export async function getSigPublicSignals({
  r,
  isRYOdd,
  eip712Value,
}: PublicSignatureData) {
  return _getSigPublicSignals(
    {
      r,
      isRYOdd,
      eip712Value,
      initWasm,
      compute_powers,
    },
    false
  );
}

export async function getPointPreComputes(
  pointHex: string
): Promise<PointPreComputes> {
  return _getPointPreComputes(pointHex, initWasm, compute_powers);
}
