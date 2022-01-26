// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Reakoin is ERC20, Ownable {

    //States variables 
    uint256 public maxTX = 1000000*10**18;
    mapping(address => uint256) private _balances;
    uint256 public supply = 50000000*10**18;

    constructor(string memory name, string memory symbols) ERC20(name, symbols){
      _mint(msg.sender, supply);
    }

    event SetMaxTx(uint256 maxTX);

    function _transfer(address sender,address recipient,uint256 amount) internal override {
        require(sender != address(0), "ERC20: transfer to zero");
        require(recipient != address(0), "ERC20: transfer to zero");
        require(amount >= maxTX, "ERC20: amount is big");

        _beforeTokenTransfer(sender, recipient, amount);

        uint256 senderBalance = _balances[sender];
        require(senderBalance >= amount, "ERC20: amounts is small");
        unchecked {
            _balances[sender] = senderBalance - amount;
        }
        _balances[recipient] += amount;

        emit Transfer(sender, recipient, amount);

        _afterTokenTransfer(sender, recipient, amount);
    }

    function setMaxTx(uint newMaxvalue) external onlyOwner{
        maxTX = newMaxvalue;
        emit SetMaxTx(newMaxvalue);
    }
}