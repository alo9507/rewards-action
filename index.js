const core = require('@actions/core')
const github = require('@actions/github')
const Web3 = require('web3')
const HDWalletProvider = require('@truffle/hdwallet-provider')
const rewards = require('./.octobay.json')

;(async () => {
  try {
    const seedPhrase = core.getInput('seed-phrase')
    const rpcNode = core.getInput('rpc-node')
    let fromAccount = core.getInput('from-account')

    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    const walletProvider = new HDWalletProvider(seedPhrase, rpcNode)
    const web3 = new Web3(walletProvider)
    if (!fromAccount) {
      const accounts = await web3.eth.getAccounts()
      fromAccount = accounts[0]
    }

    const tx = await sendTransaction(
      fromAccount,
      '0x0cE5CD28e4CD4b3a4def3c9eE461809b2c5ee9E6',
      '1000000000000000'
    )

    web3.eth.sendTransaction({
      from: fromAccount,
      to: '0x0cE5CD28e4CD4b3a4def3c9eE461809b2c5ee9E6',
      value: '1000000000000000'
    }).on('error', (e) => { throw e }).then(() => walletProvider.engine.stop())

    core.setOutput("tx", tx)
  } catch (error) {
    core.setFailed(error.message)
  }
})()