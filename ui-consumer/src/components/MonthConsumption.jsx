import React, { useEffect , useState} from "react";
import Web3 from 'web3';
import EnergyConsumptionAbi from '../Abi/EnergyConsumptionAbi.json';


export default function MonthConsumption({setYear, setMonth, address, year, month}){

  const [energy, setEnergy] = useState("");
  const [bill, setBill] = useState("");
  const [ethPrice, setEthPrice] = useState("");
  
  const loadEnergyData = async (address) => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      const contractAbi = EnergyConsumptionAbi;
      const contractAddress = "0x74BfF1a72f3d5C34Be7a03D9d8C75b98A50A12C1";
      const contract = new web3.eth.Contract(contractAbi, contractAddress);
      
      const currentYear = year;
      const currentMonth = month 
      const { consumedEnergy, billAmount, paid } = await contract.methods.getMonthlyData(address, currentYear, currentMonth).call();
      setEnergy(consumedEnergy);
      setBill(web3.utils.fromWei(billAmount.toString(), 'ether'));  // Assuming billAmount is in Wei

       // Get latest Ethereum price
    const latestEthPrice = await contract.methods.getLatestEthPrice().call();
    setEthPrice(latestEthPrice / 1.e8);  // Assuming you have a state variable setEthPrice for this

    }
  }

  function getMonthName(num){
    //TODO
    return 'Test';
  }
  function getYearName(num){
    //TODO
    return 'Test';
  }

  useEffect(() => {
    if(address){
      loadEnergyData(address);
    }
  }, [address, year, month])

  return(
    <div>
        <div className="month--consumption">
                <h1> Energy consumption - {getMonthName(month)} {getYearName(year)}</h1>
        <div className="month--data">
            <div className="energy--consumed">
                <h1>{energy}KWh</h1>
            </div>
            <div className="month--bill">
                <h1>{Number.parseFloat(bill).toPrecision(4)}€</h1>
                <h1>{Number.parseFloat(bill/ethPrice).toPrecision(2)}ETH</h1>
            </div>
        </div>
        </div> 
       
    </div>
  )
}
