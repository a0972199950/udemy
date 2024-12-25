import { Web3 } from 'web3'

let web3

if (typeof window !== 'undefined' && typeof ethereum !== 'undefined') {
  window.ethereum.request({ method: 'eth_requestAccounts' }) // 尋求使用者同意
  web3 = new Web3(window.ethereum)
} else {
  web3 = new Web3(new Web3.providers.HttpProvider('https://sepolia.infura.io/v3/75647ccf8d11449092a79c2d3d1b3965'))
}

export default web3
