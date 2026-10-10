import { randomInt } from "node:crypto";

export const USDT_EVM_ADDRESS_DEFAULT = "0x24ed5adac799eff29f619d25d1d2074762fe4220";
export const USDT_PAYMENT_WINDOW_MS = 30 * 60 * 1000;

const TRANSFER_TOPIC = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";
const USDT_BEP20 = "0x55d398326f99059ff775485246999027b3197955";
const TOKEN_DECIMALS = BigInt(18);
const DISPLAY_DECIMALS = 6;
const BSC_RPCS = [
  "https://bsc.publicnode.com",
  "https://binance.llamarpc.com",
  "https://bsc-dataseed.binance.org",
];

export type UsdtCheckout = {
  network: string;
  token: string;
  address: string;
  payAmount: string;
  payUnits: string;
  expiresAt: string;
};

export function usdtReceiveAddress() {
  const configured =
    process.env.USDT_EVM_ADDRESS?.trim() || process.env.NEXT_PUBLIC_USDT_EVM_ADDRESS?.trim();
  return (configured || USDT_EVM_ADDRESS_DEFAULT).toLowerCase();
}

export function usdtNetworkLabel() {
  return "BNB Smart Chain (BEP-20)";
}

function unitsToDisplay(units: bigint) {
  const scale = BigInt(10) ** TOKEN_DECIMALS;
  const whole = units / scale;
  const fraction = (units % scale).toString().padStart(Number(TOKEN_DECIMALS), "0").slice(0, DISPLAY_DECIMALS);
  return `${whole.toString()}.${fraction}`;
}

export function buildUsdtCheckout(creditUsdt: number, takenUnits: Set<string>): UsdtCheckout {
  const base =
    BigInt(Math.round(creditUsdt * 1_000_000)) * BigInt(10) ** (TOKEN_DECIMALS - BigInt(DISPLAY_DECIMALS));
  let units = base;
  for (let attempt = 0; attempt < 30; attempt += 1) {
    const suffix = BigInt(randomInt(1, 10_000));
    const next = base + suffix * BigInt(10) ** (TOKEN_DECIMALS - BigInt(DISPLAY_DECIMALS));
    if (!takenUnits.has(next.toString())) {
      units = next;
      break;
    }
  }

  return {
    network: usdtNetworkLabel(),
    token: "USDT",
    address: usdtReceiveAddress(),
    payAmount: unitsToDisplay(units),
    payUnits: units.toString(),
    expiresAt: new Date(Date.now() + USDT_PAYMENT_WINDOW_MS).toISOString(),
  };
}

export function parseUsdtCheckout(metadata: string | null): UsdtCheckout | null {
  if (!metadata) return null;
  try {
    const data = JSON.parse(metadata) as Partial<UsdtCheckout>;
    if (!data.address || !data.payUnits || !data.payAmount || !data.expiresAt) return null;
    return {
      network: data.network || usdtNetworkLabel(),
      token: data.token || "USDT",
      address: data.address,
      payAmount: data.payAmount,
      payUnits: data.payUnits,
      expiresAt: data.expiresAt,
    };
  } catch {
    return null;
  }
}

type RpcLog = {
  transactionHash?: string;
  blockNumber?: string;
  data?: string;
  topics?: string[];
};

async function rpc<T>(method: string, params: unknown[]): Promise<T> {
  const endpoints = process.env.BSC_RPC_URL?.trim() ? [process.env.BSC_RPC_URL.trim()] : BSC_RPCS;
  let lastError = "Could not reach the USDT network";
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
        cache: "no-store",
      });
      const payload = (await response.json()) as { result?: T; error?: { message?: string } };
      if (!response.ok || payload.error || payload.result === undefined) {
        lastError = payload.error?.message || lastError;
        continue;
      }
      return payload.result;
    } catch (error) {
      lastError = error instanceof Error ? error.message : lastError;
    }
  }
  throw new Error(lastError);
}

function padAddress(address: string) {
  return `0x${address.toLowerCase().replace(/^0x/, "").padStart(64, "0")}`;
}

export async function findUsdtTransfer(input: {
  payUnits: string;
  address: string;
  createdAt: Date;
  expiresAt: Date;
}) {
  const latestHex = await rpc<string>("eth_blockNumber", []);
  const latest = BigInt(latestHex);
  const span = BigInt(2500);
  const from = latest > span ? latest - span : BigInt(0);
  const logs = await rpc<RpcLog[]>("eth_getLogs", [
    {
      address: USDT_BEP20,
      fromBlock: `0x${from.toString(16)}`,
      toBlock: "latest",
      topics: [TRANSFER_TOPIC, null, padAddress(input.address)],
    },
  ]);

  const expected = BigInt(input.payUnits);
  const start = input.createdAt.getTime() - 60_000;
  const end = input.expiresAt.getTime() + 120_000;

  for (const log of logs) {
    if (!log.transactionHash || !log.data || !log.blockNumber) continue;
    if (BigInt(log.data) !== expected) continue;
    const block = await rpc<{ timestamp?: string } | null>("eth_getBlockByNumber", [log.blockNumber, false]);
    const timestamp = block?.timestamp ? Number(BigInt(block.timestamp)) * 1000 : 0;
    if (timestamp < start || timestamp > end) continue;
    return { txHash: log.transactionHash.toLowerCase() };
  }

  return null;
}
