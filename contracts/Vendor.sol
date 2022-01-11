//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import './JoeToken.sol';

contract Vendor {
  JoeToken token;

  constructor(JoeToken _token) {
    token = _token;
  }

  function buyTokens(uint amount) external payable {
    token.transfer(msg.sender, amount);
  }
}