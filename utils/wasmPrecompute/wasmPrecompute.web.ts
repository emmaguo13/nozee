import {
  getPointPreComputes as _getPointPreComputes,
  getSigPublicSignals as _getSigPublicSignals,
  PublicSignatureData
} from "./wasmPrecompute.common";
import { PointPreComputes } from "../../types/zk";
import initWasm from "../wasm/web/getPrecomputesHelpers";
import { compute_powers } from "../wasm/web/getPrecomputesHelpers";

export async function getSigPublicSignals({
  r,
  isRYOdd,
  eip712Value
}: PublicSignatureData) {
  return _getSigPublicSignals({
    r,
    isRYOdd,
    eip712Value,
    initWasm,
    compute_powers
  });
}

export async function getPointPreComputes(
  pointHex: string
): Promise<PointPreComputes> {
  return _getPointPreComputes(pointHex, initWasm, compute_powers);
}
