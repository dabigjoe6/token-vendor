import { useState, useEffect } from "react";
import Web3 from "web3";
import BN from 'bn.js';
import vendorContract from './Vendor.json';
import joeContract from './JoeToken.json';

const VENDOR_ADDRESS = "0x09F4Bfe5A0D604Fcb14f695DEbca74E65240DC37";
const JOE_TOKEN_ADDRESS = "0x0E29C407b31aD7b6cc79ba64fE9D9954e82990E9";
const App = () => {
  const [provider, setProvider] = useState(null);
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState(0);

  const handleAmount = (e) => {
    setAmount(e.target.value);
  };

  const parseAmount = (_amount) => {
    let ten = new BN(10);
    let decimal = new BN(18);
    let power = ten.pow(decimal);
    let amount = power.mul(new BN(_amount));
    return amount.toString();
  }

  const buyJoeToken = async (_amount) => {
    try {
      if (provider && address) {
        const contract = new provider.Contract(vendorContract.abi, VENDOR_ADDRESS);

        provider.sendTransaction({
          from: address,
          to: VENDOR_ADDRESS,
          gasPrice: "20000000000",
          gas: "210640",
          value: parseAmount(_amount),
          data: contract.methods.buyTokens(parseAmount(_amount)).encodeABI()
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const sellJoeToken = async (_amount) => {
    if (provider && address) {
      try {
        const contract = new provider.Contract(joeContract.abi, JOE_TOKEN_ADDRESS);
        const vContract = new provider.Contract(vendorContract.abi, VENDOR_ADDRESS);

        await provider.sendTransaction({
          from: address,
          to: JOE_TOKEN_ADDRESS,
          data: contract.methods.approve(VENDOR_ADDRESS, parseAmount(_amount)).encodeABI(),
          gasPrice: "20000000000",
          gas: "210640",
        });

        await provider.sendTransaction({
          from: address,
          to: VENDOR_ADDRESS,
          data: vContract.methods.sell(parseAmount(_amount)).encodeABI(),
          gasPrice: "20000000000",
          gas: "210640",
        });


      } catch (e) {
        console.error(e);
      }
    }
  }

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.send("eth_requestAccounts");

        setProvider(web3.eth);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getAddress = async () => {
    try {
      if (provider) {
        provider.getAccounts().then((accounts) => {
          setAddress(accounts[0]);
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (provider && !address) {
      getAddress();
    }
  }, [provider, address]);

  return (
    <div>
      <h3>Enter amount of JoeTokens to buy</h3>
      <button onClick={connectWallet}>{address || "Connect wallet"}</button>
      <input
        type="number"
        value={amount}
        placeholder="Enter amount of JoeTokens to buy"
        onChange={handleAmount}
      />
      <button onClick={() => buyJoeToken(amount)}>buy</button>
      <button onClick={() => sellJoeToken(amount)}>sell</button>
    </div>
  );
};

export default App;
