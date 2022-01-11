//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract JoEToken is ERC20  {
  constructor (uint initialSupply) ERC20("JoE", "JoE")  {
    _mint(msg.sender, initialSupply);
  }
}