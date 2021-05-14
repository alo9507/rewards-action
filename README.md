# Octobay Rewards Action

A GitHub Action to automate crypto payments to your contributors.

Currently only issue rewards (e.g. bug bounties) are possible but other feature will follow.

## How it works

You need a wallet that holds the reserves you want to use to reward contributors.
You configure the action to trigger when you label issues and you define what labels lead to what reward.
If the user who created the issue has a verified ETH address on Octobay or in the GitHub bio, the action will use your wallet to send the configured amount to that address. For a simple bug bounty programm for example you can configure the action to send a fixed amount of ETH to an issue's author when you add the label 'critical-bug'.


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