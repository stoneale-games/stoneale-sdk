import { Buffer } from "buffer";
import { Address } from "@stellar/stellar-sdk";
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from "@stellar/stellar-sdk/contract";
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Timepoint,
  Duration,
} from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";

if (typeof window !== "undefined") {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CB5CGHND7BPEJZBUKN4AO3UHNHXGG2U2OJ6ASWERKMMW54KIUKXOC6QC",
  }
} as const

export const Errors = {
  1: {message:"InvalidAmount"},
  2: {message:"AlreadyClaimed"},
  3: {message:"DailyCapExceeded"}
}


export interface Config {
  admin: string;
  daily_cap: i128;
  reporter: string;
  token: string;
}



export interface Client {
  /**
   * Construct and simulate a award transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Mint `amount` STONE to `player` for completing `achievement`.
   * Each achievement can only be rewarded once per player.
   */
  award: ({player, achievement, amount}: {player: string, achievement: string, amount: i128}, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a config transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  config: (options?: MethodOptions) => Promise<AssembledTransaction<Config>>

  /**
   * Construct and simulate a upgrade transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  upgrade: ({wasm_hash}: {wasm_hash: Buffer}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a set_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_admin: ({admin}: {admin: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a is_claimed transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  is_claimed: ({player, achievement}: {player: string, achievement: string}, options?: MethodOptions) => Promise<AssembledTransaction<boolean>>

  /**
   * Construct and simulate a earned_today transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * STONE earned during the current UTC day.
   */
  earned_today: ({player}: {player: string}, options?: MethodOptions) => Promise<AssembledTransaction<i128>>

  /**
   * Construct and simulate a set_reporter transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_reporter: ({reporter}: {reporter: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a total_earned transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Lifetime STONE earned through this contract.
   */
  total_earned: ({player}: {player: string}, options?: MethodOptions) => Promise<AssembledTransaction<i128>>

  /**
   * Construct and simulate a set_daily_cap transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_daily_cap: ({daily_cap}: {daily_cap: i128}, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a release_token_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Hand STONE's SAC admin role to `new_admin` (e.g. when migrating to a
   * new rewards contract). After this call `award` can no longer mint.
   */
  release_token_admin: ({new_admin}: {new_admin: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
        /** Constructor/Initialization Args for the contract's `__constructor` method */
        {admin, reporter, token, daily_cap}: {admin: string, reporter: string, token: string, daily_cap: i128},
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy({admin, reporter, token, daily_cap}, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAAAwAAAAAAAAANSW52YWxpZEFtb3VudAAAAAAAAAEAAAAAAAAADkFscmVhZHlDbGFpbWVkAAAAAAACAAAAAAAAABBEYWlseUNhcEV4Y2VlZGVkAAAAAw==",
        "AAAAAQAAAAAAAAAAAAAABkNvbmZpZwAAAAAABAAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAAlkYWlseV9jYXAAAAAAAAALAAAAAAAAAAhyZXBvcnRlcgAAABMAAAAAAAAABXRva2VuAAAAAAAAEw==",
        "AAAABQAAAAAAAAAAAAAAB0F3YXJkZWQAAAAAAQAAAAdhd2FyZGVkAAAAAAMAAAAAAAAABnBsYXllcgAAAAAAEwAAAAEAAAAAAAAAC2FjaGlldmVtZW50AAAAABEAAAABAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAAAg==",
        "AAAABQAAAAAAAAAAAAAADUNvbmZpZ1VwZGF0ZWQAAAAAAAABAAAADmNvbmZpZ191cGRhdGVkAAAAAAABAAAAAAAAAAZjb25maWcAAAAAB9AAAAAGQ29uZmlnAAAAAAAAAAAAAg==",
        "AAAAAAAAAHRNaW50IGBhbW91bnRgIFNUT05FIHRvIGBwbGF5ZXJgIGZvciBjb21wbGV0aW5nIGBhY2hpZXZlbWVudGAuCkVhY2ggYWNoaWV2ZW1lbnQgY2FuIG9ubHkgYmUgcmV3YXJkZWQgb25jZSBwZXIgcGxheWVyLgAAAAVhd2FyZAAAAAAAAAMAAAAAAAAABnBsYXllcgAAAAAAEwAAAAAAAAALYWNoaWV2ZW1lbnQAAAAAEQAAAAAAAAAGYW1vdW50AAAAAAALAAAAAQAAA+kAAAACAAAAAw==",
        "AAAAAAAAAAAAAAAGY29uZmlnAAAAAAAAAAAAAQAAB9AAAAAGQ29uZmlnAAA=",
        "AAAAAAAAAAAAAAAHdXBncmFkZQAAAAABAAAAAAAAAAl3YXNtX2hhc2gAAAAAAAPuAAAAIAAAAAA=",
        "AAAAAAAAAAAAAAAJc2V0X2FkbWluAAAAAAAAAQAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAA==",
        "AAAAAAAAAAAAAAAKaXNfY2xhaW1lZAAAAAAAAgAAAAAAAAAGcGxheWVyAAAAAAATAAAAAAAAAAthY2hpZXZlbWVudAAAAAARAAAAAQAAAAE=",
        "AAAAAAAAAChTVE9ORSBlYXJuZWQgZHVyaW5nIHRoZSBjdXJyZW50IFVUQyBkYXkuAAAADGVhcm5lZF90b2RheQAAAAEAAAAAAAAABnBsYXllcgAAAAAAEwAAAAEAAAAL",
        "AAAAAAAAAAAAAAAMc2V0X3JlcG9ydGVyAAAAAQAAAAAAAAAIcmVwb3J0ZXIAAAATAAAAAA==",
        "AAAAAAAAACxMaWZldGltZSBTVE9ORSBlYXJuZWQgdGhyb3VnaCB0aGlzIGNvbnRyYWN0LgAAAAx0b3RhbF9lYXJuZWQAAAABAAAAAAAAAAZwbGF5ZXIAAAAAABMAAAABAAAACw==",
        "AAAAAAAAATwqIGBhZG1pbmAgLSBjYW4gcm90YXRlIHRoZSByZXBvcnRlciwgY2hhbmdlIHRoZSBjYXAgYW5kIHVwZ3JhZGUuCiogYHJlcG9ydGVyYCAtIGdhbWUgc2VydmVyIGtleSB0aGF0IHNpZ25zIGV2ZXJ5IGBhd2FyZGAuCiogYHRva2VuYCAtIGFkZHJlc3Mgb2YgdGhlIFNUT05FIFN0ZWxsYXIgQXNzZXQgQ29udHJhY3QuIFRoaXMKY29udHJhY3QgbXVzdCBiZSBtYWRlIHRoZSBTQUMgYWRtaW4gYmVmb3JlIGBhd2FyZGAgY2FuIG1pbnQuCiogYGRhaWx5X2NhcGAgLSBtYXggU1RPTkUgKGluIHN0cm9vcHMpIG9uZSBwbGF5ZXIgY2FuIGVhcm4gcGVyIFVUQyBkYXkuAAAADV9fY29uc3RydWN0b3IAAAAAAAAEAAAAAAAAAAVhZG1pbgAAAAAAABMAAAAAAAAACHJlcG9ydGVyAAAAEwAAAAAAAAAFdG9rZW4AAAAAAAATAAAAAAAAAAlkYWlseV9jYXAAAAAAAAALAAAAAA==",
        "AAAAAAAAAAAAAAANc2V0X2RhaWx5X2NhcAAAAAAAAAEAAAAAAAAACWRhaWx5X2NhcAAAAAAAAAsAAAABAAAD6QAAAAIAAAAD",
        "AAAAAAAAAIdIYW5kIFNUT05FJ3MgU0FDIGFkbWluIHJvbGUgdG8gYG5ld19hZG1pbmAgKGUuZy4gd2hlbiBtaWdyYXRpbmcgdG8gYQpuZXcgcmV3YXJkcyBjb250cmFjdCkuIEFmdGVyIHRoaXMgY2FsbCBgYXdhcmRgIGNhbiBubyBsb25nZXIgbWludC4AAAAAE3JlbGVhc2VfdG9rZW5fYWRtaW4AAAAAAQAAAAAAAAAJbmV3X2FkbWluAAAAAAAAEwAAAAA=" ]),
      options
    )
  }
  public readonly fromJSON = {
    award: this.txFromJSON<Result<void>>,
        config: this.txFromJSON<Config>,
        upgrade: this.txFromJSON<null>,
        set_admin: this.txFromJSON<null>,
        is_claimed: this.txFromJSON<boolean>,
        earned_today: this.txFromJSON<i128>,
        set_reporter: this.txFromJSON<null>,
        total_earned: this.txFromJSON<i128>,
        set_daily_cap: this.txFromJSON<Result<void>>,
        release_token_admin: this.txFromJSON<null>
  }
}