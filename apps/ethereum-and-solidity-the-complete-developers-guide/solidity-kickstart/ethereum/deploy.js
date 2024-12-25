const { Web3 } = require('web3')
const HDWalletProvider = require('@truffle/hdwallet-provider')
const { abi, evm } = require('./build/CampaignFactory.json')

const provider = new HDWalletProvider(
  'six adapt analyst degree audit elder hedgehog blossom rival rail jewel combine',
  'https://sepolia.infura.io/v3/75647ccf8d11449092a79c2d3d1b3965'
)

const web3 = new Web3(provider)

const deploy = async () => {
  const account = await web3.eth.getAccounts()

  const contract = await new web3.eth.Contract(abi)
    .deploy({
      data: evm.bytecode.object,
    })
    .send({
      from: account[0],
      gas: '2000000'
    })

  console.log('Contract address: ', contract.options.address)
  provider.engine.stop()
}

deploy()
