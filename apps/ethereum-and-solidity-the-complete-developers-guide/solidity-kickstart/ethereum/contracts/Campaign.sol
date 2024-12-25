/// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract CampaignFactory {
    address[] public deployedCompaigns;

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCompaigns;
    }

    function createCampaign(uint minimum) public returns (address) {
        address newCampaign = address(new Campaign(minimum, msg.sender));
        deployedCompaigns.push(newCampaign);
        return newCampaign;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address payable recipient;
        bool isCompleted;
        mapping(address => bool) hasVoted;
        uint approvals;
    }

    struct Summary {
        uint minimumContribution;
        uint balance;
        uint requestLength;
        uint approversCount;
        address manager;
    }

    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;

    constructor(uint minimum, address creator) {
        manager = creator;
        minimumContribution = minimum;
    }

    modifier restricted() {
        require(msg.sender == manager, "Only manager can do this operation.");
        _;
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function contribute() public payable {
        require(
            msg.value >= minimumContribution,
            "You didn't match the minimum contribution."
        );
        require(
            !approvers[msg.sender],
            "You have already contributed this campaign."
        );

        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(
        string memory description,
        uint value,
        address payable recipient
    ) public restricted {
        Request storage request = requests.push();

        require(
            value <= address(this).balance,
            "The rest money is less than the request value."
        );

        request.description = description;
        request.value = value;
        request.recipient = recipient;
        request.isCompleted = false;
        request.approvals = 0;
    }

    function approveRequest(uint requestIndex, bool approve) public {
        Request storage request = requests[requestIndex];

        require(approvers[msg.sender], "Only contributers can vote");
        require(!request.hasVoted[msg.sender], "You have already voted");

        request.hasVoted[msg.sender] = true;
        if (approve) {
            request.approvals++;
        }
    }

    function finalizeRequest(uint requestIndex) public restricted {
        Request storage request = requests[requestIndex];

        require(
            request.approvals > approversCount / 2,
            "You don't have the permission to finalize the request since there are not enough approvers have agreed this request."
        );
        require(
            !request.isCompleted,
            "You have already finalized this request before. Please create a new request."
        );

        request.recipient.transfer(request.value);
        request.isCompleted = true;
    }

    function getSummary() public view returns (Summary memory) {
        Summary memory summary = Summary({
            minimumContribution: minimumContribution,
            balance: getBalance(),
            requestLength: requests.length,
            approversCount: approversCount,
            manager: manager
        });

        return summary;
    }

    function getRequestCount() public view returns (uint) {
        return requests.length;
    }
}
