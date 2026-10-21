# Contributing to @stoneale/sdk

Thanks for helping build Stoneale on Stellar!

## Picking an issue

Issues are labelled `complexity: trivial`, `complexity: medium` or `complexity: high`. Comment on an issue to have it assigned to you before you start. If you've had no activity on an assigned issue for 7 days, it may be reassigned.

## Setup

```bash
npm ci
npm test
```

## Guidelines

- **Don't hand-edit `src/generated/`.** Regenerate it with `npm run generate` (needs the [Stellar CLI](https://developers.stellar.org/docs/tools/cli)).
- Add helpers in `src/index.ts`, with a unit test in `test/unit.test.mjs`. If a helper reads chain state, add a read-only check in `test/testnet.test.mjs`.
- Tests must **never submit transactions or need secret keys**. CI runs without secrets.
- Keep the SDK usable in both the browser and Node: no `fs`, and no Node-only APIs in `src/`.
- Use [Conventional Commits](https://www.conventionalcommits.org) and put one issue in each PR (`Closes #N`).

## Security

Report vulnerabilities privately to **security@stoneale.com**. Never commit secret keys.

## License

By contributing, you agree that your contributions will be licensed under [Apache-2.0](LICENSE).
