import { useState, useEffect } from "react";
import Web3 from "web3";

const VENDOR_ADDRESS = "";
const App = () => {
  const [provider, setProvider] = useState(null);
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState(0);

  const handleAmount = (e) => {
    setAmount(e.target.value);
  };

  const buyJoeToken = async () => {
    try {
      if (provider && address) {
        provider.sendTransaction({
          from: address,
          to: VENDOR_ADDRESS,
          gasPrice: "20000000000",
          gas: "210640",
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
      <button onClick={buyJoeToken}>buy</button>
    </div>
  );
};

export default App;
