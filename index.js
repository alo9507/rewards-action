const core = require('@actions/core')
const github = require('@actions/github')
const Web3 = require('web3')
const HDWalletProvider = require('@truffle/hdwallet-provider')
const repoConfig = require('./.octobay.json')

async function run() {
  try {
    // get info from context
    const issue = github.context.payload.issue
    const addedLabel = github.context.payload.label.name
    core.info(`Issue "${issue.title}" was labeled "${addedLabel}"`)

    // check repo's rewards config
    if (!repoConfig.labelRewards) {
      throw Error('No rewards configured.')
    }

    // set up wallet
    const seedPhrase = core.getInput('seed-phrase')
    const rpcNode = core.getInput('rpc-node')
    const walletProvider = new HDWalletProvider(seedPhrase, rpcNode)
    const web3 = new Web3(walletProvider)

    // set addresses
    const toAddress = core.getInput('to-address')
    let fromAddress = core.getInput('from-address')
    // if no from address is configured in the workflow, use first one derived from the seed phrase
    if (!fromAddress) {
      const accounts = await web3.eth.getAccounts()
      fromAddress = accounts[0]
    }

    // check addresses
    if (!web3.utils.isAddress(toAddress)) {
      throw Error(`Receiving address (${toAddress}) is not a valid Ethereum address.`)
    }
    if (!web3.utils.isAddress(fromAddress)) {
      throw Error(`Sending address (${fromAddress}) is not a valid Ethereum address.`)
    }

    // get label reward
    const reward = repoConfig.labelRewards.labels.find(label => label.name === addedLabel)

    if (reward) {
      core.info(`Found reward: ${JSON.stringify(reward)}`)
      core.info(`Sending transaction... (From: ${fromAddress})`)
      web3.eth.sendTransaction({
        from: fromAddress,
        to: toAddress,
        value: reward.value
      }).on('error', (error) => { throw error }).then((tx) => {
        core.info(`Transaction Hash: ${tx.transactionHash}`)
        core.setOutput("transactionHash", tx.transactionHash)
      }).catch((error) => {
        core.setFailed(error.message)
      }).finally(() => {
        walletProvider.engine.stop()
      })
    } else {
      core.info(`No reward for label ${addedLabel} found.`)
      walletProvider.engine.stop()
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()