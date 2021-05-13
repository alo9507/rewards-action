const core = require('@actions/core');
const github = require('@actions/github');

try {
  const rewards = core.getInput('rewards');
  const seedPhrase = core.getInput('seed-phrase');
  const labelAuthority = core.getInput('label-authority');
  const rpcNode = core.getInput('rpc-node');

  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)

  // TODO:
  // - find issue author's eth address (via Octobay's UserAddressStorage or on GitHub (repo, description, gist, we'll see)
  // - send transaction
  let tx;

  core.setOutput("tx", tx);
} catch (error) {
  core.setFailed(error.message);
}
