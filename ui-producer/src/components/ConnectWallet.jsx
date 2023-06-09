import React, { useEffect ,useState} from "react";
import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';

export default function ConnectWallet({ setAddress, setBalance , address, balance}) {

  const [copySuccess, setCopySuccess] = useState("");

    useEffect(() => {

        if (window.ethereum && window.ethereum.selectedAddress) {
          loadBlockchainData(new Web3(window.ethereum));
        }
      }, []);
    

  const connectWallet = async () => {
    const provider = await detectEthereumProvider();

    if (provider) {
      startApp(provider); 
    } else {
      console.log('Please install MetaMask!');
    }
  };

  const startApp = async (provider) => {
    if (provider !== window.ethereum) {
      console.error('Do you have multiple wallets installed?');
    }

    const web3Instance = new Web3(window.ethereum);

   //Request account access
    try {
      await window.ethereum.enable();
    } catch (error) {
      console.error("User denied account access");
      return;
    }

    // Load Blockchain Data
    loadBlockchainData(web3Instance);
  }

  const loadBlockchainData = async (web3Instance) => {
    const accounts = await web3Instance.eth.getAccounts();
    setAddress(accounts[0]);

    const ethBalance = await web3Instance.eth.getBalance(accounts[0]);
    setBalance(web3Instance.utils.fromWei(ethBalance, 'ether'));
  };

  const copyAddressToClipboard = async () => {
    try {
        await navigator.clipboard.writeText(address);
        setCopySuccess("Copied to clipboard!");
    } catch (err) {
      setCopySuccess("Failed to copy to clipboard!");
    }
  }
  useEffect(() => {
    if (copySuccess){
        setTimeout(() => {
            setCopySuccess("");
        }, 3000);
    }
  }, [copySuccess]);

 
  return (
    <>
     
     {     
    address ?
    <div className="header--connected" >
      <p onClick={copyAddressToClipboard} className="address--copy">
        <span className="header--connected--title">Wallet: </span>
        <span className="header--connected--address">{address.substring(0,6) + "..." + address.substring(address.length - 4)}</span>
        {copySuccess && 
                    <span className="tooltip">
                        {copySuccess}
                    </span>}
      </p>
      <p>
      <span className="header--connected--title">Balance: </span>
      <span className="header--connected--address">{Number.parseFloat(balance).toFixed(4)}</span>
      </p>
        
    </div>
    :
   
            <div className="header--connect" onClick={connectWallet}>Connect Wallet</div>
          
        }
   </>
  );
}

