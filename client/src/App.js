import { useState, useEffect } from "react";
import Web3 from "web3";
import BN from 'bn.js';
import vendorContract from './Vendor.json';
import joeContract from './JoeToken.json';

const VENDOR_ADDRESS = "0x64C564Cfbf9ACCB289F04B17eC881BE3D4CdB404";
const JOE_TOKEN_ADDRESS = "0x2da4B2aC59Eb45b09862ba4418487520220a7FcB";
const App = () => {
  const [provider, setProvider] = useState(null);
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState(0);

  const handleAmount = (e) => {
    setAmount(e.target.value);
  };

  const buyJoeToken = async (_amount) => {
    try {
      if (provider && address) {
        const contract = new provider.Contract(vendorContract.abi, VENDOR_ADDRESS);
        const joeC = new provider.Contract(joeContract.abi, JOE_TOKEN_ADDRESS);

        joeC.methods.balanceOf(VENDOR_ADDRESS).call().then(result => {
          console.log('balance', result);
        })

        let ten = new BN(10);
        let decimal = new BN(18);
        let power = ten.pow(decimal);
        let amount = power.mul(new BN(_amount));
        amount = amount.toString();

        provider.sendTransaction({
          from: address,
          to: VENDOR_ADDRESS,
          gasPrice: "20000000000",
          gas: "210640",
          value: amount,
          data: contract.methods.buyTokens(amount).encodeABI()
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

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
    </div>
  );
};

export default App;
