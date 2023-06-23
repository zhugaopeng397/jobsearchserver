// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract MultiSig {
    address[] public owners;
    uint256 public required;
    uint public transactionCount;

    struct Transaction {
        address destination;
        uint value;
        bool executed;
        bytes data;
    }

    mapping(uint => Transaction) public transactions;
    mapping(uint => mapping(address => bool)) public confirmations;

    constructor(address[] memory _owners, uint256 _required) {
        require(_owners.length > 0 && _required > 0 && _owners.length == _required);
        owners = _owners;
        required = _required;
    }

    // constructor(uint256 _required) {
    //     // require(_owners.length > 0 && _required > 0 && _owners.length > _required);
    //     // owners = _owners;
    //     required = _required;
    // }

    function addTransaction(address _destination, uint _value, bytes memory data) internal returns(uint256) {
        uint256 index = transactionCount++;
        transactions[index] = Transaction(_destination, _value, false, data);
        return index;
    }

    function confirmTransaction(uint transactionId) public {
        require(isOwner(msg.sender));
        confirmations[transactionId][msg.sender] = true;
        if (isConfirmed(transactionId)) {
            executeTransaction(transactionId);
        }
    }

    function isOwner(address addr) private view returns(bool) {
        for (uint i = 0; i < owners.length; i++) {
            if (owners[i] == addr) {
                return true;
            }
        }
        return false;
    }

    function getConfirmationsCount(uint transactionId) public view returns(uint) {
        uint confCount;
        for (uint i = 0; i < owners.length; i++) {
            if (confirmations[transactionId][owners[i]]) {
                confCount++;
            }
        }
        return confCount;
    }

    function submitTransaction(address _destination, uint _value, bytes memory data) external {
        uint index = addTransaction(_destination, _value, data);
        confirmTransaction(index);
    }

    function isConfirmed(uint transactionId) public view returns(bool) {
        return getConfirmationsCount(transactionId) >= required;
    }

    function executeTransaction(uint transactionId) public {
        require(isConfirmed(transactionId));
        Transaction storage _tx = transactions[transactionId];
        (bool s, ) = _tx.destination.call{value: _tx.value}(_tx.data);
        require(s);
        _tx.executed = true; 
    }

    receive() payable external {

    }
}