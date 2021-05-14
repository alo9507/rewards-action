import { getInput, setOutput, setFailed } from '@actions/core'
import { context } from '@actions/github'
import Web3 from 'web3'
import HDWalletProvider from '@truffle/hdwallet-provider'
import rewards from './.octobay.json'

try {
  const seedPhrase = getInput('seed-phrase')
  const rpcNode = getInput('rpc-node')

  console.log(rewards)

  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(context.payload, undefined, 2)
  const web3 = new Web3(new HDWalletProvider(seedPhrase, rpcNode))

  web3.eth.sendTransaction({
    from: '0xA56d9e73f98212e56A2eFb00c9F47d1da64937ee',
    to: '0x0cE5CD28e4CD4b3a4def3c9eE461809b2c5ee9E6',
    value: '1000000000000000'
  })
  .on('transactionHash', (hash) => console.log(hash))
  .on('receipt', (receipt) => console.log(receipt))
  .on('confirmation', (confirmationNumber, receipt) => console.log(confirmationNumber, receipt))
  .on('error', (e) => { throw e })

  // TODO:
  // - find issue author's eth address (via Octobay's UserAddressStorage or on GitHub (repo, description, gist, we'll see)
  // - send transaction
  let tx

  setOutput("tx", tx)
} catch (error) {
  setFailed(error.message)
}
