// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Contract.sol";

contract Reakoin is Contract, Ownable {

    //States variables 
    
    mapping(address => uint256) private _balances;
    uint256 public supply = 50000000*10**18;

    constructor(string memory name, string memory symbols) Contract(name, symbols){
      _mint(msg.sender, supply);
    }

 
}