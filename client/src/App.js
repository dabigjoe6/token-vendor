import { useState, useEffect } from "react";
import Web3 from "web3";
import vendorContract from './Vendor.json';
import joeContract from './JoeToken.json';

const VENDOR_ADDRESS = "0x2f14907846F7Cc7025039Ba4dBda4346eBC9Fdec";
const JOE_TOKEN_ADDRESS = "0xd6b0E82C1ECDae61C87e275e70FD7032b2a9360C";
const App = () => {
  const [provider, setProvider] = useState(null);
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState(0);

  const handleAmount = (e) => {
    setAmount(e.target.value);
  };

  const buyJoeToken = async (amount) => {
    try {
      if (provider && address) {
        const contract = new provider.Contract(vendorContract.abi, VENDOR_ADDRESS);
        // const contract = new provider.Contract(joeContract.abi, JOE_TOKEN_ADDRESS);

        // contract.methods.balanceOf(VENDOR_ADDRESS).call().then(result => {
        //   console.log('balance', result);
        // })

        provider.sendTransaction({
          from: address,
          to: VENDOR_ADDRESS,
          gasPrice: "20000000000",
          gas: "210640",
          value: Web3.utils.toWei(String(1 * amount)),
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
