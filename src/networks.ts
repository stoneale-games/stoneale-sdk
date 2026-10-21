import { Networks } from "@stellar/stellar-sdk";

export type StoneNetwork = "testnet";

export interface NetworkConfig {
    networkPassphrase: string;
    rpcUrl: string;
    horizonUrl: string;
    /** Issuer of the STONE classic asset. */
    stoneIssuer: string;
    /** Stellar Asset Contract (SAC) for STONE. */
    stoneContractId: string;
    rewardsContractId: string;
    badgesContractId: string;
}

/** Live Stoneale deployments. Mainnet will be added after the security audit. */
export const NETWORKS: Record<StoneNetwork, NetworkConfig> = {
    testnet: {
        networkPassphrase: Networks.TESTNET,
        rpcUrl: "https://soroban-testnet.stellar.org",
        horizonUrl: "https://horizon-testnet.stellar.org",
        stoneIssuer: "GCPX2276HEZKHLIPMC553SLBB3UJCQ377IU2DRICTSLFNDCXBOCWL5UI",
        stoneContractId: "CCX55XV3JX5JCAK6PU4NVFH47ABA4KXRIKQCQHRVEXXCFWGHSQLTNCBG",
        rewardsContractId: "CB5CGHND7BPEJZBUKN4AO3UHNHXGG2U2OJ6ASWERKMMW54KIUKXOC6QC",
        badgesContractId: "CBXEHWTFJDNWZNZESWLE67EODOBKSJG333F6ECPARPBXAV476J26RCOZ",
    },
};
