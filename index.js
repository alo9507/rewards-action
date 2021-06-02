const core = require('@actions/core')
const github = require('@actions/github')
const axios = require('axios')
const Web3 = require('web3')
const HDWalletProvider = require('@truffle/hdwallet-provider')
const repoConfig = require('./.octobay.json')

;(async () => {
  try {
    // prepare
    const seedPhrase = core.getInput('seed-phrase')
    const rpcNode = core.getInput('rpc-node')
    let fromAddress = core.getInput('from-address')
    const walletProvider = new HDWalletProvider(seedPhrase, rpcNode)
    const web3 = new Web3(walletProvider)
    const issue = github.context.payload.issue
    const issueAuthor = issue.user
    const issueLabeler = github.context.payload.sender.login

    core.info(`Issue "${issue.title}" was labeled "${issue.labels.map(l => l.name).join('", "')}" by ${issueLabeler}`)

    // check labeling authority
    if (repoConfig.issues && repoConfig.issues.authority && issueLabeler === repoConfig.issues.authority) {
      // fetch issueAuthor's octobay config from profile repo (github.com/<username>/<username>)
      let userConfig
      const userConfigResponse = await axios.get(`https://raw.githubusercontent.com/${issueAuthor.login}/${issueAuthor.login}/main/.octobay.json`)
      if (userConfigResponse) userConfig = userConfigResponse.data
      
      // if no from address is configured in the workflow, use first one
      if (!fromAddress) {
        const accounts = await web3.eth.getAccounts()
        fromAddress = accounts[0]
      }
  
      // if issueAuthor has a valid address configured
      let toAddress
      if (userConfig && userConfig.address && web3.utils.isAddress(userConfig.address)) {
        core.info(`Found address for user ${issueAuthor.login}: ${userConfig.address}`)
  
        // check if there's a reward configured for the issue's labels
        let reward
        repoConfig.issues.rewards.forEach(r => {
          if (r.labels.every((requiredLabel) => issue.labels.map(l => l.name).includes(requiredLabel))) {
            reward = r
          }
        })

        if (reward) {
          core.info(`Found reward: ${JSON.stringify(reward)}`)
          core.info(`Sending transaction... (From: ${fromAddress})`)
          web3.eth.sendTransaction({
            from: fromAddress,
            to: userConfig.address,
            value: reward.value
          }).on('error', (error) => { throw error }).then((tx) => {
            core.info(`Transaction Hash: ${tx.transactionHash}`)
            core.setOutput("tx", tx)
            walletProvider.engine.stop()
          }).catch((error) => {
            core.setFailed(error.message)
          })
        } else {
          core.info('No reward requirements are met.')
          walletProvider.engine.stop()
        }
      } else {
        core.info(`No address found for user ${issueAuthor.login}.`)
        walletProvider.engine.stop()
      }
    } else {
      core.info(`Configured authority "${repoConfig.issues.authority}" does not match "${issueLabeler}" who labeled the issue.`)
      walletProvider.engine.stop()
    }
  } catch (error) {
    core.setFailed(error.message)
  }
})()