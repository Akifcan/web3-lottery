// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.11;

contract Lottery {
    address public owner;
    address payable[] public players;
    uint public lotteryId;
    mapping (uint => address payable) public lotteryHistory; 

    modifier onlyOwner() {
        require(msg.sender == owner, "only for owner");
        _;
    }

    modifier isPlayerExists(){
        require(players.length > 1, "there is no player");
        _;
    }

    constructor(){
        owner = msg.sender;
        lotteryId = 1;
    }

    function getBalance() public view returns (uint){
        return address(this).balance;
    }

    function getWinnerByLotter(uint lottery) public view returns (address payable) {
        return lotteryHistory[lottery];
    }

    function getPlayers() public view returns (address payable[] memory){
        return players;
    }

    function getOwner() public view returns(address) {
        return owner;
    }

    function enter() public payable {
        require(msg.value > .01 ether);
        players.push(payable (msg.sender));
    }

    function getRandomNumber() public view returns(uint) {
        return uint(keccak256(abi.encodePacked(owner, block.timestamp)));
    }

    function pickWinner() public onlyOwner isPlayerExists {
        uint index = getRandomNumber() % players.length;
        players[index].transfer(address(this).balance);
        lotteryHistory[lotteryId] = players[index];
        lotteryId++;
        players = new address payable[](0);
    }
}