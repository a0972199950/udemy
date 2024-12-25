const fs = require('fs-extra')
const path = require('path')
const solc = require('solc')

const buildFolderPath = path.resolve(__dirname, './build')
fs.removeSync(buildFolderPath)

const contractPath = path.resolve(__dirname, './contracts/Campaign.sol')
const source = fs.readFileSync(contractPath, 'utf8')

const input = {
  language: 'Solidity',
  sources: {
    'Campaign.sol': {
      content: source
    }
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*']
      }
    }
  }
}

fs.ensureDirSync(buildFolderPath)

Object
  .entries(JSON.parse(solc.compile(JSON.stringify(input))).contracts[
    'Campaign.sol'
  ])
  .forEach(([contractName, contractData]) => {
    const filePath = path.resolve(buildFolderPath, `./${contractName}.json`)
    fs.outputJSONSync(filePath, contractData)
  })
