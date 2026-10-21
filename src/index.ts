import { Asset, Keypair, contract } from "@stellar/stellar-sdk";
import * as Rewards from "./generated/stone-rewards.js";
import * as Badges from "./generated/wellness-badges.js";
import { NETWORKS, type NetworkConfig, type StoneNetwork } from "./networks.js";

export { NETWORKS, Rewards, Badges };
export type { NetworkConfig, StoneNetwork };

/** STONE uses 7 decimals like every Stellar asset: 1 STONE = 10^7 stroops. */
export const STONE_DECIMALS = 7;
const STROOPS_PER_STONE = 10n ** BigInt(STONE_DECIMALS);

/** "12.5" -> 125000000n. Rejects more than 7 decimals or non-numeric input. */
export function toStroops(amount: string | number): bigint {
    const text = String(amount).trim();
    const match = /^(\d+)(?:\.(\d{0,7}))?$/.exec(text);
    if (!match) {
        throw new Error(`Invalid STONE amount: "${text}"`);
    }
    const [, whole, frac = ""] = match;
    return BigInt(whole) * STROOPS_PER_STONE + BigInt(frac.padEnd(STONE_DECIMALS, "0"));
}

/** 125000000n -> "12.5" */
export function fromStroops(stroops: bigint): string {
    const sign = stroops < 0n ? "-" : "";
    const abs = stroops < 0n ? -stroops : stroops;
    const whole = abs / STROOPS_PER_STONE;
    const frac = (abs % STROOPS_PER_STONE).toString().padStart(STONE_DECIMALS, "0").replace(/0+$/, "");
    return `${sign}${whole}${frac ? `.${frac}` : ""}`;
}

/** The STONE classic asset (for trustlines and Horizon queries). */
export const stoneAsset = (network: StoneNetwork = "testnet") =>
    new Asset("STONE", NETWORKS[network].stoneIssuer);

export interface ClientOptions {
    network?: StoneNetwork;
    /** Signer's public key. Required only for state-changing calls. */
    publicKey?: string;
    /** Wallet signer, e.g. Freighter's signTransaction or contract.basicNodeSigner(...).signTransaction */
    signTransaction?: contract.ClientOptions["signTransaction"];
    /** Override the RPC URL. */
    rpcUrl?: string;
}

function baseOptions(contractId: string, opts: ClientOptions): contract.ClientOptions {
    const net = NETWORKS[opts.network ?? "testnet"];
    return {
        contractId,
        networkPassphrase: net.networkPassphrase,
        rpcUrl: opts.rpcUrl ?? net.rpcUrl,
        publicKey: opts.publicKey,
        signTransaction: opts.signTransaction,
    };
}

/** Typed client for the stone-rewards contract. */
export function rewardsClient(opts: ClientOptions = {}) {
    const net = NETWORKS[opts.network ?? "testnet"];
    return new Rewards.Client(baseOptions(net.rewardsContractId, opts));
}

/** Typed client for the wellness-badges contract. */
export function badgesClient(opts: ClientOptions = {}) {
    const net = NETWORKS[opts.network ?? "testnet"];
    return new Badges.Client(baseOptions(net.badgesContractId, opts));
}

/** Lifetime STONE (in stroops) a player has earned through stone-rewards. */
export async function getTotalEarned(player: string, opts: ClientOptions = {}): Promise<bigint> {
    const tx = await rewardsClient(opts).total_earned({ player });
    return BigInt(tx.result);
}

/** Whether `player` already claimed `achievement`. */
export async function isClaimed(player: string, achievement: string, opts: ClientOptions = {}): Promise<boolean> {
    const tx = await rewardsClient(opts).is_claimed({ player, achievement });
    return tx.result;
}

/** Token ids of the wellness badges owned by `owner`. */
export async function getBadges(owner: string, opts: ClientOptions = {}): Promise<number[]> {
    const tx = await badgesClient(opts).badges_of({ owner });
    return tx.result.map(Number);
}

export interface AwardParams {
    /** Reporter (game server) secret key: S... Keep it server-side only. */
    reporterSecret: string;
    player: string;
    /** Achievement id, a Soroban Symbol: up to 32 chars of [a-zA-Z0-9_]. */
    achievement: string;
    /** Amount in STONE, e.g. "5" or "0.25". */
    amount: string | number;
    network?: StoneNetwork;
    rpcUrl?: string;
}

/**
 * Server-side helper: mint STONE to a player for an achievement.
 * Simulates first, so contract errors (AlreadyClaimed, DailyCapExceeded, ...)
 * are thrown before anything is submitted. Returns the transaction hash.
 */
export async function awardStone(params: AwardParams): Promise<string> {
    if (!/^[a-zA-Z0-9_]{1,32}$/.test(params.achievement)) {
        throw new Error(`Invalid achievement id "${params.achievement}"`);
    }
    const net = NETWORKS[params.network ?? "testnet"];
    const keypair = Keypair.fromSecret(params.reporterSecret);
    const client = rewardsClient({
        network: params.network,
        rpcUrl: params.rpcUrl,
        publicKey: keypair.publicKey(),
        signTransaction: contract.basicNodeSigner(keypair, net.networkPassphrase).signTransaction,
    });

    const tx = await client.award({
        player: params.player,
        achievement: params.achievement,
        amount: toStroops(params.amount),
    });
    if (tx.result.isErr()) {
        throw new Error(`award failed: ${contractErrorName(tx.simulation, tx.result.unwrapErr())}`);
    }
    const sent = await tx.signAndSend();
    return sent.sendTransactionResponse?.hash ?? "";
}

/** Map "Error(Contract, #2)" in the simulation result to the contract's error name. */
function contractErrorName(simulation: object | undefined, err: { message?: string }): string {
    if (err.message) return err.message;
    const simError = simulation && "error" in simulation ? String(simulation.error) : "";
    const code = /Error\(Contract, #(\d+)\)/.exec(simError)?.[1];
    const errors = Rewards.Errors as Record<string, { message: string }>;
    return code ? errors[code]?.message ?? `contract error #${code}` : "unknown contract error";
}
