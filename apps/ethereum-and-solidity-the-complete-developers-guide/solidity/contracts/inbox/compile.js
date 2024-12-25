// compile code will go here
const path = require('path')
const fs = require('fs')
const solc = require('solc')

const source = fs.readFileSync(path.resolve(__dirname, './Inbox.sol'), 'utf8')

const input = {
  language: 'Solidity',
  sources: {
    'Inbox.sol': {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*'],
      },
    },
  },
};
 
module.exports = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
  'Inbox.sol'
].Inbox;
