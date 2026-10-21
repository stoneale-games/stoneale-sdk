import { test } from "node:test";
import assert from "node:assert/strict";
import { StrKey } from "@stellar/stellar-sdk";
import { NETWORKS, Rewards, Badges, awardStone, fromStroops, stoneAsset, toStroops } from "../dist/index.js";

test("toStroops converts STONE amounts", () => {
    assert.equal(toStroops("1"), 10_000_000n);
    assert.equal(toStroops(50), 500_000_000n);
    assert.equal(toStroops("12.5"), 125_000_000n);
    assert.equal(toStroops("0.0000001"), 1n);
    assert.equal(toStroops(" 3. "), 30_000_000n);
});

test("toStroops rejects invalid input", () => {
    for (const bad of ["", "-1", "1.00000001", "abc", "1e5", "1,5"]) {
        assert.throws(() => toStroops(bad), /Invalid STONE amount/, bad);
    }
});

test("fromStroops formats and round-trips", () => {
    assert.equal(fromStroops(0n), "0");
    assert.equal(fromStroops(500_000_000n), "50");
    assert.equal(fromStroops(125_000_000n), "12.5");
    assert.equal(fromStroops(1n), "0.0000001");
    assert.equal(fromStroops(-15_000_000n), "-1.5");
    for (const v of ["7", "0.25", "123456.7654321"]) {
        assert.equal(fromStroops(toStroops(v)), v);
    }
});

test("testnet config has valid addresses", () => {
    const net = NETWORKS.testnet;
    assert.ok(StrKey.isValidEd25519PublicKey(net.stoneIssuer));
    for (const id of [net.stoneContractId, net.rewardsContractId, net.badgesContractId]) {
        assert.ok(StrKey.isValidContract(id), id);
    }
    assert.equal(Rewards.networks.testnet.contractId, net.rewardsContractId);
    assert.equal(Badges.networks.testnet.contractId, net.badgesContractId);
});

test("stoneAsset is STONE:<issuer>", () => {
    const asset = stoneAsset();
    assert.equal(asset.getCode(), "STONE");
    assert.equal(asset.getIssuer(), NETWORKS.testnet.stoneIssuer);
});

test("generated error codes match the contracts", () => {
    assert.equal(Rewards.Errors[2].message, "AlreadyClaimed");
    assert.equal(Rewards.Errors[3].message, "DailyCapExceeded");
    assert.equal(Badges.Errors[1].message, "NotMinter");
});

test("awardStone validates the achievement id before any network call", async () => {
    await assert.rejects(
        awardStone({
            reporterSecret: "SDUMMY",
            player: NETWORKS.testnet.stoneIssuer,
            achievement: "has spaces!",
            amount: 1,
        }),
        /Invalid achievement id/,
    );
});
