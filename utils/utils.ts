import { _TypedDataEncoder } from "ethers/lib/utils";
import { GroupPayload, LeafPayload } from "../types/api";
import { REGISTERS } from "./config";
import { buildGroupPayload, createMerkleTree } from "./merkleTree";

import { Leaf } from "@prisma/client";
import { nounderAddresses } from "./nounders";

const addHexPrefix = (str: string) => `0x${str}`;

export const splitToRegisters = (value: any) => {
  const registers = [];

  if (!value) {
    return [0n, 0n, 0n, 0n];
  }

  const hex = value.toString(16).padStart(64, "0");
  for (let k = 0; k < REGISTERS; k++) {
    // 64bit = 16 chars in hex
    const val = hex.slice(k * 16, (k + 1) * 16);

    registers.unshift(BigInt(addHexPrefix(val)));
  }

  return registers.map((el) => el.toString());
};

export const registersToHex = (registers: any) => {
  return registers
    .map((el: any) => BigInt(el).toString(16).padStart(16, "0"))
    .join("");
};

export const prepareMerkleRootProof = (
  pathElements: any[],
  pathIndices: number[],
  pathRoot: any
) => {
  //@ts-ignore
  const strPathElements = pathElements.map((el: Element) => el.toString());
  //@ts-ignore
  const strPathIndices = pathIndices.map((el: Element) => el.toString());
  const strRoot = pathRoot.toString();
  return {
    pathElements: strPathElements,
    pathIndices: strPathIndices,
    root: strRoot,
  };
};

export function JSONStringifyCustom(val: any) {
  return JSON.stringify(
    val,
    (key, value) => (typeof value === "bigint" ? value.toString() : value) // return everything else unchanged
  );
}

// EIP-712 types for typed signature
// Not ideal that we have to define it twice but types of libraries are annoying
const DOMAIN = {
  name: "heyanoun-prop-150",
  version: "1",
  chainId: 1,
  verifyingContract: "0x0000000000000000000000000000000000000000",
};

const TYPES = {
  NounSignature: [
    { name: "propId", type: "string" },
    { name: "groupType", type: "string" },
    { name: "msgHash", type: "string" },
  ],
};

export type EIP712Value = {
  propId: string;
  groupType: string;
  msgHash: string;
};

export function eip712MsgHash(value: EIP712Value) {
  //@ts-ignore
  return _TypedDataEncoder.hash(DOMAIN, TYPES, value);
}

export function leafDataToAddress(data: string): string {
  return "0x" + BigInt(data).toString(16).padStart(40, "0");
}

// export async function buildNoundersGroupPayload(): Promise<GroupPayload> {
//   let noundersPayload = await buildGroupPayload(nounderAddresses, "nounders");
//   let json = JSON.stringify(noundersPayload, null, 2);
//   // TODO: store this in json somewhere for now
//   console.log(json);
//   return noundersPayload;
// }
