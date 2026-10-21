# @stoneale/sdk

**TypeScript SDK for [Stoneale](https://github.com/stoneale-games)'s Soroban smart contracts on Stellar.**

[![CI](https://github.com/stoneale-games/stoneale-sdk/actions/workflows/ci.yml/badge.svg)](https://github.com/stoneale-games/stoneale-sdk/actions/workflows/ci.yml)
[![Built on Stellar](https://img.shields.io/badge/built%20on-Stellar-7D00FF)](https://stellar.org)
[![License: Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)

Read and write Stoneale's on-chain wellness rewards from a browser, a game server or a script:

- **`stone-rewards`** mints **STONE**, a Stellar asset, to players for wellness achievements
- **`wellness-badges`** issues **soulbound** milestone badges

The typed clients are generated from the deployed contracts with `stellar contract bindings typescript`, and the SDK adds small helpers on top.

## Install

```bash
npm install github:stoneale-games/stoneale-sdk
```

## Read player progress (no wallet needed)

```ts
import { getTotalEarned, getBadges, isClaimed, fromStroops } from "@stoneale/sdk";

const player = "GCSUYOCLLHG54Z7ASZHPHJRLCI73QISIKCSX4C4S2PUPV7OQIJPQGENR";

fromStroops(await getTotalEarned(player)); // "51"
await isClaimed(player, "breathe1");       // true
await getBadges(player);                   // [1]
```

## Award STONE from your game server

```ts
import { awardStone } from "@stoneale/sdk";

const hash = await awardStone({
  reporterSecret: process.env.REPORTER_SECRET!, // the contract's reporter key. Keep it server-side
  player: "G...",
  achievement: "breathe_7day",                  // up to 32 chars [a-zA-Z0-9_]
  amount: "5",                                  // STONE
});
```

`awardStone` simulates the call first, so contract errors are thrown before anything is submitted:

| Error | Meaning |
|---|---|
| `InvalidAmount` | Amount is zero or negative |
| `AlreadyClaimed` | The player already received this achievement |
| `DailyCapExceeded` | The player would go over the daily STONE cap |

> The player needs a STONE **trustline** first. Use `stoneAsset()` to build a `changeTrust` operation, or use the Frontend's "Enable STONE rewards" button.

## Use the full typed clients in the browser with Freighter

```ts
import { rewardsClient, badgesClient } from "@stoneale/sdk";
import { signTransaction } from "@stellar/freighter-api";

const badges = badgesClient({ publicKey: address, signTransaction });
const tx = await badges.burn({ owner: address, token_id: 1 });
await tx.signAndSend(); // Freighter asks the player to approve
```

Every contract function is available with full types, through `Rewards.Client` and `Badges.Client` or the `rewardsClient()` and `badgesClient()` factories.

## API

| Export | Description |
|---|---|
| `NETWORKS.testnet` | RPC, Horizon, STONE issuer and contract IDs |
| `rewardsClient(opts)` / `badgesClient(opts)` | Typed contract clients |
| `getTotalEarned`, `isClaimed`, `getBadges` | Read-only helpers |
| `awardStone(params)` | Server-side award helper |
| `toStroops("1.5")` / `fromStroops(15000000n)` | STONE ⇄ stroops (7 decimals) |
| `stoneAsset()` | The `STONE:<issuer>` classic asset |
| `Rewards`, `Badges` | Raw generated modules (`Client`, `Errors`, types) |

## Development

```bash
npm ci
npm test               # build and run offline unit tests
npm run test:testnet   # read-only checks against the live testnet contracts
npm run generate       # regenerate clients after a contract upgrade (needs the Stellar CLI)
```

## Related repos

- [stoneale-contracts](https://github.com/stoneale-games/stoneale-contracts): the Soroban contracts
- [Frontend](https://github.com/stoneale-games/Frontend): the web app ([live testnet demo](https://stoneale-bay.vercel.app))

## License

[Apache-2.0](LICENSE) © Stoneale
