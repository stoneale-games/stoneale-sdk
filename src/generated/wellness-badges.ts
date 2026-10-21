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
    contractId: "CBXEHWTFJDNWZNZESWLE67EODOBKSJG333F6ECPARPBXAV476J26RCOZ",
  }
} as const


export interface Badge {
  badge_type: u32;
  minted_at: u64;
  owner: string;
}

export const Errors = {
  1: {message:"NotMinter"},
  2: {message:"AlreadyHasBadge"},
  3: {message:"NotFound"},
  4: {message:"NotOwner"}
}




export interface Client {
  /**
   * Construct and simulate a burn transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Permanently delete one of your own badges.
   */
  burn: ({owner, token_id}: {owner: string, token_id: u32}, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a mint transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Issue a badge of `badge_type` to `to`. Returns the new token id.
   */
  mint: ({minter, to, badge_type}: {minter: string, to: string, badge_type: u32}, options?: MethodOptions) => Promise<AssembledTransaction<Result<u32>>>

  /**
   * Construct and simulate a name transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  name: (options?: MethodOptions) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  admin: (options?: MethodOptions) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a badge transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  badge: ({token_id}: {token_id: u32}, options?: MethodOptions) => Promise<AssembledTransaction<Result<Badge>>>

  /**
   * Construct and simulate a symbol transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  symbol: (options?: MethodOptions) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a balance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  balance: ({owner}: {owner: string}, options?: MethodOptions) => Promise<AssembledTransaction<u32>>

  /**
   * Construct and simulate a upgrade transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  upgrade: ({wasm_hash}: {wasm_hash: Buffer}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a base_uri transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Metadata lives at `{base_uri}{badge_type}.json`.
   */
  base_uri: (options?: MethodOptions) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a owner_of transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  owner_of: ({token_id}: {token_id: u32}, options?: MethodOptions) => Promise<AssembledTransaction<Result<string>>>

  /**
   * Construct and simulate a badges_of transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  badges_of: ({owner}: {owner: string}, options?: MethodOptions) => Promise<AssembledTransaction<Array<u32>>>

  /**
   * Construct and simulate a has_badge transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  has_badge: ({owner, badge_type}: {owner: string, badge_type: u32}, options?: MethodOptions) => Promise<AssembledTransaction<boolean>>

  /**
   * Construct and simulate a is_minter transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  is_minter: ({minter}: {minter: string}, options?: MethodOptions) => Promise<AssembledTransaction<boolean>>

  /**
   * Construct and simulate a set_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_admin: ({admin}: {admin: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a set_minter transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_minter: ({minter, enabled}: {minter: string, enabled: boolean}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a set_base_uri transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_base_uri: ({base_uri}: {base_uri: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
        /** Constructor/Initialization Args for the contract's `__constructor` method */
        {admin, name, symbol, base_uri}: {admin: string, name: string, symbol: string, base_uri: string},
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
    return ContractClient.deploy({admin, name, symbol, base_uri}, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAQAAAAAAAAAAAAAABUJhZGdlAAAAAAAAAwAAAAAAAAAKYmFkZ2VfdHlwZQAAAAAABAAAAAAAAAAJbWludGVkX2F0AAAAAAAABgAAAAAAAAAFb3duZXIAAAAAAAAT",
        "AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAABAAAAAAAAAAJTm90TWludGVyAAAAAAAAAQAAAAAAAAAPQWxyZWFkeUhhc0JhZGdlAAAAAAIAAAAAAAAACE5vdEZvdW5kAAAAAwAAAAAAAAAITm90T3duZXIAAAAE",
        "AAAABQAAAAAAAAAAAAAABkJ1cm5lZAAAAAAAAQAAAAZidXJuZWQAAAAAAAIAAAAAAAAABW93bmVyAAAAAAAAEwAAAAEAAAAAAAAACHRva2VuX2lkAAAABAAAAAAAAAAC",
        "AAAABQAAAAAAAAAAAAAABk1pbnRlZAAAAAAAAQAAAAZtaW50ZWQAAAAAAAMAAAAAAAAAAnRvAAAAAAATAAAAAQAAAAAAAAAKYmFkZ2VfdHlwZQAAAAAABAAAAAEAAAAAAAAACHRva2VuX2lkAAAABAAAAAAAAAAC",
        "AAAABQAAAAAAAAAAAAAACU1pbnRlclNldAAAAAAAAAEAAAAKbWludGVyX3NldAAAAAAAAgAAAAAAAAAGbWludGVyAAAAAAATAAAAAQAAAAAAAAAHZW5hYmxlZAAAAAABAAAAAAAAAAI=",
        "AAAAAAAAACpQZXJtYW5lbnRseSBkZWxldGUgb25lIG9mIHlvdXIgb3duIGJhZGdlcy4AAAAAAARidXJuAAAAAgAAAAAAAAAFb3duZXIAAAAAAAATAAAAAAAAAAh0b2tlbl9pZAAAAAQAAAABAAAD6QAAAAIAAAAD",
        "AAAAAAAAAEBJc3N1ZSBhIGJhZGdlIG9mIGBiYWRnZV90eXBlYCB0byBgdG9gLiBSZXR1cm5zIHRoZSBuZXcgdG9rZW4gaWQuAAAABG1pbnQAAAADAAAAAAAAAAZtaW50ZXIAAAAAABMAAAAAAAAAAnRvAAAAAAATAAAAAAAAAApiYWRnZV90eXBlAAAAAAAEAAAAAQAAA+kAAAAEAAAAAw==",
        "AAAAAAAAAAAAAAAEbmFtZQAAAAAAAAABAAAAEA==",
        "AAAAAAAAAAAAAAAFYWRtaW4AAAAAAAAAAAAAAQAAABM=",
        "AAAAAAAAAAAAAAAFYmFkZ2UAAAAAAAABAAAAAAAAAAh0b2tlbl9pZAAAAAQAAAABAAAD6QAAB9AAAAAFQmFkZ2UAAAAAAAAD",
        "AAAAAAAAAAAAAAAGc3ltYm9sAAAAAAAAAAAAAQAAABA=",
        "AAAAAAAAAAAAAAAHYmFsYW5jZQAAAAABAAAAAAAAAAVvd25lcgAAAAAAABMAAAABAAAABA==",
        "AAAAAAAAAAAAAAAHdXBncmFkZQAAAAABAAAAAAAAAAl3YXNtX2hhc2gAAAAAAAPuAAAAIAAAAAA=",
        "AAAAAAAAADBNZXRhZGF0YSBsaXZlcyBhdCBge2Jhc2VfdXJpfXtiYWRnZV90eXBlfS5qc29uYC4AAAAIYmFzZV91cmkAAAAAAAAAAQAAABA=",
        "AAAAAAAAAAAAAAAIb3duZXJfb2YAAAABAAAAAAAAAAh0b2tlbl9pZAAAAAQAAAABAAAD6QAAABMAAAAD",
        "AAAAAAAAAAAAAAAJYmFkZ2VzX29mAAAAAAAAAQAAAAAAAAAFb3duZXIAAAAAAAATAAAAAQAAA+oAAAAE",
        "AAAAAAAAAAAAAAAJaGFzX2JhZGdlAAAAAAAAAgAAAAAAAAAFb3duZXIAAAAAAAATAAAAAAAAAApiYWRnZV90eXBlAAAAAAAEAAAAAQAAAAE=",
        "AAAAAAAAAAAAAAAJaXNfbWludGVyAAAAAAAAAQAAAAAAAAAGbWludGVyAAAAAAATAAAAAQAAAAE=",
        "AAAAAAAAAAAAAAAJc2V0X2FkbWluAAAAAAAAAQAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAA==",
        "AAAAAAAAAAAAAAAKc2V0X21pbnRlcgAAAAAAAgAAAAAAAAAGbWludGVyAAAAAAATAAAAAAAAAAdlbmFibGVkAAAAAAEAAAAA",
        "AAAAAAAAAAAAAAAMc2V0X2Jhc2VfdXJpAAAAAQAAAAAAAAAIYmFzZV91cmkAAAAQAAAAAA==",
        "AAAAAAAAAAAAAAANX19jb25zdHJ1Y3RvcgAAAAAAAAQAAAAAAAAABWFkbWluAAAAAAAAEwAAAAAAAAAEbmFtZQAAABAAAAAAAAAABnN5bWJvbAAAAAAAEAAAAAAAAAAIYmFzZV91cmkAAAAQAAAAAA==" ]),
      options
    )
  }
  public readonly fromJSON = {
    burn: this.txFromJSON<Result<void>>,
        mint: this.txFromJSON<Result<u32>>,
        name: this.txFromJSON<string>,
        admin: this.txFromJSON<string>,
        badge: this.txFromJSON<Result<Badge>>,
        symbol: this.txFromJSON<string>,
        balance: this.txFromJSON<u32>,
        upgrade: this.txFromJSON<null>,
        base_uri: this.txFromJSON<string>,
        owner_of: this.txFromJSON<Result<string>>,
        badges_of: this.txFromJSON<Array<u32>>,
        has_badge: this.txFromJSON<boolean>,
        is_minter: this.txFromJSON<boolean>,
        set_admin: this.txFromJSON<null>,
        set_minter: this.txFromJSON<null>,
        set_base_uri: this.txFromJSON<null>
  }
}