const assert = require('assert')
const ganache = require('ganache')
const { Web3 } = require('web3')
const { abi, evm } = require('./compile')

const web3 = new Web3(ganache.provider())

let accounts
let manager
let nonManager
let lottery

beforeEach(async () => {
  accounts = await web3.eth.getAccounts()
  manager = accounts[0]
  nonManager = accounts[1]

  lottery = await new web3.eth.Contract(abi)
    .deploy({
      data: evm.bytecode.object
    })
    .send({
      from: manager,
      gas: '1000000'
    })
})

describe('Lottery', () => {
  it('deploys a contract', () => {
    assert.ok(lottery.options.address)
  })

  it('can enter a player', async () => {
    await lottery.methods.enter().send({
      from: manager,
      value: web3.utils.toWei('1', 'ether')
    })

    const players = await lottery.methods.getPlayers().call()

    assert(players[0] === manager)
  })

  it('can enter multiple players', async () => {
    for (const i of Array.from(Array(3)).map((_, i) => i)) {
      await lottery.methods.enter().send({
        from: accounts[i],
        value: web3.utils.toWei('1', 'ether')
      })
    }

    const players = await lottery.methods.getPlayers().call()

    for (const i of Array.from(Array(3)).map((_, i) => i)) {
      assert(players[i] === accounts[i])
    }
  })

  it('needs certain amout of ether to enter as a player', async () => {
    try {
      await lottery.methods.enter().send({
        from: manager,
        value: '10'
      })

      assert(false)
    } catch (err) {
      assert(err)
    }
  })

  it('needs to be the manager to pick a winner', async () => {
    try {
      await lottery.methods.pickWinner().send({
        from: nonManager
      })

      assert(false)
    } catch (err) {
      assert(err)
    }
  })

  it('needs at least one player existing to pick a winner', async () => {
    try {
      await lottery.methods.pickWinner().send({
        from: manager
      })

      assert(false)
    } catch (err) {
      assert(err)
    }
  })

  it('picks a winner and reset the lottery', async () => {
    await lottery.methods.enter().send({
      from: manager,
      value: web3.utils.toWei('2', 'ether')
    })

    const initialBalance = await web3.eth.getBalance(manager)

    await lottery.methods.pickWinner().send({
      from: manager
    })

    const currentBalance = await web3.eth.getBalance(manager)

    assert(currentBalance - initialBalance < web3.utils.toWei('2', 'ether'))
    assert(currentBalance - initialBalance > web3.utils.toWei('1.8', 'ether'))

    const players = await lottery.methods.getPlayers().call()

    assert(players.length === 0)
  })
})