# Evidence Review Lab

A small public demonstration inspired by two of my private projects, [CYBER-AI and SENTINEL-AI](https://github.com/emamoreno7/emamoreno7/blob/main/showcase/cyber-intelligence.md) and [AutoPilot](https://github.com/emamoreno7/emamoreno7/blob/main/showcase/autopilot.md).

I wanted a way to show why an automated workflow should distinguish evidence integrity, claim support and permission to act. The example uses a fictional inventory report and a synthetic HTTP response. It does not contain the original engines or customer data.

[Try the live demo](https://emamoreno7.github.io/evidence-review-lab/) — no installation required.

## Run it

Node.js 22 or newer. No packages, credentials or external services are required.

```sh
npm start
```

Open http://127.0.0.1:4173. Try the scenarios, then change the evidence or claim and run the check again. The decision trace shows the expected and observed digests and the reason for the decision.

```sh
npm test
npm run demo
```

The same policy module runs in the browser and in Node.js. The tests use the built-in Node test runner; the repository includes a GitHub Actions workflow.

## What the example checks

| Scenario | Result |
| --- | --- |
| Registered document with matching bytes and exact claim | ELIGIBLE in automatic mode |
| Modified evidence | BLOCK |
| Claim not found as a complete line | HOLD |
| HTTP body with matching digest and claim | HOLD (capture not authenticated) |
| Manual review or automation off | HOLD |

A digest match is not proof of origin. The expected digests are fixed in the demo registry, not supplied by the person editing the evidence. A matching HTTP body still has no independent capture attestation. Automatic mode cannot override that rule.

## Scope

This is a newly written portfolio example, not a release of CYBER-AI, SENTINEL-AI, ARTEX or AutoPilot. No private code was copied. The original research uses semantic evaluation; this example deliberately uses exact complete-line matching and makes no claim to perform NLI or AI inference. It has no publication, scanning, external network or social-media integration. ELIGIBLE means only that a local demo rule passed. The browser is not a security boundary; the static registry is not a signed or independently trusted evidence store.

The demo is also hosted on GitHub Pages.

## Verification

The local run passed 18 unit tests on Node.js 22.16.0. The local HTTP server was also checked for the expected assets and rejected paths. The [GitHub Actions test run](https://github.com/emamoreno7/evidence-review-lab/actions/runs/45786006553) also completed successfully. Full browser interaction has not been covered by automated tests.

## Feedback

If you find a scenario that the policy handles incorrectly, feel free to open an issue with a reproducible example. If the demo is useful, a star helps others discover it.

See [CONTRIBUTING.md](CONTRIBUTING.md) for local setup and review expectations. Small test cases, accessibility fixes and independent reproductions are particularly welcome.

## License

[MIT](LICENSE). This license applies to this standalone demo only, not the separate private projects mentioned above.
