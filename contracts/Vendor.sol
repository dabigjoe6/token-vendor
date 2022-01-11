//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import './JoeToken.sol';

contract Vendor {
  JoEToken token;

  constructor(JoEToken _token) {
    token = _token;
  }

  function buyTokens(uint amount) external payable {
    token.transfer(msg.sender, amount);
  }
}