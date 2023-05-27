import React, { useEffect, useState } from "react";
import Web3 from 'web3';
import EnergyConsumptionAbi from '../Abi/EnergyConsumptionAbi.json';

export default function Totals({setTotalConsumption, address, totalConsumption}){
  const [totalUnpaid, setTotalUnpaid] = useState(0);
  const [ethPrice, setEthPrice] = useState("");

  useEffect(() => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      const contractAbi = EnergyConsumptionAbi;
      const contractAddress = "0x200cdb515DBA84671b865E16d631e4c76A986B18";
      const contract = new web3.eth.Contract(contractAbi, contractAddress);

      const fetchUnpaidTotal = async () => {
        const unpaidTotalWei = await contract.methods.getCustomerTotalUnpaidBillAmount(address).call();
        const unpaidTotalEther = web3.utils.fromWei(unpaidTotalWei.toString(), 'ether');
        console.log('test1',address);
        setTotalUnpaid(unpaidTotalEther);

        // Get latest Ethereum price
        const latestEthPrice = await contract.methods.getLatestEthPrice().call();
        setEthPrice(latestEthPrice / 1.e8);  // Assuming you have a state variable setEthPrice for this

      }

      fetchUnpaidTotal();
    }
  }, [address]);

  return (
    <div>
      <h1>Total consumed</h1>
      <div className="totals--data">
      <div className="totals--consumed">
        <h2>{totalConsumption} kWh</h2>
        </div>
        <div className="totals--unpaid">
            <p className="title--unpaid">Total unpaid bill</p>
            <h2>{Number.parseFloat(totalUnpaid).toFixed(2)} €</h2>
            <h2>{Number.parseFloat(totalUnpaid/ethPrice).toFixed(4)}ETH</h2> 
        </div>
        
            
       </div>
     
    </div>
  );
}
