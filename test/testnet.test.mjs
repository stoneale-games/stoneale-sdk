// Read-only checks against the live testnet contracts (no keys, nothing submitted).
// DEMO_PLAYER received 50 STONE for "breathe1" and badge #1 in the deployment smoke test.
import { test } from "node:test";
import assert from "node:assert/strict";
import { Keypair } from "@stellar/stellar-sdk";
import { getBadges, getTotalEarned, isClaimed, rewardsClient, toStroops } from "../dist/index.js";

const DEMO_PLAYER = "GCSUYOCLLHG54Z7ASZHPHJRLCI73QISIKCSX4C4S2PUPV7OQIJPQGENR";

test("reads lifetime STONE earned", async () => {
    assert.ok(await getTotalEarned(DEMO_PLAYER) >= toStroops(50));
});

test("reads claimed achievements", async () => {
    assert.equal(await isClaimed(DEMO_PLAYER, "breathe1"), true);
    assert.equal(await isClaimed(DEMO_PLAYER, "never_claimed"), false);
});

test("reads badges", async () => {
    assert.deepEqual(await getBadges(DEMO_PLAYER), [1]);
});

test("unknown players have no history", async () => {
    const fresh = Keypair.random().publicKey();
    assert.equal(await getTotalEarned(fresh), 0n);
    assert.deepEqual(await getBadges(fresh), []);
});

test("reads rewards config", async () => {
    const { result } = await rewardsClient().config();
    assert.equal(result.daily_cap, toStroops(1000));
});
