const fs = require('fs')
const core = require('@actions/core')
const github = require('@actions/github')
const Web3 = require('web3')
const HDWalletProvider = require('@truffle/hdwallet-provider')

try {
  const seedPhrase = core.getInput('seed-phrase')
  const rpcNode = core.getInput('rpc-node')

  const rewards = fs.readFileSync('./.octobay')
  console.log(rewards)

  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(payload)
  const web3 = new Web3(new HDWalletProvider(seedPhrase, rpcNode))

  web3.eth.sendTransaction({
    from: '0xA56d9e73f98212e56A2eFb00c9F47d1da64937ee',
    to: '0x0cE5CD28e4CD4b3a4def3c9eE461809b2c5ee9E6',
    value: '1000000000000000'
  })
  .on('transactionHash', function(hash){
      console.log(hash)
  })
  .on('receipt', function(receipt){
      console.log(receipt)
  })
  .on('confirmation', function(confirmationNumber, receipt){ })
  .on('error', function(e) { throw e })

  // TODO:
  // - find issue author's eth address (via Octobay's UserAddressStorage or on GitHub (repo, description, gist, we'll see)
  // - send transaction
  let tx

  core.setOutput("tx", tx)
} catch (error) {
  core.setFailed(error.message)
}
