/// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract Lottery {
	address public manager;
	address[] public players;

	constructor () {
		manager = msg.sender;
	}

	modifier restricted () {
		require(manager == msg.sender, 'Only lottery manager can pick a winner');
		_;
	}

	function getPlayers () public view returns (address[] memory) {
		return players;
	}

	function enter () public payable {
		require(msg.value >= 0.1 ether, 'Must send more than 0.1 ether');

		players.push(msg.sender);
	}

	function random () private view restricted returns (uint) {
		return uint(keccak256(abi.encode(block.difficulty, block.timestamp, players)));
	}

	function pickWinner () public restricted payable {
		require(players.length > 0, 'The lottery has no players thus cannot pick a winner');

		uint index = random() % players.length;
		address payable winner = payable(players[index]);
		winner.transfer(address(this).balance);
		reset();
	}

	function reset () private restricted {
		players = new address[](0);
	}
}