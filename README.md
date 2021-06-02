# Octobay Rewards Action

A GitHub Action to automate crypto payments to your contributors.

Currently only issue rewards (e.g. bug bounties) are possible but other features will follow.

## How it works

1. You need a wallet that holds the reserves you want to use to reward contributors.
2. You add a workflow to your repository and pass it the key to a wallet as a repository secret. (Yes we're putting a lot of trust on Github here.)
3. You add a `.octobay.json` to your repository, configuring the rewards.
4. Contributors need to add a `.octobay.json` to their user repository (`github.com/<username>/<username>`), configuring an Ethereum address.
5. Contributors without an address configured in a `.octobay.json`, will be guided be the GitHub action commenting on the issue, giving them a chance to add the configure an address and trigger the workflow again by replying to the comment.

## Inputs

### `seed-phrase`

**Required** The seed phrase for the wallet that pays contributors.

### `rpc-node`

An ethereum RPC node. Default `"https://mainnet.rpc.fiews.io/v1/free"`.

## Outputs

### `tx`

The Ethereum transaction receipt.

## Example usage

You need to set a wallet seed phrase as a [repository secret](https://docs.github.com/en/actions/reference/encrypted-secrets#creating-encrypted-secrets-for-a-repository).

```yaml
name: Octobay Rewards
on:
  # Triggered when you label issues.
  issues:
    types: [labeled]

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

jobs:
  reward:
    runs-on: ubuntu-latest
    steps:
      # Checks-out your repository under $GITHUB_WORKSPACE, so your job can access it
      - uses: actions/checkout@v1
      - uses: octobay/rewards-action@v1.0
        with:
          rpc-node: 'https://mainnet.rpc.fiews.io/v1/free' # default
          seed-phrase: '${{ secrets.WALLET_SEED_PHRASE }}'
```
