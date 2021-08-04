# Contributing to Creamcrop

We're happy your here, spending the time to contribute to creamcrop. 


## Table of Contents

- [Issues/Questions](#issues-or-questions)
- [Contributing to the Codebase](#contributing-to-the-codebase)
- [Non-code related contributions](#non-code-related-contributions)

**Before contributing, please make sure to follow the Code of Conduct.**

## Issues or Questions

If you have an bug, that's great, just head over to the [issues](https://github.com/creamcropdev/creamcrop/issues/)
tab and create an issue.

If you have a question, meaning you _think_ there's a bug, or, you don't know how to do something, submit a discussion!
We'll answer your question ASAP, and if the problem is a bug, we can simply transfer the discussion over to an issue.

## Contributing to the Codebase

If you plan to add a feature or fix a bug, then you can start by cloning the repo:
```sh
git clone https://github.com/creamcropdev/creamcrop.git
cd creamcrop
npm i
npm link # This allows you to make changes and then use "cream" or "creamcrop" in the CLI.
```
Make sure you uninstall any existing installation of creamcrop before using `npm link`. 

Once you've run those commands, you can make changes as necassary, however, make sure
to run the linter (`npm lint`), and keep the file structure:
```text
src/
 ├── bin/ # For the CLI
 ├── utils/ # For command utilites
 └── index.js # Only for metadata 
```

We strongly encourage you to add yourself to the all-contributors file also, using the all contributors CLI or bot.

## Non-Code Related Contributions

Fixing a typo? Workflow error? No problem, you can also fix this, and just add yourself to the contributors file too, with the CLI or bot.
