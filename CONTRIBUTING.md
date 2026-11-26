# Contributing

I'm interested in small, reproducible improvements to the lab, especially cases where evidence integrity and permission to act can be confused.

Start with the [open issues](https://github.com/emamoreno7/evidence-review-lab/issues). If you're interested in a task, leave a comment before starting so we can avoid duplicate work. For larger changes, please discuss the approach first.

## Local development

Fork the repository, clone your fork and create a branch. Node.js 22 or newer is enough.

```sh
npm test
npm start
```

Open http://127.0.0.1:4173 to try the interface.

## Pull requests

- Keep each change focused and explain the problem it solves.
- For policy changes, add tests for the expected behavior and the failure path.
- Use synthetic fixtures. Do not include credentials, customer data or real traffic captures.
- Keep integrity, claim support and authenticity separate. A matching hash alone must never authenticate an HTTP capture.
- Include the test command and observed results. If a browser test was manual, say so.

Documentation, accessibility fixes and independent reproductions are welcome. Be respectful when reviewing someone else's work.

Contributions to this repository are provided under its MIT license. The license does not extend to the separate private projects mentioned in the README.
