# Octobay Rewards Action

A GitHub Action to automate crypto payments to your contributors.

Currently only issue rewards (e.g. bug bounties) are possible but other features will follow.

## How it works

1. You need a wallet that holds the reserves you want to use to reward contributors.
2. You add a workflow to your repository and pass it the key to a wallet as a repository secret. (Yes we're putting a lot of trust on Github here.)
3. You add a `.octobay.json` to your repository, configuring the rewards.
4. Contributors need to add a `.octobay.json` to their user repository (`github.com/<username>/<username>`), configuring an Ethereum address.
5. Contributors without an address configured in a `.octobay.json`, will be guided be the GitHub action commenting on the issue, giving them a chance to add the configure an address and trigger the workflow again by replying to the comment.

**We recommend to inform your contributors that you support Octobay Rewards. See [how we are doing it](https://github.com/Octobay/rewards-action/issues/new/choose) using [issue templates](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository).**

## Example usage

See our [label-rewards.yml](.github/workflows/label-rewards.yml) and [.octobay.json](.octobay.json).

## Inputs

### `to-address`

**Required** The Ethereum address of the receiving user. (Can be retrieved using octobay/get-user-config-action.)

### `from-address`

**Optional** The Ethereum address to send the rewards from. Defaults to the first address derived from the provided seed phrase.

### `seed-phrase`

**Required** The seed phrase for the wallet that pays contributors.

### `rpc-node`

**Optional** An ethereum RPC node. Default `"https://mainnet.rpc.fiews.io/v1/free"`.

## Outputs

### `transactionHash`

The Ethereum transaction hash.
