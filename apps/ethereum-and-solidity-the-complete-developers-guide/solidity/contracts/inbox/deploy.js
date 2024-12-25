const HDWalletProvider = require('@truffle/hdwallet-provider');
const { Web3 } = require('web3');
const { abi, evm } = require('./compile')

const provider = new HDWalletProvider(
  'six adapt analyst degree audit elder hedgehog blossom rival rail jewel combine',
  'https://sepolia.infura.io/v3/75647ccf8d11449092a79c2d3d1b3965'
)

const web3 = new Web3(provider)

const deploy = async () => {
  const accounts = await web3.eth.getAccounts()
  
  const contract = await new web3.eth.Contract(abi)
    .deploy({
      data: evm.bytecode.object,
      arguments: ['Hi there']
    })
    .send({
      from: accounts[0],
      gas: '1000000'
    })

  provider.engine.stop()
}

deploy()
