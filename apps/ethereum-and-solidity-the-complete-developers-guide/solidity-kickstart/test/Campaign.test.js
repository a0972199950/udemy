const assert = require('assert')
const { Web3 } = require('web3')
const ganache = require('ganache')
const compiledCampaignFactory = require('../ethereum/build/CampaignFactory.json')
const compiledCampaign = require('../ethereum/build/Campaign.json')

const web3 = new Web3(ganache.provider())

let accounts
let campaignFactory
let campaignAddress
let campaign

beforeEach(async () => {
  accounts = await web3.eth.getAccounts()

  campaignFactory = await new web3.eth.Contract(compiledCampaignFactory.abi)
    .deploy({
      data: compiledCampaignFactory.evm.bytecode.object
    })
    .send({
      from: accounts[0],
      gas: '2000000'
    })

  await campaignFactory.methods.createCampaign('100').send({
    from: accounts[0],
    gas: '2000000'
  })

  ;[campaignAddress] = await campaignFactory.methods.getDeployedCampaigns().call()
  campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress)
})

describe('Compaign', () => {
  it('deploys a factory and a campaign', () => {
    assert.ok(campaignFactory.options.address)
    assert.ok(campaign.options.address)
  })

  it('marks caller as the campaign manager', async () => {
    const manager = await campaign.methods.manager().call()
    assert.equal(manager, accounts[0])
  })

  it ('allows people to contribute money and marks them as approvers', async () => {
    await campaign.methods.contribute().send({
      from: accounts[1],
      value: '1000'
    })

    const balance = await web3.eth.getBalance(campaignAddress)
    assert.equal(balance, '1000')

    const isApprover = await campaign.methods.approvers(accounts[1]).call()
    assert.ok(isApprover)
  })

  it('requires a minimum contribution', async () => {
    try {
      await campaign.methods.contribute().send({
        from: accounts[1],
        value: '1'
      })

      assert(false)
    } catch (err) {
      assert(true)
    }

    try {
      await campaign.methods.contribute().send({
        from: accounts[1],
        value: '1000'
      })

      assert(true)
    } catch (err) {
      assert(false)
    }
  })

  it('allows a manager to make a payment request', async () => {
    await campaign.methods.contribute().send({
      from: accounts[1],
      value: '1000'
    })

    await campaign.methods.createRequest('Buy batteries', '100', accounts[2]).send({
      from: accounts[0],
      gas: '1000000'
    })

    const request = await campaign.methods.requests(0).call()
    assert.equal(request.description, 'Buy batteries')
  })

  it('allows a manager to finalize a request', async () => {
    await campaign.methods.contribute().send({
      from: accounts[1],
      value: web3.utils.toWei('10', 'ether')
    })

    await campaign.methods.createRequest('description', web3.utils.toWei('5', 'ether'), accounts[2]).send({
      from: accounts[0],
      gas: '1000000'
    })

    await campaign.methods.approveRequest(0, true).send({
      from: accounts[1],
      gas: '1000000'
    })

    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: '1000000'
    })

    let account2Balance = await web3.eth.getBalance(accounts[2])
    account2Balance = web3.utils.fromWei(account2Balance, 'ether')

    assert.equal(account2Balance, '1005')
  })

  it('can return summary', async () => {
    const summary = await campaign.methods.getSummary().call()
    console.log(summary)

    assert(summary)
  })
})
